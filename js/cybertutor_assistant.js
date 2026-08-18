/* CyberLab — CyberTutor Floating IA Assistant & Context Memory Component
   Autonomous Robot Companion with Eye-Tracking, Micro-Emotions, Unsolicited Insights & Auto-Glossary */
class CyberTutorAssistant {
  constructor() {
    this.storage = window.CyberStorage;
    this.isOpen = false;
    this.history = [];
    this.idleTimer = null;
    this.isAutonomousIdle = false;
    this.thoughtTimer = null;
    this.lastUserActivity = Date.now();
    this.activeThoughtPrompt = null;
    this.userDismissedThoughts = false;
    this.initWidget();
  }

  initWidget() {
    if (document.getElementById('cybertutor-fab')) return;

    // Robot Avatar Button
    const fab = document.createElement('button');
    fab.id = 'cybertutor-fab';
    fab.className = 'cybertutor-robot-fab';
    fab.setAttribute('aria-label', 'Abrir CyberTutor IA');
    fab.innerHTML = `
      <div class="robot-face">
        <div class="robot-head">
          <div class="robot-antenna"><span class="antenna-bulb"></span></div>
          <div class="robot-visor">
            <div class="eye left-eye" id="left-eye"><div class="pupil" id="left-pupil"></div></div>
            <div class="eye right-eye" id="right-eye"><div class="pupil" id="right-pupil"></div></div>
          </div>
        </div>
      </div>
      <div class="robot-pulse-ring"></div>
    `;
    fab.onclick = () => this.toggleDrawer();
    document.body.appendChild(fab);

    // Floating Thought Bubble Container
    const thoughtBubble = document.createElement('div');
    thoughtBubble.id = 'robot-thought-bubble';
    thoughtBubble.className = 'robot-thought-bubble hidden';
    thoughtBubble.setAttribute('role', 'status');
    thoughtBubble.setAttribute('aria-live', 'polite');
    thoughtBubble.onclick = (e) => {
      if (e.target.closest('.thought-close-btn')) return;
      if (this.activeThoughtPrompt) {
        this.sendQuickPrompt(this.activeThoughtPrompt);
      } else {
        this.toggleDrawer(true);
      }
      this.hideThoughtBubble();
    };
    document.body.appendChild(thoughtBubble);

    this.initEyeTracking(fab);

    // CyberTutor Drawer Panel
    const drawer = document.createElement('div');
    drawer.id = 'cybertutor-drawer';
    drawer.className = 'cybertutor-drawer-panel';
    drawer.setAttribute('aria-label', 'CyberTutor IA');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="drawer-header">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <span style="font-size:1.6rem">🤖</span>
          <div style="min-width:0">
            <h3 style="font-size:1.05rem;margin:0;color:var(--accent-cyan)">CyberTutor IA</h3>
            <span class="tag cyan" style="font-size:.7rem">Gemini 1.5 Pro Brain</span>
          </div>
        </div>
        <button class="drawer-close-btn" id="cybertutor-drawer-close" aria-label="Cerrar CyberTutor">✕</button>
      </div>
      <div class="drawer-context-strip">
        <span class="ctx-pill">⚡ Nivel ${this.storage?.data?.level || 1}</span>
        <span class="ctx-pill">🏆 ${this.storage?.data?.xp || 0} XP</span>
        <span class="ctx-pill">🔥 ${this.storage?.data?.streak || 1}d Racha</span>
      </div>
      <div class="drawer-messages-body" id="cybertutor-drawer-messages">
        <div class="chat-bubble tutor">¡Hola 👋! Soy tu <strong>CyberTutor</strong> impulsado por Gemini. Cualquier concepto de ciberseguridad que consultemos se guardará automáticamente en tu <strong>Glosario</strong>.</div>
      </div>
      <div class="drawer-quick-prompts">
        <button class="quick-chip" data-prompt="Dame un ejemplo práctico de la Tríada CIA.">💡 Ejercicio CIA</button>
        <button class="quick-chip" data-prompt="Explícame el Three-Way Handshake TCP.">🌐 Handshake TCP</button>
        <button class="quick-chip" data-prompt="¿Cómo calculo la máscara de subred /28?">🔢 Subnetting /28</button>
      </div>
      <div class="drawer-input-bar">
        <input type="text" id="cybertutor-drawer-input" class="chat-input" autocomplete="off" placeholder="Pregunta a CyberTutor…">
        <button class="btn btn-primary" id="cybertutor-drawer-send-btn">Enviar</button>
      </div>`;
    document.body.appendChild(drawer);

    drawer.querySelector('#cybertutor-drawer-close').onclick = () => this.toggleDrawer(false);
    drawer.querySelector('#cybertutor-drawer-send-btn').onclick = () => this.sendMessage();
    drawer.querySelector('#cybertutor-drawer-input').addEventListener('keydown', e => { if (e.key === 'Enter') this.sendMessage(); });
    drawer.querySelectorAll('.quick-chip').forEach(btn => btn.onclick = () => this.sendQuickPrompt(btn.dataset.prompt));

    this.startAutonomousLife();
  }

  initEyeTracking(fab) {
    const leftPupil = fab.querySelector('#left-pupil');
    const rightPupil = fab.querySelector('#right-pupil');
    const leftEye = fab.querySelector('#left-eye');
    const rightEye = fab.querySelector('#right-eye');

    this.updateEyesPosition = (targetX, targetY) => {
      [ { eye: leftEye, pupil: leftPupil }, { eye: rightEye, pupil: rightPupil } ].forEach(({ eye, pupil }) => {
        if (!eye || !pupil) return;
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = targetX - eyeCenterX;
        const dy = targetY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(3.5, Math.hypot(dx, dy) / 25);

        const offsetX = Math.cos(angle) * dist;
        const offsetY = Math.sin(angle) * dist;

        pupil.style.transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;
      });
    };

    const registerActivity = (e) => {
      this.lastUserActivity = Date.now();
      this.isAutonomousIdle = false;
      if (e.type === 'touchmove' && e.touches[0]) {
        this.updateEyesPosition(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.clientX !== undefined) {
        this.updateEyesPosition(e.clientX, e.clientY);
      }
    };

    window.addEventListener('pointermove', registerActivity, { passive: true });
    window.addEventListener('touchmove', registerActivity, { passive: true });

    // Blink Loop
    setInterval(() => {
      if (leftEye && rightEye) {
        leftEye.classList.add('blinking');
        rightEye.classList.add('blinking');
        setTimeout(() => {
          leftEye.classList.remove('blinking');
          rightEye.classList.remove('blinking');
        }, 160);
      }
    }, 3600);

    fab.addEventListener('pointerenter', () => fab.classList.add('emotion-happy'));
    fab.addEventListener('pointerleave', () => fab.classList.remove('emotion-happy'));
  }

  startAutonomousLife() {
    // 1. Autonomous Glance Loop when user is idle
    setInterval(() => {
      if (Date.now() - this.lastUserActivity > 3000) {
        this.isAutonomousIdle = true;
        this.performAutonomousGlance();
      }
    }, 5000);

    // 2. Unsolicited Spontaneous Thought & Insight Loop (85s interval, highly discrete)
    setTimeout(() => this.triggerSpontaneousThought(), 12000);
    setInterval(() => this.triggerSpontaneousThought(), 85000);

    // 3. React to view navigation
    window.addEventListener('hashchange', () => {
      setTimeout(() => this.triggerContextualThought(), 2000);
    });
  }

  performAutonomousGlance() {
    if (!this.updateEyesPosition || this.isOpen) return;
    const fab = document.getElementById('cybertutor-fab');
    if (!fab) return;

    const targets = [
      { x: window.innerWidth * 0.8, y: 35 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4 },
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.85 },
      { x: window.innerWidth * 0.9, y: window.innerHeight * 0.9 }
    ];
    const picked = targets[Math.floor(Math.random() * targets.length)];
    this.updateEyesPosition(picked.x, picked.y);

    if (Math.random() > 0.7) {
      fab.classList.add('emotion-happy');
      setTimeout(() => fab.classList.remove('emotion-happy'), 1500);
    }
  }

  triggerSpontaneousThought() {
    if (this.isOpen || this.userDismissedThoughts || document.body.classList.contains('account-gate-active')) return;

    const hash = (location.hash || '#dashboard').replace('#', '');
    const thoughts = {
      dashboard: [
        { text: "🤖 ¡Tu racha sigue activa! ¿Practicamos un laboratorio rápido?", prompt: "Recomiéndame el mejor laboratorio para mi nivel." },
        { text: "💡 Tip: El 80% de ataques inician con Phishing.", prompt: "Explícame las técnicas de Phishing y cómo detectarlas." }
      ],
      recorrido: [
        { text: "🧭 ¡Cada nodo del circuito refuerza tu aprendizaje!", prompt: "Explícame el objetivo de la etapa actual en mi recorrido." }
      ],
      labs: [
        { text: "🧪 En la terminal puedes probar comandos simulados.", prompt: "Dame una guía rápida para el laboratorio de análisis de tráfico." }
      ]
    };

    const currentList = thoughts[hash] || thoughts.dashboard;
    const item = currentList[Math.floor(Math.random() * currentList.length)];
    this.showThoughtBubble(item.text, item.prompt);
  }

  triggerContextualThought() {
    if (this.isOpen || this.userDismissedThoughts) return;
    const hash = (location.hash || '#dashboard').replace('#', '');
    const viewNames = {
      dashboard: 'Dashboard', recorrido: 'Recorrido', labs: 'Laboratorios',
      quizzes: 'Exámenes', map: 'Mapa de Proceso', cybertutor: 'CyberTutor IA',
      notes: 'Mis Apuntes', resources: 'Recursos', glossary: 'Glosario'
    };
    const title = viewNames[hash];
    if (title) {
      this.showThoughtBubble(`📍 Sección <strong>${title}</strong>. ¡Consulta lo que necesites!`, `Dame un resumen rápido de la sección ${title}`);
    }
  }

  showThoughtBubble(textHTML, promptText = null) {
    const bubble = document.getElementById('robot-thought-bubble');
    const fab = document.getElementById('cybertutor-fab');
    if (!bubble || this.userDismissedThoughts) return;

    this.activeThoughtPrompt = promptText;
    bubble.innerHTML = `
      <div class="thought-content"><span>${textHTML}</span></div>
      <button class="thought-close-btn" aria-label="Cerrar aviso" onclick="event.stopPropagation(); window.CyberTutorAssistant.hideThoughtBubble(true);">✕</button>
    `;
    bubble.classList.remove('hidden');

    if (fab) fab.classList.add('emotion-happy');

    clearTimeout(this.thoughtTimer);
    this.thoughtTimer = setTimeout(() => {
      this.hideThoughtBubble();
    }, 7500);
  }

  hideThoughtBubble(userInitiated = false) {
    const bubble = document.getElementById('robot-thought-bubble');
    const fab = document.getElementById('cybertutor-fab');
    if (bubble) bubble.classList.add('hidden');
    if (fab) fab.classList.remove('emotion-happy');
    if (userInitiated) {
      this.userDismissedThoughts = true;
      setTimeout(() => { this.userDismissedThoughts = false; }, 180000); // 3 min silence
    }
  }

  toggleDrawer(force) {
    const drawer = document.getElementById('cybertutor-drawer');
    if (!drawer) return;
    this.hideThoughtBubble();
    this.isOpen = typeof force === 'boolean' ? force : !this.isOpen;
    drawer.classList.toggle('open', this.isOpen);
    drawer.setAttribute('aria-hidden', String(!this.isOpen));
    document.body.classList.toggle('cybertutor-open', this.isOpen);
    if (this.isOpen) {
      const input = document.getElementById('cybertutor-drawer-input');
      if (input) { setTimeout(() => input.focus(), 120); }
    }
  }

  askAboutConcept(conceptName) {
    if (!this.isOpen) this.toggleDrawer(true);
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
    const fab = document.getElementById('cybertutor-fab');
    if (fab) fab.classList.add('emotion-thinking');

    const typingBubble = this.appendBubble('tutor', '🤖 CyberTutor está analizando tu consulta con Gemini 1.5 Pro…', false);
    try {
      const endpoint = window.CyberTutor?.endpoint?.() || 'https://cyberla-cybertutor.tapiashdicson.workers.dev/api/cybertutor';
      const studentContext = window.CyberTutor?.buildStudentContext?.() || {};
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text', message: msg, history: this.history.slice(-10), student: studentContext })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      let answer = data.answer || 'No recibí una respuesta válida.';
      if (window.CyberTutor?.processXpRewards) {
        answer = window.CyberTutor.processXpRewards(answer);
      }
      if (typingBubble) typingBubble.innerHTML = window.CyberTutor?.parseMarkdown?.(answer) || this.escape(answer);
      this.history.push({ role: 'user', content: msg }, { role: 'model', content: answer });

      // Auto-Save concept to Glosario
      this.autoSaveToGlossary(msg, answer);

    } catch (e) {
      console.error(e);
      if (typingBubble) typingBubble.textContent = `⚠️ No pude conectar con CyberTutor. ${e.message || 'Error de red'}`;
    } finally {
      if (fab) fab.classList.remove('emotion-thinking');
    }
  }

  autoSaveToGlossary(question, answer) {
    if (!window.CyberStorage?.addAiGlossaryTerm) return;

    const termMatch = question.match(/(?:qué es|que es|explicame|explícame|definición de|definicion de|significa|concepto de|cómo funciona|como funciona)\s+([a-záéíóúñ0-9\s\-_/]+)/i);
    let term = termMatch ? termMatch[1].trim() : null;

    if (!term) {
      const knownTerms = ['phishing', 'firewall', 'xss', 'sql injection', 'mitm', 'ransomware', 'vpn', 'dns', 'tcp', 'ddos', 'zero day', 'triada cia', 'nmap', 'wireshark', 'hash', 'cifrado', 'soc', 'siem', 'malware'];
      const found = knownTerms.find(t => question.toLowerCase().includes(t));
      if (found) term = found.toUpperCase();
    }

    if (term) {
      term = term.replace(/[?¿!¡.,]/g, '').trim();
      term = term.charAt(0).toUpperCase() + term.slice(1);

      const plainText = answer.replace(/<[^>]+>/g, '').replace(/[*_#`]/g, '');
      const sentences = plainText.split('.').map(s => s.trim()).filter(Boolean);
      const simpleDef = sentences[0] ? sentences[0] + '.' : 'Explicación generada por CyberTutor IA.';
      const techDef = sentences[1] ? sentences[1] + '.' : simpleDef;

      window.CyberStorage.addAiGlossaryTerm({
        term: term,
        simpleDef: simpleDef.slice(0, 220),
        techDef: techDef.slice(0, 300),
        example: `Aprendido en consulta con CyberTutor IA.`,
        category: '🤖 IA CyberTutor'
      });

      this.showMiniToast(`📖 Concepto '${term}' guardado en tu Glosario.`);
    }
  }

  showMiniToast(text) {
    const toast = document.createElement('div');
    toast.className = 'cybertutor-mini-toast';
    toast.innerHTML = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  appendBubble(role, text) {
    const container = document.getElementById('cybertutor-drawer-messages');
    if (!container) return null;
    const b = document.createElement('div');
    b.className = `chat-bubble ${role}`;
    if (role === 'tutor' && window.CyberTutor) b.innerHTML = window.CyberTutor.parseMarkdown(text);
    else b.textContent = text;
    container.appendChild(b);
    container.scrollTop = container.scrollHeight;
    return b;
  }

  escape(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
}
window.CyberTutorAssistant = new CyberTutorAssistant();
