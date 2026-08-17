/* CyberLab AI CyberTutor Component & Backend Architecture Guide */

class CyberTutorEngine {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const container = document.getElementById('cybertutor-root');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <h2 style="font-size: 1.4rem;">🤖 CyberTutor — Tu Asistente IA de Ciberseguridad</h2>
          <span class="tag cyan">IA Educativa Personalizada</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          CyberTutor está diseñado para responder tus dudas, generar ejercicios a tu nivel actual y adaptar sus explicaciones.
        </p>
      </div>

      <div class="tutor-container">
        <!-- Preset Prompts Sidebar -->
        <div class="tutor-prompts-sidebar">
          <div style="font-weight: 700; font-size: 0.9rem; color: var(--accent-cyan); margin-bottom: 8px;">PROMPTS RECOMENDADOS:</div>
          <button class="btn btn-secondary" style="font-size: 0.8rem; text-align: left;" onclick="window.CyberTutor.sendPreset('Explícame qué es el protocolo TCP como si tuviera 10 años.')">
            👶 Explícame TCP como a un niño de 10 años
          </button>
          <button class="btn btn-secondary" style="font-size: 0.8rem; text-align: left;" onclick="window.CyberTutor.sendPreset('Ahora explícame TCP a nivel técnico universitario completo.')">
            🎓 Explícame TCP a nivel universitario
          </button>
          <button class="btn btn-secondary" style="font-size: 0.8rem; text-align: left;" onclick="window.CyberTutor.sendPreset('Creo que entendí NAT y Subnetting. Evalúame con 3 preguntas.')">
            📝 Evalúa mis conocimientos sobre NAT
          </button>
          <button class="btn btn-secondary" style="font-size: 0.8rem; text-align: left;" onclick="window.CyberTutor.sendPreset('¿Qué temas debería estudiar después según mis áreas débiles?')">
            🎯 Recomiéndame qué estudiar ahora
          </button>
          
          <div style="margin-top: 20px; background: rgba(163, 113, 247, 0.1); padding: 12px; border-radius: var(--radius-sm); border: 1px solid rgba(163, 113, 247, 0.3); font-size: 0.8rem;">
            <strong style="color: var(--accent-purple);">🛡️ ARQUITECTURA SEGURA DE IA:</strong>
            <p style="color: var(--text-muted); margin-top: 4px;">
              Para conectar una IA real (OpenAI/Gemini/Claude) en producción sin exponer tu API Key en el frontend estático de GitHub Pages, utiliza un servidor intermediario seguro (Cloudflare Workers / Vercel Serverless Function) que reciba la petición, agregue la API Key en el header y devuelva la respuesta.
            </p>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="tutor-chat-window">
          <div class="chat-history" id="tutor-chat-history">
            <div class="chat-bubble tutor">
              ¡Hola! Soy tu <strong>CyberTutor</strong>. He analizado tu progreso actual: Nivel ${this.storage.data.level} (XP: ${this.storage.data.xp}). ¿En qué concepto te puedo ayudar hoy?
            </div>
          </div>
          <div class="chat-input-bar">
            <input type="text" id="tutor-user-input" class="chat-input" placeholder="Escribe tu duda a CyberTutor..." onkeypress="if(event.key==='Enter') window.CyberTutor.sendUserMessage()" />
            <button class="btn btn-primary" onclick="window.CyberTutor.sendUserMessage()">Enviar</button>
          </div>
        </div>
      </div>
    `;
  }

  sendPreset(text) {
    const input = document.getElementById('tutor-user-input');
    if (input) {
      input.value = text;
      this.sendUserMessage();
    }
  }

  sendUserMessage() {
    const input = document.getElementById('tutor-user-input');
    const history = document.getElementById('tutor-chat-history');
    if (!input || !history) return;

    const msg = input.value.trim();
    if (!msg) return;

    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = msg;
    history.appendChild(userBubble);

    input.value = '';

    // Generate Simulated AI Response based on cybersecurity concepts
    setTimeout(() => {
      const response = this.generateSimulatedAIResponse(msg);
      const tutorBubble = document.createElement('div');
      tutorBubble.className = 'chat-bubble tutor';
      tutorBubble.innerHTML = response;
      history.appendChild(tutorBubble);
      history.scrollTop = history.scrollHeight;
    }, 600);
  }

  generateSimulatedAIResponse(prompt) {
    const p = prompt.toLowerCase();

    if (p.includes('10 años')) {
      return `<strong>CyberTutor:</strong> Imagina que enviar información por Internet es como mandar cartas por correo. ✉️ <br><br><strong>TCP</strong> es como un servicio de correo súper responsable: se asegura de llamar por teléfono antes de mandar la carta para confirmar que estás en casa (Handshake), le pone un número a cada carta (1, 2, 3) y si la carta #2 se pierde en el camino, ¡la vuelve a enviar hasta que tengas todas ordenaditas!`;
    }

    if (p.includes('universitario')) {
      return `<strong>CyberTutor:</strong> A nivel universitario de arquitectura de sistemas: <br><br><strong>TCP (Transmission Control Protocol)</strong> es un protocolo de capa de transporte (Capa 4 OSI) orientado a conexión y confiable. Utiliza un <em>Handshake de 3 vías (SYN, SYN-ACK, ACK)</em> para negociar el Sequence Number (ISN) y el Window Size. Garantiza entrega mediante control de flujo (Sliding Window Algorithm) y retransmisión adaptativa mediante RTT (Round Trip Time).`;
    }

    if (p.includes('evalúame') || p.includes('evaluame')) {
      return `<strong>CyberTutor:</strong> ¡Excelente! Aquí tienes tu evaluación sobre NAT: <br><br><strong>Pregunta 1:</strong> ¿En qué capa del modelo OSI opera un router realizando PAT (Port Address Translation)? <br><strong>Pregunta 2:</strong> ¿Por qué NAT ayuda a preservar direcciones IPv4 públicas en redes privadas? <br><br>Responde en el chat y analizaré tus respuestas.`;
    }

    return `<strong>CyberTutor:</strong> He recibido tu consulta: <em>"${prompt}"</em>. <br><br>Como concepto fundamental de ciberseguridad, recuerda siempre verificar los tres aspectos de la Tríada CIA (Confidencialidad, Integridad y Disponibilidad) e inspeccionar los logs de auditoría para validar este comportamiento en tus laboratorios.`;
  }
}

window.CyberTutor = new CyberTutorEngine();
