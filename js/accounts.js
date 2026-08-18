/* CyberLab Accounts & Cloud Backend Manager
   Local profiles + Cloudflare Worker auth + durable profile photos + cloud progress. */

const ACCOUNTS_KEY = 'cyberlab_accounts_v1';
const ACTIVE_ACCOUNT_KEY = 'cyberlab_active_account_v1';
const CLOUD_TOKEN_KEY = 'cyberlab_cloud_token_v1';
const AVATAR_PRESETS = ['🤖','🛡️','💻','⚡','🦅','🥷','🦊','🚀'];

const accountDefaults = {
  id:'', username:'Estudiante', email:'', avatar:'🛡️', bio:'Estudiante de CyberLab',
  createdAt:new Date().toISOString(), isCloud:false, privateProfile:true
};

function isSafeAvatar(value){
  if(typeof value!=='string') return false;
  if(value.startsWith('data:image/')) return /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(value);
  if(value.startsWith('https://')) return true;
  return value.length>0 && value.length<=16 && !/[<>"'`]/.test(value);
}

class AccountsManager {
  constructor(){
    this.accounts=this.loadAccounts();
    this.activeId=localStorage.getItem(ACTIVE_ACCOUNT_KEY)||null;
    this.cloudToken=localStorage.getItem(CLOUD_TOKEN_KEY)||null;
    this.ready=new Promise(resolve=>{this._resolveReady=resolve;});
    this.pendingAvatar='🛡️';
    this.ensureMigration();
    this.renderGate();
    const active=this.getActive();
    if(active)this._resolveReady(active);
  }

  getApiBase(){return 'https://cyberla-cybertutor.tapiashdicson.workers.dev/api';}

  loadAccounts(){
    try{
      const parsed=JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'[]');
      if(!Array.isArray(parsed))return [];
      return parsed.map(a=>{
        const account={...accountDefaults,...a};
        if(!isSafeAvatar(account.avatar))account.avatar='🛡️';
        account.privateProfile=account.privateProfile!==false;
        return account;
      });
    }catch(e){console.error('Error al cargar cuentas:',e);return [];}
  }

  saveAccounts(){
    try{localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(this.accounts));return true;}
    catch(e){console.error('No se pudieron guardar las cuentas:',e);return false;}
  }

  ensureMigration(){
    if(this.accounts.length){
      if(!this.activeId||!this.accounts.some(a=>a.id===this.activeId)){
        this.activeId=this.accounts[0].id;
        localStorage.setItem(ACTIVE_ACCOUNT_KEY,this.activeId);
      }
      return;
    }

    const legacy=localStorage.getItem('cyberlab_user_data_v1');
    const account={
      id:`user-${crypto.randomUUID()}`,
      username:'Estudiante',email:'',pinHash:'',avatar:'🛡️',bio:'Estudiante de CyberLab',
      createdAt:new Date().toISOString(),isCloud:false,privateProfile:true
    };
    this.accounts.push(account);
    this.saveAccounts();
    this.activeId=account.id;
    localStorage.setItem(ACTIVE_ACCOUNT_KEY,account.id);
    if(!legacy)localStorage.removeItem('cyberlab_user_data_v1');
  }

  getActive(){return this.accounts.find(a=>a.id===this.activeId)||null;}

  async hashPin(pin){
    if(!pin)return '';
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(pin));
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  renderGate(){
    if(this.getActive())return;
    if(document.getElementById('accounts-gate'))return;
    const gate=document.createElement('div');
    gate.id='accounts-gate';
    gate.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(5,8,15,.97);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);font-family:inherit;';
    gate.innerHTML='<div id="accounts-card" class="account-gate-card"></div>';
    document.body.appendChild(gate);
    this.renderSelection();
  }

  renderSelection(){
    const card=document.getElementById('accounts-card');if(!card)return;
    const active=this.getActive();if(active){this.hideGate();return;}
    card.innerHTML=`
      <div class="account-gate-head"><div class="account-gate-icon">🛡️</div><h2>Bienvenido a CyberLab</h2><p>Accede a tu cuenta o usa un perfil local.</p></div>
      <div class="account-tabs"><button id="tab-cloud-login" class="btn btn-primary">🌐 Iniciar</button><button id="tab-cloud-register" class="btn btn-secondary">✨ Crear</button><button id="tab-local-profiles" class="btn btn-secondary">👤 Locales</button></div>
      <div id="auth-tab-content"></div>`;

    const a=[card.querySelector('#tab-cloud-login'),card.querySelector('#tab-cloud-register'),card.querySelector('#tab-local-profiles')];
    const activate=btn=>a.forEach(x=>{x.className='btn btn-secondary';x.style.background='transparent';});
    a[0].onclick=()=>{activate(a[0]);a[0].className='btn btn-primary';this.renderCloudLogin();};
    a[1].onclick=()=>{activate(a[1]);a[1].className='btn btn-primary';this.renderCloudRegister();};
    a[2].onclick=()=>{activate(a[2]);a[2].className='btn btn-primary';this.renderLocalProfiles();};
    this.renderCloudLogin();
  }

  renderCloudLogin(){
    const c=document.getElementById('auth-tab-content');if(!c)return;
    c.innerHTML=`
      <div class="account-info-box"><strong>🌐 Cuenta en la Nube</strong><span>Tu progreso y foto se sincronizan entre dispositivos.</span></div>
      <label>Usuario o correo</label><input id="login-identifier" class="chat-input" autocomplete="username" placeholder="Ej. Dicson o usuario@correo.com">
      <label>Contraseña o PIN</label><input id="login-password" type="password" class="chat-input" autocomplete="current-password" placeholder="••••••••">
      <button id="btn-cloud-login-submit" class="btn btn-primary account-full-btn">🚀 Iniciar Sesión</button><div id="login-status-msg" class="account-status"></div>`;
    c.querySelector('#btn-cloud-login-submit').onclick=()=>this.handleCloudLogin();
  }

  renderCloudRegister(){
    const c=document.getElementById('auth-tab-content');if(!c)return;
    this.pendingAvatar='🛡️';
    c.innerHTML=`
      <div class="account-info-box"><strong>✨ Crear cuenta</strong><span>Elige tu nombre y una foto o avatar.</span></div>
      <label>Nombre de usuario</label><input id="reg-username" class="chat-input" maxlength="24" autocomplete="username" placeholder="Ej. Dicson">
      <label>Correo (opcional)</label><input id="reg-email" type="email" class="chat-input" autocomplete="email" placeholder="usuario@correo.com">
      <label>Contraseña o PIN <small>(mínimo 4 caracteres)</small></label><input id="reg-password" type="password" maxlength="64" class="chat-input" autocomplete="new-password" placeholder="••••••••">
      <label>Foto de perfil / avatar</label>
      <div class="avatar-picker"><div id="avatar-preview-box" class="avatar-preview">🛡️</div><div class="avatar-picker-actions"><input id="reg-avatar-file" type="file" accept="image/jpeg,image/png,image/webp" hidden><button type="button" id="pick-register-photo" class="btn btn-secondary">📸 Subir foto</button><div class="avatar-presets">${AVATAR_PRESETS.map(e=>`<button type="button" class="btn-avatar-preset">${e}</button>`).join('')}</div></div></div>
      <button id="btn-cloud-reg-submit" class="btn btn-primary account-full-btn">✨ Crear e Ingresar</button><div id="reg-status-msg" class="account-status"></div>`;

    c.querySelector('#pick-register-photo').onclick=()=>c.querySelector('#reg-avatar-file').click();
    c.querySelector('#reg-avatar-file').onchange=e=>this.previewFile(e.target.files?.[0]);
    c.querySelectorAll('.btn-avatar-preset').forEach(btn=>btn.onclick=()=>{this.pendingAvatar=btn.textContent;const b=document.getElementById('avatar-preview-box');if(b)b.textContent=this.pendingAvatar;});
    c.querySelector('#btn-cloud-reg-submit').onclick=()=>this.handleCloudRegister();
  }

  renderLocalProfiles(){
    const c=document.getElementById('auth-tab-content');if(!c)return;
    c.innerHTML=`<h3 class="account-section-title">Perfiles guardados en este dispositivo</h3>
      ${this.accounts.length?`<div class="local-account-list">${this.accounts.map(a=>{const av=isSafeAvatar(a.avatar)?a.avatar:'👤';return `<button data-login="${this.escape(a.id)}" class="local-account-btn">${av.startsWith('data:image/')||av.startsWith('https://')?`<img src="${this.escape(av)}" alt="" loading="lazy">`:`<span>${this.escape(av)}</span>`}<strong>${this.escape(a.username)}</strong><small>${a.isCloud?'🌐 Cuenta Nube':'💻 Perfil Local'}</small></button>`;}).join('')}</div>`:'<p class="account-empty">No hay perfiles locales guardados.</p>'}
      <button id="btn-create-local-quick" class="btn btn-secondary account-full-btn">➕ Crear Perfil Local</button>`;
    c.querySelectorAll('[data-login]').forEach(btn=>btn.onclick=()=>this.loginLocal(btn.dataset.login));
    c.querySelector('#btn-create-local-quick').onclick=()=>this.createQuickLocal();
  }

  async previewFile(file){
    if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){alert('Usa JPG, PNG o WebP.');return;}
    if(file.size>5*1024*1024){alert('La foto debe pesar menos de 5 MB.');return;}
    try{
      const data=await this.compressImage(file);
      this.pendingAvatar=data;
      const box=document.getElementById('avatar-preview-box');
      if(box)box.innerHTML=`<img src="${this.escape(data)}" alt="Vista previa">`;
    }catch(e){console.error(e);alert('No se pudo procesar la imagen.');}
  }

  compressImage(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=()=>reject(new Error('No se pudo leer la imagen.'));
      reader.onload=()=>{
        const img=new Image();
        img.onerror=()=>reject(new Error('Imagen inválida.'));
        img.onload=()=>{
          const size=320,scale=Math.min(size/img.width,size/img.height,1);
          const w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale));
          const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext('2d');
          if(!ctx)return reject(new Error('Canvas no disponible.'));
          ctx.fillStyle='#111827';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
          const data=canvas.toDataURL('image/jpeg',0.78);
          resolve(data);
        };
        img.src=reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async handleCloudLogin(){
    const idInput=document.getElementById('login-identifier')?.value.trim();
    const passInput=document.getElementById('login-password')?.value||'';
    const status=document.getElementById('login-status-msg');
    if(!idInput)return alert('Por favor ingresa tu usuario o correo.');
    if(status)status.textContent='🌐 Conectando…';
    try{
      const res=await fetch(`${this.getApiBase()}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier:idInput,password:passInput})});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(data.error||`Error de inicio de sesión (${res.status})`);
      const user=data.user||{};
      const account={id:user.id,username:user.username,email:user.email||'',avatar:isSafeAvatar(user.avatar)?user.avatar:'🛡️',bio:user.bio||'',token:data.token||'',isCloud:true,createdAt:user.createdAt||new Date().toISOString(),privateProfile:user.privateProfile!==false};
      const idx=this.accounts.findIndex(a=>a.id===account.id);if(idx>=0)this.accounts[idx]=account;else this.accounts.push(account);this.saveAccounts();
      if(data.token){this.cloudToken=data.token;localStorage.setItem(CLOUD_TOKEN_KEY,data.token);}

      await this.select(account,{sync:false});
      if(data.progress&&window.CyberStorage?.importCloudProgress){
        const imported=window.CyberStorage.importCloudProgress(data.progress);
        if(!imported)console.warn('El progreso cloud no pudo restaurarse localmente.');
      }
      await this.syncCloudProgress();
    }catch(err){console.error(err);if(status)status.textContent=`❌ ${err.message}`;}
  }

  async handleCloudRegister(){
    const name=document.getElementById('reg-username')?.value.trim();
    const email=document.getElementById('reg-email')?.value.trim();
    const pass=document.getElementById('reg-password')?.value||'';
    const status=document.getElementById('reg-status-msg');
    if(!name||name.length<2)return alert('El nombre debe tener al menos 2 caracteres.');
    if(!/^[\p{L}\p{N}_.-]{2,24}$/u.test(name))return alert('Usa solo letras, números, punto, guion o guion bajo.');
    if(pass.length<4)return alert('La contraseña o PIN debe tener al menos 4 caracteres.');
    if(status)status.textContent='✨ Creando cuenta…';
    try{
      const res=await fetch(`${this.getApiBase()}/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:name,email:email||name,password:pass,avatar:isSafeAvatar(this.pendingAvatar)?this.pendingAvatar:'🛡️',bio:'Estudiante de ciberseguridad en CyberLab'})});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(data.error||`No se pudo crear el usuario (${res.status})`);
      const user=data.user||{};
      const account={id:user.id,username:user.username,email:user.email||email||'',avatar:isSafeAvatar(user.avatar)?user.avatar:(isSafeAvatar(this.pendingAvatar)?this.pendingAvatar:'🛡️'),bio:user.bio||'',token:data.token||'',isCloud:true,createdAt:user.createdAt||new Date().toISOString(),privateProfile:true};
      const idx=this.accounts.findIndex(a=>a.id===account.id);if(idx>=0)this.accounts[idx]=account;else this.accounts.push(account);this.saveAccounts();
      if(data.token){this.cloudToken=data.token;localStorage.setItem(CLOUD_TOKEN_KEY,data.token);}
      await this.select(account,{sync:false});
      await this.syncCloudProgress();
    }catch(err){console.error(err);if(status)status.textContent=`❌ ${err.message}`;}
  }

  createQuickLocal(){
    const name=prompt('Nombre de usuario para este perfil local:');
    if(!name||!name.trim())return;
    const clean=name.trim().slice(0,24);
    const account={id:`user-${crypto.randomUUID()}`,username:clean,avatar:'👤',bio:'Perfil Local',createdAt:new Date().toISOString(),isCloud:false,privateProfile:true};
    this.accounts.push(account);this.saveAccounts();this.select(account);
  }

  async loginLocal(id){
    const account=this.accounts.find(a=>a.id===id);if(!account)return;
    if(account.pinHash){const pin=prompt(`PIN de ${account.username}:`);if(pin===null||await this.hashPin(pin)!==account.pinHash)return alert('PIN incorrecto.');}
    await this.select(account);
  }

  async select(account,{sync=true}={}){
    if(!account?.id)return;
    this.activeId=account.id;
    localStorage.setItem(ACTIVE_ACCOUNT_KEY,account.id);
    if(account.token){this.cloudToken=account.token;localStorage.setItem(CLOUD_TOKEN_KEY,account.token);}else{this.cloudToken=null;localStorage.removeItem(CLOUD_TOKEN_KEY);}
    window.CyberStorage?.setActiveAccount(account.id);
    this.hideGate();
    window.dispatchEvent(new CustomEvent('cyberlab_account_changed',{detail:account}));
    if(this._resolveReady)this._resolveReady(account);
    if(sync&&account.isCloud)await this.syncCloudProgress();
  }

  async syncCloudProgress(){
    const active=this.getActive();if(!active?.token)return false;
    try{
      const progress=window.CyberStorage?.data||{};
      const res=await fetch(`${this.getApiBase()}/user/sync`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${active.token}`},body:JSON.stringify({progress})});
      if(!res.ok){const d=await res.json().catch(()=>({}));throw new Error(d.error||`HTTP ${res.status}`);}
      return true;
    }catch(e){console.warn('Error al sincronizar progreso con Worker Cloud:',e);return false;}
  }

  hideGate(){const gate=document.getElementById('accounts-gate');if(gate)gate.style.display='none';}

  async logout(){
    this.activeId=null;this.cloudToken=null;
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);localStorage.removeItem(CLOUD_TOKEN_KEY);
    window.CyberStorage?.setActiveAccount(null);
    const gate=document.getElementById('accounts-gate');
    if(gate){gate.style.display='flex';this.renderSelection();}
  }

  async updateActiveProfile({username,avatar,bio}={}){
    const account=this.getActive();if(!account)throw new Error('No hay cuenta activa.');
    const prev={username:account.username,avatar:account.avatar,bio:account.bio};
    if(username?.trim())account.username=username.trim().slice(0,24);
    if(avatar!==undefined){if(!isSafeAvatar(avatar))throw new Error('La foto o avatar no es válido.');account.avatar=avatar;}
    if(bio!==undefined)account.bio=String(bio).slice(0,180);
    this.saveAccounts();

    if(account.isCloud&&account.token){
      try{
        const res=await fetch(`${this.getApiBase()}/user/profile`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${account.token}`},body:JSON.stringify({username:account.username,avatar:account.avatar,bio:account.bio})});
        const data=await res.json().catch(()=>({}));
        if(!res.ok)throw new Error(data.error||`No se pudo guardar el perfil (${res.status})`);
        if(data.user){
          if(typeof data.user.username==='string')account.username=data.user.username;
          if(isSafeAvatar(data.user.avatar))account.avatar=data.user.avatar;
          if(typeof data.user.bio==='string')account.bio=data.user.bio;
          this.saveAccounts();
        }
      }catch(e){
        Object.assign(account,prev);this.saveAccounts();
        throw e;
      }
    }

    window.dispatchEvent(new CustomEvent('cyberlab_account_changed',{detail:account}));
    return account;
  }

  setPrivacy(isPrivate){const account=this.getActive();if(!account)return null;account.privateProfile=Boolean(isPrivate);this.saveAccounts();window.dispatchEvent(new CustomEvent('cyberlab_account_changed',{detail:account}));return account;}

  escape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
}

window.CyberAccounts=new AccountsManager();
