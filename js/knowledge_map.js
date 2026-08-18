/* CyberLab Knowledge Map — Compact Mobile-First Tech-Tree Visualizer */
class KnowledgeMapRenderer {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const data = this.storage.data || {};
    const container = document.getElementById('knowledge-map-root');
    if (!container) return;

    container.innerHTML = '';

    const stages = [
      { id: 0, name: 'ETAPA 0 — ALFABETIZACIÓN INFORMÁTICA' },
      { id: 1, name: 'ETAPA 1 — SISTEMAS OPERATIVOS' },
      { id: 2, name: 'ETAPA 2 — REDES & TELECOMUNICACIONES' },
      { id: 3, name: 'ETAPA 3 — INTERNET & PROTOCOLOS WEB' },
      { id: 4, name: 'ETAPA 4 — PROGRAMACIÓN SEGURA' },
      { id: 7, name: 'ETAPA 7 — HARDENING & CIBERDEFENSA' },
      { id: 11, name: 'ETAPA 11 — OPERACIONES SOC' }
    ];

    const completedCount = data.completedModules ? data.completedModules.length : 0;
    const totalModules = modules.length || 1;
    const progressPct = Math.round((completedCount / totalModules) * 100);

    // Compact Summary Banner Header
    const summaryCard = document.createElement('div');
    summaryCard.className = 'card';
    summaryCard.style.cssText = 'margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, rgba(0,240,255,0.08), rgba(15,20,29,0.95)); border: 1px solid rgba(0,240,255,0.25); border-radius: 16px;';
    summaryCard.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
        <h2 style="font-size: 1.15rem; font-weight:800; color:#ffffff; margin:0;">🗺️ Mapa de Proceso</h2>
        <span class="tag cyan" style="font-size:0.75rem;">${progressPct}% Completado</span>
      </div>
      <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; margin-bottom:6px;">
        <div style="width:${progressPct}%; height:100%; background:linear-gradient(90deg, #00f0ff, #39d353); border-radius:10px; transition:width 0.4s ease;"></div>
      </div>
      <div style="font-size:0.76rem; color:var(--text-muted); text-align:right;">${completedCount} de ${totalModules} módulos dominados</div>
    `;
    container.appendChild(summaryCard);

    stages.forEach(stage => {
      const stageModules = modules.filter(m => m.stage === stage.id);
      if (stageModules.length === 0) return;

      const stageBlock = document.createElement('div');
      stageBlock.className = 'knowledge-stage-compact';
      stageBlock.style.cssText = 'margin-bottom: 14px;';

      let stageHtml = `
        <div style="font-size:0.8rem; font-weight:800; letter-spacing:0.4px; color:var(--accent-cyan); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>⚡</span> <span>${stage.name}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:8px;">
      `;

      stageModules.forEach(mod => {
        const isLocked = mod.prerequisites && mod.prerequisites.some(prereqId => !data.completedModules.includes(prereqId));
        const isMastered = data.completedModules && data.completedModules.includes(mod.id);

        let statusClass = 'border: 1px solid rgba(0,240,255,0.18); background: rgba(15,22,32,0.85);';
        let statusTag = `<span class="tag yellow" style="font-size:0.68rem;">🟡 En progreso</span>`;

        if (isLocked) {
          statusClass = 'border: 1px solid rgba(255,255,255,0.08); background: rgba(10,14,20,0.5); opacity:0.65;';
          statusTag = `<span class="tag red" style="font-size:0.68rem;">🔒 Bloqueado</span>`;
        } else if (isMastered) {
          statusClass = 'border: 1px solid rgba(57,211,83,0.35); background: rgba(12,28,20,0.85);';
          statusTag = `<span class="tag green" style="font-size:0.68rem;">🟢 Dominado</span>`;
        }

        stageHtml += `
          <div class="card map-node-compact" data-module-id="${mod.id}" style="${statusClass} padding: 10px 12px; border-radius: 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; cursor:pointer;">
            <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
              <span style="font-size: 1.4rem; flex:0 0 auto;">${mod.icon}</span>
              <div style="min-width:0; flex:1;">
                <div style="font-size:0.88rem; font-weight:700; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${mod.title}</div>
                <div style="font-size:0.72rem; color:var(--text-muted);">${mod.concepts ? mod.concepts.length : 0} conceptos · ${mod.estimatedTime || '15 min'}</div>
              </div>
            </div>
            <div style="flex:0 0 auto; display:flex; align-items:center; gap:6px;">
              ${statusTag}
              <span style="color:var(--text-muted); font-size:0.9rem;">➔</span>
            </div>
          </div>
        `;
      });

      stageHtml += `</div>`;
      stageBlock.innerHTML = stageHtml;
      container.appendChild(stageBlock);
    });

    // Attach click handlers to open node details modal
    container.querySelectorAll('.map-node-compact').forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const modId = nodeEl.getAttribute('data-module-id');
        this.openNodeModal(modId);
      });
    });
  }

  openNodeModal(modId) {
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const mod = modules.find(m => m.id === modId);
    if (!mod) return;

    const modal = document.getElementById('node-modal');
    const modalContent = document.getElementById('node-modal-content');
    if (!modal || !modalContent) return;

    const data = this.storage.data || {};
    const isCompleted = data.completedModules && data.completedModules.includes(mod.id);

    let html = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
        <span style="font-size: 1.8rem;">${mod.icon}</span>
        <div style="min-width:0; flex:1;">
          <h2 style="font-size: 1.15rem; margin:0; color:#fff;">${mod.title}</h2>
          <span class="tag cyan" style="font-size:0.7rem;">${mod.category || 'Módulo'}</span>
        </div>
      </div>
      <p style="color: var(--text-muted); font-size:0.84rem; margin-bottom: 14px; line-height:1.4;">${mod.description}</p>
      
      <h3 style="font-size: 0.95rem; font-weight:700; margin-bottom: 10px; color:var(--accent-cyan);">Conceptos en este módulo:</h3>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;">
    `;

    (mod.concepts || []).forEach(c => {
      const currentMastery = (data.masteryLevels && data.masteryLevels[c.id]) || 0;
      html += `
        <div style="background: rgba(7,14,22,0.9); padding: 10px; border-radius: 12px; border: 1px solid rgba(0,240,255,0.14);">
          <div style="font-weight: 700; font-size:0.86rem; color: var(--accent-cyan);">${c.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 3px; line-height:1.35;">${c.summary}</div>
          <div style="margin-top: 6px; font-size: 0.74rem; font-weight: 600;">
            Dominio: <span style="color: var(--accent-yellow);">${this.getMasteryLabel(currentMastery)}</span>
          </div>
        </div>
      `;
    });

    html += `
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px;">
        <button class="btn btn-secondary" style="min-height:42px; font-size:0.84rem;" onclick="document.getElementById('node-modal').classList.remove('active')">Cerrar</button>
        <button class="btn btn-primary" style="min-height:42px; font-size:0.84rem;" onclick="window.CyberKnowledgeMap.markModuleComplete('${mod.id}')">
          ${isCompleted ? '✓ Completado' : 'Marcar (+100 XP)'}
        </button>
      </div>
    `;

    modalContent.innerHTML = html;
    modal.classList.add('active');
  }

  markModuleComplete(modId) {
    const data = this.storage.data;
    if (data.completedModules && !data.completedModules.includes(modId)) {
      data.completedModules.push(modId);
      this.storage.saveData();
      if (window.CyberGamification) window.CyberGamification.addXP(100, 'Módulo completado');
    }
    const modal = document.getElementById('node-modal');
    if (modal) modal.classList.remove('active');
    this.render();
  }

  getMasteryLabel(level) {
    const labels = [
      'Nivel 0: Sin iniciar',
      'Nivel 1: Concepto básico',
      'Nivel 2: Comprendido',
      'Nivel 3: Aplicado',
      'Nivel 4: Avanzado',
      'Nivel 5: Dominio Total'
    ];
    return labels[level] || labels[0];
  }
}

window.CyberKnowledgeMap = new KnowledgeMapRenderer();
