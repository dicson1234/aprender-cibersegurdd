/* CyberLab CyberTutor — Gemini text chat + optional Gladia voice.
   IMPORTANT: API secrets stay in the Cloudflare Worker, never in this file. */
class CyberTutorEngine {
  constructor(){ this.storage=window.CyberStorage; this.mediaRecorder=null; this.audioChunks=[]; this.busy=false; }
  endpoint(){ return localStorage.getItem('cyberlab_cybertutor_endpoint') || window.CYBERLAB_CONFIG?.cybertutorEndpoint || ''; }
  esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}

  render(){
    const c=document.getElementById('cybertutor-root'); if(!c)return;
    c.innerHTML=`
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h2>🤖 CyberTutor — Tutor de Ciberseguridad</h2><span class="tag cyan">Gemini 2.5 Flash + aprendizaje adaptativo</span></div>
        <p style="color:var(--text-muted)">Chatea con Gemini a través de un backend seguro. También puedes usar el micrófono si has configurado Gladia.</p>
      </div>
      <div class="tutor-container">
        <div class="tutor-prompts-sidebar">
          <div style="font-weight:700;color:var(--accent-cyan);margin-bottom:8px">PROMPTS RECOMENDADOS</div>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Explícame TCP como si tuviera 10 años.')">👶 TCP como a un niño</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Explícame TCP a nivel técnico universitario y ponme un ejemplo.')">🎓 TCP universitario</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Evalúame con 5 preguntas sobre redes y dime exactamente qué debo repasar.')">📝 Evalúame</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Según mi progreso, ¿qué debería estudiar después?')">🎯 Qué estudiar ahora</button>
          <div style="margin-top:18px;padding:12px;border-radius:10px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);font-size:.8rem">
            <strong>🧠 Gemini:</strong><p style="color:var(--text-muted);margin:5px 0 0">Tu API key se guarda solamente en el backend de Cloudflare. El navegador nunca recibe la clave.</p>
          </div>
          <div style="margin-top:12px;padding:12px;border-radius:10px;background:rgba(163,113,247,.08);border:1px solid rgba(163,113,247,.2);font-size:.8rem">
            <strong>🎙️ Voz:</strong><p style="color:var(--text-muted);margin:5px 0 0">La voz usa el mismo backend; si configuras Gladia, puedes hablar con CyberTutor.</p>
          </div>
          <button id="cybertutor-config-btn" class="btn btn-secondary" style="margin-top:12px;width:100%">⚙️ Configurar backend</button>
        </div>
        <div class="tutor-chat-window">
          <div class="chat-history" id="tutor-chat-history"><div class="chat-bubble tutor">¡Hola! Soy tu <strong>CyberTutor</strong>. Estás en Nivel ${this.storage.data.level} (${this.storage.data.xp} XP). ¿Qué quieres aprender hoy?</div></div>
          <div class="chat-input-bar" style="flex-wrap:wrap">
            <input type="text" id="tutor-user-input" class="chat-input" placeholder="Escribe tu duda..." onkeypress="if(event.key==='Enter') CyberTutor.sendUserMessage()" />
            <button class="btn btn-primary" id="tutor-send-btn">Enviar</button>
            <button class="btn btn-secondary" id="tutor-mic-btn">🎙️ Hablar</button>
          </div>
        </div>
      </div>`;
    c.querySelector('#tutor-send-btn').onclick=()=>this.sendUserMessage();
    c.querySelector('#tutor-mic-btn').onclick=()=>this.toggleRecording();
    c.querySelector('#cybertutor-config-btn').onclick=()=>this.configureEndpoint();
  }

  addBubble(role,text,html=false){const h=document.getElementById('tutor-chat-history');if(!h)return;const b=document.createElement('div');b.className=`chat-bubble ${role}`;if(html)b.innerHTML=text;else b.textContent=text;h.appendChild(b);h.scrollTop=h.scrollHeight;return b;}
  setBusy(v){this.busy=v;const s=document.getElementById('tutor-send-btn'),m=document.getElementById('tutor-mic-btn');if(s)s.disabled=v;if(m)m.disabled=v;}
  sendPreset(t){const i=document.getElementById('tutor-user-input');if(i){i.value=t;this.sendUserMessage();}}

  buildStudentContext(){
    const d=this.storage?.data||{};
    return {
      level:d.level||1,
      xp:d.xp||0,
      streak:d.streak||0,
      hoursStudied:d.hoursStudied||0,
      mastery:d.masteryLevels||{},
      mistakes:(d.mistakes||[]).slice(-20),
      completedModules:(d.completedModules||[]).slice(-30),
      primaryObjective:d.primaryObjective||'',
      secondaryObjective:d.secondaryObjective||''
    };
  }

  async sendUserMessage(){
    const i=document.getElementById('tutor-user-input');if(!i||this.busy)return;const msg=i.value.trim();if(!msg)return;i.value='';this.addBubble('user',msg);
    const endpoint=this.endpoint();
    if(!endpoint){this.addBubble('tutor','Configura primero la URL del backend de CyberTutor en ⚙️ Configurar backend.');return;}
    try{
      this.setBusy(true);const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'text',message:msg,student:this.buildStudentContext()})});
      const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||`HTTP ${r.status}`);this.addBubble('tutor',d.answer||'No recibí una respuesta válida.');
    }catch(e){console.error(e);this.addBubble('tutor','No pude conectar con Gemini. Revisa que el Worker esté desplegado y que GEMINI_API_KEY esté configurada.');}
    finally{this.setBusy(false);}
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
    }catch(e){console.error(e);this.addBubble('tutor','No pude procesar el audio. Comprueba que el Worker tenga GLADIA_API_KEY configurada si estás usando voz.');}
    finally{this.setBusy(false);const b=document.getElementById('tutor-mic-btn');if(b)b.textContent='🎙️ Hablar';}
  }

  configureEndpoint(){
    const current=this.endpoint();const endpoint=prompt('URL de tu Cloudflare Worker para CyberTutor:',current||'');if(endpoint===null)return;
    if(endpoint && !/^https:\/\//i.test(endpoint))return alert('Usa una URL HTTPS.');
    if(endpoint)localStorage.setItem('cyberlab_cybertutor_endpoint',endpoint);else localStorage.removeItem('cyberlab_cybertutor_endpoint');
    alert(endpoint?'Backend guardado.':'Backend eliminado.');
  }
}
window.CyberTutor=new CyberTutorEngine();
