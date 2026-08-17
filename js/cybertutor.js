/* CyberLab CyberTutor — text fallback + Gladia voice integration.
   IMPORTANT: the Gladia secret must live in the backend Worker, never in this file. */

class CyberTutorEngine {
  constructor(){ this.storage=window.CyberStorage; this.mediaRecorder=null; this.audioChunks=[]; this.busy=false; }
  endpoint(){ return localStorage.getItem('cyberlab_cybertutor_endpoint') || window.CYBERLAB_CONFIG?.cybertutorEndpoint || ''; }
  esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}

  render(){
    const c=document.getElementById('cybertutor-root'); if(!c)return;
    c.innerHTML=`
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h2>🤖 CyberTutor — Tutor de Ciberseguridad</h2><span class="tag cyan">Gladia + aprendizaje adaptativo</span></div>
        <p style="color:var(--text-muted)">Escribe tu duda o usa el micrófono. La voz se transcribe y procesa mediante un backend seguro conectado a Gladia.</p>
      </div>
      <div class="tutor-container">
        <div class="tutor-prompts-sidebar">
          <div style="font-weight:700;color:var(--accent-cyan);margin-bottom:8px">PROMPTS RECOMENDADOS</div>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Explícame TCP como si tuviera 10 años.')">👶 TCP como a un niño</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Explícame TCP a nivel técnico universitario y ponme un ejemplo.')">🎓 TCP universitario</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Evalúame con 5 preguntas sobre redes y dime exactamente qué debo repasar.')">📝 Evalúame</button>
          <button class="btn btn-secondary" style="font-size:.8rem;text-align:left" onclick="CyberTutor.sendPreset('Según mi progreso, ¿qué debería estudiar después?')">🎯 Qué estudiar ahora</button>
          <div style="margin-top:18px;padding:12px;border-radius:10px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);font-size:.8rem">
            <strong>🎙️ Voz:</strong><p style="color:var(--text-muted);margin:5px 0 0">Pulsa “Hablar con CyberTutor”, concede permiso al micrófono y habla en español. La clave Gladia nunca se envía al navegador.</p>
          </div>
          <button id="cybertutor-config-btn" class="btn btn-secondary" style="margin-top:12px;width:100%">⚙️ Configurar backend</button>
        </div>
        <div class="tutor-chat-window">
          <div class="chat-history" id="tutor-chat-history"><div class="chat-bubble tutor">¡Hola! Soy tu <strong>CyberTutor</strong>. Estás en Nivel ${this.storage.data.level} (${this.storage.data.xp} XP). Puedes escribirme o hablarme.</div></div>
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

  async sendUserMessage(){
    const i=document.getElementById('tutor-user-input');if(!i||this.busy)return;const msg=i.value.trim();if(!msg)return;i.value='';this.addBubble('user',msg);
    // Gladia is an audio intelligence API; typed questions use the local tutor fallback until a text LLM backend is configured.
    const endpoint=this.endpoint();
    if(endpoint){
      try{this.setBusy(true);const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'text',message:msg,student:{level:this.storage.data.level,xp:this.storage.data.xp,mastery:this.storage.data.masteryLevels}})});if(!r.ok)throw new Error(`HTTP ${r.status}`);const d=await r.json();this.addBubble('tutor',d.answer||'No recibí una respuesta válida.');return;}catch(e){console.error(e);this.addBubble('tutor','No pude conectar con el backend de CyberTutor. Revisa la configuración del endpoint.');return;}finally{this.setBusy(false);}}
    setTimeout(()=>this.addBubble('tutor',this.generateFallback(msg),true),300);
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
    if(!endpoint){this.addBubble('tutor','El micrófono funciona, pero aún falta configurar el endpoint de Cloudflare Worker que guarda la clave de Gladia.');return;}
    this.setBusy(true);this.addBubble('tutor','🎙️ Procesando tu voz con Gladia…');
    try{
      const fd=new FormData();fd.append('audio',blob,'cybertutor.webm');
      fd.append('prompt',`Eres CyberTutor, un tutor experto de ciberseguridad. Responde en español. Estudiante nivel ${this.storage.data.level}, XP ${this.storage.data.xp}. Explica con claridad, corrige errores y propone práctica segura.`);
      const r=await fetch(endpoint,{method:'POST',body:fd});if(!r.ok)throw new Error(`HTTP ${r.status}`);const d=await r.json();
      const answer=d.answer||d.response||'Gladia procesó el audio pero no devolvió respuesta.';if(d.transcript)this.addBubble('user',`🎙️ Transcripción: ${d.transcript}`);this.addBubble('tutor',answer,true);
    }catch(e){console.error(e);this.addBubble('tutor','No pude procesar el audio. Revisa que el Worker esté desplegado y que tenga GLADIA_API_KEY configurada.');}
    finally{this.setBusy(false);const b=document.getElementById('tutor-mic-btn');if(b)b.textContent='🎙️ Hablar';}
  }

  configureEndpoint(){
    const current=this.endpoint();const endpoint=prompt('URL de tu Cloudflare Worker para CyberTutor:',current||'');if(endpoint===null)return;
    if(endpoint && !/^https:\/\//i.test(endpoint))return alert('Usa una URL HTTPS.');
    if(endpoint)localStorage.setItem('cyberlab_cybertutor_endpoint',endpoint);else localStorage.removeItem('cyberlab_cybertutor_endpoint');
    alert(endpoint?'Backend guardado.':'Backend eliminado.');
  }

  generateFallback(prompt){const p=prompt.toLowerCase();if(p.includes('10 años'))return '<strong>CyberTutor:</strong> Imagina Internet como una carretera y TCP como un mensajero que confirma que cada paquete llegó, mantiene el orden y retransmite lo perdido.';if(p.includes('universitario'))return '<strong>CyberTutor:</strong> TCP es un protocolo de transporte orientado a conexión. Usa SYN, SYN-ACK y ACK para establecer la conexión y mecanismos de control de flujo, congestión y retransmisión para ofrecer entrega fiable.';if(p.includes('evalúame')||p.includes('evaluame'))return '<strong>CyberTutor:</strong> 1) ¿Qué diferencia hay entre TCP y UDP? 2) ¿Qué función cumple ARP? 3) ¿Qué indica un SYN? 4) ¿Qué es una subred? 5) ¿Qué evidencia buscarías en un log de autenticación sospechoso?';return `<strong>CyberTutor:</strong> He recibido: <em>${this.esc(prompt)}</em>. Para convertir esta duda en aprendizaje, explícame primero qué crees que ocurre y luego te corregiré paso a paso.`;}
}
window.CyberTutor=new CyberTutorEngine();
