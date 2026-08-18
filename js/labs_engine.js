/* CyberLab Labs Engine: Guided Interactive Laboratory Workspace with Step Checklist & Verification */

class LabsEngine {
  constructor() {
    this.storage = window.CyberStorage;
    this.completedSteps = {}; // labId -> Set of step numbers
  }

  render() {
    const labs = window.CyberData ? window.CyberData.labs || [] : [];
    const container = document.getElementById('labs-root');
    if (!container) return;

    container.innerHTML = '';

    labs.forEach(lab => {
      const isDone = this.storage.data.completedLabs.includes(lab.id);
      const card = document.createElement('div');
      card.className = 'card lab-card card-glass';
      card.style.marginBottom = '24px';

      if (!this.completedSteps[lab.id]) {
        this.completedSteps[lab.id] = new Set(isDone ? lab.steps.map(s => s.step) : []);
      }

      const completedCount = this.completedSteps[lab.id].size;
      const totalSteps = lab.steps.length;
      const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

      let stepsHtml = '';
      lab.steps.forEach(st => {
        const stepDone = this.completedSteps[lab.id].has(st.step);
        stepsHtml += `
          <div class="lab-step-item ${stepDone ? 'step-completed' : ''}" style="margin-bottom: 16px; background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <label style="font-weight: 700; color: var(--accent-cyan); display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" ${stepDone ? 'checked' : ''} 
                       onchange="window.CyberLabs.toggleStep('${lab.id}', ${st.step}, this.checked)">
                Paso ${st.step}: ${st.title}
              </label>
              <span class="tag ${stepDone ? 'green' : 'yellow'}">${stepDone ? '☑ Listo' : '☐ Pendiente'}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;">${st.description}</div>
            <div class="terminal-window" style="margin: 0;">
              <div class="terminal-header">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">bash — 80x24</span>
              </div>
              <div class="terminal-body" style="min-height: 48px; padding: 10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span class="terminal-prompt">user@cyberlab:~$</span> <code style="color:#00f0ff;font-family:monospace">${st.command}</code>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${st.command.replace(/'/g, "\\'")}'); window.CyberGamification.showToast('📋 Comando copiado al portapapeles');">Copiar</button>
              </div>
            </div>
          </div>
        `;
      });

      let questionsHtml = '';
      if (lab.questions && lab.questions.length > 0) {
        lab.questions.forEach((q, idx) => {
          questionsHtml += `
            <div style="margin-top: 14px; background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div style="font-weight: 600; margin-bottom: 8px; font-size: 0.92rem; color:var(--text-main);">Pregunta ${idx + 1}: ${q.question}</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${q.options.map((opt, oIdx) => `
                  <button class="quiz-option-btn" style="padding: 10px 14px; font-size: 0.88rem; text-align:left;"
                          onclick="window.CyberLabs.answerQuestion('${lab.id}', '${q.id}', ${oIdx}, ${q.answer}, this)">
                    ${String.fromCharCode(65 + oIdx)}. ${opt}
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
            <h3 style="font-size: 1.3rem; font-weight: 700; margin-top: 6px; color:var(--text-main);">${lab.title}</h3>
          </div>
          <span class="tag ${isDone ? 'green' : 'yellow'}">${isDone ? '✓ Completado (+150 XP)' : 'En Progreso'}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">${lab.objective}</p>
        
        <div style="margin-bottom: 16px; background: rgba(255,199,0,0.08); border-left:4px solid var(--accent-yellow); padding:12px; border-radius:var(--radius-sm)">
          <strong style="color: var(--accent-yellow);">📋 Preparación del Entorno:</strong>
          <div style="font-size: 0.9rem; color: var(--text-main); margin-top: 4px;">${lab.preparation}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
            <h4 style="font-size: 1.05rem; color:var(--accent-cyan);">Pasos Guiados de Ejecución (${completedCount}/${totalSteps}):</h4>
            <span style="font-weight:700; color:var(--accent-cyan)">${progressPct}%</span>
          </div>
          <div class="progress-bar-container" style="height:8px;">
            <div class="progress-bar-fill green" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        ${stepsHtml}

        <div style="margin-top:24px; padding-top:16px; border-top:1px dashed var(--border-color);">
          <h4 style="font-size: 1.05rem; margin-bottom: 12px; color:var(--accent-purple);">📝 Mini Evaluación del Laboratorio:</h4>
          ${questionsHtml}
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items:center;">
          <button class="btn btn-secondary" onclick="window.CyberTutorAssistant.sendQuickPrompt('Ayúdame a resolver el laboratorio ${lab.title}')">🤖 Pedir Ayuda a CyberTutor</button>
          <button class="btn btn-primary" onclick="window.CyberLabs.completeLab('${lab.id}')" ${isDone ? 'disabled' : ''}>
            ${isDone ? '✓ Laboratorio Completado' : 'Finalizar y Marcar Completado (+150 XP)'}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  toggleStep(labId, stepNum, isChecked) {
    if (!this.completedSteps[labId]) {
      this.completedSteps[labId] = new Set();
    }
    if (isChecked) {
      this.completedSteps[labId].add(stepNum);
      window.CyberGamification.addXP(10, `Paso ${stepNum} de laboratorio ejecutado`, `lab_step_${labId}_${stepNum}`);
    } else {
      this.completedSteps[labId].delete(stepNum);
    }
    this.render();
  }

  answerQuestion(labId, qId, selectedIdx, correctIdx, btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.classList.remove('correct', 'incorrect');
      b.disabled = true;
    });

    if (selectedIdx === correctIdx) {
      btnEl.classList.add('correct');
      window.CyberGamification.addXP(25, 'Respuesta correcta en laboratorio', `lab_q_${qId}`);
    } else {
      btnEl.classList.add('incorrect');
      if (parent.children[correctIdx]) parent.children[correctIdx].classList.add('correct');
    }
  }

  completeLab(labId) {
    const data = this.storage.data;
    if (!data.completedLabs.includes(labId)) {
      data.completedLabs.push(labId);
      this.storage.saveData();
      window.CyberGamification.addXP(150, 'Laboratorio completado', `lab_completed_${labId}`);
      if (window.CyberRecorrido) window.CyberRecorrido.triggerConfetti();
      this.render();
    }
  }
}

window.CyberLabs = new LabsEngine();
