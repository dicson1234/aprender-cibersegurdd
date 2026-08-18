/* ==========================================================================
   CyberLab — CyberTutor Floating IA Assistant & Context Memory Component
   ========================================================================== */

class CyberTutorAssistant {
  constructor() {
    this.storage = window.CyberStorage;
    this.isOpen = false;
    this.history = [];
    this.initWidget();
  }

  initWidget() {
    if (document.getElementById('cybertutor-fab')) return;

    // Create Floating Action Button (FAB)
    const fab = document.createElement('button');
    fab.id = 'cybertutor-fab';
    fab.className = 'cybertutor-fab-btn';
    fab.setAttribute('aria-label', 'Abrir CyberTutor IA');
    fab.innerHTML = `
      <span class="fab-icon">🤖</span>
      <span class="fab-label">CyberTutor</span>
      <span class="fab-pulse"></span>
    `;
    fab.onclick = () => this.toggleDrawer();
    document.body.appendChild(fab);

    // Create Sliding Drawer
    const drawer = document.createElement('div');
    drawer.id = 'cybertutor-drawer';
    drawer.className = 'cybertutor-drawer-panel';
    drawer.innerHTML = `
      <div class="drawer-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.6rem">🤖</span>
          <div>
            <h3 style="font-size:1.05rem;margin:0;color:var(--accent-cyan)">CyberTutor IA</h3>
            <span class="tag cyan" style="font-size:0.7rem">Asistente Educativo en Vivo</span>
          </div>
        </div>
        <button class="drawer-close-btn" onclick="window.CyberTutorAssistant.toggleDrawer()">✕</button>
      </div>

      <div class="drawer-context-strip">
        <span class="ctx-pill">⚡ Nivel ${this.storage?.data?.level || 1}</span>
        <span class="ctx-pill">🏆 ${this.storage?.data?.xp || 0} XP</span>
        <span class="ctx-pill">🔥 ${this.storage?.data?.streak || 1}d Racha</span>
      </div>

      <div class="drawer-messages-body" id="cybertutor-drawer-messages">
        <div class="chat-bubble tutor">
          ¡Hola 👋! Soy tu <strong>CyberTutor</strong>. Estoy monitoreando tu recorrido en ciberseguridad. ¿Qué concepto, comando o laboratorio deseas consultar?
        </div>
      </div>

      <div class="drawer-quick-prompts">
        <button class="quick-chip" onclick="window.CyberTutorAssistant.sendQuickPrompt('Dame un ejemplo práctico de la Tríada CIA.')">💡 Ejercicio CIA</button>
        <button class="quick-chip" onclick="window.CyberTutorAssistant.sendQuickPrompt('Explícame el Three-Way Handshake TCP.')">🌐 Handshake TCP</button>
        <button class="quick-chip" onclick="window.CyberTutorAssistant.sendQuickPrompt('¿Cómo calculo la máscara de subred /28?')">🔢 Subnetting /28</button>
      </div>

      <div class="drawer-input-bar">
        <input type="text" id="cybertutor-drawer-input" class="chat-input" placeholder="Pregunta a CyberTutor..." onkeypress="if(event.key==='Enter') window.CyberTutorAssistant.sendMessage()" />
        <button class="btn btn-primary" id="cybertutor-drawer-send-btn" onclick="window.CyberTutorAssistant.sendMessage()">Enviar</button>
      </div>
    `;

    document.body.appendChild(drawer);
  }

  toggleDrawer() {
    const drawer = document.getElementById('cybertutor-drawer');
    if (!drawer) return;
    this.isOpen = !this.isOpen;
    drawer.classList.toggle('open', this.isOpen);

    if (this.isOpen) {
      const input = document.getElementById('cybertutor-drawer-input');
      if (input) input.focus();
    }
  }

  askAboutConcept(conceptName) {
    if (!this.isOpen) this.toggleDrawer();
    this.sendQuickPrompt(`Explícame el concepto '${conceptName}' de forma más fácil y dame un ejemplo real.`);
  }

  sendQuickPrompt(text) {
    const input = document.getElementById('cybertutor-drawer-input');
    if (input) {
      input.value = text;
      this.sendMessage();
    }
  }

  async sendMessage() {
    const input = document.getElementById('cybertutor-drawer-input');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    this.appendBubble('user', msg);

    const typingBubble = this.appendBubble('tutor', '🤖 CyberTutor está analizando tu consulta...', true);

    try {
      const endpoint = window.CyberTutor ? window.CyberTutor.endpoint() : 'https://cyberla-cybertutor.tapiashdicson.workers.dev/api/cybertutor';
      const studentContext = window.CyberTutor ? window.CyberTutor.buildStudentContext() : {};

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          message: msg,
          history: this.history.slice(-10),
          student: studentContext
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

      const answer = data.answer || 'No recibí una respuesta válida.';
      typingBubble.innerHTML = window.CyberTutor ? window.CyberTutor.parseMarkdown(answer) : answer;

      this.history.push({ role: 'user', content: msg });
      this.history.push({ role: 'model', content: answer });

    } catch (e) {
      console.error(e);
      typingBubble.innerHTML = `⚠️ No pude conectar con el servidor de CyberTutor. (${e.message || 'Error de red'})`;
    }
  }

  appendBubble(role, text, isRawHtml = false) {
    const container = document.getElementById('cybertutor-drawer-messages');
    if (!container) return null;

    const b = document.createElement('div');
    b.className = `chat-bubble ${role}`;

    if (isRawHtml) {
      b.innerHTML = text;
    } else if (role === 'tutor' && window.CyberTutor) {
      b.innerHTML = window.CyberTutor.parseMarkdown(text);
    } else {
      b.textContent = text;
    }

    container.appendChild(b);
    container.scrollTop = container.scrollHeight;
    return b;
  }
}

window.CyberTutorAssistant = new CyberTutorAssistant();
