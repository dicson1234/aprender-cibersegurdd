/* CyberLab Knowledge Map Interactive Visualizer */

class KnowledgeMapRenderer {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const data = this.storage.data;

    const container = document.getElementById('knowledge-map-root');
    if (!container) return;

    container.innerHTML = '';

    const stages = [
      { id: 0, name: 'ETAPA 0 — ALFABETIZACIÓN INFORMÁTICA & FUNDAMENTOS' },
      { id: 1, name: 'ETAPA 1 — SISTEMAS OPERATIVOS (LINUX + WINDOWS)' },
      { id: 2, name: 'ETAPA 2 — REDES & TELECOMUNICACIONES' },
      { id: 3, name: 'ETAPA 3 — INTERNET & PROTOCOLOS WEB' },
      { id: 4, name: 'ETAPA 4 — PROGRAMACIÓN ORIENTADA A CIBERSEGURIDAD' },
      { id: 7, name: 'ETAPA 7 — SEGURIDAD & HARDENING' },
      { id: 11, name: 'ETAPA 11 — SOC & LABORATORIOS' }
    ];

    stages.forEach(stage => {
      const stageModules = modules.filter(m => m.stage === stage.id);
      if (stageModules.length === 0) return;

      const stageBlock = document.createElement('div');
      stageBlock.className = 'knowledge-stage-block';

      let stageHtml = `<div class="stage-title">⚡ ${stage.name}</div>`;
      stageHtml += `<div class="node-grid">`;

      stageModules.forEach(mod => {
        // Check prerequisites
        const isLocked = mod.prerequisites.some(prereqId => !data.completedModules.includes(prereqId));

        // Calculate status
        let status = 'no-started';
        let statusLabel = '🔴 No iniciado';
        let statusClass = 'status-no-started';

        if (isLocked) {
          status = 'locked';
          statusLabel = '🔒 Bloqueado';
          statusClass = 'status-locked';
        } else if (data.completedModules.includes(mod.id)) {
          status = 'mastered';
          statusLabel = '🔵 Dominado';
          statusClass = 'status-mastered';
        } else {
          // Check if any concept is learned
          const hasConceptsLearned = mod.concepts.some(c => (data.masteryLevels[c.id] || 0) > 0);
          if (hasConceptsLearned) {
            status = 'in-progress';
            statusLabel = '🟡 En progreso';
            statusClass = 'status-in-progress';
          }
        }

        stageHtml += `
          <div class="map-node ${statusClass}" data-module-id="${mod.id}">
            <div class="node-header">
              <span style="font-size: 1.2rem;">${mod.icon}</span>
              <span class="tag ${status === 'mastered' ? 'cyan' : status === 'in-progress' ? 'yellow' : 'red'}">${statusLabel}</span>
            </div>
            <div class="node-title">${mod.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${mod.concepts ? mod.concepts.length : 0} conceptos · ${mod.estimatedTime}</div>
          </div>
        `;
      });

      stageHtml += `</div>`;
      stageBlock.innerHTML = stageHtml;
      container.appendChild(stageBlock);
    });

    // Attach click handlers to open node details modal
    container.querySelectorAll('.map-node').forEach(nodeEl => {
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

    const data = this.storage.data;
    const isCompleted = data.completedModules.includes(mod.id);

    let html = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="font-size: 2rem;">${mod.icon}</span>
        <div>
          <h2 style="font-size: 1.4rem;">${mod.title}</h2>
          <span class="tag cyan">${mod.category}</span>
        </div>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 20px;">${mod.description}</p>
      
      <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Conceptos incluidos en este módulo:</h3>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
    `;

    mod.concepts.forEach(c => {
      const currentMastery = data.masteryLevels[c.id] || 0;
      html += `
        <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="font-weight: 600; color: var(--accent-cyan);">${c.name}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${c.summary}</div>
          <div style="margin-top: 8px; font-size: 0.8rem; font-weight: 600;">
            Nivel de dominio actual: <span style="color: var(--accent-yellow);">${this.getMasteryLabel(currentMastery)}</span>
          </div>
        </div>
      `;
    });

    html += `
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="document.getElementById('node-modal').classList.remove('active')">Cerrar</button>
        <button class="btn btn-primary" onclick="window.CyberKnowledgeMap.markModuleComplete('${mod.id}')">
          ${isCompleted ? '✓ Módulo Completado' : 'Marcar Módulo como Completado (+100 XP)'}
        </button>
      </div>
    `;

    modalContent.innerHTML = html;
    modal.classList.add('active');
  }

  markModuleComplete(modId) {
    const data = this.storage.data;
    if (!data.completedModules.includes(modId)) {
      data.completedModules.push(modId);
      this.storage.saveData();
      window.CyberGamification.addXP(100, 'Módulo completado');
    }
    document.getElementById('node-modal').classList.remove('active');
    this.render();
  }

  getMasteryLabel(level) {
    const labels = [
      'Nivel 0: Nunca he visto este concepto',
      'Nivel 1: Reconozco el concepto',
      'Nivel 2: Puedo explicarlo con mis propias palabras',
      'Nivel 3: Puedo utilizarlo',
      'Nivel 4: Puedo analizar problemas relacionados',
      'Nivel 5: Puedo aplicarlo en escenarios complejos',
      'Nivel 6: Puedo enseñárselo a otra persona'
    ];
    return labels[level] || labels[0];
  }
}

window.CyberKnowledgeMap = new KnowledgeMapRenderer();
