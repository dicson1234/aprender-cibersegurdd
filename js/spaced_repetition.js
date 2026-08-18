/* CyberLab Spaced Repetition — 1/3/7/14/30 day schedule */
class SpacedRepetitionEngine {
  constructor(){this.storage=window.CyberStorage;}
  render(){
    const mistakes=(this.storage.data.mistakes||[]).filter(m=>m.reviewDueDate);
    const container=document.getElementById('spaced-repetition-root');if(!container)return;
    container.innerHTML='';
    const due=mistakes.filter(m=>Date.parse(m.reviewDueDate)<=Date.now());
    const card=document.createElement('div');card.className='card';card.style.marginBottom='20px';
    card.innerHTML=`<div class="card-header"><h3>🧠 Repaso inteligente</h3><span class="tag yellow">1 · 3 · 7 · 14 · 30 días</span></div><p style="color:var(--text-muted)">${due.length} repaso(s) pendientes de ${mistakes.length} errores registrados.</p>`;container.appendChild(card);
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    due.forEach((m,idx)=>{
      const el=document.createElement('div');el.className='card';el.style.marginBottom='16px';
      const id=String(m.id??'').replace(/[^a-zA-Z0-9_-]/g,'');
      el.innerHTML=`<div class="card-header"><span class="tag red">Repaso #${idx+1}</span><span class="tag purple">Etapa ${(m.reviewStage||1)}/5</span></div><h4>${esc(m.question)}</h4><p style="color:var(--text-muted)"><b>Tu respuesta:</b> ${esc(m.wrongAnswer)}</p><p><b>Correcta:</b> ${esc(m.correctAnswer)}</p><div class="card" style="background:var(--bg-surface)"><b>💡</b> ${esc(m.explanation)}</div><div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap"><button class="btn btn-secondary" onclick="window.CyberSpaced.removeMistake('${id}')">Eliminar</button><button class="btn btn-primary" onclick="window.CyberSpaced.advanceReview('${id}',true)">✓ La dominé</button><button class="btn btn-secondary" onclick="window.CyberSpaced.advanceReview('${id}',false)">↻ Necesito más práctica</button></div>`;
      container.appendChild(el);
    });
    if(!due.length){const empty=document.createElement('div');empty.className='card';empty.innerHTML='<h3>🎉 No tienes repasos pendientes.</h3><p style="color:var(--text-muted)">Vuelve cuando llegue la siguiente fecha programada.</p>';container.appendChild(empty);}
  }
  advanceReview(id,mastered){
    const data=this.storage.data,m=data.mistakes.find(x=>x.id===id);if(!m)return;
    const intervals=window.CyberLabReviewIntervals||[1,3,7,14,30],max=intervals.length;
    m.reviewRewardedStages=Array.isArray(m.reviewRewardedStages)?m.reviewRewardedStages:[];
    const currentStage=Math.max(1,Math.min(max,m.reviewStage||1));
    if(mastered){
      if(!m.reviewRewardedStages.includes(currentStage)){
        m.reviewRewardedStages.push(currentStage);
        window.CyberGamification.addXP(10,'Repaso correcto',`spaced:${m.id}:stage:${currentStage}`);
      }
      m.reviewStage=currentStage+1;
    }else m.reviewStage=1;
    if(m.reviewStage>max){
      data.mistakes=data.mistakes.filter(x=>x.id!==id);
      window.CyberGamification.addXP(30,'Repaso dominado',`spaced:${m.id}:complete`);
    }else{
      const days=intervals[m.reviewStage-1];
      m.reviewDueDate=new Date(Date.now()+days*86400000).toISOString();
    }
    this.storage.saveData();this.render();
  }
  removeMistake(id){this.storage.data.mistakes=this.storage.data.mistakes.filter(m=>m.id!==id);this.storage.saveData();this.render();}
}
window.CyberSpaced=new SpacedRepetitionEngine();
