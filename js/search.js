/* CyberLab Global Instant Search Engine */

class GlobalSearchEngine {
  constructor() {
    this.init();
  }

  init() {
    const trigger = document.getElementById('search-trigger-btn');
    const modal = document.getElementById('search-modal');
    const closeBtn = document.getElementById('search-modal-close');
    const input = document.getElementById('global-search-input');

    if (trigger && modal) {
      trigger.addEventListener('click', () => {
        modal.classList.add('active');
        if (input) input.focus();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        this.performSearch(e.target.value.trim());
      });
    }
  }

  performSearch(query) {
    const resultsContainer = document.getElementById('search-results-container');
    if (!resultsContainer) return;

    if (!query || query.length < 2) {
      resultsContainer.innerHTML = `<div style="color: var(--text-muted); padding: 20px; text-align: center;">Escribe al menos 2 caracteres para buscar...</div>`;
      return;
    }

    const q = query.toLowerCase();
    const modules = window.CyberData ? window.CyberData.modules || [] : [];
    const glossary = window.CyberData ? window.CyberData.glossary || [] : [];
    const tools = window.CyberData ? window.CyberData.tools || [] : [];
    const resources = window.CyberData ? window.CyberData.resources || [] : [];
    const labs = window.CyberData ? window.CyberData.labs || [] : [];

    let results = [];

    // Match Modules & Concepts
    modules.forEach(m => {
      if (m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) {
        results.push({ type: 'Módulo', title: m.title, snippet: m.description, hash: '#tree' });
      }
      if (m.concepts) {
        m.concepts.forEach(c => {
          if (c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)) {
            results.push({ type: 'Concepto', title: c.name, snippet: c.summary, hash: '#tree' });
          }
        });
      }
    });

    // Match Glossary
    glossary.forEach(g => {
      if (g.term.toLowerCase().includes(q) || g.simpleDef.toLowerCase().includes(q)) {
        results.push({ type: 'Glosario', title: g.term, snippet: g.simpleDef, hash: '#glossary' });
      }
    });

    // Match Tools
    tools.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
        results.push({ type: 'Herramienta', title: t.name, snippet: t.description, hash: '#tools' });
      }
    });

    // Match Resources
    resources.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)) {
        results.push({ type: 'Recurso', title: r.title, snippet: r.description, hash: '#resources' });
      }
    });

    // Match Labs
    labs.forEach(l => {
      if (l.title.toLowerCase().includes(q) || l.objective.toLowerCase().includes(q)) {
        results.push({ type: 'Laboratorio', title: `${l.number}: ${l.title}`, snippet: l.objective, hash: '#labs' });
      }
    });

    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    if (results.length === 0) {
      resultsContainer.innerHTML = `<div style="color: var(--text-muted); padding: 20px; text-align: center;">No se encontraron resultados para "${esc(query)}".</div>`;
      return;
    }

    let html = '';
    results.slice(0, 15).forEach(res => {
      html += `
        <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 10px; cursor: pointer;"
             onclick="window.location.hash='${esc(res.hash)}'; document.getElementById('search-modal').classList.remove('active');">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; color: var(--accent-cyan); font-size: 0.95rem;">${esc(res.title)}</span>
            <span class="tag purple" style="font-size: 0.7rem;">${esc(res.type)}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${esc(res.snippet)}</div>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;
  }
}

window.CyberSearch = new GlobalSearchEngine();
