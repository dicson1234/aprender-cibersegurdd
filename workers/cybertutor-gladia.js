/* CyberLab CyberTutor — Cloudflare Worker + Gladia Audio-to-LLM
 * Deploy this Worker separately from GitHub Pages.
 * Secret required: GLADIA_API_KEY
 * Never put the Gladia secret in the frontend or Git repository.
 */

const GLADIA_UPLOAD_URL = 'https://api.gladia.io/v2/upload';
const GLADIA_TRANSCRIBE_URL = 'https://api.gladia.io/v2/pre-recorded';

function corsHeaders(origin) {
  const allowed = origin && /^https:\/\/([a-z0-9-]+\.)?dicson1234\.github\.io$/i.test(origin)
    ? origin
    : 'https://dicson1234.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) }
  });
}

function extractResponse(result) {
  const candidates = [
    result?.result?.audio_to_llm?.results?.[0]?.results?.response,
    result?.audio_to_llm?.results?.[0]?.results?.response,
    result?.audio_to_llm?.results?.[0]?.response,
    result?.result?.audio_to_llm?.results?.[0]?.response
  ];
  return candidates.find(v => typeof v === 'string' && v.trim()) || '';
}

function extractTranscript(result) {
  return result?.result?.transcription?.full_transcript
    || result?.transcription?.full_transcript
    || result?.result?.transcription?.utterances?.map(x => x.text).join(' ')
    || '';
}

async function uploadToGladia(file, apiKey) {
  const upload = await fetch(GLADIA_UPLOAD_URL, {
    method: 'POST',
    headers: { 'x-gladia-key': apiKey, 'Content-Type': file.type || 'audio/webm' },
    body: file.stream()
  });
  if (!upload.ok) throw new Error(`Gladia upload failed: ${upload.status} ${await upload.text()}`);
  return upload.json();
}

async function startTranscription(audioUrl, prompt, apiKey) {
  const response = await fetch(GLADIA_TRANSCRIBE_URL, {
    method: 'POST',
    headers: { 'x-gladia-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_config: { languages: ['es'] },
      audio_to_llm: true,
      audio_to_llm_config: {
        prompts: [prompt],
        model: 'openai/gpt-5.4-nano'
      }
    })
  });
  if (!response.ok) throw new Error(`Gladia transcription failed: ${response.status} ${await response.text()}`);
  return response.json();
}

async function pollJob(jobId, apiKey) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise(r => setTimeout(r, 1200));
    const response = await fetch(`${GLADIA_TRANSCRIBE_URL}/${encodeURIComponent(jobId)}`, {
      headers: { 'x-gladia-key': apiKey }
    });
    if (!response.ok) throw new Error(`Gladia polling failed: ${response.status} ${await response.text()}`);
    const result = await response.json();
    if (result.status === 'done' || result.status === 'error' || result.done === true) return result;
  }
  throw new Error('Gladia job timed out after 36 seconds.');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (new URL(request.url).pathname !== '/api/cybertutor') return json({ error: 'Not found' }, 404, origin);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
    if (!env.GLADIA_API_KEY) return json({ error: 'Servidor sin GLADIA_API_KEY configurada.' }, 500, origin);

    try {
      const contentType = request.headers.get('Content-Type') || '';
      if (!contentType.startsWith('multipart/form-data')) {
        return json({ error: 'CyberTutor con Gladia espera audio multipart/form-data. El modo de texto necesita un proveedor LLM de texto adicional.' }, 400, origin);
      }

      const form = await request.formData();
      const audio = form.get('audio');
      const prompt = String(form.get('prompt') || 'Responde en español de forma clara y educativa.');
      if (!(audio instanceof File)) return json({ error: 'Falta el campo audio.' }, 400, origin);
      if (audio.size > 12 * 1024 * 1024) return json({ error: 'El audio supera 12 MB.' }, 413, origin);

      const uploaded = await uploadToGladia(audio, env.GLADIA_API_KEY);
      const audioUrl = uploaded.audio_url || uploaded.url;
      if (!audioUrl) throw new Error('Gladia no devolvió audio_url.');

      const started = await startTranscription(audioUrl, prompt, env.GLADIA_API_KEY);
      const jobId = started.id || started.result?.id;
      const result = jobId ? await pollJob(jobId, env.GLADIA_API_KEY) : started;

      const answer = extractResponse(result);
      const transcript = extractTranscript(result);
      if (!answer) return json({ error: 'Gladia terminó pero no devolvió respuesta del Audio-to-LLM.', transcript }, 502, origin);
      return json({ answer, transcript, provider: 'gladia-audio-to-llm' }, 200, origin);
    } catch (error) {
      console.error(error);
      return json({ error: error instanceof Error ? error.message : 'Error interno del tutor.' }, 500, origin);
    }
  }
};
