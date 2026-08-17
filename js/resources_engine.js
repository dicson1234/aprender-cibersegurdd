/* CyberLab Resource Library Engine (Spanish prioritized) */

class ResourcesEngine {
  constructor() {
    this.storage = window.CyberStorage;
  }

  render() {
    const resources = window.CyberData ? window.CyberData.resources || [] : [];
    const container = document.getElementById('resources-root');
    if (!container) return;

    container.innerHTML = '';

    const headerCard = document.createElement('div');
    headerCard.className = 'card';
    headerCard.style.marginBottom = '20px';
    headerCard.innerHTML = `
      <div class="card-header">
        <h3 style="font-size: 1.2rem; font-weight: 700;">Biblioteca Curada de Recursos (${resources.length} recursos disponibles)</h3>
        <span class="tag green">🇪🇸 Prioridad en Español</span>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Recursos educativos externos verificados, organizados por nivel, tipo e idioma.</p>
      <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="window.CyberResources.filterByLang('all')">Todos</button>
        <button class="btn btn-secondary" onclick="window.CyberResources.filterByLang('es')">🇪🇸 Español</button>
        <button class="btn btn-secondary" onclick="window.CyberResources.filterByLang('us')">🇺🇸 Inglés</button>
      </div>
    `;
    container.appendChild(headerCard);

    const grid = document.createElement('div');
    grid.className = 'grid-cards';
    grid.id = 'resources-grid';
    container.appendChild(grid);

    this.renderResourcesList(resources);
  }

  renderResourcesList(resList) {
    const grid = document.getElementById('resources-grid');
    if (!grid) return;

    grid.innerHTML = '';

    resList.forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-header">
          <span class="tag ${r.language === 'es' ? 'green' : 'purple'}">${r.language === 'es' ? '🇪🇸 Español' : '🇺🇸 Inglés'}</span>
          <span class="tag cyan">${r.type}</span>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">${r.title}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px; height: 50px; overflow: hidden;">${r.description}</p>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; font-size: 0.8rem; color: var(--text-dim);">
          <span>Nivel: ${r.level}</span>
          <span>⏱️ ${r.duration}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1; text-align: center; text-decoration: none;" onclick="window.CyberGamification.addXP(10, 'Recurso visto')">
            🔗 Abrir Recurso
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  filterByLang(lang) {
    const resources = window.CyberData ? window.CyberData.resources || [] : [];
    if (lang === 'all') {
      this.renderResourcesList(resources);
    } else {
      this.renderResourcesList(resources.filter(r => r.language === lang));
    }
  }
}

window.CyberResources = new ResourcesEngine();
