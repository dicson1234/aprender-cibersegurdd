/* CyberLab LocalStorage State Manager — isolated per account + validated backups */

const STORAGE_PREFIX = 'cyberlab_user_data_v3_';
const LEGACY_KEYS = ['cyberlab_user_data_v2', 'cyberlab_user_data_v1'];
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

const DEFAULT_STATE = {
  xp: 0, level: 1, streak: 1, lastActiveDate: new Date().toISOString().split('T')[0],
  hoursStudied: 0, masteryLevels: {}, completedModules: [], passedQuizzes: [],
  completedLabs: [], completedChallenges: [], notes: [], mistakes: [], resourceRatings: {},
  viewedResources: [], unlockedAchievements: [], quizAttempts: {},
  goals: { dailyMinutes: 30, dailyCompleted: false, weeklyModules: 2, weeklyCompleted: false },
  primaryObjective: 'Convertirme en profesional de ciberseguridad.',
  secondaryObjective: 'Especializarme en Blue Team & SOC.'
};

function cloneDefaultState() { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
function isObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function asArray(v) { return Array.isArray(v) ? v : []; }
function asNumber(v, fallback) { return Number.isFinite(Number(v)) ? Number(v) : fallback; }

function sanitizeState(input) {
  const d = cloneDefaultState();
  if (!isObject(input)) return d;
  d.xp = Math.max(0, asNumber(input.xp, 0));
  d.level = Math.max(1, Math.floor(asNumber(input.level, 1)));
  d.streak = Math.max(1, Math.floor(asNumber(input.streak, 1)));
  d.lastActiveDate = typeof input.lastActiveDate === 'string' ? input.lastActiveDate : d.lastActiveDate;
  d.hoursStudied = Math.max(0, asNumber(input.hoursStudied, 0));
  d.masteryLevels = isObject(input.masteryLevels) ? input.masteryLevels : {};
  ['completedModules','passedQuizzes','completedLabs','completedChallenges','notes','mistakes','unlockedAchievements','viewedResources'].forEach(k => d[k] = asArray(input[k]));
  d.resourceRatings = isObject(input.resourceRatings) ? input.resourceRatings : {};
  d.quizAttempts = isObject(input.quizAttempts) ? input.quizAttempts : {};
  d.goals = isObject(input.goals) ? { ...d.goals, ...input.goals } : d.goals;
  if (typeof input.primaryObjective === 'string') d.primaryObjective = input.primaryObjective.slice(0, 500);
  if (typeof input.secondaryObjective === 'string') d.secondaryObjective = input.secondaryObjective.slice(0, 500);
  return d;
}

class StorageManager {
  constructor() {
    this.activeAccountId = null;
    this.data = cloneDefaultState();
  }

  key(accountId = this.activeAccountId) {
    return accountId ? `${STORAGE_PREFIX}${accountId}` : null;
  }

  setActiveAccount(accountId) {
    this.activeAccountId = accountId;
    if (!accountId) { this.data = cloneDefaultState(); return; }
    this.data = this.loadForAccount(accountId);
    this.checkStreak();
    window.dispatchEvent(new CustomEvent('cyberlab_state_updated', { detail: this.data }));
  }

  loadForAccount(accountId) {
    try {
      const key = this.key(accountId);
      let stored = key ? localStorage.getItem(key) : null;
      if (!stored) {
        const accounts = window.CyberAccounts?.accounts || [];
        const isFirstAccount = accounts.length === 1 && accounts[0]?.id === accountId;
        if (isFirstAccount) {
          for (const legacyKey of LEGACY_KEYS) {
            const legacy = localStorage.getItem(legacyKey);
            if (legacy) { stored = legacy; localStorage.removeItem(legacyKey); break; }
          }
        }
      }
      const source = stored ? JSON.parse(stored)?.data || JSON.parse(stored) : cloneDefaultState();
      const data = sanitizeState(source);
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (e) {
      console.error('Error al cargar el perfil:', e);
      return cloneDefaultState();
    }
  }

  saveData(data = this.data, emit = true) {
    this.data = sanitizeState(data);
    try {
      if (!this.activeAccountId) throw new Error('No hay cuenta activa');
      localStorage.setItem(this.key(), JSON.stringify(this.data));
    } catch (e) { console.error('Error al guardar:', e); }
    if (emit) window.dispatchEvent(new CustomEvent('cyberlab_state_updated', { detail: this.data }));
  }

  checkStreak() {
    if (!this.activeAccountId) return;
    const today = new Date().toISOString().split('T')[0];
    const last = this.data.lastActiveDate;
    if (!last || last === today) return;
    const diff = Math.round((Date.parse(today) - Date.parse(last)) / 86400000);
    this.data.streak = diff === 1 ? this.data.streak + 1 : 1;
    this.data.lastActiveDate = today;
    this.saveData();
  }

  exportBackup() {
    const account = window.CyberAccounts?.getActive();
    const payload = { schemaVersion: 3, exportedAt: new Date().toISOString(), username: account?.username || 'Usuario', data: this.data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `cyberlab_${account?.username || 'usuario'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  importBackup(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      const candidate = isObject(parsed) && isObject(parsed.data) ? parsed.data : parsed;
      if (!isObject(candidate)) throw new Error('Formato inválido');
      this.saveData(sanitizeState(candidate));
      alert('¡Progreso importado y validado con éxito!');
      window.location.reload();
    } catch (e) { console.error(e); alert('La copia no es válida o está dañada.'); }
  }

  resetAllData() {
    if (confirm('¿Estás seguro de que deseas reiniciar todo tu progreso de este usuario?')) {
      if (this.activeAccountId) localStorage.removeItem(this.key());
      window.location.reload();
    }
  }
}

window.CyberStorage = new StorageManager();
window.CyberLabReviewIntervals = REVIEW_INTERVALS;
