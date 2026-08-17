const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash'
];

const SYSTEM_PROMPT = `Eres CyberTutor, el tutor personal de ciberseguridad de CyberLab.

Tu objetivo es enseñar, no simplemente responder.

Responde siempre en español.

Explica primero de forma sencilla y después profundiza.

Utiliza ejemplos prácticos.

Relaciona los conceptos con ciberseguridad real.

Adapta la dificultad al nivel del estudiante.

Utiliza su progreso, errores y conceptos dominados para personalizar las explicaciones.

Cuando sea apropiado:
1. Explica el concepto.
2. Da un ejemplo.
3. Comprueba comprensión.
4. Propón una práctica segura.
5. Recomienda qué estudiar después.

Para contenidos ofensivos, mantén el aprendizaje dentro de laboratorios autorizados, CTFs, máquinas propias y entornos educativos.

No inventes información.`;

function getCorsHeaders(origin) {
  const isAllowed = origin && /^https:\/\/([a-z0-9-]+\.)?dicson1234\.github\.io\/?$/i.test(origin);
  const allowOrigin = isAllowed ? origin : 'https://dicson1234.github.io';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...getCorsHeaders(origin)
    }
  });
}

function formatStudentContext(student = {}) {
  return JSON.stringify({
    level: student.level ?? 1,
    xp: student.xp ?? 0,
    streak: student.streak ?? 0,
    hoursStudied: student.hoursStudied ?? 0,
    currentModule: student.currentModule ?? '',
    primaryObjective: student.primaryObjective ?? '',
    secondaryObjective: student.secondaryObjective ?? '',
    mastery: student.mastery ?? {},
    mistakes: Array.isArray(student.mistakes) ? student.mistakes.slice(-20) : [],
    completedModules: Array.isArray(student.completedModules) ? student.completedModules.slice(-30) : []
  }, null, 2);
}

async function callGemini(apiKey, payload) {
  let lastError = null;
  let lastStatus = 502;

  for (const modelName of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.candidates?.[0]?.content?.parts) {
        const answer = data.candidates[0].content.parts
          .map(p => p.text || '')
          .join('')
          .trim();

        if (answer) {
          return { ok: true, answer, model: modelName };
        }
      }

      console.error(`Gemini model ${modelName} status ${response.status}:`, data);
      lastStatus = response.status >= 500 ? 502 : response.status;
      lastError = data?.error?.message || `HTTP ${response.status}`;
    } catch (err) {
      console.error(`Error with model ${modelName}:`, err);
      lastError = err.message;
    }
  }

  return { ok: false, status: lastStatus, error: lastError || 'Gemini no pudo procesar la solicitud.' };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const pathname = url.pathname;

    // OPTIONS Handling for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }

    // GET /
    if (pathname === '/' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        message: 'CyberTutor Worker funcionando'
      }, 200, origin);
    }

    // GET /api/cybertutor
    if (pathname === '/api/cybertutor' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        message: 'CyberTutor endpoint disponible. Utiliza POST.'
      }, 200, origin);
    }

    // Route matching for POST /api/cybertutor
    if (pathname !== '/api/cybertutor') {
      return jsonResponse({ error: 'Ruta no encontrada.', endpoint: pathname }, 404, origin);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Método no permitido. Utiliza POST.' }, 405, origin);
    }

    // Check GEMINI_API_KEY secret
    if (!env.GEMINI_API_KEY) {
      return jsonResponse({ error: 'GEMINI_API_KEY no está configurada en Cloudflare.' }, 500, origin);
    }

    // Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'El cuerpo de la solicitud debe ser un JSON válido.' }, 400, origin);
    }

    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return jsonResponse({ error: 'El campo message es obligatorio.' }, 400, origin);
    }

    if (message.length > 12000) {
      return jsonResponse({ error: 'La pregunta es demasiado larga.' }, 413, origin);
    }

    const studentContextStr = formatStudentContext(body?.student || {});
    const fullSystemInstruction = `${SYSTEM_PROMPT}\n\nContexto actual del estudiante:\n${studentContextStr}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: fullSystemInstruction }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 1800
      }
    };

    const res = await callGemini(env.GEMINI_API_KEY, geminiPayload);
    if (!res.ok) {
      return jsonResponse({ error: res.error }, res.status, origin);
    }

    return jsonResponse({
      answer: res.answer,
      provider: 'google-gemini',
      model: res.model
    }, 200, origin);
  }
};
