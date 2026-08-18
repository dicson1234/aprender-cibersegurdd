/* ==========================================================================
   CyberLab — Interactive Onboarding Experience Component
   ========================================================================== */

class OnboardingManager {
  constructor() {
    this.storage = window.CyberStorage;
    this.initPromise = this.init();
  }

  async init() {
    // Never decide whether onboarding is needed from the temporary default state.
    // The account-scoped state must be hydrated first.
    await this.waitForAccountState();

    const data = this.storage?.data || {};
    if (data.onboardingCompleted) return;

    setTimeout(() => {
      // Re-check after the delay in case the account changed while the app booted.
      const activeId = window.CyberAccounts?.activeId;
      const loadedId = this.storage?.activeAccountId;
      const latest = this.storage?.data || {};
      if (activeId && loadedId === activeId && !latest.onboardingCompleted) {
        this.showOnboardingModal();
      }
    }, 400);
  }

  async waitForAccountState() {
    const accounts = window.CyberAccounts;
    if (!this.storage || !accounts?.activeId) return;

    // account_bootstrap now hydrates immediately, but keep this defensive path
    // for cached/older pages or unusual script timing.
    if (this.storage.activeAccountId !== accounts.activeId) {
      this.storage.setActiveAccount(accounts.activeId);
    }

    if (this.storage.activeAccountId === accounts.activeId) return;

    await new Promise(resolve => {
      const finish = () => {
        window.removeEventListener('cyberlab_state_updated', finish);
        resolve();
      };
      window.addEventListener('cyberlab_state_updated', finish, { once: true });
      setTimeout(finish, 1200);
    });
  }

  showOnboardingModal() {
    if (document.getElementById('onboarding-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'onboarding-modal';
    modal.className = 'modal-overlay onboarding-modal-overlay active';
    modal.innerHTML = `
      <div class="modal-card onboarding-card card-glass">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:3.5rem;margin-bottom:10px;">🛡️</div>
          <h2 style="color:var(--accent-cyan);font-size:1.6rem;margin-bottom:6px;">¡Bienvenido a CyberLab!</h2>
          <p style="color:var(--text-muted);font-size:0.95rem;">Tu academia personal e interactiva de ciberseguridad.</p>
        </div>

        <div style="margin-bottom:24px;">
          <label style="font-weight:700;color:var(--accent-yellow);display:block;margin-bottom:12px;font-size:1rem;">
            🎯 ¿Cuál es tu nivel actual de conocimientos?
          </label>
          <div class="onboarding-options-grid">
            <button class="onboarding-option-btn" onclick="window.CyberOnboarding.selectLevel('zero')">
              <span class="opt-icon">🌱</span>
              <div>
                <strong>Desde Cero</strong>
                <p>Quiero empezar con los fundamentos más básicos sin asumir conocimientos previos.</p>
              </div>
            </button>
            <button class="onboarding-option-btn" onclick="window.CyberOnboarding.selectLevel('basic')">
              <span class="opt-icon">🧠</span>
              <div>
                <strong>Básico</strong>
                <p>Conozco conceptos informáticos generales y quiero aprender ciberseguridad formal.</p>
              </div>
            </button>
            <button class="onboarding-option-btn" onclick="window.CyberOnboarding.selectLevel('intermediate')">
              <span class="opt-icon">⚡</span>
              <div>
                <strong>Intermedio</strong>
                <p>Tengo bases en redes y sistemas, y busco laboratorios, comandos y hardening.</p>
              </div>
            </button>
            <button class="onboarding-option-btn" onclick="window.CyberOnboarding.selectLevel('advanced')">
              <span class="opt-icon">🔥</span>
              <div>
                <strong>Avanzado</strong>
                <p>Busco auditoría, pentesting, análisis de incidentes y retos de nivel profesional.</p>
              </div>
            </button>
          </div>
        </div>

        <div style="text-align:center;padding-top:10px;border-top:1px dashed var(--border-color)">
          <button class="btn btn-secondary" onclick="window.CyberTutorAssistant.askAboutConcept('Evaluación de entrada')">
            🤖 Pedir recomendación a CyberTutor IA
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  selectLevel(levelKey) {
    const allowed = ['zero', 'basic', 'intermediate', 'advanced'];
    if (!allowed.includes(levelKey) || !this.storage?.activeAccountId) return;

    const data = this.storage.data;
    data.onboardingCompleted = true;
    data.userLevelPref = levelKey;
    const saved = this.storage.saveData();
    if (!saved) return;

    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.remove();

    window.CyberGamification.addXP(50, 'Onboarding completado');
    if (window.CyberRecorrido) window.CyberRecorrido.renderPath();
  }
}

window.CyberOnboarding = new OnboardingManager();
