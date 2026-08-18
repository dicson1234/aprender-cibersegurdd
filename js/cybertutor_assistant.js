/* CyberLab — CyberTutor Floating IA Assistant & Context Memory Component
   Autonomous Robot Companion with Eye-Tracking, Micro-Emotions & Unsolicited Insights */
class CyberTutorAssistant {
  constructor() {
    this.storage = window.CyberStorage;
    this.isOpen = false;
    this.history = [];
    this.idleTimer = null;
    this.isAutonomousIdle = false;
    this.thoughtTimer = null;
    this.lastUserActivity = Date.now();
    this.activeThought = null;
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
    thoughtBubble.onclick = () => {
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
        <div class="chat-bubble tutor">¡Hola 👋! Soy tu <strong>CyberTutor</strong> impulsado por Gemini. Estoy observando tu progreso en ciberseguridad. ¿En qué puedo guiarte hoy?</div>
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
      if (Date.now() - this.lastUserActivity > 2500) {
        this.isAutonomousIdle = true;
        this.performAutonomousGlance();
      }
    }, 4200);

    // 2. Unsolicited Spontaneous Thought & Insight Loop ("opiniones de la nada")
    setTimeout(() => this.triggerSpontaneousThought(), 6000);
    setInterval(() => this.triggerSpontaneousThought(), 32000);

    // 3. React to hash/view navigation
    window.addEventListener('hashchange', () => {
      setTimeout(() => this.triggerContextualThought(), 1200);
    });
  }

  performAutonomousGlance() {
    if (!this.updateEyesPosition || this.isOpen) return;
    const fab = document.getElementById('cybertutor-fab');
    if (!fab) return;

    // Pick a random target to look at
    const targets = [
      { x: window.innerWidth * 0.8, y: 35 }, // Header XP / Level
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4 }, // Center screen
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.85 }, // Bottom Nav
      { x: window.innerWidth * 0.9, y: window.innerHeight * 0.9 } // Self area
    ];
    const picked = targets[Math.floor(Math.random() * targets.length)];
    this.updateEyesPosition(picked.x, picked.y);

    // Random expression chance
    if (Math.random() > 0.6) {
      fab.classList.add('emotion-happy');
      setTimeout(() => fab.classList.remove('emotion-happy'), 1500);
    }
  }

  triggerSpontaneousThought() {
    if (this.isOpen || document.body.classList.contains('account-gate-active')) return;

    const hash = (location.hash || '#dashboard').replace('#', '');
    const data = this.storage?.data || {};

    const thoughts = {
      dashboard: [
        { text: "🤖 ¡Hola! Tu racha actual es constante. ¿Repasamos un laboratorio hoy?", prompt: "Recomiéndame el mejor laboratorio para mi nivel." },
        { text: "💡 Tip: El 80% de los incidentes de seguridad comienzan con correos de Phishing.", prompt: "Explícame las técnicas de Phishing y cómo detectarlas." },
        { text: "🛡️ Tríada CIA: Confidencialidad, Integridad y Disponibilidad.", prompt: "Dame un caso real de violación de Integridad de datos." }
      ],
      recorrido: [
        { text: "🧭 ¡El camino en circuito te guía etapa por etapa!", prompt: " Explícame el objetivo de la etapa actual en mi recorrido." },
        { text: "⚡ ¿Sabías que dominar Nmap te abre las puertas al Red Teaming?", prompt: "Dame los 5 comandos esenciales de Nmap con sus sintaxis." }
      ],
      labs: [
        { text: "🧪 En la terminal interactiva puedes ejecutar comandos reales simulados.", prompt: "Dame una guía rápida para el laboratorio de análisis de tráfico." },
        { text: "🔍 Si ves tráfico HTTP sin TLS (puerto 80), las credenciales viajan en texto plano.", prompt: "¿Por qué Wireshark puede capturar contraseñas en HTTP?" }
      ],
      quizzes: [
        { text: "📝 Recuerda: para aprobar una evaluación necesitas el 80% o más.", prompt: "Dame un mini test de 3 preguntas de práctica sobre redes." }
      ],
      notes: [
        { text: "📓 Tomar notas activa la retención a largo plazo. ¡Apunta tus comandos clave!", prompt: "¿Cómo estructurar mis notas de ciberseguridad eficientemente?" }
      ]
    };

    const currentList = thoughts[hash] || thoughts.dashboard;
    const item = currentList[Math.floor(Math.random() * currentList.length)];
    this.showThoughtBubble(item.text, item.prompt);
  }

  triggerContextualThought() {
    const hash = (location.hash || '#dashboard').replace('#', '');
    const viewNames = {
      dashboard: 'Dashboard', recorrido: 'Recorrido', labs: 'Laboratorios',
      quizzes: 'Exámenes', map: 'Mapa de Conocimientos', cybertutor: 'CyberTutor IA',
      notes: 'Mis Apuntes', resources: 'Recursos', profile: 'Mi Perfil'
    };
    const title = viewNames[hash];
    if (title && !this.isOpen) {
      this.showThoughtBubble(`📍 Entraste a <strong>${title}</strong>. ¡Estoy listo si tienes preguntas!`, `Dame un resumen rápido de la sección ${title}`);
    }
  }

  showThoughtBubble(textHTML, promptText = null) {
    const bubble = document.getElementById('robot-thought-bubble');
    const fab = document.getElementById('cybertutor-fab');
    if (!bubble) return;

    this.activeThoughtPrompt = promptText;
    bubble.innerHTML = `<span>${textHTML}</span><span class="thought-close" onclick="event.stopPropagation(); window.CyberTutorAssistant.hideThoughtBubble();">✕</span>`;
    bubble.classList.remove('hidden');

    if (fab) fab.classList.add('emotion-happy');

    clearTimeout(this.thoughtTimer);
    this.thoughtTimer = setTimeout(() => {
      this.hideThoughtBubble();
    }, 9000);
  }

  hideThoughtBubble() {
    const bubble = document.getElementById('robot-thought-bubble');
    const fab = document.getElementById('cybertutor-fab');
    if (bubble) bubble.classList.add('hidden');
    if (fab) fab.classList.remove('emotion-happy');
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
    } catch (e) {
      console.error(e);
      if (typingBubble) typingBubble.textContent = `⚠️ No pude conectar con CyberTutor. ${e.message || 'Error de red'}`;
    } finally {
      if (fab) fab.classList.remove('emotion-thinking');
    }
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
