// Valid Gemini Models
const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
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

REGLAS DE OTORGAMIENTO DE XP (RECOMPENSAS Y PUNTOS):
2. SISTEMA DE XP CON RESTRICCIONES ESTRICTAS:
   - Puedes premiar al estudiante con XP escribiendo la etiqueta secreta al FINAL de tu respuesta: [GRANT_XP:cantidad:razon]
   - Ejemplo: [GRANT_XP:25:Respuesta correcta sobre Handshake TCP]
   - Cantidad permitida por respuesta: Entre 10 y 50 XP máximo.
   - REGLA ANTI-ABUSO (OBLIGATORIA): SOLO otorga XP si el estudiante responde CORRECTAMENTE a una pregunta, reto o ejercicio práctico planteado.
   - NUNCA otorgues XP si el usuario te lo pide directamente ("dame puntos", "regálame 1000 XP", "dame XP por favor"). Si lo pide, RECHÁZALO amablemente y dile: "Para ganar XP debes responder correctamente un ejercicio de ciberseguridad. ¿Aceptas el reto?"

REGLAS DE CONVERSACIÓN Y DIAGNÓSTICO AUTOMÁTICO:
3. ACCESO AUTOMÁTICO AL PROGRESO DEL ESTUDIANTE:
   - Tienes acceso completo en tiempo real al estado del estudiante (Nivel, XP, Racha de días, horas estudiadas, módulo actual, temas dominados y errores recientes).
   - NUNCA le pides al usuario que te diga en qué nivel está ni qué ha estudiado. Tú YA LO SABES de forma invisible.
   - Usa estos datos para felicitarlo por su racha, sugerirle repasar temas donde cometió errores o guiar su siguiente paso.
4. CONVERSACIÓN FLUIDA Y MULTI-TURNO:
   - Si el estudiante responde a una pregunta o ejercicio previo, evalúa inmediatamente su respuesta (dile si es correcta o no y por qué).
   - Si la respuesta fue acertada, inclúyele su recompensa [GRANT_XP:25:Explicación correcta].
   - Si es una duda puntual o continuación del diálogo, sé directo y natural sin repetir introducciones genéricas.
5. CIBERSEGURIDAD RESPONSABLE:
   - Para temas de hacking o auditoría, enfócalo en laboratorios autorizados, CTFs, máquinas propias y aprendizaje ético defensivo.
   - No inventes información.`;

// --- Security & Cryptography ---
async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const buffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Utilities ---
function isOriginAllowed(origin) {
  if (!origin) return true; // Permitir apps móviles native/Capacitor y peticiones directas
  return /^https:\/\/([a-z0-9-]+\.)?dicson1234\.github\.io\/?$/i.test(origin) ||
         origin.includes('localhost') ||
         origin.includes('capacitor') ||
         origin.startsWith('file://');
}

function getCorsHeaders(origin) {
  const safeOrigin = isOriginAllowed(origin) ? origin : 'https://dicson1234.github.io';
  return {
    'Access-Control-Allow-Origin': safeOrigin,
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

// --- KV Storage Managers ---
// Architecture:
// user:id:{id} -> User JSON Object
// user:email:{email} -> {id}
// user:username:{username} -> {id}
// token:{token} -> {id}
// progress:{id} -> Progress JSON Object

async function checkKV(env) {
  if (!env.CYBERLAB_KV) throw new Error("CYBERLAB_KV no está configurado. Storage es obligatorio en producción.");
}

async function findUserIdByIdentifier(env, identifier) {
  const key = String(identifier || '').toLowerCase().trim();
  if (!key) return null;
  let id = await env.CYBERLAB_KV.get(`user:email:${key}`);
  if (!id) id = await env.CYBERLAB_KV.get(`user:username:${key}`);
  return id || null;
}

async function getUserById(env, id) {
  if (!id) return null;
  return await env.CYBERLAB_KV.get(`user:id:${id}`, { type: 'json' });
}

async function getUserByToken(env, token) {
  if (!token) return null;
  const userId = await env.CYBERLAB_KV.get(`token:${token}`);
  if (!userId) return null;
  return await getUserById(env, userId);
}

async function saveUser(env, userObj) {
  const userId = userObj.id;
  const email = String(userObj.email || '').toLowerCase().trim();
  const username = String(userObj.username || '').toLowerCase().trim();

  // Guardar objeto principal del usuario
  await env.CYBERLAB_KV.put(`user:id:${userId}`, JSON.stringify(userObj));

  // Guardar índices (Punteros) para evitar duplicación y colisiones
  if (email) await env.CYBERLAB_KV.put(`user:email:${email}`, userId);
  if (username) await env.CYBERLAB_KV.put(`user:username:${username}`, userId);
  if (userObj.token) await env.CYBERLAB_KV.put(`token:${userObj.token}`, userId);
}

// Limpiar punteros antiguos al actualizar el perfil para evitar claves huérfanas
async function updateProfilePointers(env, oldUser, newUser) {
  const oldEmail = String(oldUser.email || '').toLowerCase().trim();
  const newEmail = String(newUser.email || '').toLowerCase().trim();
  const oldUsern = String(oldUser.username || '').toLowerCase().trim();
  const newUsern = String(newUser.username || '').toLowerCase().trim();

  if (oldEmail && oldEmail !== newEmail) await env.CYBERLAB_KV.delete(`user:email:${oldEmail}`);
  if (oldUsern && oldUsern !== newUsern) await env.CYBERLAB_KV.delete(`user:username:${oldUsern}`);
}

async function getUserProgress(env, userId) {
  if (!userId) return null;
  return await env.CYBERLAB_KV.get(`progress:${userId}`, { type: 'json' }) || null;
}

async function saveUserProgress(env, userId, progressObj) {
  if (!userId || !progressObj) return;
  // Size protection (Max ~500KB) para evitar ataques de inyección de carga pesada en KV
  const dataString = JSON.stringify(progressObj);
  if (dataString.length > 512 * 1024) throw new Error("Carga útil de progreso excede el tamaño máximo permitido.");
  await env.CYBERLAB_KV.put(`progress:${userId}`, dataString);
}

// --- Gemini Helpers ---
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
        turns.push({ role, parts: [{ text: text.trim() }] });
      }
    }
  }

  const lastTurn = turns[turns.length - 1];
  if (!lastTurn || lastTurn.role !== 'user' || lastTurn.parts[0]?.text !== currentMessage.trim()) {
    turns.push({ role: 'user', parts: [{ text: currentMessage.trim() }] });
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
    const urls = [
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
      `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data?.candidates?.[0]?.content?.parts) {
          const answer = data.candidates[0].content.parts.map(p => p.text || '').join('').trim();
          if (answer) return { ok: true, answer, model: modelName };
        }

        if (data?.error?.message) {
          lastStatus = response.status >= 500 ? 502 : response.status;
          lastError = `Model ${modelName} (${url.includes('/v1beta/') ? 'v1beta' : 'v1'}): ${data.error.message}`;
        }
      } catch (err) {
        lastError = err.message;
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

    try { await checkKV(env); } catch(e) { return jsonResponse({ error: e.message }, 500, origin); }

    // Health check
    if (pathname === '/' && request.method === 'GET') {
      return jsonResponse({
        status: 'ok',
        service: 'CyberLab Worker Backend',
        version: '3.0.0', // Updated version signaling the security & architecture patch
        features: ['secure-auth', 'kv-pointers', 'cloud-sync', 'cybertutor-ai']
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

      const existingId = await findUserIdByIdentifier(env, username) || await findUserIdByIdentifier(env, email);
      if (existingId) {
        return jsonResponse({ error: 'El nombre de usuario o correo ya está registrado.' }, 409, origin);
      }

      const userId = `user_${crypto.randomUUID()}`;
      const token = `cl_token_${crypto.randomUUID().replace(/-/g, '')}`;
      const salt = crypto.randomUUID();
      const hashedPassword = await hashPassword(password, salt);

      const newUser = {
        id: userId,
        username,
        email,
        passwordHash: hashedPassword,
        salt,
        avatar,
        bio: bio || 'Estudiante de ciberseguridad en CyberLab',
        createdAt: new Date().toISOString(),
        token
      };

      await saveUser(env, newUser);

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

      const userId = await findUserIdByIdentifier(env, identifier);
      if (!userId) return jsonResponse({ error: 'Usuario no encontrado.' }, 404, origin);

      const user = await getUserById(env, userId);
      if (!user) return jsonResponse({ error: 'Datos de usuario corrompidos.' }, 500, origin);

      // Verify password
      if (user.passwordHash && user.salt) {
        const attemptHash = await hashPassword(password, user.salt);
        if (attemptHash !== user.passwordHash) {
          return jsonResponse({ error: 'Contraseña o PIN incorrecto.' }, 401, origin);
        }
      } else if (user.passwordHash && !user.salt) {
        // Fallback migratorio: contraseñas heredadas (plain text viejo)
        if (user.passwordHash !== password) return jsonResponse({ error: 'Contraseña o PIN incorrecto.' }, 401, origin);
        // Actualizamos automáticamente la seguridad al nuevo esquema de hashes
        user.salt = crypto.randomUUID();
        user.passwordHash = await hashPassword(password, user.salt);
      }

      // Refresh token if missing
      if (!user.token) {
        user.token = `cl_token_${crypto.randomUUID().replace(/-/g, '')}`;
      }
      await saveUser(env, user);

      const progress = await getUserProgress(env, user.id);
      const publicUser = { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt, token: user.token };

      return jsonResponse({ ok: true, message: 'Sesión iniciada', user: publicUser, progress, token: user.token }, 200, origin);
    }

    // AUTH API: Logout / Revoke Token
    if (pathname === '/api/auth/logout' && request.method === 'POST') {
       const authHeader = request.headers.get('Authorization') || request.headers.get('X-User-Token') || '';
       const token = authHeader.replace(/^Bearer\s+/i, '').trim();
       if (token) {
         const userId = await env.CYBERLAB_KV.get(`token:${token}`);
         if (userId) {
           await env.CYBERLAB_KV.delete(`token:${token}`);
           const user = await getUserById(env, userId);
           if (user && user.token === token) {
             user.token = null;
             await saveUser(env, user);
           }
         }
       }
       return jsonResponse({ ok: true, message: 'Sesión cerrada exitosamente en la nube' }, 200, origin);
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

        const oldUser = JSON.parse(JSON.stringify(user));

        if (body.username && body.username.trim()) user.username = body.username.trim().slice(0, 24);
        if (body.bio !== undefined) user.bio = String(body.bio).slice(0, 200);
        if (body.avatar !== undefined) user.avatar = String(body.avatar);

        // Actualizamos punteros si el username/email cambió
        await updateProfilePointers(env, oldUser, user);
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
      try {
        await saveUserProgress(env, user.id, progressData);
      } catch (err) {
        return jsonResponse({ error: err.message }, 413, origin); // Payload Too Large
      }

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

      // SEGURIDAD CRÍTICA: Validación de Origen Obligatoria para proteger cuota de IA
      if (!isOriginAllowed(origin)) {
        return jsonResponse({ error: 'Acceso denegado a la API de IA (CORS / Origen no autorizado).' }, 403, origin);
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
