/* CyberLab Notes Manager Engine ("Mis Apuntes" & "Lo que todavía no entiendo") */

class NotesEngine {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const notes = this.storage.data.notes || [];
    const container = document.getElementById('notes-root');
    if (!container) return;

    container.innerHTML = '';

    const headerCard = document.createElement('div');
    headerCard.className = 'card';
    headerCard.style.marginBottom = '20px';
    headerCard.innerHTML = `
      <div class="card-header">
        <h3 style="font-size: 1.2rem; font-weight: 700;">Gestor de Apuntes Personales (${notes.length} notas)</h3>
        <button class="btn btn-primary" onclick="window.CyberNotes.openNewNoteModal()">+ Nueva Nota (+10 XP)</button>
      </div>
      <div style="display: flex; gap: 12px; margin-top: 14px;">
        <button class="btn btn-secondary" onclick="window.CyberNotes.filterNotes('all')">Todas las Notas</button>
        <button class="btn btn-secondary" onclick="window.CyberNotes.filterNotes('notUnderstood')">⚠️ Lo que todavía no entiendo (${notes.filter(n => n.notUnderstood).length})</button>
      </div>
    `;
    container.appendChild(headerCard);

    const grid = document.createElement('div');
    grid.className = 'grid-cards';
    grid.id = 'notes-grid';
    container.appendChild(grid);

    this.renderNotesList(notes);
  }

  renderNotesList(notesList) {
    const grid = document.getElementById('notes-grid');
    if (!grid) return;

    grid.innerHTML = '';

    notesList.forEach(n => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-header">
          <span class="tag ${n.notUnderstood ? 'red' : 'cyan'}">${n.notUnderstood ? '⚠️ No Entendido' : n.area}</span>
          <button class="btn-icon" style="width: 28px; height: 28px;" onclick="window.CyberNotes.deleteNote('${n.id}')">✕</button>
        </div>
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">${n.title}</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 14px; white-space: pre-line;">${n.content}</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${(n.tags || []).map(t => `<span class="tag purple">#${t}</span>`).join('')}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  filterNotes(filter) {
    const notes = this.storage.data.notes || [];
    if (filter === 'notUnderstood') {
      this.renderNotesList(notes.filter(n => n.notUnderstood));
    } else {
      this.renderNotesList(notes);
    }
  }

  openNewNoteModal() {
    const modal = document.getElementById('note-modal');
    if (modal) modal.classList.add('active');
  }

  saveNewNote() {
    const title = document.getElementById('note-title-input').value.trim();
    const area = document.getElementById('note-area-input').value.trim();
    const tagsStr = document.getElementById('note-tags-input').value.trim();
    const content = document.getElementById('note-content-input').value.trim();
    const notUnderstood = document.getElementById('note-not-understood-check').checked;

    if (!title || !content) {
      alert('Por favor ingresa un título y contenido para la nota.');
      return;
    }

    const newNote = {
      id: `note-${Date.now()}`,
      title,
      area: area || 'General',
      tags: tagsStr ? tagsStr.split(',').map(t => t.trim()) : ['Notas'],
      content,
      notUnderstood,
      createdAt: new Date().toISOString()
    };

    this.storage.data.notes.push(newNote);
    this.storage.saveData();

    window.CyberGamification.addXP(10, 'Nota guardada');
    document.getElementById('note-modal').classList.remove('active');

    // Clear inputs
    document.getElementById('note-title-input').value = '';
    document.getElementById('note-content-input').value = '';

    this.render();
  }

  deleteNote(noteId) {
    if (confirm('¿Eliminar esta nota?')) {
      const data = this.storage.data;
      data.notes = data.notes.filter(n => n.id !== noteId);
      this.storage.saveData();
      this.render();
    }
  }
}

window.CyberNotes = new NotesEngine();
