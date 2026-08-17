# CyberTutor + Gladia (Cloudflare Worker)

GitHub Pages es público y no debe contener la clave de Gladia. Este Worker actúa como proxy seguro: recibe el audio del navegador, usa `GLADIA_API_KEY` como secreto y devuelve la respuesta del Audio-to-LLM.

## 1. Instalar Wrangler

```bash
npm install -g wrangler
wrangler login
```

## 2. Configurar la clave

Desde esta carpeta:

```bash
wrangler secret put GLADIA_API_KEY
```

Pega la clave de Gladia cuando Wrangler la solicite. No la escribas en `wrangler.toml`, JavaScript del frontend, README ni GitHub.

## 3. Desplegar

```bash
cd workers
wrangler deploy
```

Wrangler mostrará una URL parecida a:

`https://cyberlab-cybertutor.<tu-cuenta>.workers.dev`

## 4. Conectar CyberLab

En CyberLab abre **CyberTutor → ⚙️ Configurar backend** y pega la URL del Worker.

El frontend añadirá `/api/cybertutor` automáticamente mediante el código del Worker si la URL apunta a la raíz del Worker; también puedes pegar directamente la ruta completa.

## 5. Cómo funciona

```text
Micrófono del estudiante
        ↓
CyberLab (GitHub Pages)
        ↓ HTTPS
Cloudflare Worker
        ↓ secreto GLADIA_API_KEY
Gladia Upload
        ↓
Gladia Pre-recorded + Audio-to-LLM
        ↓
Respuesta educativa
        ↓
CyberTutor
```

Gladia documenta Audio-to-LLM como una función que ejecuta prompts sobre la transcripción de un audio pregrabado. El Worker usa ese mecanismo para el modo de voz del tutor.

## Nota sobre el chat escrito

Gladia es principalmente un servicio de voz/transcripción e inteligencia sobre audio. El modo de voz de CyberTutor queda conectado a Gladia; el chat escrito mantiene un fallback local hasta conectar un proveedor específico de LLM de texto.
