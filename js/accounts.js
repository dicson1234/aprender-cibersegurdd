/* CyberLab Accounts & Cloud Backend Manager
   Handles local profiles & serverless Cloudflare Worker API authentication,
   profile pictures, avatars, and cloud progress synchronization. */

const ACCOUNTS_KEY = 'cyberlab_accounts_v1';
const ACTIVE_ACCOUNT_KEY = 'cyberlab_active_account_v1';
const CLOUD_TOKEN_KEY = 'cyberlab_cloud_token_v1';

const AVATAR_PRESETS = ['🤖', '🛡️', '💻', '⚡', '🦅', '🥷', '🦊', '🚀'];

class AccountsManager {
  constructor() {
    this.accounts = this.loadAccounts();
    this.activeId = localStorage.getItem(ACTIVE_ACCOUNT_KEY) || null;
    this.cloudToken = localStorage.getItem(CLOUD_TOKEN_KEY) || null;
    this.ready = new Promise(resolve => { this._resolveReady = resolve; });
    this.pendingAvatar = '';
    this.ensureMigration();
    this.renderGate();
    if (this.activeId && this.accounts.some(a => a.id === this.activeId)) {
      this._resolveReady(this.getActive());
    }
  }

  getApiBase() {
    return 'https://cyberla-cybertutor.tapiashdicson.workers.dev/api';
  }

  loadAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.map(a => ({ ...accountDefaults, ...a, privateProfile: a.privateProfile !== false }));
    } catch { return []; }
  }

  saveAccounts() { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(this.accounts)); }

  ensureMigration() {
    if (this.accounts.length || !localStorage.getItem('cyberlab_user_data_v1')) return;
    const account = {
      id: `user-${crypto.randomUUID()}`,
      username: 'Usuario',
      pinHash: '',
      avatar: '🛡️',
      bio: 'Estudiante de CyberLab',
      createdAt: new Date().toISOString(),
      isCloud: false
    };
    this.accounts.push(account);
    this.saveAccounts();
    this.activeId = account.id;
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, account.id);
  }

  getActive() {
    return this.accounts.find(a => a.id === this.activeId) || null;
  }

  async hashPin(pin) {
    if (!pin) return '';
    const data = new TextEncoder().encode(pin);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  renderGate() {
    if (document.getElementById('accounts-gate')) return;
    const gate = document.createElement('div');
    gate.id = 'accounts-gate';
    gate.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(5,8,15,.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);font-family:inherit;';
    gate.innerHTML = `<div id="accounts-card" style="width:min(480px,96vw);max-height:88vh;overflow-y:auto;background:var(--bg-card,#0f141d);border:1px solid var(--accent-cyan);border-radius:24px;padding:20px 16px;box-shadow:0 20px 60px rgba(0,240,255,0.2)"></div>`;
    document.body.appendChild(gate);
    this.renderSelection();
  }

  renderSelection() {
    const card = document.getElementById('accounts-card');
    if (!card) return;
    const active = this.getActive();
    if (active) {
      this.hideGate();
      return;
    }

    card.innerHTML = `
      <div style="text-align:center;margin-bottom:14px">
        <div style="font-size:2.2rem;line-height:1;margin-bottom:4px">🛡️</div>
        <h2 style="margin:2px 0 4px;font-size:1.25rem;font-weight:800;color:var(--text-main);letter-spacing:-0.01em">Bienvenido a CyberLab</h2>
        <p style="color:var(--text-muted);font-size:.78rem;margin:0">Inicia sesión en la nube o selecciona un perfil local.</p>
      </div>

      <div style="display:flex;gap:4px;margin-bottom:14px;background:rgba(0,0,0,0.4);padding:4px;border-radius:14px;border:1px solid var(--border-color)">
        <button id="tab-cloud-login" class="btn btn-primary" style="flex:1;font-size:.78rem;padding:8px 4px;border-radius:10px">🌐 Iniciar</button>
        <button id="tab-cloud-register" class="btn btn-secondary" style="flex:1;font-size:.78rem;padding:8px 4px;border-radius:10px">✨ Crear</button>
        <button id="tab-local-profiles" class="btn btn-secondary" style="flex:1;font-size:.78rem;padding:8px 4px;border-radius:10px">👤 Locales</button>
      </div>

      <div id="auth-tab-content"></div>
    `;

    const btnLogin = card.querySelector('#tab-cloud-login');
    const btnReg = card.querySelector('#tab-cloud-register');
    const btnLocal = card.querySelector('#tab-local-profiles');

    const setActiveTab = (btn) => {
      [btnLogin, btnReg, btnLocal].forEach(b => {
        b.className = 'btn btn-secondary';
        b.style.background = 'transparent';
      });
      btn.className = 'btn btn-primary';
    };

    btnLogin.onclick = () => { setActiveTab(btnLogin); this.renderCloudLogin(); };
    btnReg.onclick = () => { setActiveTab(btnReg); this.renderCloudRegister(); };
    btnLocal.onclick = () => { setActiveTab(btnLocal); this.renderLocalProfiles(); };

    this.renderCloudLogin();
  }

  renderCloudLogin() {
    const container = document.getElementById('auth-tab-content');
    if (!container) return;
    container.innerHTML = `
      <div style="background:rgba(0,240,255,0.05);border:1px solid rgba(0,240,255,0.2);padding:10px 12px;border-radius:12px;margin-bottom:14px">
        <strong style="display:block;font-size:.85rem;color:var(--accent-cyan);margin-bottom:2px">🌐 Cuenta en la Nube (Worker Backend)</strong>
        <p style="margin:0;font-size:.75rem;color:var(--text-muted)">Accede a tus datos y foto guardados desde cualquier dispositivo.</p>
      </div>
      <label style="display:block;margin-bottom:4px;font-weight:700;font-size:.8rem">Usuario o Correo</label>
      <input id="login-identifier" class="chat-input" placeholder="Ej. Dicson o usuario@cyberlab.com" style="width:100%;height:42px;margin-bottom:10px;border-radius:12px;font-size:.88rem">
      
      <label style="display:block;margin-bottom:4px;font-weight:700;font-size:.8rem">Contraseña o PIN</label>
      <input id="login-password" type="password" class="chat-input" placeholder="••••••••" style="width:100%;height:42px;margin-bottom:14px;border-radius:12px;font-size:.88rem">

      <button id="btn-cloud-login-submit" class="btn btn-primary" style="width:100%;justify-content:center;min-height:44px;border-radius:12px;font-weight:700">🚀 Iniciar Sesión</button>
      <div id="login-status-msg" style="margin-top:8px;font-size:.8rem;text-align:center"></div>
    `;

    container.querySelector('#btn-cloud-login-submit').onclick = () => this.handleCloudLogin();
  }

  renderCloudRegister() {
    const container = document.getElementById('auth-tab-content');
    if (!container) return;
    this.pendingAvatar = '🛡️';
    container.innerHTML = `
      <div style="background:rgba(0,240,255,0.05);border:1px solid rgba(0,240,255,0.2);padding:10px 12px;border-radius:12px;margin-bottom:12px">
        <strong style="display:block;font-size:.85rem;color:var(--accent-cyan);margin-bottom:2px">✨ Crear Cuenta e Ingresar</strong>
        <p style="margin:0;font-size:.75rem;color:var(--text-muted)">Personaliza tu foto de perfil y usuario.</p>
      </div>

      <label style="display:block;margin-bottom:2px;font-weight:700;font-size:.8rem">Nombre de Usuario</label>
      <input id="reg-username" class="chat-input" maxlength="24" placeholder="Ej. Dicson" style="width:100%;height:40px;margin-bottom:8px;border-radius:12px;font-size:.85rem">

      <label style="display:block;margin-bottom:2px;font-weight:700;font-size:.8rem">Correo (opcional)</label>
      <input id="reg-email" type="email" class="chat-input" placeholder="dicson@ejemplo.com" style="width:100%;height:40px;margin-bottom:8px;border-radius:12px;font-size:.85rem">

      <label style="display:block;margin-bottom:2px;font-weight:700;font-size:.8rem">Contraseña o PIN (mín. 4 carácteres)</label>
      <input id="reg-password" type="password" maxlength="20" class="chat-input" placeholder="••••••••" style="width:100%;height:40px;margin-bottom:10px;border-radius:12px;font-size:.85rem">

      <label style="display:block;margin-bottom:4px;font-weight:700;font-size:.8rem">Foto de Perfil / Avatar</label>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div id="avatar-preview-box" style="width:46px;height:46px;min-width:46px;border-radius:50%;background:var(--bg-surface);border:2px solid var(--accent-cyan);display:grid;place-items:center;font-size:1.6rem;overflow:hidden">
          🛡️
        </div>
        <div style="flex:1;min-width:0">
          <input id="reg-avatar-file" type="file" accept="image/png,image/jpeg,image/webp" style="display:none">
          <button type="button" class="btn btn-secondary" style="font-size:.75rem;padding:4px 10px;min-height:30px;margin-bottom:4px" onclick="document.getElementById('reg-avatar-file').click()">📸 Subir foto</button>
          <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:2px">
            ${AVATAR_PRESETS.map(emoji => `<button type="button" class="btn-avatar-preset" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:8px;font-size:1rem;padding:2px 6px;cursor:pointer;flex:0 0 auto">${emoji}</button>`).join('')}
          </div>
        </div>
      </div>

      <button id="btn-cloud-reg-submit" class="btn btn-primary" style="width:100%;justify-content:center;min-height:44px;border-radius:12px;font-weight:700">✨ Crear e Ingresar</button>
      <div id="reg-status-msg" style="margin-top:6px;font-size:.8rem;text-align:center"></div>
    `;

    container.querySelector('#reg-avatar-file').onchange = e => this.previewFile(e.target.files[0]);
    container.querySelectorAll('.btn-avatar-preset').forEach(btn => {
      btn.onclick = () => {
        const emoji = btn.textContent;
        this.pendingAvatar = emoji;
        const box = document.getElementById('avatar-preview-box');
        if (box) box.innerHTML = emoji;
      };
    });

    container.querySelector('#btn-cloud-reg-submit').onclick = () => this.handleCloudRegister();
  }

  renderLocalProfiles() {
    const container = document.getElementById('auth-tab-content');
    if (!container) return;
    const accounts = this.accounts;

    container.innerHTML = `
      <h3 style="margin:0 0 10px;font-size:1rem;color:var(--text-muted)">Perfiles guardados en este navegador:</h3>
      ${accounts.length ? `<div style="display:grid;gap:10px;margin-bottom:16px">${accounts.map(a => `
        <button data-login="${a.id}" class="btn btn-secondary" style="width:100%;display:flex;align-items:center;gap:12px;justify-content:flex-start;padding:12px">
          ${a.avatar && a.avatar.startsWith('data:') || a.avatar.startsWith('http') ? `<img src="${a.avatar}" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover">` : `<span style="font-size:1.8rem">${a.avatar || '👤'}</span>`}
          <span><strong>${this.escape(a.username)}</strong><small style="display:block;color:var(--text-muted)">${a.isCloud ? '🌐 Perfil Nube' : '💻 Perfil Local'}</small></span>
        </button>`).join('')}</div>` : '<p style="color:var(--text-muted);font-size:.85rem;margin-bottom:14px">No hay perfiles locales guardados.</p>'}

      <button id="btn-create-local-quick" class="btn btn-secondary" style="width:100%;justify-content:center">➕ Crear Perfil Local Rápido</button>
    `;

    container.querySelectorAll('[data-login]').forEach(btn => btn.onclick = () => this.loginLocal(btn.dataset.login));
    container.querySelector('#btn-create-local-quick').onclick = () => this.createQuickLocal();
  }

  async previewFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const data = await this.compressImage(file);
    const box = document.getElementById('avatar-preview-box');
    if (box) {
      box.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover">`;
    }
    this.pendingAvatar = data;
  }

  compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const size = 300, scale = Math.min(size / img.width, size / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async handleCloudLogin() {
    const idInput = document.getElementById('login-identifier')?.value.trim();
    const passInput = document.getElementById('login-password')?.value.trim();
    const statusDiv = document.getElementById('login-status-msg');

    if (!idInput) return alert('Por favor ingresa tu usuario o correo.');

    if (statusDiv) statusDiv.innerHTML = '<span style="color:var(--accent-cyan)">🌐 Conectando con Cloud Worker Backend...</span>';

    try {
      const res = await fetch(`${this.getApiBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: idInput, password: passInput })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas.');

      const user = data.user;
      const account = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || '🛡️',
        bio: user.bio || '',
        token: data.token,
        isCloud: true,
        createdAt: user.createdAt
      };

      // Save into accounts array
      const idx = this.accounts.findIndex(a => a.id === user.id);
      if (idx >= 0) this.accounts[idx] = account; else this.accounts.push(account);
      this.saveAccounts();

      if (data.token) {
        this.cloudToken = data.token;
        localStorage.setItem(CLOUD_TOKEN_KEY, data.token);
      }

      // Restore user cloud progress if available
      if (data.progress && window.CyberStorage) {
        window.CyberStorage.importCloudProgress(data.progress);
      }

      await this.select(account);

    } catch (err) {
      console.error(err);
      if (statusDiv) statusDiv.innerHTML = `<span style="color:#ff4a4a">❌ ${err.message}</span>`;
    }
  }

  async handleCloudRegister() {
    const name = document.getElementById('reg-username')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const pass = document.getElementById('reg-password')?.value.trim();
    const statusDiv = document.getElementById('reg-status-msg');

    if (!name || name.length < 2) return alert('Escribe un nombre de usuario (mínimo 2 caracteres).');
    if (!pass || pass.length < 4) return alert('Ingresa una contraseña o PIN (mínimo 4 caracteres).');

    if (statusDiv) statusDiv.innerHTML = '<span style="color:var(--accent-cyan)">✨ Creando usuario en la Nube...</span>';

    try {
      const res = await fetch(`${this.getApiBase()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          email: email || name,
          password: pass,
          avatar: this.pendingAvatar || '🛡️',
          bio: 'Estudiante de ciberseguridad en CyberLab'
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo crear el usuario.');

      const user = data.user;
      const account = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || '🛡️',
        bio: user.bio || '',
        token: data.token,
        isCloud: true,
        createdAt: user.createdAt
      };

      this.accounts.push(account);
      this.saveAccounts();

      if (data.token) {
        this.cloudToken = data.token;
        localStorage.setItem(CLOUD_TOKEN_KEY, data.token);
      }

      await this.select(account);

    } catch (err) {
      console.error(err);
      if (statusDiv) statusDiv.innerHTML = `<span style="color:#ff4a4a">❌ ${err.message}</span>`;
    }
  }

  createQuickLocal() {
    const name = prompt('Nombre de usuario para este perfil local:');
    if (!name || !name.trim()) return;
    const account = {
      id: `user-${crypto.randomUUID()}`,
      username: name.trim().slice(0, 24),
      avatar: '👤',
      bio: 'Perfil Local',
      createdAt: new Date().toISOString(),
      isCloud: false
    };
    this.accounts.push(account);
    this.saveAccounts();
    this.select(account);
  }

  async loginLocal(id) {
    const account = this.accounts.find(a => a.id === id);
    if (!account) return;
    if (account.pinHash) {
      const pin = prompt(`PIN de ${account.username}:`);
      if (pin === null || await this.hashPin(pin) !== account.pinHash) return alert('PIN incorrecto.');
    }
    await this.select(account);
  }

  async select(account) {
    this.activeId = account.id;
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, account.id);
    if (account.token) {
      this.cloudToken = account.token;
      localStorage.setItem(CLOUD_TOKEN_KEY, account.token);
    }
    window.CyberStorage?.setActiveAccount(account.id);
    this.hideGate();
    window.dispatchEvent(new CustomEvent('cyberlab_account_changed', { detail: account }));
    if (this._resolveReady) this._resolveReady(account);

    // Sync cloud progress in background if cloud account
    if (account.isCloud) {
      this.syncCloudProgress();
    }
  }

  async syncCloudProgress() {
    const active = this.getActive();
    if (!active || !active.token) return;

    try {
      const progress = window.CyberStorage?.data || {};
      await fetch(`${this.getApiBase()}/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${active.token}`
        },
        body: JSON.stringify({ progress })
      });
    } catch (e) {
      console.warn('Error al sincronizar progreso con Worker Cloud:', e);
    }
  }

  hideGate() { const gate = document.getElementById('accounts-gate'); if (gate) gate.style.display = 'none'; }

  async logout() {
    this.activeId = null;
    this.cloudToken = null;
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    localStorage.removeItem(CLOUD_TOKEN_KEY);
    window.CyberStorage?.setActiveAccount(null);
    const gate = document.getElementById('accounts-gate');
    if (gate) { gate.style.display = 'flex'; this.renderSelection(); }
  }

  async updateActiveProfile({ username, avatar, bio }) {
    const account = this.getActive(); if (!account) return;
    if (username?.trim()) account.username = username.trim().slice(0, 24);
    if (avatar !== undefined) account.avatar = avatar;
    if (bio !== undefined) account.bio = String(bio).slice(0, 180);
    this.saveAccounts();

    // If cloud account, also update on worker backend
    if (account.isCloud && account.token) {
      try {
        await fetch(`${this.getApiBase()}/user/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${account.token}`
          },
          body: JSON.stringify({ username: account.username, avatar: account.avatar, bio: account.bio })
        });
      } catch (e) {
        console.warn('No se pudo actualizar el perfil en el servidor Worker:', e);
      }
    }

    window.dispatchEvent(new CustomEvent('cyberlab_account_changed', { detail: account }));
  }

  setPrivacy(isPrivate) {
    const account = this.getActive(); if (!account) return;
    account.privateProfile = Boolean(isPrivate);
    this.saveAccounts();
    window.dispatchEvent(new CustomEvent('cyberlab_account_changed', { detail: account }));
    return account;
  }

  escape(value) { return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }
}

window.CyberAccounts = new AccountsManager();
