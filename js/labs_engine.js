/* CyberLab Labs Engine: Guided Interactive Laboratory Workspace with Compact Cards & Step Drawer */

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

    const summaryCard = document.createElement('div');
    summaryCard.className = 'card';
    summaryCard.style.cssText = 'margin-bottom: 14px; padding: 14px; background: linear-gradient(135deg, rgba(0,240,255,0.08), rgba(15,20,29,0.95)); border: 1px solid rgba(0,240,255,0.25); border-radius: 16px;';
    
    const completedLabsCount = (this.storage.data.completedLabs || []).length;
    const totalLabsCount = labs.length || 1;
    const progressPct = Math.round((completedLabsCount / totalLabsCount) * 100);

    summaryCard.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
        <h2 style="font-size: 1.15rem; font-weight:800; color:#ffffff; margin:0;">🧪 CyberLabs Practicos</h2>
        <span class="tag green" style="font-size:0.75rem;">${progressPct}% Completados</span>
      </div>
      <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; margin-bottom:6px;">
        <div style="width:${progressPct}%; height:100%; background:linear-gradient(90deg, #39d353, #00f0ff); border-radius:10px; transition:width 0.4s ease;"></div>
      </div>
      <div style="font-size:0.76rem; color:var(--text-muted); text-align:right;">${completedLabsCount} de ${totalLabsCount} laboratorios aprobados</div>
    `;
    container.appendChild(summaryCard);

    const grid = document.createElement('div');
    grid.className = 'grid-cards';

    labs.forEach(lab => {
      const isDone = this.storage.data.completedLabs && this.storage.data.completedLabs.includes(lab.id);
      
      if (!this.completedSteps[lab.id]) {
        this.completedSteps[lab.id] = new Set(isDone ? (lab.steps || []).map(s => s.step) : []);
      }

      const completedCount = this.completedSteps[lab.id].size;
      const totalSteps = (lab.steps || []).length;
      const labPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

      const card = document.createElement('div');
      card.className = 'card lab-compact-card';
      card.style.cssText = `padding: 12px 14px; border-radius: 16px; ${isDone ? 'border:1px solid rgba(57,211,83,0.35); background:rgba(12,28,20,0.85);' : 'border:1px solid rgba(0,240,255,0.2); background:rgba(15,22,32,0.85);'}`;

      card.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;">
          <span class="tag ${isDone ? 'green' : 'cyan'}" style="font-size:0.7rem;">${lab.level || 'Intermedio'}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">⚡ +${lab.xp || 50} XP</span>
        </div>
        <h3 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 6px;">${lab.title}</h3>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px; line-height: 1.35;">${lab.description}</p>
        
        <div style="width:100%; height:4px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; margin-bottom:10px;">
          <div style="width:${labPct}%; height:100%; background:${isDone ? '#39d353' : '#00f0ff'};"></div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span style="font-size:0.74rem; color:${isDone ? '#39d353' : 'var(--accent-cyan)'}; font-weight:600;">
            ${isDone ? '🟢 Completado' : `${completedCount}/${totalSteps} Pasos`}
          </span>
          <button class="btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-sm" style="font-size:0.78rem; padding:6px 12px;" onclick="window.CyberLabs.openLabModal('${lab.id}')">
            ${isDone ? 'Revisar Lab' : '🧪 Iniciar Lab'}
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  openLabModal(labId) {
    const labs = window.CyberData ? window.CyberData.labs || [] : [];
    const lab = labs.find(l => l.id === labId);
    if (!lab) return;

    let modal = document.getElementById('lab-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'lab-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `<div class="modal-card" style="max-width:650px;"><button class="modal-close" onclick="document.getElementById('lab-modal').classList.remove('active')">✕</button><div id="lab-modal-content"></div></div>`;
      document.body.appendChild(modal);
    }

    const modalContent = modal.querySelector('#lab-modal-content');
    const isDone = this.storage.data.completedLabs && this.storage.data.completedLabs.includes(lab.id);

    let stepsHtml = '';
    (lab.steps || []).forEach(st => {
      const stepDone = this.completedSteps[lab.id] && this.completedSteps[lab.id].has(st.step);
      stepsHtml += `
        <div class="lab-step-item ${stepDone ? 'step-completed' : ''}" style="margin-bottom: 12px; background: rgba(10,16,24,0.9); padding: 12px; border-radius: 12px; border: 1px solid rgba(0,240,255,0.18);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <label style="font-weight: 700; color: var(--accent-cyan); display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.86rem;">
              <input type="checkbox" ${stepDone ? 'checked' : ''} 
                     onchange="window.CyberLabs.toggleStep('${lab.id}', ${st.step}, this.checked)">
              Paso ${st.step}: ${st.title}
            </label>
            <span class="tag ${stepDone ? 'green' : 'yellow'}" style="font-size:0.68rem;">${stepDone ? '☑ Listo' : '☐ Pendiente'}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">${st.description}</div>
          <div class="terminal-window" style="margin: 0;">
            <div class="terminal-header" style="padding:4px 8px; font-size:0.7rem;">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span style="color: var(--text-muted);">bash</span>
            </div>
            <div class="terminal-body" style="padding: 8px; font-size:0.76rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="terminal-prompt">$</span> <code style="color:#00f0ff;font-family:monospace">${st.command}</code>
              </div>
              <button class="btn btn-secondary btn-sm" style="font-size:0.7rem; padding:2px 8px;" onclick="navigator.clipboard.writeText('${st.command.replace(/'/g, "\\'")}'); window.CyberGamification?.showToast('📋 Comando copiado');">Copiar</button>
            </div>
          </div>
        </div>
      `;
    });

    let questionsHtml = '';
    (lab.questions || []).forEach(q => {
      questionsHtml += `
        <div style="margin-bottom: 12px; background: rgba(10,16,24,0.9); padding: 12px; border-radius: 12px; border: 1px solid rgba(0,240,255,0.18);">
          <div style="font-weight: 700; font-size: 0.86rem; color: #fff; margin-bottom: 6px;">❓ ${q.question}</div>
          <div style="display:flex; gap:8px;">
            <input type="text" class="chat-input" id="lab-ans-${q.id}" placeholder="Escribe tu respuesta..." style="flex:1; height:36px; font-size:0.8rem;">
            <button class="btn btn-primary btn-sm" onclick="window.CyberLabs.checkQuestion('${lab.id}', '${q.id}', '${q.answer}')">Verificar</button>
          </div>
        </div>
      `;
    });

    modalContent.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:12px;">
        <h2 style="font-size:1.15rem; font-weight:800; color:#fff; margin:0;">🧪 ${lab.title}</h2>
        <span class="tag ${isDone ? 'green' : 'cyan'}" style="font-size:0.7rem;">${isDone ? '🟢 Completado' : '🟡 En progreso'}</span>
      </div>
      <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px; line-height:1.4;">${lab.description}</p>
      
      <h3 style="font-size:0.9rem; color:var(--accent-cyan); font-weight:700; margin-bottom:8px;">Pasos del Laboratorio:</h3>
      ${stepsHtml}

      ${questionsHtml ? `<h3 style="font-size:0.9rem; color:var(--accent-cyan); font-weight:700; margin-top:14px; margin-bottom:8px;">Preguntas de Verificación:</h3>${questionsHtml}` : ''}

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
        <button class="btn btn-secondary" onclick="document.getElementById('lab-modal').classList.remove('active')">Cerrar</button>
        <button class="btn btn-primary" onclick="window.CyberLabs.finishLab('${lab.id}')">${isDone ? 'Finalizado (XP Obtenido)' : 'Completar Lab (+50 XP)'}</button>
      </div>
    `;

    modal.classList.add('active');
  }

  toggleStep(labId, stepNum, isChecked) {
    if (!this.completedSteps[labId]) this.completedSteps[labId] = new Set();
    if (isChecked) this.completedSteps[labId].add(stepNum);
    else this.completedSteps[labId].delete(stepNum);
  }

  checkQuestion(labId, qId, correctAnswer) {
    const input = document.getElementById(`lab-ans-${qId}`);
    if (!input) return;
    const val = input.value.trim().toLowerCase();
    if (val === correctAnswer.trim().toLowerCase()) {
      alert('🎉 ¡Respuesta Correcta! Excelente análisis.');
      input.style.borderColor = '#39d353';
    } else {
      alert('❌ Respuesta incorrecta. Vuelve a revisar el comando o la salida de la terminal.');
      input.style.borderColor = '#ff3c3c';
    }
  }

  finishLab(labId) {
    const labs = window.CyberData ? window.CyberData.labs || [] : [];
    const lab = labs.find(l => l.id === labId);
    if (!lab) return;

    if (!this.storage.data.completedLabs.includes(labId)) {
      this.storage.data.completedLabs.push(labId);
      this.storage.saveData();
      if (window.CyberGamification) {
        window.CyberGamification.addXP(lab.xp || 50, `Laboratorio completado: ${lab.title}`);
      }
      alert(`🎉 ¡Laboratorio '${lab.title}' completado! Has ganado +${lab.xp || 50} XP.`);
    }

    const modal = document.getElementById('lab-modal');
    if (modal) modal.classList.remove('active');
    this.render();
  }
}

window.CyberLabs = new LabsEngine();
