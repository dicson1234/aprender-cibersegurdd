/* CyberLab CyberTutor — Gemini text backend for Cloudflare Workers
 * Secret required: GEMINI_API_KEY
 * Optional secret: GLADIA_API_KEY for the existing voice flow.
 * Never put API keys in the Git repository or frontend.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function corsHeaders(origin) {
  const allowed = origin && /^https:\/\/([a-z0-9-]+\.)?dicson1234\.github\.io$/i.test(origin)
    ? origin : 'https://dicson1234.github.io';
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

function systemInstruction(student) {
  return `Eres CyberTutor, el tutor personal de CyberLab. Enseñas ciberseguridad de forma progresiva, clara y práctica.\n\nREGLAS PEDAGÓGICAS:\n1. Responde en español salvo que el estudiante pida otro idioma.\n2. Explica primero de forma sencilla y después aumenta la profundidad técnica cuando corresponda.\n3. Da ejemplos seguros y educativos, preferiblemente en laboratorios aislados o sistemas propios.\n4. Relaciona la respuesta con el nivel, progreso, errores y objetivos del estudiante.\n5. Si detectas una laguna de conocimiento, enséñala antes de seguir.\n6. Cuando sea útil, termina con una mini-pregunta, ejercicio o siguiente paso.\n7. No inventes datos ni afirmes haber ejecutado herramientas que no ejecutaste.\n8. Para contenidos potencialmente peligrosos, mantén el enfoque defensivo, educativo y en entornos autorizados.\n\nPERFIL ACTUAL DEL ESTUDIANTE:\n${JSON.stringify(student || {}, null, 2)}`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    const pathname = new URL(request.url).pathname;
    if (pathname !== '/api/cybertutor') return json({ error: 'Not found' }, 404, origin);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
    if (!env.GEMINI_API_KEY) return json({ error: 'Servidor sin GEMINI_API_KEY configurada.' }, 500, origin);

    try {
      const contentType = request.headers.get('Content-Type') || '';
      if (contentType.startsWith('multipart/form-data')) {
        return json({ error: 'Este Worker usa Gemini para el chat de texto. Mantén el Worker de Gladia para voz.' }, 400, origin);
      }

      const body = await request.json();
      const message = typeof body?.message === 'string' ? body.message.trim() : '';
      if (!message) return json({ error: 'Falta el mensaje.' }, 400, origin);
      if (message.length > 12000) return json({ error: 'El mensaje es demasiado largo.' }, 413, origin);

      const student = body?.student || {};
      const payload = {
        system_instruction: { parts: [{ text: systemInstruction(student) }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 1800 }
      };

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('Gemini error', response.status, data);
        return json({ error: `Gemini respondió con HTTP ${response.status}.` }, response.status >= 500 ? 502 : response.status, origin);
      }

      const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('')?.trim();
      if (!answer) return json({ error: 'Gemini no devolvió texto.' }, 502, origin);
      return json({ answer, provider: 'google-gemini', model: 'gemini-2.5-flash' }, 200, origin);
    } catch (error) {
      console.error(error);
      return json({ error: 'Error interno de CyberTutor.' }, 500, origin);
    }
  }
};
