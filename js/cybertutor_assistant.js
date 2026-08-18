/* CyberLab — CyberTutor Floating IA Assistant & Context Memory Component */
class CyberTutorAssistant {
  constructor(){this.storage=window.CyberStorage;this.isOpen=false;this.history=[];this.initWidget();}

  initWidget(){
    if(document.getElementById('cybertutor-fab'))return;
    const fab=document.createElement('button');fab.id='cybertutor-fab';fab.className='cybertutor-robot-fab';fab.setAttribute('aria-label','Abrir CyberTutor IA');
    fab.innerHTML=`
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
    fab.onclick=()=>this.toggleDrawer();document.body.appendChild(fab);

    this.initEyeTracking(fab);

    const drawer=document.createElement('div');drawer.id='cybertutor-drawer';drawer.className='cybertutor-drawer-panel';drawer.setAttribute('aria-label','CyberTutor IA');drawer.setAttribute('aria-hidden','true');
    drawer.innerHTML=`
      <div class="drawer-header">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;"><span style="font-size:1.6rem">🤖</span><div style="min-width:0"><h3 style="font-size:1.05rem;margin:0;color:var(--accent-cyan)">CyberTutor IA</h3><span class="tag cyan" style="font-size:.7rem">Asistente Educativo en Vivo</span></div></div>
        <button class="drawer-close-btn" id="cybertutor-drawer-close" aria-label="Cerrar CyberTutor">✕</button>
      </div>
      <div class="drawer-context-strip"><span class="ctx-pill">⚡ Nivel ${this.storage?.data?.level||1}</span><span class="ctx-pill">🏆 ${this.storage?.data?.xp||0} XP</span><span class="ctx-pill">🔥 ${this.storage?.data?.streak||1}d Racha</span></div>
      <div class="drawer-messages-body" id="cybertutor-drawer-messages"><div class="chat-bubble tutor">¡Hola 👋! Soy tu <strong>CyberTutor</strong>. Estoy monitoreando tu recorrido en ciberseguridad. ¿Qué concepto, comando o laboratorio deseas consultar?</div></div>
      <div class="drawer-quick-prompts"><button class="quick-chip" data-prompt="Dame un ejemplo práctico de la Tríada CIA.">💡 Ejercicio CIA</button><button class="quick-chip" data-prompt="Explícame el Three-Way Handshake TCP.">🌐 Handshake TCP</button><button class="quick-chip" data-prompt="¿Cómo calculo la máscara de subred /28?">🔢 Subnetting /28</button></div>
      <div class="drawer-input-bar"><input type="text" id="cybertutor-drawer-input" class="chat-input" autocomplete="off" placeholder="Pregunta a CyberTutor…"><button class="btn btn-primary" id="cybertutor-drawer-send-btn">Enviar</button></div>`;
    document.body.appendChild(drawer);

    drawer.querySelector('#cybertutor-drawer-close').onclick=()=>this.toggleDrawer(false);
    drawer.querySelector('#cybertutor-drawer-send-btn').onclick=()=>this.sendMessage();
    drawer.querySelector('#cybertutor-drawer-input').addEventListener('keydown',e=>{if(e.key==='Enter')this.sendMessage();});
    drawer.querySelectorAll('.quick-chip').forEach(btn=>btn.onclick=()=>this.sendQuickPrompt(btn.dataset.prompt));
  }

  initEyeTracking(fab){
    const leftPupil = fab.querySelector('#left-pupil');
    const rightPupil = fab.querySelector('#right-pupil');
    const leftEye = fab.querySelector('#left-eye');
    const rightEye = fab.querySelector('#right-eye');

    const updateEyes = (targetX, targetY) => {
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

    window.addEventListener('pointermove', e => updateEyes(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', e => {
      if (e.touches[0]) updateEyes(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // Blink Loop
    setInterval(() => {
      leftEye.classList.add('blinking');
      rightEye.classList.add('blinking');
      setTimeout(() => {
        leftEye.classList.remove('blinking');
        rightEye.classList.remove('blinking');
      }, 160);
    }, 3800);

    fab.addEventListener('pointerenter', () => fab.classList.add('emotion-happy'));
    fab.addEventListener('pointerleave', () => fab.classList.remove('emotion-happy'));
  }

  toggleDrawer(force){
    const drawer=document.getElementById('cybertutor-drawer');if(!drawer)return;
    this.isOpen=typeof force==='boolean'?force:!this.isOpen;
    drawer.classList.toggle('open',this.isOpen);drawer.setAttribute('aria-hidden',String(!this.isOpen));
    document.body.classList.toggle('cybertutor-open',this.isOpen);
    if(this.isOpen){
      const input=document.getElementById('cybertutor-drawer-input');
      if(input){setTimeout(()=>input.focus(),120);}
    }
  }

  askAboutConcept(conceptName){if(!this.isOpen)this.toggleDrawer(true);this.sendQuickPrompt(`Explícame el concepto '${conceptName}' de forma más fácil y dame un ejemplo real.`);}
  sendQuickPrompt(text){const input=document.getElementById('cybertutor-drawer-input');if(input){input.value=text;this.sendMessage();}}

  async sendMessage(){
    const input=document.getElementById('cybertutor-drawer-input');if(!input)return;
    const msg=input.value.trim();if(!msg)return;
    input.value='';this.appendBubble('user',msg);
    const typingBubble=this.appendBubble('tutor','🤖 CyberTutor está analizando tu consulta…',false);
    try{
      const endpoint=window.CyberTutor?.endpoint?.()||'https://cyberla-cybertutor.tapiashdicson.workers.dev/api/cybertutor';
      const studentContext=window.CyberTutor?.buildStudentContext?.()||{};
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'text',message:msg,history:this.history.slice(-10),student:studentContext})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||`HTTP ${response.status}`);
      let answer=data.answer||'No recibí una respuesta válida.';
      if(window.CyberTutor?.processXpRewards) {
        answer=window.CyberTutor.processXpRewards(answer);
      }
      if(typingBubble)typingBubble.innerHTML=window.CyberTutor?.parseMarkdown?.(answer)||this.escape(answer);
      this.history.push({role:'user',content:msg},{role:'model',content:answer});
    }catch(e){
      console.error(e);
      if(typingBubble)typingBubble.textContent=`⚠️ No pude conectar con CyberTutor. ${e.message||'Error de red'}`;
    }
  }

  appendBubble(role,text){
    const container=document.getElementById('cybertutor-drawer-messages');if(!container)return null;
    const b=document.createElement('div');b.className=`chat-bubble ${role}`;
    if(role==='tutor'&&window.CyberTutor)b.innerHTML=window.CyberTutor.parseMarkdown(text);else b.textContent=text;
    container.appendChild(b);container.scrollTop=container.scrollHeight;return b;
  }

  escape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
}
window.CyberTutorAssistant=new CyberTutorAssistant();
