/* CyberLab CyberTutor — Gemini text chat + optional Gladia voice.
   IMPORTANT: API secrets stay in the Cloudflare Worker, never in this file. */
const CYBERLAB_CYBERTUTOR_ENDPOINT = 'https://cyberla-cybertutor.tapiashdicson.workers.dev/api/cybertutor';

class CyberTutorEngine {
  constructor(){
    this.storage = window.CyberStorage;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.busy = false;
    this.chatHistory = [];
    this.initNotifications();
  }

  endpoint(){
    return localStorage.getItem('cyberlab_cybertutor_endpoint') || window.CYBERLAB_CONFIG?.cybertutorEndpoint || CYBERLAB_CYBERTUTOR_ENDPOINT;
  }

  esc(v){
    return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  parseMarkdown(text) {
    if (!text) return '';
    let str = String(text);

    // Code blocks ```code```
    str = str.replace(/```([a-z]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
      const cleanCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre><code>${cleanCode.trim()}</code></pre>`;
    });

    // Inline code `code`
    str = str.replace(/`([^`]+)`/g, (match, code) => {
      const cleanCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;color:#00f0ff">${cleanCode}</code>`;
    });

    // Headers (### Header -> <h3>Header</h3>)
    str = str.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    str = str.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    str = str.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Horizontal Rule (--- -> <hr>)
    str = str.replace(/^---$/gim, '<hr>');

    // Blockquotes (> Quote -> blockquote)
    str = str.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bold (**bold**) & Italic (*italic*)
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Unordered lists (* or - item)
    str = str.replace(/^[\*\-] (.*$)/gim, '<ul><li>$1</li></ul>');
    str = str.replace(/<\/ul>\s*<ul>/g, '');

    // Ordered lists (1. item)
    str = str.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
    str = str.replace(/<\/ol>\s*<ol>/g, '');

    // Divide into paragraphs by double line breaks
    const blocks = str.split(/\n{2,}/);
    str = blocks.map(b => {
      const trimmed = b.trim();
      if (!trimmed) return '';
      if (/^<(h[1-3]|pre|blockquote|ul|ol|hr)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return str;
  }

  render() {
    const c = document.getElementById('cybertutor-root'); if (!c) return;
    const notifStatus = ("Notification" in window) ? Notification.permission : 'unsupported';
    const notifLabel = notifStatus === 'granted' ? '🔔 Notificaciones' : '🔔 Activar';
    const account = window.CyberAccounts?.getActive();

    c.innerHTML = `
      <div class="chatgpt-web-layout">
        <!-- Sidebar Assistants & Presets -->
        <aside class="chatgpt-sidebar">
          <div class="chatgpt-sidebar-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:1.3rem">🤖</span>
              <div>
                <div style="font-weight:800;font-size:0.95rem;color:#fff;">CyberTutor IA</div>
                <div style="font-size:0.7rem;color:var(--accent-cyan);">Gemini 1.5 Pro Brain</div>
              </div>
            </div>
          </div>

          <div class="chatgpt-sidebar-section">
            <div class="sidebar-label">ROL & ASISTENTES</div>
            <button class="chatgpt-role-btn active" onclick="CyberTutor.sendPreset('Actúa como un Analista SOC Senior y evalúa mis respuestas de seguridad.')">🛡️ Analista SOC Senior</button>
            <button class="chatgpt-role-btn" onclick="CyberTutor.sendPreset('Actúa como un Auditor de Código de Ciberseguridad e inspecciona mis explicaciones.')">🔍 Auditor de Código</button>
            <button class="chatgpt-role-btn" onclick="CyberTutor.sendPreset('Actúa como un Pentester Red Team y explícame las vulnerabilidades de forma práctica.')">⚔️ Red Team Pentester</button>
          </div>

          <div class="chatgpt-sidebar-section">
            <div class="sidebar-label">PROMPTS RÁPIDOS</div>
            <button class="chatgpt-prompt-btn" onclick="CyberTutor.requestDiagnostic()">📊 Diagnóstico de Progreso</button>
            <button class="chatgpt-prompt-btn" onclick="CyberTutor.sendPreset('Explícame la Tríada CIA (Confidencialidad, Integridad, Disponibilidad) con un ejemplo real.')">💡 Explicar Tríada CIA</button>
            <button class="chatgpt-prompt-btn" onclick="CyberTutor.sendPreset('Guarda el concepto de Firewall en mi glosario con definición técnica y ejemplo.')">📖 Guardar Firewall en Glosario</button>
            <button class="chatgpt-prompt-btn" onclick="CyberTutor.sendPreset('Evalúame con 3 preguntas sobre Redes y dime exactamente qué debo estudiar.')">📝 Examen Rápido de Redes</button>
          </div>

          <div class="chatgpt-sidebar-footer">
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">
              👤 <strong>${account ? account.username : 'Usuario Local'}</strong><br>
              ⚡ Nivel ${this.storage?.data?.level || 1} • ${this.storage?.data?.xp || 0} XP
            </div>
            <button id="cybertutor-notif-btn" class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:6px" onclick="CyberTutor.toggleNotifications()">${notifLabel}</button>
            <button id="cybertutor-clear-btn" class="btn btn-secondary btn-sm" style="width:100%">🗑️ Limpiar Historial</button>
          </div>
        </aside>

        <!-- Main Chat Body -->
        <main class="chatgpt-chat-area">
          <header class="chatgpt-chat-header">
            <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
              <span class="status-indicator-dot"></span>
              <span style="font-weight:700;font-size:0.88rem;color:#fff;white-space:nowrap;">CyberTutor</span>
              <span class="tag cyan" style="font-size:0.65rem;">Gemini 1.5</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <button class="btn btn-secondary btn-sm cybertutor-mobile-btn" onclick="CyberTutor.openPromptsModal()" title="Roles y Prompts Rápidos" style="font-size:0.75rem;padding:4px 8px;">📋 Roles</button>
              <button class="btn btn-secondary btn-sm" onclick="CyberTutor.openConfigModal()" title="Configuración de IA" style="font-size:0.75rem;padding:4px 8px;">⚙️ Opciones</button>
            </div>
          </header>

          <div class="chatgpt-messages-container" id="tutor-chat-history">
            <div class="chatgpt-msg tutor-msg">
              <div class="msg-avatar">🤖</div>
              <div class="msg-content">
                <p>¡Hola <strong>${account ? account.username : 'Estudiante'}</strong>! 👋 Soy tu <strong>CyberTutor IA</strong> impulsado por Gemini 1.5 Pro.</p>
                <p>Puedo ayudarte a repasar laboratorios, explicarte conceptos complejos de ciberseguridad o <strong>guardar automáticamente cualquier término en tu Glosario personal</strong> (solo pídeme: <em>"Guarda el concepto X en mi glosario"</em>).</p>
                <p>¿En qué deseas entrenar hoy?</p>
              </div>
            </div>
          </div>

          <!-- Bottom Fixed Input Bar -->
          <footer class="chatgpt-input-container">
            <div class="chatgpt-quick-chips">
              <button class="chip-btn" onclick="CyberTutor.sendPreset('Explícame qué es XSS y cómo prevenirlo.')">🛡️ ¿Qué es XSS?</button>
              <button class="chip-btn" onclick="CyberTutor.sendPreset('Guarda la definición de Nmap en mi glosario.')">📖 Guardar Nmap en Glosario</button>
              <button class="chip-btn" onclick="CyberTutor.sendPreset('¿Cuáles son los puertos más comunes en Nmap y sus servicios?')">🌐 Puertos Comunes</button>
            </div>
            <div class="chatgpt-input-wrapper">
              <input type="text" id="tutor-user-input" class="chatgpt-input" placeholder="Escribe un mensaje a CyberTutor IA... (Ej: Guarda el concepto de Wireshark en mi glosario)" onkeypress="if(event.key==='Enter'){ CyberTutor.sendUserMessage(); }" />
              <button class="chatgpt-btn-mic" id="tutor-mic-btn" title="Activar micrófono">🎙️</button>
              <button class="chatgpt-btn-send" id="tutor-send-btn" title="Enviar mensaje">➔</button>
            </div>
          </footer>
        </main>
      </div>`;

    c.querySelector('#tutor-send-btn').onclick = () => this.sendUserMessage();
    c.querySelector('#tutor-mic-btn').onclick = () => this.toggleRecording();

    this.checkStudyReminders();
  }

  openConfigModal() {
    let modal = document.getElementById('cybertutor-config-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cybertutor-config-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `<div class="modal-card" style="max-width:500px;"><button class="modal-close" onclick="document.getElementById('cybertutor-config-modal').classList.remove('active')">✕</button><div id="cybertutor-config-modal-content"></div></div>`;
      document.body.appendChild(modal);
    }
    const currentEndpoint = this.endpoint();
    const account = window.CyberAccounts?.getActive();
    const notifStatus = ("Notification" in window) ? Notification.permission : 'unsupported';
    const notifLabel = notifStatus === 'granted' ? '🔔 Notificaciones Activas' : '🔔 Activar Notificaciones';

    const content = modal.querySelector('#cybertutor-config-modal-content');
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="font-size:1.6rem">⚙️</span>
        <div>
          <h3 style="font-size:1.1rem;font-weight:800;color:#fff;margin:0;">Opciones & Configuración IA</h3>
          <p style="font-size:0.78rem;color:var(--text-muted);margin:0;">Ajustes del motor CyberTutor y backend Cloudflare.</p>
        </div>
      </div>

      <div style="background:rgba(8,12,18,0.8);padding:12px;border-radius:12px;border:1px solid rgba(0,240,255,0.15);margin-bottom:14px;">
        <label style="font-size:0.8rem;font-weight:700;color:var(--accent-cyan);display:block;margin-bottom:4px;">🌐 Backend Cloudflare Worker Endpoint:</label>
        <input type="text" id="cybertutor-endpoint-input" class="chat-input" value="${this.esc(currentEndpoint)}" style="width:100%;height:38px;font-size:0.8rem;margin-bottom:8px;">
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" onclick="CyberTutor.saveEndpoint()">Guardar Endpoint</button>
          <button class="btn btn-secondary btn-sm" onclick="CyberTutor.resetEndpoint()">Restablecer por Defecto</button>
        </div>
      </div>

      <div style="background:rgba(8,12,18,0.8);padding:12px;border-radius:12px;border:1px solid rgba(163,113,247,0.18);margin-bottom:14px;">
        <label style="font-size:0.8rem;font-weight:700;color:#d0b5ff;display:block;margin-bottom:6px;">⏱️ Frecuencia del Asistente Autónomo:</label>
        <select id="cybertutor-interval-select" class="chat-input" style="width:100%;height:38px;font-size:0.8rem;margin-bottom:8px;" onchange="CyberTutor.updateInterval(this.value)">
          <option value="60000" ${localStorage.getItem('cyberlab_tutor_interval')==='60000'?'selected':''}>Cada 60 segundos</option>
          <option value="90000" ${!localStorage.getItem('cyberlab_tutor_interval')||localStorage.getItem('cyberlab_tutor_interval')==='90000'?'selected':''}>Cada 90 segundos (Recomendado)</option>
          <option value="180000" ${localStorage.getItem('cyberlab_tutor_interval')==='180000'?'selected':''}>Cada 3 minutos</option>
          <option value="300000" ${localStorage.getItem('cyberlab_tutor_interval')==='300000'?'selected':''}>Cada 5 minutos</option>
        </select>
        <span style="font-size:0.74rem;color:var(--text-muted);">Define la frecuencia con la que la burbuja flotante te ofrece consejos de estudio.</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        <button class="btn btn-secondary" onclick="CyberTutor.requestDiagnostic(); document.getElementById('cybertutor-config-modal').classList.remove('active');">📊 Generar Diagnóstico de Progreso</button>
        <button class="btn btn-secondary" onclick="CyberTutor.toggleNotifications();">${notifLabel}</button>
        <button class="btn btn-secondary" style="color:#ff6b6b;" onclick="CyberTutor.clearChat(); document.getElementById('cybertutor-config-modal').classList.remove('active');">🗑️ Limpiar Historial de Chat</button>
      </div>

      <div style="display:flex;justify-content:flex-end;">
        <button class="btn btn-primary" onclick="document.getElementById('cybertutor-config-modal').classList.remove('active')">Cerrar</button>
      </div>
    `;
    modal.classList.add('active');
  }

  openPromptsModal() {
    let modal = document.getElementById('cybertutor-prompts-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cybertutor-prompts-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `<div class="modal-card" style="max-width:480px;"><button class="modal-close" onclick="document.getElementById('cybertutor-prompts-modal').classList.remove('active')">✕</button><div id="cybertutor-prompts-modal-content"></div></div>`;
      document.body.appendChild(modal);
    }
    const content = modal.querySelector('#cybertutor-prompts-modal-content');
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="font-size:1.6rem">📋</span>
        <div>
          <h3 style="font-size:1.1rem;font-weight:800;color:#fff;margin:0;">Roles y Prompts Rápido</h3>
          <p style="font-size:0.78rem;color:var(--text-muted);margin:0;">Selecciona una modalidad o consulta recomendada.</p>
        </div>
      </div>

      <div class="sidebar-label" style="margin-bottom:6px;">ROL & ASISTENTES</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
        <button class="chatgpt-role-btn active" onclick="CyberTutor.sendPreset('Actúa como un Analista SOC Senior y evalúa mis respuestas de seguridad.'); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">🛡️ Analista SOC Senior</button>
        <button class="chatgpt-role-btn" onclick="CyberTutor.sendPreset('Actúa como un Auditor de Código de Ciberseguridad e inspecciona mis explicaciones.'); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">🔍 Auditor de Código</button>
        <button class="chatgpt-role-btn" onclick="CyberTutor.sendPreset('Actúa como un Pentester Red Team y explícame las vulnerabilidades de forma práctica.'); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">⚔️ Red Team Pentester</button>
      </div>

      <div class="sidebar-label" style="margin-bottom:6px;">PROMPTS RECOMENDADOS</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
        <button class="chatgpt-prompt-btn" onclick="CyberTutor.requestDiagnostic(); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">📊 Diagnóstico de Progreso</button>
        <button class="chatgpt-prompt-btn" onclick="CyberTutor.sendPreset('Explícame la Tríada CIA (Confidencialidad, Integridad, Disponibilidad) con un ejemplo real.'); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">💡 Explicar Tríada CIA</button>
        <button class="chatgpt-prompt-btn" onclick="CyberTutor.sendPreset('Guarda el concepto de Firewall en mi glosario con definición técnica y ejemplo.'); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">📖 Guardar Firewall en Glosario</button>
        <button class="chatgpt-prompt-btn" onclick="CyberTutor.sendPreset('Evalúame con 3 preguntas sobre Redes y dime exactamente qué debo estudiar.'); document.getElementById('cybertutor-prompts-modal').classList.remove('active');">📝 Examen Rápido de Redes</button>
      </div>

      <div style="display:flex;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="document.getElementById('cybertutor-prompts-modal').classList.remove('active')">Cerrar</button>
      </div>
    `;
    modal.classList.add('active');
  }

  saveEndpoint() {
    const input = document.getElementById('cybertutor-endpoint-input');
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      localStorage.setItem('cyberlab_cybertutor_endpoint', val);
      alert('✅ Endpoint guardado correctamente.');
    }
  }

  resetEndpoint() {
    localStorage.removeItem('cyberlab_cybertutor_endpoint');
    const input = document.getElementById('cybertutor-endpoint-input');
    if (input) input.value = CYBERLAB_CYBERTUTOR_ENDPOINT;
    alert('✅ Endpoint restablecido al servidor por defecto.');
  }

  updateInterval(val) {
    if (val) {
      localStorage.setItem('cyberlab_tutor_interval', val);
      if (window.CyberTutorAssistant) {
        window.CyberTutorAssistant.thoughtIntervalMs = Number(val);
      }
      alert('⏱️ Intervalo del asistente actualizado.');
    }
  }

  addBubble(role, text, html = false) {
    const h = document.getElementById('tutor-chat-history');
    if (!h) return;
    const b = document.createElement('div');
    b.className = `chat-bubble ${role}`;

    if (html) {
      b.innerHTML = text;
    } else if (role === 'tutor') {
      b.innerHTML = this.parseMarkdown(text);
    } else {
      const parsed = String(text ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      b.innerHTML = parsed;
    }

    h.appendChild(b);
    h.scrollTop = h.scrollHeight;
    return b;
  }

  clearChat() {
    this.chatHistory = [];
    const h = document.getElementById('tutor-chat-history');
    if (h) {
      h.innerHTML = `<div class="chat-bubble tutor">¡Hola! He limpiado el historial del chat. Sé que estás en Nivel ${this.storage?.data?.level || 1}. ¿Qué tema deseas repasar?</div>`;
    }
  }

  setBusy(v){
    this.busy=v;
    const s=document.getElementById('tutor-send-btn'), m=document.getElementById('tutor-mic-btn');
    if(s) s.disabled=v;
    if(m) m.disabled=v;
  }

  sendPreset(t){
    const i=document.getElementById('tutor-user-input');
    if(i){
      i.value=t;
      this.sendUserMessage();
    }
  }

  requestDiagnostic(){
    const msg = "CyberTutor, analiza mi progreso actual, mi nivel, racha y actividades completadas sin que yo te los diga, y dame un diagnóstico de mi rendimiento y recomendaciones.";
    this.sendPreset(msg);
  }

  buildStudentContext(){
    const d=this.storage?.data||{};
    return {
      level:d.level||1,
      xp:d.xp||0,
      streak:d.streak||0,
      hoursStudied:d.hoursStudied||0,
      currentModule:d.currentModule||d.currentTopic||'',
      mastery:d.masteryLevels||{},
      mistakes:(d.mistakes||[]).slice(-20),
      completedModules:(d.completedModules||[]).slice(-30),
      passedQuizzes:(d.passedQuizzes||[]).slice(-20),
      completedLabs:(d.completedLabs||[]).slice(-20),
      primaryObjective:d.primaryObjective||'',
      secondaryObjective:d.secondaryObjective||''
    };
  }

  processXpRewards(text) {
    if (!text) return '';
    let cleanText = String(text);
    const xpRegex = /\[GRANT_XP:(\d+):([^\]]+)\]/gi;
    let match;
    while ((match = xpRegex.exec(text)) !== null) {
      const amount = parseInt(match[1], 10);
      const reason = match[2].trim();
      if (amount > 0 && amount <= 100 && window.CyberGamification) {
        window.CyberGamification.addXP(amount, `CyberTutor: ${reason}`, `cybertutor_ai_${Date.now()}_${amount}`);
      }
    }
    return cleanText.replace(xpRegex, '').trim();
  }

  async sendUserMessage(){
    const i=document.getElementById('tutor-user-input');
    if(!i||this.busy)return;
    const msg=i.value.trim();
    if(!msg)return;
    i.value='';

    localStorage.setItem('cyberlab_last_study_timestamp', Date.now().toString());

    this.addBubble('user', msg);

    const endpoint=this.endpoint();
    if(!endpoint){
      this.addBubble('tutor','No se encontró el backend de CyberTutor.');
      return;
    }

    const payloadHistory = this.chatHistory.slice(-12).map(h => ({
      role: h.role === 'tutor' ? 'model' : 'user',
      content: h.content
    }));

    // Add typing indicator bubble
    const typingBubble = this.addBubble(
      'tutor',
      `🤖 CyberTutor está escribiendo<span class="typing-dots"><span></span><span></span><span></span></span>`,
      true
    );

    try {
      this.setBusy(true);
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          message: msg,
          history: payloadHistory,
          student: this.buildStudentContext()
        })
      });

      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);

      let answer = d.answer || 'No recibí una respuesta válida.';
      answer = this.processXpRewards(answer);

      // Replace typing bubble with actual parsed answer
      if (typingBubble) {
        typingBubble.innerHTML = this.parseMarkdown(answer);
      } else {
        this.addBubble('tutor', answer);
      }

      this.chatHistory.push({ role: 'user', content: msg });
      this.chatHistory.push({ role: 'tutor', content: answer });

    } catch (e) {
      console.error(e);
      const errText = `No pude conectar con Gemini. ${e.message || ''}`.trim();
      if (typingBubble) {
        typingBubble.innerHTML = this.esc(errText);
      } else {
        this.addBubble('tutor', errText);
      }
    } finally {
      this.setBusy(false);
    }
  }

  /* Notifications & Inactivity Reminders */
  initNotifications() {
    if (!("Notification" in window)) return;
    const lastCheck = localStorage.getItem('cyberlab_last_notif_check');
    const now = Date.now();
    if (!lastCheck || (now - Number(lastCheck)) > 3600000) {
      localStorage.setItem('cyberlab_last_notif_check', now.toString());
      this.checkStudyReminders();
    }
  }

  async toggleNotifications() {
    if (!("Notification" in window)) {
      alert('Tu navegador no soporta notificaciones Web.');
      return;
    }

    if (Notification.permission === 'granted') {
      this.sendNotification(
        '⚡ CyberTutor — Notificaciones Activas',
        `CyberTutor te enviará recordatorios para cuidar tu racha de ${this.storage?.data?.streak || 1} días.`
      );
      alert('¡Las notificaciones ya están activas y funcionando!');
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      this.sendNotification(
        '⚡ CyberTutor Activado',
        `¡Excelente! CyberTutor te avisará cuando lleves tiempo sin repasar ciberseguridad.`
      );
      const btn = document.getElementById('cybertutor-notif-btn');
      if (btn) btn.textContent = '🔔 Notificaciones Activas';
    } else {
      alert('Permiso de notificaciones denegado. Puedes cambiarlo en los ajustes de tu navegador.');
    }
  }

  sendNotification(title, body) {
    if (!("Notification" in window) || Notification.permission !== 'granted') return;
    try {
      new Notification(title, {
        body,
        icon: 'https://dicson1234.github.io/aprender-cibersegurdd/favicon.ico',
        badge: 'https://dicson1234.github.io/aprender-cibersegurdd/favicon.ico'
      });
    } catch (e) {
      console.warn('No se pudo lanzar notificación web:', e);
    }
  }

  checkStudyReminders() {
    const lastStudyStr = localStorage.getItem('cyberlab_last_study_timestamp');
    if (!lastStudyStr) return;

    const lastStudy = Number(lastStudyStr);
    const hoursInactive = (Date.now() - lastStudy) / 3600000;
    const streak = this.storage?.data?.streak || 1;

    if (hoursInactive >= 24) {
      const msg = `⚡ CyberTutor te extraña: Llevas ${Math.floor(hoursInactive / 24)} día(s) sin estudiar. ¡Ingresa hoy a CyberLab para mantener tu racha de ${streak} días!`;
      this.sendNotification('🛡️ CyberTutor — Recordatorio de Estudio', msg);
    }
  }

  async toggleRecording(){
    if(this.mediaRecorder?.state==='recording'){this.mediaRecorder.stop();return;}
    if(!navigator.mediaDevices?.getUserMedia){alert('Este navegador no permite grabación de audio.');return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});this.audioChunks=[];
      this.mediaRecorder=new MediaRecorder(stream);this.mediaRecorder.ondataavailable=e=>e.data.size&&this.audioChunks.push(e.data);
      this.mediaRecorder.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());const type=this.audioChunks[0]?.type||'audio/webm';const blob=new Blob(this.audioChunks,{type});await this.sendAudio(blob);};
      this.mediaRecorder.start();const b=document.getElementById('tutor-mic-btn');if(b)b.textContent='⏹️ Detener';
    }catch(e){console.error(e);alert('No se pudo acceder al micrófono. Concede permiso al navegador e inténtalo de nuevo.');}
  }

  async sendAudio(blob){
    const endpoint=this.endpoint();
    if(!endpoint){this.addBubble('tutor','Configura primero el backend de CyberTutor.');return;}
    this.setBusy(true);this.addBubble('tutor','🎙️ Procesando tu voz…');
    try{
      const fd=new FormData();fd.append('audio',blob,'cybertutor.webm');
      fd.append('prompt',`Eres CyberTutor, tutor experto de ciberseguridad. Responde en español. Estudiante: ${JSON.stringify(this.buildStudentContext())}. Explica, corrige errores y propone práctica segura.`);
      const r=await fetch(endpoint,{method:'POST',body:fd});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||`HTTP ${r.status}`);
      if(d.transcript)this.addBubble('user',`🎙️ Transcripción: ${d.transcript}`);this.addBubble('tutor',d.answer||'No recibí una respuesta válida.');
    }catch(e){console.error(e);this.addBubble('tutor','No pude procesar el audio. Comprueba que el Worker de voz esté configurado.');}
    finally{this.setBusy(false);const b=document.getElementById('tutor-mic-btn');if(b)b.textContent='🎙️ Hablar';}
  }

  configureEndpoint(){
    const current=this.endpoint();const endpoint=prompt('URL de tu Cloudflare Worker para CyberTutor:',current||'');if(endpoint===null)return;
    if(endpoint && !/^https:\/\//i.test(endpoint))return alert('Usa una URL HTTPS.');
    if(endpoint)localStorage.setItem('cyberlab_cybertutor_endpoint',endpoint);else localStorage.removeItem('cyberlab_cybertutor_endpoint');
    alert(endpoint?'Backend guardado.':'Backend restablecido al backend predeterminado.');
  }
}
window.CyberTutor=new CyberTutorEngine();
