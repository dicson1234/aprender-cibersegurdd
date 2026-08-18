/* Active user profile UI with Cloud Backend Sync & Profile Photo support */
(function(){
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const AVATAR_PRESETS = ['🤖', '🛡️', '💻', '⚡', '🦅', '🥷', '🦊', '🚀'];

  async function importFile(input){
    const file=input.files?.[0];if(!file)return;
    try{window.CyberStorage.importBackup(await file.text());}finally{input.value='';}
  }

  function render(){
    const c=document.getElementById('profile-root'), a=window.CyberAccounts?.getActive(), d=window.CyberStorage?.data;
    if(!c||!a||!d)return;
    const ach=window.CyberData?.achievements||[];

    const avatarHtml = (a.avatar && (a.avatar.startsWith('data:') || a.avatar.startsWith('http')))
      ? `<img src="${a.avatar}" alt="Foto de ${esc(a.username)}" style="width:96px;height:96px;object-fit:cover;border-radius:50%;border:3px solid var(--accent-cyan);box-shadow:0 0 20px rgba(0,240,255,0.3)">`
      : `<div style="width:96px;height:96px;border-radius:50%;display:grid;place-items:center;font-size:3.5rem;background:var(--bg-surface);border:3px solid var(--accent-cyan);box-shadow:0 0 20px rgba(0,240,255,0.3)">${a.avatar || '👤'}</div>`;

    c.innerHTML=`
    <div class="card" style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        ${avatarHtml}
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <h2 style="margin:0">${esc(a.username)}</h2>
            ${a.isCloud ? '<span class="tag green">🌐 Cuenta Nube (Backend Worker)</span>' : '<span class="tag yellow">💻 Perfil Local</span>'}
          </div>
          <p style="color:var(--text-muted);margin:6px 0 10px">${esc(a.bio||'Estudiante de ciberseguridad en CyberLab')}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span class="tag cyan">Nivel ${d.level}</span>
            <span class="tag purple">${d.xp.toLocaleString()} XP</span>
            <span class="tag yellow">🔥 ${d.streak} días de racha</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button id="edit-account" class="btn btn-secondary">✏️ Editar Perfil & Foto</button>
          ${a.isCloud ? '<button id="sync-cloud-btn" class="btn btn-secondary">🔄 Sincronizar Nube</button>' : ''}
          <button id="switch-account" class="btn btn-secondary">👥 Cambiar Usuario</button>
          <button id="logout-account" class="btn btn-primary">🚪 Salir</button>
        </div>
      </div>
    </div>

    <div class="grid-cards">
      <div class="card">
        <h3>🎯 Objetivos de Carrera</h3>
        <p><strong>Principal:</strong> ${esc(d.primaryObjective)}</p>
        <p><strong>Secundario:</strong> ${esc(d.secondaryObjective)}</p>
      </div>
      <div class="card">
        <h3>💾 Copia de Seguridad & Nube</h3>
        <p style="color:var(--text-muted)">Progreso de ${esc(a.username)}. ${a.isCloud ? 'Tus datos se respaldan en la Nube (Cloudflare Worker).' : 'Perfil guardado en este navegador.'}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="CyberStorage.exportBackup()">📥 Exportar JSON</button>
          <button class="btn btn-secondary" onclick="document.getElementById('import-file-input').click()">📤 Importar JSON</button>
          <input id="import-file-input" type="file" accept="application/json" style="display:none">
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px">
      <h3>🏆 Logros (${d.unlockedAchievements.length} / ${ach.length})</h3>
      <div class="grid-cards">${ach.map(x=>{
        const ok=d.unlockedAchievements.includes(x.id);
        return `<div class="card" style="opacity:${ok?'1':'.4'}"><div style="font-size:2rem">${esc(x.icon)}</div><strong>${esc(x.name)}</strong><div style="font-size:.8rem;color:var(--text-muted)">${esc(x.description)}</div></div>`;
      }).join('')}</div>
    </div>`;

    c.querySelector('#import-file-input').onchange=e=>importFile(e.target);
    c.querySelector('#edit-account').onclick=()=>openEditor(a);
    if(c.querySelector('#sync-cloud-btn')) {
      c.querySelector('#sync-cloud-btn').onclick=async ()=>{
        c.querySelector('#sync-cloud-btn').textContent = '⌛ Sincronizando...';
        await window.CyberAccounts.syncCloudProgress();
        setTimeout(()=>{
          c.querySelector('#sync-cloud-btn').textContent = '✅ Sincronizado!';
          setTimeout(()=>c.querySelector('#sync-cloud-btn').textContent = '🔄 Sincronizar Nube', 2000);
        }, 500);
      };
    }
    c.querySelector('#switch-account').onclick=()=>selectAccount();
    c.querySelector('#logout-account').onclick=()=>window.CyberAccounts.logout();
  }

  function selectAccount(){
    localStorage.removeItem('cyberlab_active_account_v1');
    window.CyberAccounts.activeId=null;
    window.CyberStorage.setActiveAccount(null);
    const g=document.getElementById('accounts-gate');
    if(g)g.style.display='flex';
    window.CyberAccounts.renderSelection();
  }

  function openEditor(a){
    const old=document.getElementById('profile-editor-modal');if(old)old.remove();
    const m=document.createElement('div');
    m.id='profile-editor-modal';
    m.className='modal-overlay active';
    let currentAvatar = a.avatar || '🛡️';

    m.innerHTML=`
      <div class="modal-card" style="max-width:500px">
        <button class="modal-close" id="close">✕</button>
        <h3>✏️ Editar perfil & foto</h3>
        
        <label style="display:block;margin-top:10px">Nombre de usuario</label>
        <input id="edit-name" class="chat-input" maxlength="24" style="width:100%;margin:4px 0 12px" value="${esc(a.username)}">
        
        <label style="display:block">Biografía</label>
        <textarea id="edit-bio" class="chat-input" maxlength="180" rows="3" style="width:100%;margin:4px 0 12px">${esc(a.bio||'')}</textarea>
        
        <label style="display:block;margin-bottom:6px">Foto de perfil / Avatar</label>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div id="modal-avatar-preview" style="width:72px;height:72px;border-radius:50%;background:var(--bg-surface);border:2px solid var(--accent-cyan);display:grid;place-items:center;font-size:2.5rem;overflow:hidden">
            ${currentAvatar.startsWith('data:') || currentAvatar.startsWith('http') ? `<img src="${currentAvatar}" style="width:100%;height:100%;object-fit:cover">` : currentAvatar}
          </div>
          <div style="flex:1">
            <input id="edit-avatar-file" type="file" accept="image/png,image/jpeg,image/webp" style="display:none">
            <button type="button" class="btn btn-secondary" style="font-size:.8rem;padding:6px 12px;margin-bottom:8px" onclick="document.getElementById('edit-avatar-file').click()">📸 Subir foto propia</button>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${AVATAR_PRESETS.map(emoji => `<button type="button" class="btn-avatar-preset-edit" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:8px;font-size:1.2rem;padding:4px 8px;cursor:pointer">${emoji}</button>`).join('')}
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button id="cancel" class="btn btn-secondary">Cancelar</button>
          <button id="save" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </div>`;

    document.body.appendChild(m);

    m.querySelector('#edit-avatar-file').onchange = async e => {
      if (e.target.files[0]) {
        currentAvatar = await window.CyberAccounts.compressImage(e.target.files[0]);
        m.querySelector('#modal-avatar-preview').innerHTML = `<img src="${currentAvatar}" style="width:100%;height:100%;object-fit:cover">`;
      }
    };

    m.querySelectorAll('.btn-avatar-preset-edit').forEach(btn => {
      btn.onclick = () => {
        currentAvatar = btn.textContent;
        m.querySelector('#modal-avatar-preview').innerHTML = currentAvatar;
      };
    });

    m.querySelector('#close').onclick = m.querySelector('#cancel').onclick = () => m.remove();

    m.querySelector('#save').onclick = async () => {
      const name = m.querySelector('#edit-name').value.trim();
      if (!name) return alert('Escribe un nombre de usuario.');
      await window.CyberAccounts.updateActiveProfile({
        username: name,
        bio: m.querySelector('#edit-bio').value,
        avatar: currentAvatar
      });
      m.remove();
      render();
    };
  }

  window.CyberProfileAccounts = { render };
  if (window.CyberApp) window.CyberApp.renderProfile = render;
  window.addEventListener('cyberlab_account_changed', () => {
    if (window.CyberApp?.updateHeaderStats) window.CyberApp.updateHeaderStats();
    setTimeout(render, 0);
  });
  window.addEventListener('cyberlab_state_updated', () => setTimeout(render, 0));
  setTimeout(render, 0);
})();
