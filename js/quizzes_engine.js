/* CyberLab Quizzes & Examinations Engine (80% Passing standard) — Compact Cards & Exam Drawer */

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

    const totalQuizzesPassed = (this.storage.data.passedQuizzes || []).length;
    const totalQuizzesAvailable = quizzes.length || 1;
    const overallPct = Math.round((totalQuizzesPassed / totalQuizzesAvailable) * 100);

    const summaryCard = document.createElement('div');
    summaryCard.className = 'card';
    summaryCard.style.cssText = 'margin-bottom: 14px; padding: 14px; background: linear-gradient(135deg, rgba(163,113,247,0.08), rgba(15,20,29,0.95)); border: 1px solid rgba(163,113,247,0.25); border-radius: 16px;';
    summaryCard.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
        <h2 style="font-size: 1.15rem; font-weight:800; color:#ffffff; margin:0;">📝 Exámenes de Evaluación</h2>
        <span class="tag purple" style="font-size:0.75rem;">${overallPct}% Aprobado</span>
      </div>
      <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; margin-bottom:6px;">
        <div style="width:${overallPct}%; height:100%; background:linear-gradient(90deg, #a371f7, #00f0ff); border-radius:10px; transition:width 0.4s ease;"></div>
      </div>
      <div style="font-size:0.76rem; color:var(--text-muted); text-align:right;">${totalQuizzesPassed} de ${totalQuizzesAvailable} preguntas aprobadas (Mínimo 80%)</div>
    `;
    container.appendChild(summaryCard);

    const grid = document.createElement('div');
    grid.className = 'grid-cards';

    categories.forEach(cat => {
      const catQuizzes = quizzes.filter(q => q.category === cat);
      if (catQuizzes.length === 0) return;

      const passedCount = catQuizzes.filter(q => this.storage.data.passedQuizzes.includes(q.id)).length;
      const isPassedAll = passedCount === catQuizzes.length;
      const rewarded = this.storage.data.rewardedExams.includes(cat);

      const card = document.createElement('div');
      card.className = 'card quiz-compact-card';
      card.style.cssText = `padding: 12px 14px; border-radius: 16px; ${isPassedAll ? 'border:1px solid rgba(57,211,83,0.35); background:rgba(12,28,20,0.85);' : 'border:1px solid rgba(163,113,247,0.25); background:rgba(18,14,30,0.85);'}`;

      card.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;">
          <span class="tag ${isPassedAll ? 'green' : 'purple'}" style="font-size:0.7rem;">${cat}</span>
          <span style="font-size:0.74rem; color:var(--text-muted);">${catQuizzes.length} Preguntas</span>
        </div>
        <h3 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Examen de ${cat}</h3>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px;">Estándar del 80% • Recompensa +100 XP</p>
        
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span class="tag ${isPassedAll ? 'green' : 'yellow'}" style="font-size:0.68rem;">
            ${passedCount} / ${catQuizzes.length} Aprobadas
          </span>
          <button class="btn btn-primary btn-sm" style="font-size:0.78rem; padding:6px 12px;" onclick="window.CyberQuizzes.startExam('${cat}')">
            ${rewarded ? 'Repetir Examen' : '📝 Iniciar Examen'}
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
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
      <div class="card" style="margin-bottom:14px; padding:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div>
            <h2 style="font-size:1.15rem; margin:0 0 4px; color:#fff;">Examen de ${category}</h2>
            <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">Responde las preguntas. Debes obtener al menos 80% para aprobar.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.CyberQuizzes.render()">✕ Salir</button>
        </div>
      </div>
    `;

    examQuestions.forEach((q, idx) => {
      html += `
        <div class="quiz-card" id="q-card-${q.id}" style="margin-bottom:12px; padding:12px 14px; border-radius:14px; background:rgba(15,22,32,0.85); border:1px solid rgba(0,240,255,0.18);">
          <div style="font-size:.72rem;color:var(--accent-cyan);font-weight:700;margin-bottom:4px;">PREGUNTA ${idx + 1} DE ${examQuestions.length} · ${q.difficulty}</div>
          <div style="font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:12px;">${q.question}</div>
          <div class="quiz-options-list" style="display:grid; grid-template-columns:1fr; gap:6px;">
            ${q.options.map((opt, oIdx) => `
              <button class="quiz-option-btn" onclick="window.CyberQuizzes.selectAnswer('${q.id}', ${oIdx}, this)" aria-pressed="false" style="font-size:0.84rem; padding:8px 12px; border-radius:10px; text-align:left;">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `
      <div style="display:flex;justify-content:flex-end;margin-top:16px;margin-bottom:24px;">
        <button class="btn btn-primary" onclick="window.CyberQuizzes.submitExam('${category}')" style="padding:10px 24px;font-size:0.9rem;">
          📊 Evaluar Examen
        </button>
      </div>
    `;

    container.innerHTML = html;
  }

  selectAnswer(qId, optionIdx, btnEl) {
    this.currentAnswers[qId] = optionIdx;
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    btnEl.classList.add('selected');
    btnEl.setAttribute('aria-pressed', 'true');
  }

  submitExam(category) {
    if (!this.currentQuiz?.length) return;

    let score = 0;
    const total = this.currentQuiz.length;
    const now = Date.now();
    const existingMistakes = this.storage.data.mistakes || [];

    this.currentQuiz.forEach(q => {
      const selected = this.currentAnswers[q.id];
      if (selected === q.answer) {
        score++;
        if (!this.storage.data.passedQuizzes.includes(q.id)) {
          this.storage.data.passedQuizzes.push(q.id);
        }
      } else {
        const wrongAnswer = selected !== undefined ? q.options[selected] : 'Sin responder';
        const duplicate = existingMistakes.some(m => m.questionId === q.id && m.wrongAnswer === wrongAnswer && m.reviewDueDate && Date.parse(m.reviewDueDate) > now - 86400000);
        if (!duplicate) {
          existingMistakes.push({
            id: `mistake-${now}-${Math.random().toString(36).slice(2, 8)}`,
            questionId: q.id,
            question: q.question,
            wrongAnswer,
            correctAnswer: q.options[q.answer],
            explanation: q.explanation,
            date: new Date(now).toISOString(),
            reviewDueDate: new Date(now + 86400000).toISOString(),
            reviewStage: 1
          });
        }
      }
    });

    this.storage.data.mistakes = existingMistakes.slice(-200);
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 80;
    const alreadyRewarded = this.storage.data.rewardedExams.includes(category);

    if (passed && !alreadyRewarded) {
      this.storage.data.rewardedExams.push(category);
      this.storage.saveData();
      if (window.CyberGamification) window.CyberGamification.addXP(100, `Examen de ${category} aprobado (${pct}%)`);
      alert(`🎉 ¡EXAMEN APROBADO! Puntuación: ${pct}%. Has obtenido +100 XP por esta primera aprobación.`);
    } else {
      this.storage.saveData();
      if (passed) {
        alert(`✅ Examen aprobado: ${pct}%. La recompensa de XP de este examen ya fue obtenida anteriormente.`);
      } else {
        alert(`⚠️ Puntuación: ${pct}%. Necesitas al menos 80% para aprobar. Las preguntas falladas fueron enviadas a repetición espaciada.`);
      }
    }

    this.render();
  }
}

window.CyberQuizzes = new QuizzesEngine();
