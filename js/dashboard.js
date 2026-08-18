/* CyberLab Dashboard Component Renderer & Recommendation Engine — Redesigned Mobile UX */

class DashboardRenderer {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const data = this.storage.data || {};
    const account = window.CyberAccounts?.getActive();
    const username = account ? account.username : 'Estudiante';
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const quizzes = window.CyberData ? window.CyberData.quizzes || [] : [];
    const labs = window.CyberData ? window.CyberData.labs || [] : [];
    const challenges = window.CyberData ? window.CyberData.challenges || [] : [];

    // Overview Statistics Calculation
    const totalConcepts = modules.reduce((acc, m) => acc + (m.concepts ? m.concepts.length : 0), 0) || 12;
    const learnedConcepts = Object.keys(data.masteryLevels || {}).filter(k => (data.masteryLevels[k] || 0) >= 3).length;
    const progressPct = Math.min(100, Math.max(0, Math.round((learnedConcepts / totalConcepts) * 100)));

    const streakDays = data.streak || 1;
    const streakLabel = streakDays === 1 ? '1 día' : `${streakDays} días`;

    container.innerHTML = `
      <!-- Greeting Header -->
      <div class="dash-greeting-header">
        <h1 class="dash-user-title">¡Hola, ${this.escape(username)}! 👋</h1>
        <p class="dash-user-subtitle">Tu centro de control y entrenamiento en ciberseguridad.</p>
      </div>

      <!-- General Progress Card -->
      <div class="card dash-overall-card">
        <div class="dash-overall-head">
          <div>
            <h3 class="dash-card-heading">Progreso General</h3>
          </div>
          <div class="dash-circular-gauge">
            <span class="gauge-value">${progressPct}%</span>
          </div>
        </div>
        <div class="progress-bar-container" style="margin: 14px 0 10px 0; height: 8px;">
          <div class="progress-bar-fill cyan" style="width: ${progressPct}%"></div>
        </div>
        <div class="dash-overall-meta">
          <span>Conceptos dominados: <strong>${learnedConcepts} / ${totalConcepts}</strong></span>
        </div>
      </div>

      <!-- My Activities Section -->
      <div class="dash-section-head">
        <h2>Mis actividades</h2>
        <a href="#recorrido" class="dash-link-action">Ver todo →</a>
      </div>

      <div class="dash-activities-grid">
        <!-- Laboratorios -->
        <div class="dash-activity-card card-green" onclick="window.location.hash='#labs'">
          <div class="activity-icon-circle green">🧪</div>
          <div class="activity-body">
            <div class="activity-title-row">
              <h3>Laboratorios</h3>
              <span class="tag green">${data.completedLabs?.length || 0} / ${labs.length || 5}</span>
            </div>
            <p class="activity-desc">Práctica guiada paso a paso.</p>
          </div>
          <button class="activity-arrow-btn green" aria-label="Ir a Laboratorios">→</button>
        </div>

        <!-- Exámenes -->
        <div class="dash-activity-card card-purple" onclick="window.location.hash='#quizzes'">
          <div class="activity-icon-circle purple">📋</div>
          <div class="activity-body">
            <div class="activity-title-row">
              <h3>Exámenes</h3>
              <span class="tag purple">${data.passedQuizzes?.length || 0} / ${quizzes.length || 30}</span>
            </div>
            <p class="activity-desc">Evaluaciones con estándar del 80%.</p>
          </div>
          <button class="activity-arrow-btn purple" aria-label="Ir a Exámenes">→</button>
        </div>

        <!-- Retos -->
        <div class="dash-activity-card card-yellow" onclick="window.location.hash='#challenges'">
          <div class="activity-icon-circle yellow">🎯</div>
          <div class="activity-body">
            <div class="activity-title-row">
              <h3>Retos</h3>
              <span class="tag yellow">${data.completedChallenges?.length || 0} / ${challenges.length || 10}</span>
            </div>
            <p class="activity-desc">Razonamiento y análisis.</p>
          </div>
          <button class="activity-arrow-btn yellow" aria-label="Ir a Retos">→</button>
        </div>
      </div>

      <!-- Streak Widget Card -->
      <div class="card dash-streak-card" onclick="window.location.hash='#spaced-repetition'">
        <div class="streak-icon-box">🔥</div>
        <div class="streak-body">
          <span class="streak-label">Racha actual</span>
          <div class="streak-count">${streakLabel}</div>
          <span class="streak-sub">¡Sigue así, tú puedes!</span>
        </div>
        <button class="streak-arrow-btn" aria-label="Ver detalles de racha">›</button>
      </div>

      <!-- Quick Summary Section -->
      <div class="dash-section-head" style="margin-top: 24px;">
        <h2>Resumen rápido</h2>
      </div>

      <div class="dash-quick-summary-grid">
        <div class="summary-metric-card">
          <span class="metric-icon">📖</span>
          <div class="metric-value">${learnedConcepts} / ${totalConcepts}</div>
          <div class="metric-label">Conceptos dominados</div>
        </div>
        <div class="summary-metric-card">
          <span class="metric-icon">🧪</span>
          <div class="metric-value">${data.completedLabs?.length || 0} / ${labs.length || 5}</div>
          <div class="metric-label">Labs completados</div>
        </div>
        <div class="summary-metric-card">
          <span class="metric-icon">📋</span>
          <div class="metric-value">${data.passedQuizzes?.length || 0} / ${quizzes.length || 30}</div>
          <div class="metric-label">Exámenes aprobados</div>
        </div>
        <div class="summary-metric-card">
          <span class="metric-icon">🏆</span>
          <div class="metric-value">${(data.xp || 0).toLocaleString()}</div>
          <div class="metric-label">Puntos totales</div>
        </div>
      </div>
    `;
  }

  escape(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
}

window.CyberDashboard = new DashboardRenderer();
