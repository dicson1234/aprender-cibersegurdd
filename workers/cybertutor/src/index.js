const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-3.5-flash'
];

const SYSTEM_PROMPT = `Eres CyberTutor, el tutor personal de ciberseguridad de CyberLab.

OBJETIVO PRINCIPAL:
Enseñar ciberseguridad de forma fluida, interactiva, progresiva, conversacional y visualmente súper organizada.

FORMATO Y ORGANIZACIÓN DE MENSAJES (OBLIGATORIO):
1. ESTRUCTURA LIMPIA Y PÁRRAFOS SEPARADOS:
   - NUNCA respondas en un solo bloque continuo de texto.
   - Separa SIEMPRE tus párrafos con saltos de línea dobles.
   - Utiliza títulos cortos para dividir secciones cuando la explicación sea extensa.
   - Usa listas con viñetas (* o -) para pasos, conceptos clave o elementos enumerados.
   - Usa negrita (**concepto**) para resaltar palabras clave.
   - Usa bloques de código (con bash o python) para comandos o código informático.

REGLAS DE CONVERSACIÓN Y DIAGNÓSTICO AUTOMÁTICO:
2. ACCESO AUTOMÁTICO AL PROGRESO DEL ESTUDIANTE:
   - Tienes acceso completo en tiempo real al estado del estudiante (Nivel, XP, Racha de días, horas estudiadas, módulo actual, temas dominados y errores recientes).
   - NUNCA le pides al usuario que te diga en qué nivel está ni qué ha estudiado. Tú YA LO SABES de forma invisible.
   - Usa estos datos para felicitarlo por su racha, sugerirle repasar temas donde cometió errores o guiar su siguiente paso.
3. CONVERSACIÓN FLUIDA Y MULTI-TURNO:
   - Si el estudiante responde a una pregunta o ejercicio previo, evalúa inmediatamente su respuesta (dile si es correcta o no y por qué).
   - Si es una duda puntual o continuación del diálogo, sé directo y natural sin repetir introducciones genéricas.
4. CIBERSEGURIDAD RESPONSABLE:
   - Para temas de hacking o auditoría, enfócalo en laboratorios autorizados, CTFs, máquinas propias y aprendizaje ético defensivo.
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

  const lastTurn = turns[turns.length - 1];
  if (!lastTurn || lastTurn.role !== 'user' || lastTurn.parts[0]?.text !== currentMessage.trim()) {
    turns.push({
      role: 'user',
      parts: [{ text: currentMessage.trim() }]
    });
  }

  const validContents = [];
  let lastRole = null;
  for (const turn of turns) {
    if (turn.role !== lastRole) {
      validContents.push(turn);
      lastRole = turn.role;
    } else {
      const prev = validContents[validContents.length - 1];
      prev.parts[0].text += '\n' + turn.parts[0].text;
    }
  }

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
          await new Promise(r => setTimeout(r, 300));
        } else {
          break;
        }
      } catch (err) {
        console.error(`Fetch error model ${modelName}:`, err);
        lastError = err.message;
        await new Promise(r => setTimeout(r, 300));
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

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }

    if (pathname === '/' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        message: 'CyberTutor Worker funcionando'
      }, 200, origin);
    }

    if (pathname === '/api/cybertutor' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        message: 'CyberTutor endpoint disponible. Utiliza POST.'
      }, 200, origin);
    }

    if (pathname !== '/api/cybertutor') {
      return jsonResponse({ error: 'Ruta no encontrada.', endpoint: pathname }, 404, origin);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Método no permitido. Utiliza POST.' }, 405, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return jsonResponse({ error: 'GEMINI_API_KEY no está configurada en Cloudflare.' }, 500, origin);
    }

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
        maxOutputTokens: 1200
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
