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
  renderResourcesList(list){const grid=document.getElementById('resources-grid');if(!grid)return;grid.innerHTML='';list.forEach(r=>{
    const card=document.createElement('div');card.className='card';const title=this.esc(r.title),desc=this.esc(r.description),lang=r.language==='es'?'🇪🇸 Español':'🇺🇸 Inglés',type=this.esc(r.type),level=this.esc(r.level),duration=this.esc(r.duration),url=String(r.url||'');
    if(!/^https?:\/\//i.test(url))return;
    const id=String(r.id||r.url); const viewed=this.storage.data.viewedResources.includes(id);
    card.innerHTML=`<div class="card-header"><span class="tag ${r.language==='es'?'green':'purple'}">${lang}</span><span class="tag cyan">${type}</span></div><h4>${title}</h4><p style="color:var(--text-muted)">${desc}</p><div style="display:flex;justify-content:space-between;font-size:.8rem"><span>Nivel: ${level}</span><span>⏱️ ${duration}</span></div><a href="${this.esc(url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width:100%;margin-top:12px;text-decoration:none;justify-content:center" onclick="CyberResources.markViewed('${this.esc(id)}')">${viewed?'↗ Abrir de nuevo':'🔗 Abrir recurso'}</a>`;grid.appendChild(card);
  });}
  markViewed(id){if(this.storage.data.viewedResources.includes(id))return;this.storage.data.viewedResources.push(id);this.storage.saveData();window.CyberGamification.addXP(10,'Primer recurso estudiado');}
  filterByLang(lang){const r=window.CyberData?.resources||[];this.renderResourcesList(lang==='all'?r:r.filter(x=>x.language===lang));}
}
window.CyberResources=new ResourcesEngine();
