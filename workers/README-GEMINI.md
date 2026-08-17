# CyberTutor + Gemini

CyberTutor ahora usa Gemini 2.5 Flash para el chat de texto mediante un Cloudflare Worker.

## Seguridad

No coloques `GEMINI_API_KEY` en GitHub, `index.html`, JavaScript del navegador ni variables públicas. Google recomienda mantener las claves fuera del control de versiones y usar un backend/proxy seguro. 

## Configuración

1. Instala/authentica Wrangler.
2. Desde `workers/`, despliega el Worker:

```bash
wrangler secret put GEMINI_API_KEY
wrangler deploy
```

Cuando `wrangler secret put` lo solicite, pega la clave nueva de Gemini directamente en la terminal de Cloudflare. No la guardes en este repositorio.

3. En CyberLab abre **CyberTutor → Configurar backend** y pega la URL del Worker, por ejemplo:

```text
https://cyberlab-cybertutor.<tu-subdominio>.workers.dev/api/cybertutor
```

La URL debe ser HTTPS.

## Modelo

El Worker usa `gemini-2.5-flash`, modelo estable de baja latencia y con nivel gratuito para texto según la tarifa actual de Gemini API.

## Importante sobre la clave compartida en el chat

La clave que se pegó en la conversación debe considerarse expuesta. Revócala/elíminala en Google AI Studio y crea una nueva antes de desplegar.
