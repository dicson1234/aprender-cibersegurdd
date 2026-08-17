/* CyberLab Learning Tree & Lesson Reader Component */

class LearningTreeRenderer {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const container = document.getElementById('learning-tree-root');
    if (!container) return;

    container.innerHTML = '';

    modules.forEach((mod, index) => {
      const accordion = document.createElement('div');
      accordion.className = 'tree-accordion-item';

      let conceptsHtml = '';
      mod.concepts.forEach(c => {
        const currentMastery = this.storage.data.masteryLevels[c.id] || 0;

        conceptsHtml += `
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
            <h4 style="font-size: 1.2rem; color: var(--accent-cyan); margin-bottom: 8px;">${c.name}</h4>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">${c.summary}</p>
            
            <div style="margin-bottom: 16px;">
              <strong style="color: var(--accent-purple);">📘 TEORÍA:</strong>
              <div style="white-space: pre-line; margin-top: 6px; font-size: 0.95rem;">${c.theory}</div>
            </div>

            <div style="margin-bottom: 16px; background: var(--bg-surface); padding: 12px; border-left: 3px solid var(--accent-yellow); border-radius: var(--radius-sm);">
              <strong style="color: var(--accent-yellow);">💡 EJEMPLO:</strong>
              <div style="margin-top: 4px; font-size: 0.9rem;">${c.example}</div>
            </div>

            <div style="margin-bottom: 16px; background: var(--bg-surface); padding: 12px; border-left: 3px solid var(--accent-cyan); border-radius: var(--radius-sm);">
              <strong style="color: var(--accent-cyan);">🧪 PRÁCTICA:</strong>
              <div style="margin-top: 4px; font-size: 0.9rem;">${c.practice}</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div style="background: rgba(57, 211, 83, 0.1); border: 1px solid rgba(57, 211, 83, 0.3); padding: 12px; border-radius: var(--radius-sm);">
                <strong style="color: var(--accent-green);">🛡️ CÓMO DEFENDER:</strong>
                <div style="font-size: 0.85rem; margin-top: 4px;">${c.defense}</div>
              </div>
              <div style="background: rgba(163, 113, 247, 0.1); border: 1px solid rgba(163, 113, 247, 0.3); padding: 12px; border-radius: var(--radius-sm);">
                <strong style="color: var(--accent-purple);">🔍 CÓMO DETECTAR:</strong>
                <div style="font-size: 0.85rem; margin-top: 4px;">${c.detection}</div>
              </div>
            </div>

            ${c.resources ? `
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px dashed var(--border-color); margin-bottom: 24px;">
              <h5 style="font-size: 1rem; margin-bottom: 12px; color: var(--accent-cyan);">📚 Recursos Externos Sugeridos</h5>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${(c.resources.readings || []).map(r => `
                  <a href="${r.url}" target="_blank" class="resource-link" style="display: flex; align-items: center; gap: 8px; color: var(--text-main); text-decoration: none; padding: 10px 14px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-color); transition: all var(--transition-fast);">
                    <span style="font-size: 1.2rem;">📄</span>
                    <span style="flex: 1; font-weight: 500;">${r.title}</span>
                    <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 600;">[Leer] ↗</span>
                  </a>
                `).join('')}
                ${(c.resources.videos || []).map(v => `
                  <a href="${v.url}" target="_blank" class="resource-link" style="display: flex; align-items: center; gap: 8px; color: var(--text-main); text-decoration: none; padding: 10px 14px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-color); transition: all var(--transition-fast);">
                    <span style="font-size: 1.2rem;">🎥</span>
                    <span style="flex: 1; font-weight: 500;">${v.title}</span>
                    <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 600;">[Ver] ↗</span>
                  </a>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Nivel de Dominio (0 a 6) -->
            <div class="mastery-scale-container">
              <div class="mastery-scale-title">REGISTRAR TU NIVEL DE DOMINIO (0 a 6):</div>
              <div class="mastery-options">
                ${[0,1,2,3,4,5,6].map(lvl => `
                  <button class="mastery-btn ${currentMastery === lvl ? 'selected' : ''}" 
                          onclick="window.CyberLearningTree.setMastery('${c.id}', ${lvl})">
                    Nivel ${lvl}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Ciclo Práctico Banner -->
            <div style="margin-top: 24px; padding: 16px; background: rgba(180, 154, 99, 0.1); border: 1px solid var(--accent-yellow); border-radius: var(--radius-md); text-align: center;">
              <strong style="color: var(--accent-yellow); display: block; margin-bottom: 8px; font-size: 1.05rem;">🔥 Siguiente Paso: ¡Cierra el Ciclo Práctico!</strong>
              <div style="font-size: 0.9rem; color: var(--text-main);">
                Dirígete a las pestañas de <strong>Quizzes</strong> y <strong>Laboratorios</strong> de la plataforma para poner a prueba y asentar este conocimiento.
              </div>
            </div>
          </div>
        `;
      });

      accordion.innerHTML = `
        <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('open')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.3rem;">${mod.icon}</span>
            <div>
              <div style="font-weight: 700; font-size: 1.05rem;">${mod.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${mod.category} · ${mod.estimatedTime}</div>
            </div>
          </div>
          <span style="font-size: 1.2rem; color: var(--text-muted);">▼</span>
        </div>
        <div class="accordion-content ${index === 0 ? 'open' : ''}">
          ${conceptsHtml}
        </div>
      `;

      container.appendChild(accordion);
    });
  }

  setMastery(conceptId, level) {
    const data = this.storage.data;
    const oldLevel = data.masteryLevels[conceptId] || 0;
    data.masteryLevels[conceptId] = level;
    this.storage.saveData();

    if (level > oldLevel) {
      window.CyberGamification.addXP((level - oldLevel) * 15, `Nivel de dominio actualizado a ${level}`);
    }

    this.render();
  }
}

window.CyberLearningTree = new LearningTreeRenderer();
