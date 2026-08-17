/* CyberLab Local Accounts: perfiles independientes por navegador/dispositivo.
   Nota: esto NO es autenticación de servidor; cada navegador mantiene sus propias cuentas.
   Para cuentas sincronizadas entre dispositivos hace falta un backend de autenticación. */

const ACCOUNTS_KEY = 'cyberlab_accounts_v1';
const ACTIVE_ACCOUNT_KEY = 'cyberlab_active_account_v1';

const accountDefaults = {
  avatar: '',
  bio: '',
  createdAt: new Date().toISOString()
};

class AccountsManager {
  constructor() {
    this.accounts = this.loadAccounts();
    this.activeId = localStorage.getItem(ACTIVE_ACCOUNT_KEY) || null;
    this.ready = new Promise(resolve => { this._resolveReady = resolve; });
    this.ensureMigration();
    this.renderGate();
    if (this.activeId && this.accounts.some(a => a.id === this.activeId)) {
      this._resolveReady(this.getActive());
    }
  }

  loadAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  saveAccounts() {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(this.accounts));
  }

  ensureMigration() {
    if (this.accounts.length || !localStorage.getItem('cyberlab_user_data_v1')) return;
    const account = {
      id: `user-${crypto.randomUUID()}`,
      username: 'Usuario',
      pinHash: '',
      ...accountDefaults,
      migratedFromLegacy: true
    };
    this.accounts.push(account);
    this.saveAccounts();
    this.activeId = account.id;
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, account.id);
  }

  getActive() { return this.accounts.find(a => a.id === this.activeId) || null; }

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
    gate.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(5,8,15,.97);backdrop-filter:blur(12px);font-family:inherit;';
    gate.innerHTML = `<div id="accounts-card" style="width:min(560px,100%);max-height:90vh;overflow:auto;background:var(--bg-card,#111827);border:1px solid var(--border-color,#263244);border-radius:20px;padding:24px;box-shadow:0 25px 80px rgba(0,0,0,.45)"></div>`;
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
    const accounts = this.accounts;
    card.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:3rem">🛡️</div>
        <h1 style="margin:8px 0 4px">Bienvenido a CyberLab</h1>
        <p style="color:var(--text-muted)">Cada persona puede tener su propio perfil y progreso en este dispositivo.</p>
      </div>
      ${accounts.length ? `<h3 style="margin-bottom:10px">Tus perfiles</h3><div style="display:grid;gap:10px;margin-bottom:18px">${accounts.map(a => `
        <button data-login="${a.id}" class="btn btn-secondary" style="width:100%;display:flex;align-items:center;gap:12px;justify-content:flex-start;padding:12px">
          ${a.avatar ? `<img src="${a.avatar}" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover">` : '<span style="font-size:1.8rem">👤</span>'}
          <span><strong>${this.escape(a.username)}</strong><small style="display:block;color:var(--text-muted)">Perfil local</small></span>
        </button>`).join('')}</div>` : ''}
      <button id="new-account-btn" class="btn btn-primary" style="width:100%;justify-content:center">➕ Crear nuevo usuario</button>
      <p style="font-size:.75rem;color:var(--text-muted);margin-top:14px;text-align:center">Las cuentas de esta versión son locales al navegador. No suben tus datos a GitHub ni a CyberLab.</p>
    `;
    card.querySelectorAll('[data-login]').forEach(btn => btn.addEventListener('click', () => this.login(btn.dataset.login)));
    card.querySelector('#new-account-btn').addEventListener('click', () => this.renderCreate());
  }

  renderCreate() {
    const card = document.getElementById('accounts-card');
    if (!card) return;
    card.innerHTML = `
      <button id="account-back" class="btn btn-secondary" style="margin-bottom:14px">← Volver</button>
      <h2 style="margin-bottom:6px">Crear tu usuario</h2>
      <p style="color:var(--text-muted);margin-bottom:16px">Tu nombre, foto y progreso quedarán separados de los demás perfiles.</p>
      <label style="display:block;margin-bottom:6px">Nombre de usuario</label>
      <input id="account-name" class="chat-input" maxlength="24" placeholder="Ej. Dicson" style="width:100%;margin-bottom:12px">
      <label style="display:block;margin-bottom:6px">PIN (opcional, 4–12 caracteres)</label>
      <input id="account-pin" type="password" maxlength="12" class="chat-input" placeholder="Para proteger el perfil en este dispositivo" style="width:100%;margin-bottom:12px">
      <label style="display:block;margin-bottom:6px">Foto de perfil</label>
      <input id="account-avatar" type="file" accept="image/png,image/jpeg,image/webp" style="width:100%;margin-bottom:16px">
      <img id="account-preview" alt="Vista previa" style="display:none;width:88px;height:88px;border-radius:50%;object-fit:cover;border:2px solid var(--accent-cyan);margin-bottom:16px">
      <button id="create-account" class="btn btn-primary" style="width:100%;justify-content:center">Crear usuario</button>
    `;
    card.querySelector('#account-back').onclick = () => this.renderSelection();
    card.querySelector('#account-avatar').onchange = e => this.previewFile(e.target.files[0]);
    card.querySelector('#create-account').onclick = () => this.createAccount();
  }

  async previewFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const data = await this.compressImage(file);
    const img = document.getElementById('account-preview');
    if (img) { img.src = data; img.style.display = 'block'; }
    this.pendingAvatar = data;
  }

  compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const size = 320, scale = Math.min(size / img.width, size / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', .82));
        };
        img.onerror = reject; img.src = reader.result;
      };
      reader.onerror = reject; reader.readAsDataURL(file);
    });
  }

  async createAccount() {
    const name = document.getElementById('account-name')?.value.trim();
    const pin = document.getElementById('account-pin')?.value || '';
    if (!name) return alert('Escribe un nombre de usuario.');
    if (this.accounts.some(a => a.username.toLowerCase() === name.toLowerCase())) return alert('Ese nombre ya existe en este dispositivo.');
    if (pin && (pin.length < 4 || pin.length > 12)) return alert('El PIN debe tener entre 4 y 12 caracteres.');
    const account = { id: `user-${crypto.randomUUID()}`, username: name, pinHash: await this.hashPin(pin), avatar: this.pendingAvatar || '', bio: '', createdAt: new Date().toISOString() };
    this.accounts.push(account); this.saveAccounts(); this.pendingAvatar = '';
    await this.select(account);
  }

  async login(id) {
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
    window.CyberStorage?.setActiveAccount(account.id);
    this.hideGate();
    window.dispatchEvent(new CustomEvent('cyberlab_account_changed', { detail: account }));
    if (this._resolveReady) this._resolveReady(account);
  }

  hideGate() {
    const gate = document.getElementById('accounts-gate');
    if (gate) gate.style.display = 'none';
  }

  async logout() {
    this.activeId = null;
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    window.CyberStorage?.setActiveAccount(null);
    const gate = document.getElementById('accounts-gate');
    if (gate) { gate.style.display = 'flex'; this.renderSelection(); }
  }

  updateActiveProfile({ username, avatar, bio }) {
    const account = this.getActive(); if (!account) return;
    if (username?.trim()) account.username = username.trim().slice(0, 24);
    if (avatar !== undefined) account.avatar = avatar;
    if (bio !== undefined) account.bio = bio.slice(0, 180);
    this.saveAccounts();
    window.dispatchEvent(new CustomEvent('cyberlab_account_changed', { detail: account }));
  }

  escape(value) { return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }
}

window.CyberAccounts = new AccountsManager();
