/* CyberLab Resource Library — one-time XP + safe DOM rendering */
class ResourcesEngine {
  constructor(){this.storage=window.CyberStorage;}
  esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  render(){
    const resources=window.CyberData?.resources||[], c=document.getElementById('resources-root'); if(!c)return;
    c.innerHTML=''; const h=document.createElement('div'); h.className='card'; h.style.marginBottom='20px';
    h.innerHTML=`<div class="card-header"><h3>Biblioteca Curada de Recursos (${resources.length})</h3><span class="tag green">🇪🇸 Prioridad en Español</span></div><p style="color:var(--text-muted)">Recursos organizados por nivel, tipo e idioma. La XP se obtiene una sola vez por recurso.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-secondary" onclick="CyberResources.filterByLang('all')">Todos</button><button class="btn btn-secondary" onclick="CyberResources.filterByLang('es')">🇪🇸 Español</button><button class="btn btn-secondary" onclick="CyberResources.filterByLang('us')">🇺🇸 Inglés</button></div>`; c.appendChild(h);
    const grid=document.createElement('div'); grid.className='grid-cards'; grid.id='resources-grid'; c.appendChild(grid); this.renderResourcesList(resources);
  }
  renderResourcesList(list){
    const grid=document.getElementById('resources-grid');if(!grid)return;grid.innerHTML='';
    if(list.length===0){
      grid.innerHTML='<div class="card" style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted)">No hay recursos disponibles para este filtro.</div>';
      return;
    }
    list.forEach(r=>{
      const card=document.createElement('div');
      card.className='card resource-compact-card';
      card.style.cssText='padding:12px 14px; border-radius:14px; border:1px solid rgba(0,240,255,0.18); background:rgba(15,22,32,0.85);';
      const title=this.esc(r.title),desc=this.esc(r.description),lang=r.language==='es'?'🇪🇸 Español':'🇺🇸 Inglés',type=this.esc(r.type),level=this.esc(r.level),duration=this.esc(r.duration),url=String(r.url||'');
      if(!/^https?:\/\//i.test(url))return;
      const id=String(r.id||r.url); const viewed=this.storage.data.viewedResources.includes(id);
      card.innerHTML=`
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span class="tag ${r.language==='es'?'green':'purple'}" style="font-size:0.68rem;">${lang}</span>
          <span class="tag cyan" style="font-size:0.68rem;">${type}</span>
        </div>
        <h4 style="font-size:0.92rem;font-weight:700;color:#fff;margin-bottom:4px;">${title}</h4>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${desc}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <span style="font-size:0.72rem;color:var(--text-muted);">⏱️ ${duration} · ${level}</span>
          <a href="${this.esc(url)}" target="_blank" rel="noopener noreferrer" class="btn ${viewed?'btn-secondary':'btn-primary'} btn-sm" style="font-size:0.75rem;padding:4px 10px;text-decoration:none;" onclick="CyberResources.markViewed('${this.esc(id)}')">
            ${viewed?'↗ Reabrir':'🔗 Abrir'}
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  markViewed(id){if(this.storage.data.viewedResources.includes(id))return;this.storage.data.viewedResources.push(id);this.storage.saveData();window.CyberGamification.addXP(10,'Primer recurso estudiado');}
  filterByLang(lang){const r=window.CyberData?.resources||[];this.renderResourcesList(lang==='all'?r:r.filter(x=>x.language===lang));}
}
window.CyberResources=new ResourcesEngine();
