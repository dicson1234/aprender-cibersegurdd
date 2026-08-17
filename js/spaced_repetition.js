/* CyberLab Spaced Repetition Engine ("Errores que cometí") */

class SpacedRepetitionEngine {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const mistakes = this.storage.data.mistakes || [];
    const container = document.getElementById('spaced-repetition-root');
    if (!container) return;

    container.innerHTML = '';

    if (mistakes.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 8px;">¡No tienes errores pendientes de repasar!</h3>
          <p style="color: var(--text-muted);">Cuando cometas un error en un cuestionario o examen, la plataforma lo guardará automáticamente aquí para programar tu repaso espaciado.</p>
        </div>
      `;
      return;
    }

    const titleCard = document.createElement('div');
    titleCard.className = 'card';
    titleCard.style.marginBottom = '20px';
    titleCard.innerHTML = `
      <div class="card-header">
        <h3 style="font-size: 1.2rem; font-weight: 700;">Base de Conocimiento de Errores (${mistakes.length} registrados)</h3>
        <span class="tag yellow">Sistema de Repetición Espaciada</span>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Revisar tus errores de forma espaciada (Día 1, 3, 7, 14, 30) garantiza la fijación del conocimiento a largo plazo.</p>
    `;
    container.appendChild(titleCard);

    mistakes.forEach((m, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '16px';
      card.innerHTML = `
        <div class="card-header">
          <span class="tag red">Error #${idx + 1}</span>
          <span class="tag purple">Repaso Etapa ${m.reviewStage || 1}</span>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 600; margin-bottom: 12px;">${m.question}</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div style="background: rgba(255, 123, 114, 0.1); border: 1px solid rgba(255, 123, 114, 0.3); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <strong style="color: var(--accent-red);">❌ Tu Respuesta Fallada:</strong> ${m.wrongAnswer}
          </div>
          <div style="background: rgba(57, 211, 83, 0.1); border: 1px solid rgba(57, 211, 83, 0.3); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem;">
            <strong style="color: var(--accent-green);">✓ Respuesta Correcta:</strong> ${m.correctAnswer}
          </div>
        </div>

        <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.9rem; margin-bottom: 14px;">
          <strong style="color: var(--accent-cyan);">💡 Explicación del Concepto:</strong> ${m.explanation}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary" onclick="window.CyberSpaced.removeMistake('${m.id}')">Eliminar de la lista</button>
          <button class="btn btn-primary" onclick="window.CyberSpaced.advanceReview('${m.id}')">✓ Marcar Concepto Dominado (+30 XP)</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  advanceReview(mistakeId) {
    const data = this.storage.data;
    const index = data.mistakes.findIndex(m => m.id === mistakeId);
    if (index !== -1) {
      data.mistakes.splice(index, 1);
      this.storage.saveData();
      window.CyberGamification.addXP(30, 'Error repasado y dominado');
      this.render();
    }
  }

  removeMistake(mistakeId) {
    const data = this.storage.data;
    data.mistakes = data.mistakes.filter(m => m.id !== mistakeId);
    this.storage.saveData();
    this.render();
  }
}

window.CyberSpaced = new SpacedRepetitionEngine();
