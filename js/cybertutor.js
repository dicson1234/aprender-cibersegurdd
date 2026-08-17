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

  render(){
    const c=document.getElementById('cybertutor-root'); if(!c)return;
    const notifStatus = ("Notification" in window) ? Notification.permission : 'unsupported';
    const notifLabel = notifStatus === 'granted' ? '🔔 Notificaciones Activas' : '🔔 Activar Notificaciones';

    c.innerHTML=`
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h2>🤖 CyberTutor — Tutor de Ciberseguridad</h2><span class="tag cyan">Gemini Ultra Fast + Respuesta en Vivo</span></div>
        <p style="color:var(--text-muted)">CyberTutor conoce tu nivel, racha y progreso en vivo sin que se lo digas. Respuestas estructuradas e instantáneas.</p>
      </div>
      <div class="tutor-container">
        <div class="tutor-prompts-sidebar">
          <div style="font-weight:700;color:var(--accent-cyan);margin-bottom:8px">ACCIONES RÁPIDAS</div>
          <button class="btn btn-primary" style="font-size:.8rem;text-align:left;width:100%;margin-bottom:6px" onclick="CyberTutor.requestDiagnostic()">📊 Mi Diagnóstico Automático</button>
          <button id="cybertutor-notif-btn" class="btn btn-secondary" style="font-size:.8rem;text-align:left;width:100%;margin-bottom:12px" onclick="CyberTutor.toggleNotifications()">${notifLabel}</button>

          <div style="font-weight:700;color:var(--accent-cyan);margin-bottom:8px">PROMPTS RECOMENDADOS</div>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Explícame TCP como si tuviera 10 años.')">👶 TCP como a un niño</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Explícame TCP a nivel técnico universitario y ponme un ejemplo.')">🎓 TCP universitario</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Evalúame con 5 preguntas sobre redes y dime exactamente qué debo repasar.')">📝 Evalúame</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Según mi progreso, ¿qué debería estudiar después?')">🎯 Qué estudiar ahora</button>
          
          <div style="margin-top:14px;padding:12px;border-radius:10px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);font-size:.8rem">
            <strong>🧠 Diagnóstico Invisible:</strong><p style="color:var(--text-muted);margin:5px 0 0">Nivel ${this.storage?.data?.level || 1} • ${this.storage?.data?.xp || 0} XP • Racha ${this.storage?.data?.streak || 1} días. CyberTutor lee tu avance automáticamente.</p>
          </div>
          <button id="cybertutor-clear-btn" class="btn btn-secondary" style="margin-top:12px;width:100%">🗑️ Limpiar chat</button>
          <button id="cybertutor-config-btn" class="btn btn-secondary" style="margin-top:8px;width:100%">⚙️ Configurar backend</button>
        </div>
        <div class="tutor-chat-window">
          <div class="chat-history" id="tutor-chat-history"><div class="chat-bubble tutor">¡Hola! Soy tu <strong>CyberTutor</strong>. Conozco tu progreso actual (Nivel ${this.storage?.data?.level || 1}, ${this.storage?.data?.xp || 0} XP, Racha: ${this.storage?.data?.streak || 1} días). ¿En qué concepto o laboratorio quieres profundizar hoy?</div></div>
          <div class="chat-input-bar" style="flex-wrap:wrap">
            <input type="text" id="tutor-user-input" class="chat-input" placeholder="Escribe tu duda o responde a CyberTutor..." onkeypress="if(event.key==='Enter') CyberTutor.sendUserMessage()" />
            <button class="btn btn-primary" id="tutor-send-btn">Enviar</button>
            <button class="btn btn-secondary" id="tutor-mic-btn">🎙️ Hablar</button>
          </div>
        </div>
      </div>`;

    c.querySelector('#tutor-send-btn').onclick=()=>this.sendUserMessage();
    c.querySelector('#tutor-mic-btn').onclick=()=>this.toggleRecording();
    c.querySelector('#cybertutor-clear-btn').onclick=()=>this.clearChat();
    c.querySelector('#cybertutor-config-btn').onclick=()=>this.configureEndpoint();

    this.checkStudyReminders();
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

      const answer = d.answer || 'No recibí una respuesta válida.';

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
