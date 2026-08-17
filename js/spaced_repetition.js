/* CyberLab Spaced Repetition — 1/3/7/14/30 day schedule */
class SpacedRepetitionEngine {
  constructor() { this.storage = window.CyberStorage; }
  render() {
    const mistakes = (this.storage.data.mistakes || []).filter(m => m.reviewDueDate);
    const container = document.getElementById('spaced-repetition-root'); if (!container) return;
    container.innerHTML = '';
    const due = mistakes.filter(m => Date.parse(m.reviewDueDate) <= Date.now());
    const card = document.createElement('div'); card.className = 'card'; card.style.marginBottom = '20px';
    card.innerHTML = `<div class="card-header"><h3>🧠 Repaso inteligente</h3><span class="tag yellow">1 · 3 · 7 · 14 · 30 días</span></div><p style="color:var(--text-muted)">${due.length} repaso(s) pendientes de ${mistakes.length} errores registrados.</p>`;
    container.appendChild(card);
    due.forEach((m, idx) => {
      const el = document.createElement('div'); el.className = 'card'; el.style.marginBottom = '16px';
      const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      el.innerHTML = `<div class="card-header"><span class="tag red">Repaso #${idx+1}</span><span class="tag purple">Etapa ${(m.reviewStage||1)}/5</span></div><h4>${esc(m.question)}</h4><p style="color:var(--text-muted)"><b>Tu respuesta:</b> ${esc(m.wrongAnswer)}</p><p><b>Correcta:</b> ${esc(m.correctAnswer)}</p><div class="card" style="background:var(--bg-surface)"><b>💡</b> ${esc(m.explanation)}</div><div style="display:flex;gap:10px;justify-content:flex-end"><button class="btn btn-secondary" onclick="window.CyberSpaced.removeMistake('${m.id}')">Eliminar</button><button class="btn btn-primary" onclick="window.CyberSpaced.advanceReview('${m.id}',true)">✓ La dominé</button><button class="btn btn-secondary" onclick="window.CyberSpaced.advanceReview('${m.id}',false)">↻ Necesito más práctica</button></div>`;
      container.appendChild(el);
    });
    if (!due.length) { const empty=document.createElement('div'); empty.className='card'; empty.innerHTML='<h3>🎉 No tienes repasos pendientes.</h3><p style="color:var(--text-muted)">Vuelve cuando llegue la siguiente fecha programada.</p>'; container.appendChild(empty); }
  }
  advanceReview(id, mastered) {
    const data=this.storage.data, m=data.mistakes.find(x=>x.id===id); if(!m) return;
    const max=(window.CyberLabReviewIntervals||[1,3,7,14,30]).length;
    m.reviewStage=Math.max(1, mastered ? (m.reviewStage||1)+1 : 1);
    if(m.reviewStage>max){ data.mistakes=data.mistakes.filter(x=>x.id!==id); window.CyberGamification.addXP(30,'Repaso dominado'); }
    else { const days=(window.CyberLabReviewIntervals||[1,3,7,14,30])[m.reviewStage-1]; m.reviewDueDate=new Date(Date.now()+days*86400000).toISOString(); if(mastered) window.CyberGamification.addXP(10,'Repaso correcto'); }
    this.storage.saveData(); this.render();
  }
  removeMistake(id){ this.storage.data.mistakes=this.storage.data.mistakes.filter(m=>m.id!==id); this.storage.saveData(); this.render(); }
}
window.CyberSpaced=new SpacedRepetitionEngine();
