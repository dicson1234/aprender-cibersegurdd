const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

const SYSTEM_PROMPT = `Eres CyberTutor, el tutor personal de ciberseguridad de CyberLab.

OBJETIVO PRINCIPAL:
Enseñar ciberseguridad de forma fluida, interactiva, progresiva y conversacional.

REGLAS DE INTERACCIÓN Y CONVERSACIÓN:
1. RESPONDE SIEMPRE EN ESPAÑOL.
2. MANTÉN EL HILO Y CONTEXTO DE LA CONVERSACIÓN:
   - Si el estudiante está respondiendo a una pregunta previa o ejercicio, evalúa de inmediato su respuesta (dile si es correcta o no y por qué).
   - Si el estudiante hace una pregunta de seguimiento, contéstala directamente sin repetir introducciones anteriores.
3. ADAPTA EL FORMATO SEGÚN EL TIPO DE MENSAJE:
   - NO uses plantillas ni esquemas rígidos de 5 o 6 pasos para CADA mensaje.
   - Para explicaciones de conceptos nuevos por primera vez: explica sencillo, pon un ejemplo cotidiano y conéctalo con ciberseguridad real.
   - Para respuestas breves, dudas puntuales o continuación del diálogo: sé directo, claro y conversacional.
4. PEDAGOGÍA Y PRÁCTICA:
   - Anima al estudiante a pensar y participar.
   - Cuando sea oportuno, termina proponiendo una pregunta corta o un comando/ejercicio práctico seguro.
5. CIBERSEGURIDAD RESPONSABLE:
   - Para temas ofensivos o de hacking, mantén el aprendizaje dentro de entornos autorizados, CTFs, máquinas propias y laboratorios de práctica.
   - No inventes información.`;

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

function buildGeminiContents(rawHistory, currentMessage) {
  const turns = [];

  if (Array.isArray(rawHistory)) {
    for (const item of rawHistory) {
      const role = (item.role === 'assistant' || item.role === 'model' || item.role === 'tutor') ? 'model' : 'user';
      const text = typeof item.content === 'string' ? item.content : (typeof item.text === 'string' ? item.text : '');
      if (text.trim()) {
        turns.push({
          role,
          parts: [{ text: text.trim() }]
        });
      }
    }
  }

  // Check if currentMessage is already the last turn
  const lastTurn = turns[turns.length - 1];
  if (!lastTurn || lastTurn.role !== 'user' || lastTurn.parts[0]?.text !== currentMessage.trim()) {
    turns.push({
      role: 'user',
      parts: [{ text: currentMessage.trim() }]
    });
  }

  // Ensure roles strictly alternate: user, model, user, model...
  const validContents = [];
  let lastRole = null;
  for (const turn of turns) {
    if (turn.role !== lastRole) {
      validContents.push(turn);
      lastRole = turn.role;
    } else {
      // Append text to previous turn if same role
      const prev = validContents[validContents.length - 1];
      prev.parts[0].text += '\n' + turn.parts[0].text;
    }
  }

  // Gemini API requires first turn to have role 'user'
  while (validContents.length > 0 && validContents[0].role !== 'user') {
    validContents.shift();
  }

  return validContents.length > 0 ? validContents : [{ role: 'user', parts: [{ text: currentMessage.trim() }] }];
}

async function callGemini(apiKey, payload) {
  let lastError = null;
  let lastStatus = 502;

  for (const modelName of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    
    // Attempt up to 2 times for each model (retry on 503 / transient server errors)
    for (let attempt = 0; attempt < 2; attempt++) {
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

        console.error(`Gemini model ${modelName} (attempt ${attempt + 1}) status ${response.status}:`, data);
        lastStatus = response.status >= 500 ? 502 : response.status;
        lastError = data?.error?.message || `HTTP ${response.status}`;

        if (response.status === 503 || response.status === 429) {
          // Wait 600ms before retry
          await new Promise(r => setTimeout(r, 600));
        } else {
          break; // Non-retriable status (e.g. 404 or 400)
        }
      } catch (err) {
        console.error(`Fetch error model ${modelName}:`, err);
        lastError = err.message;
        await new Promise(r => setTimeout(r, 400));
      }
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

    const contents = buildGeminiContents(body?.history, message);

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: fullSystemInstruction }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
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
