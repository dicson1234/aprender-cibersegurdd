/* CyberLab Dashboard Component Renderer & Recommendation Engine */

class DashboardRenderer {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const data = this.storage.data;
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const quizzes = window.CyberData ? window.CyberData.quizzes || [] : [];
    const labs = window.CyberData ? window.CyberData.labs || [] : [];
    const challenges = window.CyberData ? window.CyberData.challenges || [] : [];

    // Header Stats
    document.querySelectorAll('.stat-xp-val').forEach(el => el.textContent = data.xp.toLocaleString());
    document.querySelectorAll('.stat-level-val').forEach(el => el.textContent = data.level);
    document.querySelectorAll('.stat-streak-val').forEach(el => el.textContent = `${data.streak} días`);

    // Overview Statistics Cards
    const totalConcepts = modules.reduce((acc, m) => acc + (m.concepts ? m.concepts.length : 0), 0);
    const learnedConcepts = Object.keys(data.masteryLevels).filter(k => data.masteryLevels[k] >= 3).length;
    const progressPct = totalConcepts > 0 ? Math.round((learnedConcepts / totalConcepts) * 100) : 0;

    const elProgressPct = document.getElementById('dash-overall-progress-pct');
    if (elProgressPct) elProgressPct.textContent = `${progressPct}%`;

    const elProgressBar = document.getElementById('dash-overall-progress-bar');
    if (elProgressBar) elProgressBar.style.width = `${progressPct}%`;

    const elConceptsLearned = document.getElementById('dash-concepts-learned');
    if (elConceptsLearned) elConceptsLearned.textContent = `${learnedConcepts} / ${totalConcepts}`;

    const elLabsDone = document.getElementById('dash-labs-done');
    if (elLabsDone) elLabsDone.textContent = `${data.completedLabs.length} / ${labs.length}`;

    const elQuizzesDone = document.getElementById('dash-quizzes-done');
    if (elQuizzesDone) elQuizzesDone.textContent = `${data.passedQuizzes.length} / ${quizzes.length}`;

    const elChallengesDone = document.getElementById('dash-challenges-done');
    if (elChallengesDone) elChallengesDone.textContent = `${data.completedChallenges.length} / ${challenges.length}`;

    // Render Category Strengths & Weaknesses
    this.renderCategoryBreakdown(modules, data);

    // Render Recommendation Engine
    this.renderRecommendationEngine(modules, data);
  }

  renderCategoryBreakdown(modules, data) {
    const categories = ['Redes', 'Linux', 'Windows', 'Programación', 'Seguridad', 'Fundamentos', 'Laboratorios'];
    const container = document.getElementById('dash-categories-container');
    if (!container) return;

    container.innerHTML = '';

    categories.forEach(cat => {
      const catModules = modules.filter(m => m.category === cat);
      let catTotalConcepts = 0;
      let catLearnedConcepts = 0;

      catModules.forEach(m => {
        if (m.concepts) {
          catTotalConcepts += m.concepts.length;
          m.concepts.forEach(c => {
            if (data.masteryLevels[c.id] >= 3) catLearnedConcepts++;
          });
        }
      });

      const catPct = catTotalConcepts > 0 ? Math.round((catLearnedConcepts / catTotalConcepts) * 100) : 0;

      const catCard = document.createElement('div');
      catCard.className = 'card';
      catCard.innerHTML = `
        <div class="card-header">
          <span class="card-title">${cat}</span>
          <span class="tag ${catPct > 70 ? 'green' : catPct > 30 ? 'yellow' : 'red'}">${catPct}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill ${catPct > 70 ? 'green' : ''}" style="width: ${catPct}%"></div>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); text-align: right;">
          ${catLearnedConcepts} de ${catTotalConcepts} conceptos dominados
        </div>
      `;
      container.appendChild(catCard);
    });
  }

  renderRecommendationEngine(modules, data) {
    const elRecTitle = document.getElementById('dash-rec-title');
    const elRecReason = document.getElementById('dash-rec-reason');
    const elRecAction = document.getElementById('dash-rec-action');

    if (!elRecTitle) return;

    // Find first uncompleted module or weak area
    let targetModule = null;
    let reason = '';

    for (let m of modules) {
      if (!data.completedModules.includes(m.id)) {
        targetModule = m;
        reason = `Siguiente módulo en tu ruta de aprendizaje de ${m.category}.`;
        break;
      }
    }

    if (!targetModule && modules.length > 0) {
      targetModule = modules[0];
      reason = '¡Has completado los módulos iniciales! Repasa los conceptos para elevar tu nivel de dominio a 6.';
    }

    if (targetModule) {
      elRecTitle.textContent = targetModule.title;
      elRecReason.textContent = reason;
      elRecAction.onclick = () => {
        window.location.hash = '#tree';
      };
    }
  }
}

window.CyberDashboard = new DashboardRenderer();
