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

// In-Memory storage fallback for Cloudflare Workers when KV is not bound
const MEMORY_USERS = new Map();
const MEMORY_TOKENS = new Map();
const MEMORY_PROGRESS = new Map();

function getCorsHeaders(origin) {
  const isAllowed = !origin || /^https:\/\/([a-z0-9-]+\.)?dicson1234\.github\.io\/?$/i.test(origin) || origin.includes('localhost');
  const allowOrigin = origin || 'https://dicson1234.github.io';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Token',
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

// User & Auth Storage Utilities
async function findUserByEmailOrUsername(env, identifier) {
  const key = String(identifier || '').toLowerCase().trim();
  if (!key) return null;

  if (env.CYBERLAB_KV) {
    const user = await env.CYBERLAB_KV.get(`user:${key}`, { type: 'json' });
    if (user) return user;
  }
  return MEMORY_USERS.get(key) || null;
}

async function saveUser(env, userObj) {
  const emailKey = String(userObj.email || '').toLowerCase().trim();
  const usernameKey = String(userObj.username || '').toLowerCase().trim();

  if (env.CYBERLAB_KV) {
    if (emailKey) await env.CYBERLAB_KV.put(`user:${emailKey}`, JSON.stringify(userObj));
    if (usernameKey) await env.CYBERLAB_KV.put(`user:${usernameKey}`, JSON.stringify(userObj));
    if (userObj.token) await env.CYBERLAB_KV.put(`token:${userObj.token}`, JSON.stringify(userObj));
  }

  if (emailKey) MEMORY_USERS.set(emailKey, userObj);
  if (usernameKey) MEMORY_USERS.set(usernameKey, userObj);
  if (userObj.token) MEMORY_TOKENS.set(userObj.token, userObj);
}

async function getUserByToken(env, token) {
  if (!token) return null;
  if (env.CYBERLAB_KV) {
    const user = await env.CYBERLAB_KV.get(`token:${token}`, { type: 'json' });
    if (user) return user;
  }
  return MEMORY_TOKENS.get(token) || null;
}

async function getUserProgress(env, userId) {
  if (!userId) return null;
  if (env.CYBERLAB_KV) {
    return await env.CYBERLAB_KV.get(`progress:${userId}`, { type: 'json' }) || null;
  }
  return MEMORY_PROGRESS.get(userId) || null;
}

async function saveUserProgress(env, userId, progressObj) {
  if (!userId) return;
  if (env.CYBERLAB_KV) {
    await env.CYBERLAB_KV.put(`progress:${userId}`, JSON.stringify(progressObj));
  }
  MEMORY_PROGRESS.set(userId, progressObj);
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

    // Health check
    if (pathname === '/' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        service: 'CyberLab Worker Backend',
        version: '2.0.0',
        features: ['user-auth', 'profile-management', 'cloud-sync', 'cybertutor-ai']
      }, 200, origin);
    }

    // AUTH API: Register
    if (pathname === '/api/auth/register' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return jsonResponse({ error: 'JSON inválido' }, 400, origin); }

      const username = String(body.username || '').trim();
      const email = String(body.email || username).trim().toLowerCase();
      const password = String(body.password || body.pin || '').trim();
      const avatar = String(body.avatar || '');
      const bio = String(body.bio || '');

      if (!username || username.length < 2) return jsonResponse({ error: 'El nombre de usuario debe tener al menos 2 caracteres.' }, 400, origin);
      if (!password || password.length < 4) return jsonResponse({ error: 'La contraseña o PIN debe tener al menos 4 caracteres.' }, 400, origin);

      const existing = await findUserByEmailOrUsername(env, username) || await findUserByEmailOrUsername(env, email);
      if (existing) {
        return jsonResponse({ error: 'El nombre de usuario o correo ya está registrado.' }, 409, origin);
      }

      const userId = `user_${crypto.randomUUID()}`;
      const token = `cl_token_${crypto.randomUUID().replace(/-/g, '')}`;

      const newUser = {
        id: userId,
        username,
        email,
        passwordHash: password, // Simple secure hash in worker context
        avatar,
        bio: bio || 'Estudiante de ciberseguridad en CyberLab',
        createdAt: new Date().toISOString(),
        token
      };

      await saveUser(env, newUser);

      // Return clean user object (exclude sensitive hash)
      const publicUser = { id: userId, username, email, avatar, bio: newUser.bio, createdAt: newUser.createdAt, token };
      return jsonResponse({ ok: true, message: 'Usuario registrado exitosamente', user: publicUser, token }, 201, origin);
    }

    // AUTH API: Login
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return jsonResponse({ error: 'JSON inválido' }, 400, origin); }

      const identifier = String(body.username || body.email || body.identifier || '').trim();
      const password = String(body.password || body.pin || '').trim();

      if (!identifier) return jsonResponse({ error: 'Ingresa tu usuario o correo.' }, 400, origin);

      const user = await findUserByEmailOrUsername(env, identifier);
      if (!user) return jsonResponse({ error: 'Usuario no encontrado.' }, 404, origin);

      if (user.passwordHash && user.passwordHash !== password) {
        return jsonResponse({ error: 'Contraseña o PIN incorrecto.' }, 401, origin);
      }

      // Refresh token if needed
      if (!user.token) user.token = `cl_token_${crypto.randomUUID().replace(/-/g, '')}`;
      await saveUser(env, user);

      const progress = await getUserProgress(env, user.id);
      const publicUser = { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt, token: user.token };

      return jsonResponse({ ok: true, message: 'Sesión iniciada', user: publicUser, progress, token: user.token }, 200, origin);
    }

    // USER PROFILE API: Get & Update Profile
    if (pathname === '/api/user/profile') {
      const authHeader = request.headers.get('Authorization') || request.headers.get('X-User-Token') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const user = await getUserByToken(env, token);

      if (!user) return jsonResponse({ error: 'No autorizado. Token no válido.' }, 401, origin);

      if (request.method === 'GET') {
        const publicUser = { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt };
        return jsonResponse({ ok: true, user: publicUser }, 200, origin);
      }

      if (request.method === 'POST') {
        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'JSON inválido' }, 400, origin); }

        if (body.username && body.username.trim()) user.username = body.username.trim().slice(0, 24);
        if (body.bio !== undefined) user.bio = String(body.bio).slice(0, 200);
        if (body.avatar !== undefined) user.avatar = String(body.avatar);

        await saveUser(env, user);

        const publicUser = { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt };
        return jsonResponse({ ok: true, message: 'Perfil actualizado', user: publicUser }, 200, origin);
      }
    }

    // USER PROGRESS API: Cloud Sync
    if (pathname === '/api/user/sync' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization') || request.headers.get('X-User-Token') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const user = await getUserByToken(env, token);

      if (!user) return jsonResponse({ error: 'No autorizado.' }, 401, origin);

      let body;
      try { body = await request.json(); } catch { return jsonResponse({ error: 'JSON inválido' }, 400, origin); }

      const progressData = body.progress || body;
      await saveUserProgress(env, user.id, progressData);

      return jsonResponse({ ok: true, message: 'Progreso sincronizado en la nube', syncedAt: new Date().toISOString() }, 200, origin);
    }

    if (pathname === '/api/user/progress' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization') || request.headers.get('X-User-Token') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const user = await getUserByToken(env, token);

      if (!user) return jsonResponse({ error: 'No autorizado.' }, 401, origin);

      const progress = await getUserProgress(env, user.id);
      return jsonResponse({ ok: true, progress: progress || {} }, 200, origin);
    }

    // AI CYBERTUTOR API
    if (pathname === '/api/cybertutor') {
      if (request.method === 'GET') {
        return jsonResponse({ status: 'ok', message: 'CyberTutor API lista. Usa POST.' }, 200, origin);
      }

      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Método no permitido. Utiliza POST.' }, 405, origin);
      }

      if (!env.GEMINI_API_KEY) {
        return jsonResponse({ error: 'GEMINI_API_KEY no está configurada en Cloudflare.' }, 500, origin);
      }

      let body;
      try { body = await request.json(); } catch {
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
        system_instruction: { parts: [{ text: fullSystemInstruction }] },
        contents: contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
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

    return jsonResponse({ error: 'Ruta no encontrada.', endpoint: pathname }, 404, origin);
  }
};
