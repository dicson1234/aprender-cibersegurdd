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
  renderNotesList(list){
    const g=document.getElementById('notes-grid');if(!g)return;g.innerHTML='';
    if(list.length===0){
      g.innerHTML='<div class="card" style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted)">No hay notas guardadas aún. Haz clic en "+ Nueva Nota" para tomar tus primeros apuntes.</div>';
      return;
    }
    list.forEach(n=>{
      const card=document.createElement('article');
      card.className='card note-compact-card';
      card.style.cssText='padding:12px 14px; border-radius:14px; border:1px solid rgba(0,240,255,0.18); background:rgba(15,22,32,0.85);';
      const id=this.esc(n.id);
      const title=this.esc(n.title);
      const contentSnippet=this.esc(n.content.slice(0,100));
      card.innerHTML=`
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span class="tag ${n.notUnderstood?'red':'cyan'}" style="font-size:0.68rem;">${n.notUnderstood?'⚠️ No Entendido':this.esc(n.area)}</span>
          <button class="btn-icon" style="width:24px;height:24px;font-size:0.75rem;" onclick="CyberNotes.deleteNote('${id}')">✕</button>
        </div>
        <h4 style="font-size:0.92rem;font-weight:700;color:#fff;margin-bottom:4px;">${title}</h4>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${contentSnippet}...</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <div style="display:flex;gap:4px;flex-wrap:wrap">${(n.tags||[]).slice(0,2).map(t=>`<span class="tag purple" style="font-size:0.65rem;">#${this.esc(t)}</span>`).join('')}</div>
          <button class="btn btn-secondary btn-sm" style="font-size:0.72rem;padding:4px 8px;" onclick="CyberNotes.openReader('${id}')">👁️ Leer</button>
        </div>
      `;
      g.appendChild(card);
    });
  }

  openReader(id){
    const notes=this.storage.data.notes||[];
    const note=notes.find(n=>n.id===id);
    if(!note)return;
    let modal=document.getElementById('note-reader-modal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='note-reader-modal';
      modal.className='modal-overlay';
      modal.innerHTML='<div class="modal-card"><button class="modal-close" onclick="document.getElementById(\'note-reader-modal\').classList.remove(\'active\')">✕</button><div id="note-reader-content"></div></div>';
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#note-reader-content');
    content.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span class="tag ${note.notUnderstood?'red':'cyan'}">${note.notUnderstood?'⚠️ No Entendido':this.esc(note.area)}</span>
        <span style="font-size:0.75rem;color:var(--text-muted);">${new Date(note.createdAt).toLocaleDateString()}</span>
      </div>
      <h2 style="font-size:1.2rem;color:#fff;margin-bottom:12px;">${this.esc(note.title)}</h2>
      <div style="font-size:0.88rem;color:var(--text-main);line-height:1.5;white-space:pre-line;margin-bottom:16px;background:rgba(8,12,18,0.8);padding:14px;border-radius:12px;border:1px solid rgba(0,240,255,0.14);">
        ${this.esc(note.content)}
      </div>
      <div style="display:flex;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="document.getElementById('note-reader-modal').classList.remove('active')">Cerrar</button>
      </div>
    `;
    modal.classList.add('active');
  }
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
