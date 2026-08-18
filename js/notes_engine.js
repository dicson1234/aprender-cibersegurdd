/* CyberLab Notes Manager — safe text rendering */
class NotesEngine{
  constructor(){this.storage=window.CyberStorage;}
  esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  noteRewardKey(title,content){return `${title.trim().toLowerCase().slice(0,160)}::${content.trim().toLowerCase().slice(0,1000)}`;}
  render(){
    const notes=this.storage.data.notes||[],c=document.getElementById('notes-root');if(!c)return;c.innerHTML='';
    const h=document.createElement('div');h.className='card';h.style.marginBottom='20px';h.innerHTML=`<div class="card-header"><h3>Gestor de Apuntes Personales (${notes.length})</h3><button class="btn btn-primary" onclick="CyberNotes.openNewNoteModal()">+ Nueva Nota</button></div><div style="display:flex;gap:12px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-secondary" onclick="CyberNotes.filterNotes('all')">Todas</button><button class="btn btn-secondary" onclick="CyberNotes.filterNotes('notUnderstood')">⚠️ No entiendo (${notes.filter(n=>n.notUnderstood).length})</button></div>`;c.appendChild(h);
    const g=document.createElement('div');g.className='grid-cards';g.id='notes-grid';c.appendChild(g);this.renderNotesList(notes);
  }
  renderNotesList(list){const g=document.getElementById('notes-grid');if(!g)return;g.innerHTML='';list.forEach(n=>{const card=document.createElement('article');card.className='card';const id=this.esc(n.id);card.innerHTML=`<div class="card-header"><span class="tag ${n.notUnderstood?'red':'cyan'}">${n.notUnderstood?'⚠️ No Entendido':this.esc(n.area)}</span><button class="btn-icon" style="width:28px;height:28px" onclick="CyberNotes.deleteNote('${id}')">✕</button></div><h4>${this.esc(n.title)}</h4><p style="color:var(--text-muted);white-space:pre-line">${this.esc(n.content)}</p><div style="display:flex;gap:6px;flex-wrap:wrap">${(n.tags||[]).slice(0,10).map(t=>`<span class="tag purple">#${this.esc(t)}</span>`).join('')}</div>`;g.appendChild(card);});}
  filterNotes(f){const n=this.storage.data.notes||[];this.renderNotesList(f==='notUnderstood'?n.filter(x=>x.notUnderstood):n);}
  openNewNoteModal(){document.getElementById('note-modal')?.classList.add('active');}
  saveNewNote(){
    const titleEl=document.getElementById('note-title-input'),areaEl=document.getElementById('note-area-input'),tagsEl=document.getElementById('note-tags-input'),contentEl=document.getElementById('note-content-input'),nuEl=document.getElementById('note-not-understood-check');
    const title=titleEl?.value.trim().slice(0,120)||'',area=areaEl?.value.trim().slice(0,80)||'',tags=tagsEl?.value.trim()||'',content=contentEl?.value.trim().slice(0,5000)||'',nu=!!nuEl?.checked;
    if(!title||!content){alert('Ingresa título y contenido.');return;}
    const rewardKey=this.noteRewardKey(title,content);const rewardKeys=Array.isArray(this.storage.data.rewardedNoteKeys)?this.storage.data.rewardedNoteKeys:[];
    this.storage.data.notes.push({id:`note-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,title,area:area||'General',tags:tags?tags.split(',').map(t=>t.trim().slice(0,40)).filter(Boolean).slice(0,10):['Notas'],content,notUnderstood:nu,createdAt:new Date().toISOString()});
    this.storage.data.notes=this.storage.data.notes.slice(-200);
    const firstReward=!rewardKeys.includes(rewardKey);
    if(firstReward){rewardKeys.push(rewardKey);this.storage.data.rewardedNoteKeys=rewardKeys.slice(-200);}
    this.storage.saveData();
    if(firstReward)window.CyberGamification.addXP(10,'Nota guardada');
    else window.CyberGamification.showToast('Nota guardada · sin XP duplicada','cyan');
    document.getElementById('note-modal')?.classList.remove('active');
    ['note-title-input','note-area-input','note-tags-input','note-content-input'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
    if(nuEl)nuEl.checked=false;
    this.render();
  }
  deleteNote(id){if(confirm('¿Eliminar esta nota?')){this.storage.data.notes=this.storage.data.notes.filter(n=>n.id!==id);this.storage.saveData();this.render();}}
}
window.CyberNotes=new NotesEngine();
