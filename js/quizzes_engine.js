/* CyberLab Quizzes & Examinations Engine (80% Passing standard) */

class QuizzesEngine {
  constructor() {
    this.storage = window.CyberStorage;
    this.currentQuiz = null;
    this.currentAnswers = {};
  }

  render() {
    const quizzes = window.CyberData ? window.CyberData.quizzes || [] : [];
    const container = document.getElementById('quizzes-root');
    if (!container) return;

    container.innerHTML = '';

    const categories = ['Fundamentos', 'Informática', 'Sistemas', 'Linux', 'Windows', 'Redes', 'Internet', 'Programación', 'Seguridad', 'Laboratorios'];

    categories.forEach(cat => {
      const catQuizzes = quizzes.filter(q => q.category === cat);
      if (catQuizzes.length === 0) return;

      const passedCount = catQuizzes.filter(q => this.storage.data.passedQuizzes.includes(q.id)).length;
      const isPassedAll = passedCount === catQuizzes.length;

      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '16px';
      card.innerHTML = `
        <div class="card-header">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700;">Examen de ${cat}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${catQuizzes.length} preguntas de opción múltiple · Mínimo 80% para aprobar</span>
          </div>
          <span class="tag ${isPassedAll ? 'green' : 'yellow'}">${passedCount} / ${catQuizzes.length} Aprobadas</span>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 14px;">
          <button class="btn btn-primary" onclick="window.CyberQuizzes.startExam('${cat}')">
            ${passedCount > 0 ? 'Repetir Examen (+100 XP)' : 'Iniciar Examen (+100 XP)'}
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  startExam(category) {
    const quizzes = window.CyberData ? window.CyberData.quizzes || [] : [];
    const examQuestions = quizzes.filter(q => q.category === category);
    if (examQuestions.length === 0) return;

    this.currentQuiz = examQuestions;
    this.currentAnswers = {};

    const container = document.getElementById('quizzes-root');
    if (!container) return;

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <h2 style="font-size: 1.4rem;">Examen de ${category}</h2>
          <button class="btn btn-secondary" onclick="window.CyberQuizzes.render()">Cancelar Examen</button>
        </div>
        <p style="color: var(--text-muted);">Responde las preguntas y presiona 'Evaluar Examen' al finalizar. Debes obtener al menos 80% para aprobar.</p>
      </div>
    `;

    examQuestions.forEach((q, idx) => {
      html += `
        <div class="quiz-card" id="q-card-${q.id}">
          <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px;">PREGUNTA ${idx + 1} DE ${examQuestions.length} · ${q.difficulty}</div>
          <div style="font-size: 1.05rem; font-weight: 600; margin-bottom: 16px;">${q.question}</div>
          <div class="quiz-options-list">
            ${q.options.map((opt, oIdx) => `
              <button class="quiz-option-btn" onclick="window.CyberQuizzes.selectAnswer('${q.id}', ${oIdx}, this)">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `
      <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
        <button class="btn btn-primary" onclick="window.CyberQuizzes.submitExam('${category}')" style="padding: 12px 28px; font-size: 1rem;">
          📊 Evaluar Examen
        </button>
      </div>
    `;

    container.innerHTML = html;
  }

  selectAnswer(qId, optionIdx, btnEl) {
    this.currentAnswers[qId] = optionIdx;
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('correct'));
    btnEl.classList.add('correct');
  }

  submitExam(category) {
    let score = 0;
    const total = this.currentQuiz.length;

    this.currentQuiz.forEach(q => {
      const selected = this.currentAnswers[q.id];
      const qCard = document.getElementById(`q-card-${q.id}`);

      if (selected === q.answer) {
        score++;
        if (!this.storage.data.passedQuizzes.includes(q.id)) {
          this.storage.data.passedQuizzes.push(q.id);
        }
      } else {
        // Record mistake for Spaced Repetition!
        this.storage.data.mistakes.push({
          id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          questionId: q.id,
          question: q.question,
          wrongAnswer: selected !== undefined ? q.options[selected] : 'Sin responder',
          correctAnswer: q.options[q.answer],
          explanation: q.explanation,
          date: new Date().toISOString(),
          reviewDueDate: new Date(Date.now() + 86400000).toISOString(), // Day 1
          reviewStage: 1
        });
      }
    });

    this.storage.saveData();
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 80;

    if (passed) {
      window.CyberGamification.addXP(100, `Examen de ${category} aprobado (${pct}%)`);
      alert(`🎉 ¡EXAMEN APROBADO! Puntuación: ${pct}%. Calificación excelente.`);
    } else {
      alert(`⚠️ Puntuación: ${pct}%. Necesitas al menos 80% para aprobar. Las preguntas falladas se enviaron a tu sección de 'Errores que cometí' para repetición espaciada.`);
    }

    this.render();
  }
}

window.CyberQuizzes = new QuizzesEngine();
