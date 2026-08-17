/* Profile UI bound to the active local account. */
(function () {
  function escapeHtml(v) { return String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }

  function renderProfile() {
    const app = window.CyberApp;
    const container = document.getElementById('profile-root');
    if (!app || !container || !window.CyberStorage || !window.CyberAccounts) return;
    const account = window.CyberAccounts.getActive();
    const data = window.CyberStorage.data;
    const achievements = window.CyberData?.achievements || [];
    if (!account) return;
    app._profileAccountRenderer = true;

    container.innerHTML = `
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          ${account.avatar ? `<img src="${account.avatar}" alt="Foto de ${escapeHtml(account.username)}" style="width:88px;height:88px;object-fit:cover;border-radius:50%;border:3px solid var(--accent-cyan)">` : '<div style="width:88px;height:88px;border-radius:50%;display:grid;place-items:center;font-size:3rem;background:var(--bg-surface)">👤</div>'}
          <div style="flex:1"><h2 style="font-size:1.5rem">${escapeHtml(account.username)}</h2><p style="color:var(--text-muted);margin:4px 0 8px">${escapeHtml(account.bio || 'Perfil de estudiante de CyberLab')}</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag cyan">Nivel ${data.level}</span><span class="tag purple">${data.xp.toLocaleString()} XP</span><span class="tag yellow">🔥 ${data.streak} días</span></div></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><button id="edit-account" class="btn btn-secondary">✏️ Editar perfil</button><button id="switch-account" class="btn btn-secondary">👥 Cambiar usuario</button><button id="logout-account" class="btn btn-primary">Salir</button></div>
        </div>
      </div>

      <div class="grid-cards">
        <div class="card"><h3 style="font-size:1.1rem;margin-bottom:12px">Objetivos Personalizados</h3><p style="margin-bottom:10px"><strong>Principal:</strong> ${escapeHtml(data.primaryObjective)}</p><p><strong>Secundario:</strong> ${escapeHtml(data.secondaryObjective)}</p></div>
        <div class="card"><h3 style="font-size:1.1rem;margin-bottom:12px">Copia de Seguridad</h3><p style="font-size:.85rem;color:var(--text-muted);margin-bottom:14px">El backup pertenece únicamente a ${escapeHtml(account.username)}.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" onclick="window.CyberStorage.exportBackup()">📥 Exportar JSON</button><button class="btn btn-secondary" onclick="document.getElementById('import-file-input').click()">📤 Importar JSON</button><input type="file" id="import-file-input" accept="application/json" style="display:none" onchange="window.CyberApp.handleImportFile(this)"></div></div>
      </div>

      <div class="card" style="margin-top:20px"><h3 style="font-size:1.2rem;margin-bottom:14px">🏆 Galería de Logros (${data.unlockedAchievements.length} / ${achievements.length})</h3><div class="grid-cards">${achievements.map(ach => { const unlocked=data.unlockedAchievements.includes(ach.id); return `<div class="card" style="opacity:${unlocked?'1':'.4'}"><div style="font-size:2rem">${escapeHtml(ach.icon)}</div><div style="font-weight:700">${escapeHtml(ach.name)}</div><div style="font-size:.8rem;color:var(--text-muted);margin-top:4px">${escapeHtml(ach.description)}</div><div style="font-size:.75rem;color:var(--accent-yellow);font-weight:bold;margin-top:8px">+${ach.xpReward} XP</div></div>`; }).join('')}</div></div>
    `;

    container.querySelector('#edit-account').onclick = () => openEditor(account);
    container.querySelector('#switch-account').onclick = () => { window.CyberAccounts.activeId = null; document.getElementById('accounts-gate').style.display='flex'; window.CyberAccounts.renderSelection(); };
    container.querySelector('#logout-account').onclick = () => window.CyberAccounts.logout();
  }

  function openEditor(account) {
    const current = document.getElementById('profile-editor-modal');
    if (current) current.remove();
    const modal = document.createElement('div');
    modal.id='profile-editor-modal'; modal.className='modal-overlay active';
    modal.innerHTML=`<div class="modal-card"><button class="modal-close" id="close-profile-editor">✕</button><h3 style="margin-bottom:16px">✏️ Editar perfil</h3><label>Nombre</label><input id="edit-name" class="chat-input" maxlength="24" style="width:100%;margin:6px 0 12px" value="${escapeHtml(account.username)}"><label>Biografía</label><textarea id="edit-bio" class="chat-input" maxlength="180" rows="3" style="width:100%;margin:6px 0 12px">${escapeHtml(account.bio||'')}</textarea><label>Foto</label><input id="edit-avatar" type="file" accept="image/png,image/jpeg,image/webp" style="width:100%;margin:6px 0 16px"><div id="edit-preview-wrap"></div><div style="display:flex;justify-content:flex-end;gap:10px"><button id="cancel-edit" class="btn btn-secondary">Cancelar</button><button id="save-edit" class="btn btn-primary">Guardar</button></div></div>`;
    document.body.appendChild(modal);
    let avatar = account.avatar;
    modal.querySelector('#close-profile-editor').onclick=modal.querySelector('#cancel-edit').onclick=()=>modal.remove();
    modal.querySelector('#edit-avatar').onchange=async e=>{ if(e.target.files[0]){ avatar=await window.CyberAccounts.compressImage(e.target.files[0]); modal.querySelector('#edit-preview-wrap').innerHTML=`<img src="${avatar}" style="width:84px;height:84px;object-fit:cover;border-radius:50%;margin-bottom:12px">`; }};
    modal.querySelector('#save-edit').onclick=()=>{ const name=modal.querySelector('#edit-name').value.trim(); if(!name)return alert('Escribe un nombre.'); if(window.CyberAccounts.accounts.some(a=>a.id!==account.id&&a.username.toLowerCase()===name.toLowerCase()))return alert('Ese nombre ya está usado.'); window.CyberAccounts.updateActiveProfile({username:name,bio:modal.querySelector('#edit-bio').value,avatar}); modal.remove(); renderProfile(); };
  }

  const previousRenderProfile = window.CyberApp?.renderProfile;
  if (window.CyberApp) window.CyberApp.renderProfile = renderProfile;
  window.addEventListener('cyberlab_account_changed', () => { setTimeout(renderProfile, 0); });
  window.addEventListener('cyberlab_state_updated', () => { setTimeout(renderProfile, 0); });
  setTimeout(renderProfile, 0);
})();
