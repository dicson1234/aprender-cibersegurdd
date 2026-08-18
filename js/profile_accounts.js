/* Active user profile UI with reliable Cloud profile sync */
(function(){
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const avatarSource=v=>typeof v==='string'&&(/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(v)||v.startsWith('https://'));
  const AVATAR_PRESETS=['🤖','🛡️','💻','⚡','🦅','🥷','🦊','🚀'];

  async function importFile(input){
    const file=input.files?.[0];if(!file)return;
    try{await window.CyberStorage.importBackup(await file.text());}finally{input.value='';}
  }

  function avatarHtml(a,size=96){
    const av=avatarSource(a.avatar)?a.avatar:null;
    return av
      ? `<img class="profile-avatar-img" src="${esc(av)}" alt="Foto de ${esc(a.username)}" loading="lazy" style="width:${size}px;height:${size}px">`
      : `<div class="profile-avatar-fallback" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.42)}px">${esc(a.avatar||'👤')}</div>`;
  }

  function render(){
    const c=document.getElementById('profile-root'),a=window.CyberAccounts?.getActive(),d=window.CyberStorage?.data;
    if(!c||!a||!d)return;
    const ach=window.CyberData?.achievements||[];

    c.innerHTML=`
      <div class="profile-hero-card card">
        <div class="profile-hero-main">
          <div class="profile-avatar-wrap">${avatarHtml(a,96)}</div>
          <div class="profile-identity">
            <div class="profile-title-row"><h2>${esc(a.username)}</h2><span class="tag ${a.isCloud?'green':'yellow'}">${a.isCloud?'🌐 Cuenta Nube':'💻 Perfil Local'}</span></div>
            <p class="profile-bio">${esc(a.bio||'Estudiante de ciberseguridad en CyberLab')}</p>
            <div class="profile-stats"><span class="tag cyan">Nivel ${d.level}</span><span class="tag purple">${d.xp.toLocaleString()} XP</span><span class="tag yellow">🔥 ${d.streak} días</span></div>
          </div>
        </div>
        <div class="profile-actions">
          <button id="edit-account" class="btn btn-primary">✏️ Editar perfil</button>
          ${a.isCloud?'<button id="sync-cloud-btn" class="btn btn-secondary">🔄 Sincronizar</button>':''}
          <button id="switch-account" class="btn btn-secondary">👥 Cambiar</button>
          <button id="logout-account" class="btn btn-danger">🚪 Salir</button>
        </div>
      </div>

      <div class="grid-cards profile-grid">
        <div class="card"><h3>🎯 Objetivos</h3><p><strong>Principal:</strong> ${esc(d.primaryObjective)}</p><p><strong>Secundario:</strong> ${esc(d.secondaryObjective)}</p></div>
        <div class="card"><h3>💾 Respaldo</h3><p class="profile-muted">${a.isCloud?'Tu perfil y progreso se sincronizan con la nube.':'Este perfil y su progreso viven en este navegador.'}</p><div class="profile-buttons"><button class="btn btn-primary" id="export-backup">📥 Exportar</button><button class="btn btn-secondary" id="import-backup">📤 Importar</button><input id="import-file-input" type="file" accept="application/json" hidden></div></div>
      </div>

      <div class="card profile-achievements"><h3>🏆 Logros (${d.unlockedAchievements.length} / ${ach.length})</h3><div class="grid-cards">${ach.map(x=>{const ok=d.unlockedAchievements.includes(x.id);return `<div class="card achievement-card" style="opacity:${ok?'1':'.42'}"><div class="achievement-icon">${esc(x.icon)}</div><strong>${esc(x.name)}</strong><div class="profile-muted">${esc(x.description)}</div></div>`;}).join('')}</div></div>`;

    c.querySelector('#import-file-input').onchange=e=>importFile(e.target);
    c.querySelector('#export-backup').onclick=()=>window.CyberStorage.exportBackup();
    c.querySelector('#import-backup').onclick=()=>c.querySelector('#import-file-input').click();
    c.querySelector('#edit-account').onclick=()=>openEditor(a);
    if(c.querySelector('#sync-cloud-btn'))c.querySelector('#sync-cloud-btn').onclick=async()=>{
      const btn=c.querySelector('#sync-cloud-btn');btn.disabled=true;btn.textContent='⌛ Sincronizando…';
      const ok=await window.CyberAccounts.syncCloudProgress();btn.textContent=ok?'✅ Sincronizado':'⚠️ Reintentar';
      setTimeout(()=>{btn.textContent='🔄 Sincronizar';btn.disabled=false;},1800);
    };
    c.querySelector('#switch-account').onclick=()=>selectAccount();
    c.querySelector('#logout-account').onclick=()=>window.CyberAccounts.logout();
  }

  function selectAccount(){
    window.CyberAccounts.logout();
  }

  function openEditor(a){
    const old=document.getElementById('profile-editor-modal');if(old)old.remove();
    const m=document.createElement('div');m.id='profile-editor-modal';m.className='modal-overlay active';
    let currentAvatar=a.avatar||'🛡️';
    m.innerHTML=`<div class="modal-card profile-editor-card">
      <button class="modal-close" id="close" aria-label="Cerrar">✕</button>
      <div class="profile-editor-head"><div class="profile-editor-avatar" id="modal-avatar-preview"></div><div><h3>Editar perfil</h3><p class="profile-muted">Tu foto se guarda localmente y, en cuentas nube, también en el servidor.</p></div></div>
      <label>Nombre de usuario</label><input id="edit-name" class="chat-input" maxlength="24" value="${esc(a.username)}">
      <label>Biografía</label><textarea id="edit-bio" class="chat-input" maxlength="180" rows="3">${esc(a.bio||'')}</textarea>
      <label>Foto de perfil / avatar</label>
      <div class="profile-avatar-editor"><input id="edit-avatar-file" type="file" accept="image/jpeg,image/png,image/webp" hidden><button id="pick-edit-photo" type="button" class="btn btn-secondary">📸 Subir foto</button><div class="avatar-presets editor-presets">${AVATAR_PRESETS.map(e=>`<button type="button" class="btn-avatar-preset-edit">${e}</button>`).join('')}</div></div>
      <div class="profile-editor-footer"><button id="cancel" class="btn btn-secondary">Cancelar</button><button id="save" class="btn btn-primary">Guardar cambios</button></div>
      <div id="profile-save-status" class="account-status"></div>
    </div>`;
    document.body.appendChild(m);

    const preview=m.querySelector('#modal-avatar-preview');
    const drawPreview=()=>{preview.innerHTML=avatarSource(currentAvatar)?`<img src="${esc(currentAvatar)}" alt="Vista previa">`:`<span>${esc(currentAvatar||'👤')}</span>`;};
    drawPreview();

    m.querySelector('#pick-edit-photo').onclick=()=>m.querySelector('#edit-avatar-file').click();
    m.querySelector('#edit-avatar-file').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{currentAvatar=await window.CyberAccounts.compressImage(file);drawPreview();}catch(err){alert(err.message);}};
    m.querySelectorAll('.btn-avatar-preset-edit').forEach(btn=>btn.onclick=()=>{currentAvatar=btn.textContent;drawPreview();});
    m.querySelector('#close').onclick=m.querySelector('#cancel').onclick=()=>m.remove();
    m.querySelector('#save').onclick=async()=>{
      const status=m.querySelector('#profile-save-status');const saveBtn=m.querySelector('#save');
      const name=m.querySelector('#edit-name').value.trim();if(!name)return alert('Escribe un nombre de usuario.');
      saveBtn.disabled=true;saveBtn.textContent='Guardando…';if(status)status.textContent='';
      try{
        await window.CyberAccounts.updateActiveProfile({username:name,bio:m.querySelector('#edit-bio').value,avatar:currentAvatar});
        m.remove();render();
      }catch(e){
        console.error(e);saveBtn.disabled=false;saveBtn.textContent='Guardar cambios';if(status)status.textContent=`❌ ${e.message||'No se pudo guardar el perfil.'}`;
      }
    };
  }

  window.CyberProfileAccounts={render};
  if(window.CyberApp)window.CyberApp.renderProfile=render;
  window.addEventListener('cyberlab_account_changed',()=>{window.CyberApp?.updateHeaderStats?.();setTimeout(render,0);});
  window.addEventListener('cyberlab_state_updated',()=>setTimeout(render,0));
  setTimeout(render,0);
})();
