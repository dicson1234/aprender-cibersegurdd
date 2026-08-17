const ALLOWED_ORIGIN = "https://dicson1234.github.io";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `Eres CyberTutor, el tutor personal de ciberseguridad de CyberLab.

Tu objetivo es enseñar ciberseguridad de forma progresiva.

Explica primero de manera sencilla y después profundiza.

Utiliza ejemplos prácticos.

Relaciona los conceptos con situaciones reales de ciberseguridad.

Cuando sea apropiado:
1. Explica.
2. Da un ejemplo.
3. Haz una pequeña comprobación de comprensión.
4. Propón una práctica segura.
5. Recomienda qué estudiar después.

Adapta la dificultad al estudiante.

Para contenidos ofensivos, mantén el aprendizaje dentro de laboratorios autorizados, CTFs, máquinas propias y entornos educativos.

No inventes información.`;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

function studentContext(student = {}) {
  return JSON.stringify({
    level: student.level ?? 1,
    xp: student.xp ?? 0,
    streak: student.streak ?? 0,
    hoursStudied: student.hoursStudied ?? 0,
    currentModule: student.currentModule ?? "",
    primaryObjective: student.primaryObjective ?? "",
    secondaryObjective: student.secondaryObjective ?? "",
    mastery: student.mastery ?? {},
    mistakes: Array.isArray(student.mistakes) ? student.mistakes.slice(-20) : [],
    completedModules: Array.isArray(student.completedModules) ? student.completedModules.slice(-30) : [],
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) {
        return new Response(null, { status: 403, headers: corsHeaders(origin) });
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response("CyberTutor Worker funcionando.", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (url.pathname === "/api/cybertutor" && request.method === "GET") {
      return json({
        status: "ok",
        message: "CyberTutor endpoint disponible. Utiliza POST.",
      }, 200, origin);
    }

    if (url.pathname !== "/api/cybertutor" || request.method !== "POST") {
      return json({ error: "Ruta o método no permitido." }, 405, origin);
    }

    if (origin !== ALLOWED_ORIGIN) {
      return json({ error: "Origen no permitido." }, 403, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: "GEMINI_API_KEY no está configurada en Cloudflare." }, 500, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "El cuerpo debe ser JSON válido." }, 400, origin);
    }

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return json({ error: "El campo message es obligatorio." }, 400, origin);
    }
    if (message.length > 12000) {
      return json({ error: "La pregunta es demasiado larga." }, 413, origin);
    }

    const prompt = `${SYSTEM_PROMPT}\n\nContexto actual del estudiante:\n${studentContext(body.student)}\n\nPregunta del estudiante:\n${message}`;

    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }],
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1800,
          },
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const upstreamMessage = data?.error?.message || `Gemini HTTP ${response.status}`;
        return json({ error: "Gemini no pudo generar la respuesta.", details: upstreamMessage }, 502, origin);
      }

      const answer = data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim();

      if (!answer) {
        return json({ error: "Gemini devolvió una respuesta vacía." }, 502, origin);
      }

      return json({
        answer,
        provider: "google-gemini",
        model: "gemini-2.5-flash",
      }, 200, origin);
    } catch (error) {
      return json({
        error: "No se pudo conectar con Gemini.",
        details: error instanceof Error ? error.message : "Error desconocido",
      }, 502, origin);
    }
  },
};
