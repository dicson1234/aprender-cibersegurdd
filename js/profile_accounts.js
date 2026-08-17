/* Active local account profile UI. */
(function(){
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  async function importFile(input){const file=input.files?.[0];if(!file)return;try{window.CyberStorage.importBackup(await file.text());}finally{input.value='';}}
  function render(){
    const c=document.getElementById('profile-root'),a=window.CyberAccounts?.getActive(),d=window.CyberStorage?.data;
    if(!c||!a||!d)return;
    const ach=window.CyberData?.achievements||[];
    const privateProfile=a.privateProfile!==false;
    c.innerHTML=`
    <div class="profile-mobile-shell">
      <section class="profile-hero card">
        <div class="profile-avatar-wrap">
          ${a.avatar?`<img class="profile-avatar" src="${a.avatar}" alt="Foto de perfil">`:'<div class="profile-avatar profile-avatar-fallback">👤</div>'}
          <span class="profile-lock-badge">${privateProfile?'🔒':'🌐'}</span>
        </div>
        <div class="profile-hero-copy">
          <span class="profile-eyebrow">${privateProfile?'PERFIL PRIVADO':'PERFIL LOCAL'}</span>
          <h1>${esc(a.username)}</h1>
          <p>${esc(a.bio||'Estudiante de ciberseguridad en CyberLab')}</p>
          <div class="profile-stat-row"><span class="tag cyan">Nivel ${d.level}</span><span class="tag purple">${d.xp.toLocaleString()} XP</span><span class="tag yellow">🔥 ${d.streak} días</span></div>
        </div>
        <button id="edit-account" class="btn btn-secondary profile-edit-btn">✏️ Editar</button>
      </section>

      <section class="profile-privacy card">
        <div class="profile-section-icon">🔐</div>
        <div class="profile-section-copy"><strong>Privacidad del perfil</strong><p>${privateProfile?'Tu perfil está configurado como privado en este navegador.':'El perfil aparece como local y puede mostrarse dentro de este dispositivo.'}</p></div>
        <button id="toggle-privacy" class="privacy-toggle ${privateProfile?'is-private':''}" aria-pressed="${privateProfile}"><span>${privateProfile?'🔒':'🌐'}</span><span>${privateProfile?'Privado':'Local'}</span></button>
      </section>

      <section class="profile-photo-card card">
        <div><span class="profile-eyebrow">TU IDENTIDAD</span><h2>Foto de perfil</h2><p>Elige una imagen para reconocer tu cuenta. La imagen se comprime y se guarda en este navegador.</p></div>
        <button id="change-avatar" class="btn btn-primary">📷 Cambiar foto</button>
        <input id="profile-avatar-input" type="file" accept="image/png,image/jpeg,image/webp" hidden>
      </section>

      <section class="profile-mobile-grid">
        <div class="card profile-summary-card"><span class="profile-eyebrow">OBJETIVOS</span><h2>Tu dirección</h2><p><strong>Principal</strong><br>${esc(d.primaryObjective||'Sin definir')}</p><p><strong>Secundario</strong><br>${esc(d.secondaryObjective||'Sin definir')}</p></div>
        <div class="card profile-security-card"><span class="profile-eyebrow">ACCESO</span><h2>Protección</h2><p>${a.pinHash?'🔒 PIN activado':'⚠️ Sin PIN de acceso'}</p><button id="switch-account" class="btn btn-secondary">👥 Cambiar usuario</button><button id="logout-account" class="btn btn-danger">Salir</button></div>
      </section>

      <section class="card profile-backup-card"><div><span class="profile-eyebrow">DATOS</span><h2>Copia de seguridad</h2><p>Exporta o importa tu progreso manualmente.</p></div><div class="profile-action-row"><button class="btn btn-primary" onclick="CyberStorage.exportBackup()">📥 Exportar</button><button class="btn btn-secondary" onclick="document.getElementById('import-file-input').click()">📤 Importar</button><input id="import-file-input" type="file" accept="application/json" hidden></div></section>

      <section class="card profile-achievements"><div class="profile-section-heading"><div><span class="profile-eyebrow">COLECCIÓN</span><h2>🏆 Logros</h2></div><span class="tag cyan">${d.unlockedAchievements.length} / ${ach.length}</span></div><div class="grid-cards profile-achievements-grid">${ach.map(x=>{const ok=d.unlockedAchievements.includes(x.id);return `<div class="card" style="opacity:${ok?'1':'.42'}"><div style="font-size:2rem">${esc(x.icon)}</div><strong>${esc(x.name)}</strong><div style="font-size:.8rem;color:var(--text-muted)">${esc(x.description)}</div></div>`}).join('')}</div></section>
    </div>`;

    c.querySelector('#import-file-input').onchange=e=>importFile(e.target);
    c.querySelector('#edit-account').onclick=()=>openEditor(a);
    c.querySelector('#switch-account').onclick=()=>selectAccount();
    c.querySelector('#logout-account').onclick=()=>window.CyberAccounts.logout();
    c.querySelector('#change-avatar').onclick=()=>c.querySelector('#profile-avatar-input').click();
    c.querySelector('#profile-avatar-input').onchange=async e=>{
      const file=e.target.files?.[0];
      if(!file)return;
      try{const avatar=await window.CyberAccounts.compressImage(file);window.CyberAccounts.updateActiveProfile({avatar});}catch(err){alert('No se pudo procesar la imagen.');}
      e.target.value='';
    };
    c.querySelector('#toggle-privacy').onclick=()=>window.CyberAccounts.setPrivacy(!privateProfile);
  }

  function selectAccount(){localStorage.removeItem('cyberlab_active_account_v1');window.CyberAccounts.activeId=null;window.CyberStorage.setActiveAccount(null);const g=document.getElementById('accounts-gate');if(g)g.style.display='flex';window.CyberAccounts.renderSelection();}

  function openEditor(a){
    const old=document.getElementById('profile-editor-modal');if(old)old.remove();
    const m=document.createElement('div');m.id='profile-editor-modal';m.className='modal-overlay active';
    m.innerHTML=`<div class="modal-card profile-editor-card"><button class="modal-close" id="close">✕</button><span class="profile-eyebrow">PERFIL</span><h3>Editar perfil</h3><label>Nombre</label><input id="name" class="chat-input" maxlength="24" style="width:100%;margin:6px 0 12px" value="${esc(a.username)}"><label>Biografía</label><textarea id="bio" class="chat-input" maxlength="180" rows="3" style="width:100%;margin:6px 0 12px">${esc(a.bio||'')}</textarea><label>Foto</label><input id="avatar" type="file" accept="image/png,image/jpeg,image/webp" style="width:100%;margin:6px 0 16px"><div id="preview"></div><div style="display:flex;justify-content:flex-end;gap:10px"><button id="cancel" class="btn btn-secondary">Cancelar</button><button id="save" class="btn btn-primary">Guardar</button></div></div>`;
    document.body.appendChild(m);
    let avatar=a.avatar;
    m.querySelector('#avatar').onchange=async e=>{if(e.target.files[0]){avatar=await window.CyberAccounts.compressImage(e.target.files[0]);m.querySelector('#preview').innerHTML=`<img src="${avatar}" alt="Vista previa" style="width:84px;height:84px;object-fit:cover;border-radius:50%;margin-bottom:12px">`;}};
    m.querySelector('#close').onclick=m.querySelector('#cancel').onclick=()=>m.remove();
    m.querySelector('#save').onclick=()=>{const name=m.querySelector('#name').value.trim();if(!name)return alert('Escribe un nombre.');if(window.CyberAccounts.accounts.some(x=>x.id!==a.id&&x.username.toLowerCase()===name.toLowerCase()))return alert('Ese nombre ya está usado.');window.CyberAccounts.updateActiveProfile({username:name,bio:m.querySelector('#bio').value,avatar});m.remove();render();};
  }

  if(window.CyberApp)window.CyberApp.renderProfile=render;
  window.addEventListener('cyberlab_account_changed',()=>setTimeout(render,0));window.addEventListener('cyberlab_state_updated',()=>setTimeout(render,0));setTimeout(render,0);
})();
