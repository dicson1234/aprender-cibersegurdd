/* CyberLab Labs Engine: Guided Interactive Laboratory Workspace */

class LabsEngine {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const labs = window.CyberData ? window.CyberData.labs || [] : [];
    const container = document.getElementById('labs-root');
    if (!container) return;

    container.innerHTML = '';

    labs.forEach(lab => {
      const isDone = this.storage.data.completedLabs.includes(lab.id);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '20px';

      let stepsHtml = '';
      lab.steps.forEach(st => {
        stepsHtml += `
          <div style="margin-bottom: 16px; background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 4px;">Paso ${st.step}: ${st.title}</div>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">${st.description}</div>
            <div class="terminal-window" style="margin: 0;">
              <div class="terminal-header">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">bash — 80x24</span>
              </div>
              <div class="terminal-body" style="min-height: 50px; padding: 10px;">
                <span class="terminal-prompt">user@cyberlab:~$</span> ${st.command}
              </div>
            </div>
          </div>
        `;
      });

      let questionsHtml = '';
      if (lab.questions) {
        lab.questions.forEach((q, idx) => {
          questionsHtml += `
            <div style="margin-top: 14px; background: var(--bg-dark); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div style="font-weight: 600; margin-bottom: 8px; font-size: 0.9rem;">Pregunta ${idx + 1}: ${q.question}</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${q.options.map((opt, oIdx) => `
                  <button class="quiz-option-btn" style="padding: 8px 12px; font-size: 0.85rem;"
                          onclick="window.CyberLabs.answerQuestion('${lab.id}', '${q.id}', ${oIdx}, ${q.answer}, this)">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="card-header">
          <div>
            <span class="tag cyan">${lab.number}</span>
            <span class="tag purple">${lab.category}</span>
            <h3 style="font-size: 1.3rem; font-weight: 700; margin-top: 6px;">${lab.title}</h3>
          </div>
          <span class="tag ${isDone ? 'green' : 'yellow'}">${isDone ? '✓ Completado (+150 XP)' : 'Pendiente'}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">${lab.objective}</p>
        
        <div style="margin-bottom: 16px;">
          <strong style="color: var(--accent-yellow);">📋 Preparación del Entorno:</strong>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">${lab.preparation}</div>
        </div>

        <h4 style="font-size: 1.05rem; margin-bottom: 12px;">Pasos Guiados de Ejecución:</h4>
        ${stepsHtml}

        <h4 style="font-size: 1.05rem; margin-top: 20px; margin-bottom: 10px;">Evaluación de Conocimiento del Lab:</h4>
        ${questionsHtml}

        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="window.CyberLabs.completeLab('${lab.id}')" ${isDone ? 'disabled' : ''}>
            ${isDone ? '✓ Laboratorio Completado' : 'Finalizar y Marcar Completado (+150 XP)'}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  answerQuestion(labId, qId, selectedIdx, correctIdx, btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.classList.remove('correct', 'incorrect');
      b.disabled = true;
    });

    if (selectedIdx === correctIdx) {
      btnEl.classList.add('correct');
      window.CyberGamification.addXP(25, 'Respuesta correcta en laboratorio');
    } else {
      btnEl.classList.add('incorrect');
      parent.children[correctIdx].classList.add('correct');
    }
  }

  completeLab(labId) {
    const data = this.storage.data;
    if (!data.completedLabs.includes(labId)) {
      data.completedLabs.push(labId);
      this.storage.saveData();
      window.CyberGamification.addXP(150, 'Laboratorio completado');
      this.render();
    }
  }
}

window.CyberLabs = new LabsEngine();
