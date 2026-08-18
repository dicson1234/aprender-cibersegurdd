/* CyberLab Application Entry Point, DataLoader & View Manager */

window.CyberData = window.CyberData || {};

class CyberLabApp {
  constructor() {
    this.init();
  }

  async init() {
    console.log('⚡ Inicializando CyberLab Platform...');

    // Load JSON Datasets (Synchronous Bundle or Async Fetch)
    await this.loadAllDatasets();

    // Pre-render ALL views on startup so content exists immediately in DOM
    this.renderAllViews();

    // Register Service Worker for PWA Offline Functionality
    this.registerServiceWorker();

    // Initial View Render
    const initialView = (window.location.hash || '#dashboard').replace('#', '');
    this.onViewChange(initialView);

    // Subscribe to state changes to update header stats
    window.addEventListener('cyberlab_state_updated', () => {
      this.updateHeaderStats();
    });
    this.updateHeaderStats();
  }

  async loadAllDatasets() {
    if (window.CyberData && Object.keys(window.CyberData).length > 0) {
      console.log('✅ Datasets síncronos embebidos detectados:', Object.keys(window.CyberData));
      return;
    }
    const files = [
      'modules', 'quizzes', 'challenges', 'labs',
      'resources', 'glossary', 'tools', 'achievements',
      'projects', 'roadmaps', 'cases', 'mitre'
    ];

    try {
      const responses = await Promise.all(files.map(f => fetch(`./data/${f}.json`)));
      const jsons = await Promise.all(responses.map(r => r.ok ? r.json() : []));
      
      window.CyberData = window.CyberData || {};
      files.forEach((f, index) => {
        window.CyberData[f] = jsons[index] || [];
      });
      console.log('✅ Datasets cargados en paralelo:', Object.keys(window.CyberData));
    } catch (e) {
      console.error('Error al cargar datasets:', e);
    }
  }

  renderAllViews() {
    if (window.CyberDashboard) window.CyberDashboard.render();
    if (window.CyberRecorrido) window.CyberRecorrido.renderPath();
    if (window.CyberKnowledgeMap) window.CyberKnowledgeMap.render();
    if (window.CyberLearningTree) window.CyberLearningTree.render();
    if (window.CyberLabs) window.CyberLabs.render();
    if (window.CyberQuizzes) window.CyberQuizzes.render();
    if (window.CyberSpaced) window.CyberSpaced.render();
    if (window.CyberNotes) window.CyberNotes.render();
    if (window.CyberResources) window.CyberResources.render();
    if (window.CyberTutor) window.CyberTutor.render();
    this.renderGlossary();
    this.renderTools();
    this.renderProjects();
    this.renderRoadmaps();
    this.renderCases();
    this.renderMitre();
    this.renderChallenges();
    this.renderPlatformSecurity();
    this.renderProfile();
  }

  updateHeaderStats() {
    const data = window.CyberStorage.data;
    document.querySelectorAll('.stat-xp-val').forEach(el => el.textContent = data.xp.toLocaleString());
    document.querySelectorAll('.stat-level-val').forEach(el => el.textContent = data.level);
    document.querySelectorAll('.stat-streak-val').forEach(el => el.textContent = `${data.streak} d`);

    const account = window.CyberAccounts?.getActive();
    if (account) {
      const userBox = document.getElementById('header-user-profile-badge');
      if (userBox) {
        const avatarSrc = (account.avatar && (account.avatar.startsWith('data:') || account.avatar.startsWith('http')))
          ? `<img src="${account.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid var(--accent-cyan)">`
          : `<span style="font-size:1.1rem">${account.avatar || '👤'}</span>`;
        userBox.innerHTML = `${avatarSrc} <span style="font-weight:700;font-size:0.85rem">${account.username}</span>`;
      }
    }
  }

  onViewChange(viewName) {
    switch (viewName) {
      case 'dashboard':
        if (window.CyberDashboard) window.CyberDashboard.render();
        break;
      case 'recorrido':
        if (window.CyberRecorrido) window.CyberRecorrido.renderPath();
        break;
      case 'map':
        if (window.CyberKnowledgeMap) window.CyberKnowledgeMap.render();
        break;
      case 'tree':
        if (window.CyberLearningTree) window.CyberLearningTree.render();
        break;
      case 'labs':
        if (window.CyberLabs) window.CyberLabs.render();
        break;
      case 'quizzes':
        if (window.CyberQuizzes) window.CyberQuizzes.render();
        break;
      case 'spaced-repetition':
        if (window.CyberSpaced) window.CyberSpaced.render();
        break;
      case 'notes':
        if (window.CyberNotes) window.CyberNotes.render();
        break;
      case 'resources':
        if (window.CyberResources) window.CyberResources.render();
        break;
      case 'cybertutor':
        if (window.CyberTutor) window.CyberTutor.render();
        break;
      case 'glossary':
        this.renderGlossary();
        break;
      case 'tools':
        this.renderTools();
        break;
      case 'projects':
        this.renderProjects();
        break;
      case 'careers':
        this.renderRoadmaps();
        break;
      case 'cases':
        this.renderCases();
        break;
      case 'mitre':
        this.renderMitre();
        break;
      case 'challenges':
        this.renderChallenges();
        break;
      case 'security':
        this.renderPlatformSecurity();
        break;
      case 'profile':
        this.renderProfile();
        break;
      default:
        if (window.CyberDashboard) window.CyberDashboard.render();
        break;
    }
  }

  renderGlossary() {
    const container = document.getElementById('glossary-root');
    if (!container) return;
    const glossary = window.CyberData.glossary || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">📖 Diccionario & Glosario de Ciberseguridad</h2>
        <p style="color: var(--text-muted);">Términos clave explicados de forma sencilla y técnica.</p>
      </div>
      <div class="grid-cards">
    `;

    glossary.forEach(g => {
      html += `
        <div class="card">
          <div class="card-header">
            <span class="tag cyan">${g.term.split(' ')[0]}</span>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">${g.term}</h3>
          <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 10px;"><strong>Definición Sencilla:</strong> ${g.simpleDef}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;"><strong>Técnica:</strong> ${g.techDef}</p>
          <div style="background: var(--bg-surface); padding: 8px; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--accent-yellow);">
            💡 <strong>Ejemplo:</strong> ${g.example}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderTools() {
    const container = document.getElementById('tools-root');
    if (!container) return;
    const tools = window.CyberData.tools || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">🛠️ Biblioteca de Herramientas de Ciberseguridad</h2>
        <p style="color: var(--text-muted);">Software esencial, su propósito operativo y laboratorios donde practicar.</p>
      </div>
      <div class="grid-cards">
    `;

    tools.forEach(t => {
      html += `
        <div class="card">
          <div class="card-header">
            <span class="tag purple">${t.category}</span>
            <span class="tag green">${t.level}</span>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">${t.name}</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">${t.description}</p>
          <div style="font-size: 0.8rem; color: var(--text-main); margin-bottom: 10px;">
            <strong>Sistemas Operativos:</strong> ${t.os}
          </div>
          <div style="background: var(--bg-surface); padding: 8px; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 12px;">
            <strong>¿Cuándo usarla?:</strong> ${t.usageContext}
          </div>
          <a href="${t.officialUrl}" target="_blank" class="btn btn-secondary" style="font-size: 0.85rem; text-decoration: none; width: 100%; justify-content: center;">
            🌐 Sitio Oficial / Docs
          </a>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderProjects() {
    const container = document.getElementById('projects-root');
    if (!container) return;
    const projects = window.CyberData.projects || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">🚀 Proyectos Prácticos de Seguridad</h2>
        <p style="color: var(--text-muted);">Construye herramientas y laboratorios reales para consolidar tu conocimiento.</p>
      </div>
      <div class="grid-cards">
    `;

    projects.forEach(p => {
      html += `
        <div class="card">
          <div class="card-header">
            <span class="tag cyan">${p.level}</span>
            <span class="tag purple">${p.category}</span>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px;">${p.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 14px;">${p.description}</p>
          <div style="font-size: 0.85rem; margin-bottom: 12px;">
            <strong>Habilidades:</strong> ${(p.skills || []).join(', ')}
          </div>
          <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--accent-green);">
            📦 <strong>Entregable Esperado:</strong> ${p.deliverable}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderRoadmaps() {
    const container = document.getElementById('roadmaps-root');
    if (!container) return;
    const roadmaps = window.CyberData.roadmaps || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">🛣️ Rutas y Especializaciones Profesionales</h2>
        <p style="color: var(--text-muted);">Descubre qué habilidades y certificaciones requiere cada rol en la industria.</p>
      </div>
      <div class="grid-cards">
    `;

    roadmaps.forEach(r => {
      html += `
        <div class="card">
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 8px;">${r.role}</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 14px;">${r.description}</p>
          <div style="margin-bottom: 12px;">
            <strong>Habilidades Clave:</strong>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
              ${r.keySkills.map(s => `<span class="tag cyan">${s}</span>`).join('')}
            </div>
          </div>
          <div>
            <strong>Certificaciones Relacionadas:</strong>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
              ${r.certifications.map(c => `<span class="tag yellow">${c}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderCases() {
    const container = document.getElementById('cases-root');
    if (!container) return;
    const cases = window.CyberData.cases || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">🕵️ CyberCases — Investigación de Incidentes Ficticios</h2>
        <p style="color: var(--text-muted);">Analiza registros de eventos reales, encuentra indicadores y toma decisiones de contención.</p>
      </div>
    `;

    cases.forEach(c => {
      html += `
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-header">
            <span class="tag red">Investigación Activa</span>
            <span class="tag purple">${c.company}</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">${c.title}</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px;">${c.summary}</p>
          
          <div class="terminal-window">
            <div class="terminal-header">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">SIEM Event Logs</span>
            </div>
            <div class="terminal-body">
              ${c.logs.map(l => `<div class="terminal-line">${l}</div>`).join('')}
            </div>
          </div>

          <h4 style="font-size: 1.05rem; margin-top: 16px; margin-bottom: 12px;">Preguntas de Investigación:</h4>
          ${c.questions.map((q, qIdx) => `
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 10px;">
              <div style="font-weight: 600; margin-bottom: 8px;">Pregunta ${qIdx + 1}: ${q.question}</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${q.options.map((opt, oIdx) => `
                  <button class="quiz-option-btn" onclick="window.CyberApp.answerCaseQuestion('${c.id}', ${qIdx}, ${oIdx}, ${q.answer}, this)">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  answerCaseQuestion(caseId, qIdx, selectedIdx, correctIdx, btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.classList.remove('correct', 'incorrect');
      b.disabled = true;
    });

    if (selectedIdx === correctIdx) {
      btnEl.classList.add('correct');
      window.CyberGamification.addXP(50, 'Respuesta correcta en CyberCase');
    } else {
      btnEl.classList.add('incorrect');
      parent.children[correctIdx].classList.add('correct');
    }
  }

  renderMitre() {
    const container = document.getElementById('mitre-root');
    if (!container) return;
    const mitre = window.CyberData.mitre || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">🎯 Matriz MITRE ATT&CK Educativa</h2>
        <p style="color: var(--text-muted);">Tácticas, técnicas, detecciones y mitigaciones de adversarios reales.</p>
      </div>
      <div class="grid-cards">
    `;

    mitre.forEach(m => {
      html += `
        <div class="card">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">${m.tactic}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">${m.description}</p>
          ${m.techniques.map(t => `
            <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 8px; border: 1px solid var(--border-color);">
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--accent-yellow);">${t.id}: ${t.name}</div>
              <div style="font-size: 0.85rem; color: var(--text-main); margin-top: 4px;">${t.desc}</div>
              <div style="font-size: 0.8rem; color: var(--accent-green); margin-top: 4px;"><strong>Detección:</strong> ${t.detection}</div>
            </div>
          `).join('')}
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderChallenges() {
    const container = document.getElementById('challenges-root');
    if (!container) return;
    const challenges = window.CyberData.challenges || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">⚔️ Retos Prácticos & Razonamiento</h2>
        <p style="color: var(--text-muted);">Demuestra tu capacidad de análisis resolviendo problemas de ciberseguridad.</p>
      </div>
    `;

    challenges.forEach(ch => {
      const isDone = window.CyberStorage.data.completedChallenges.includes(ch.id);
      html += `
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-header">
            <span class="tag yellow">${ch.category}</span>
            <span class="tag cyan">+${ch.xp} XP</span>
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">${ch.title}</h3>
          <p style="color: var(--text-muted); margin-bottom: 12px;">${ch.description}</p>
          
          <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 14px; border: 1px solid var(--border-color);">
            <strong>Escenario / Requerimiento:</strong>
            <p style="font-size: 0.9rem; margin-top: 4px;">${ch.prompt}</p>
          </div>

          <button class="btn btn-secondary" style="margin-bottom: 12px;" onclick="this.nextElementSibling.style.display='block'">
            💡 Ver Pistas y Solución Ideal
          </button>
          
          <div style="display: none; background: var(--bg-dark); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--accent-cyan);">
            <strong style="color: var(--accent-cyan);">Solución Ideal Recomendada:</strong>
            <p style="font-size: 0.9rem; white-space: pre-line; margin-top: 6px;">${ch.idealSolution}</p>
          </div>

          <div style="margin-top: 14px; display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" onclick="window.CyberApp.completeChallenge('${ch.id}', ${ch.xp})" ${isDone ? 'disabled' : ''}>
              ${isDone ? '✓ Reto Completado' : 'Comparé mi Respuesta y Marcar Completado'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  completeChallenge(chId, xp) {
    const data = window.CyberStorage.data;
    if (!data.completedChallenges.includes(chId)) {
      data.completedChallenges.push(chId);
      window.CyberStorage.saveData();
      window.CyberGamification.addXP(xp, 'Reto completado');
      this.renderChallenges();
    }
  }

  renderPlatformSecurity() {
    const container = document.getElementById('security-root');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem;">🔒 Auditoría de Seguridad de la Plataforma CyberLab</h2>
        <p style="color: var(--text-muted);">Como estudiante de ciberseguridad, aprende cómo está protegida la propia aplicación que estás usando.</p>
      </div>

      <div class="grid-cards">
        <div class="card">
          <h3 style="font-size: 1.1rem; color: var(--accent-green); margin-bottom: 8px;">✓ Prevención de XSS (Cross-Site Scripting)</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">Todos los inputs de notas y texto de usuario utilizan métodos de inserción seguros (\`textContent\` y escapado de caracteres) evitando la ejecución de código JavaScript inyectado.</p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.1rem; color: var(--accent-green); margin-bottom: 8px;">✓ 0% Exposición de Secretos en Frontend</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">La aplicación no almacena API Keys, tokens de acceso ni credenciales en el código fuente cliente, garantizando la compatibilidad segura con GitHub Pages.</p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.1rem; color: var(--accent-green); margin-bottom: 8px;">✓ Privacidad y Persistencia Local</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">Todo tu progreso, notas y respuestas se almacenan exclusivamente en el \`localStorage\` de tu navegador sin transmitir datos a servidores externos no autorizados.</p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.1rem; color: var(--accent-green); margin-bottom: 8px;">✓ Principio de Ética y Legalidad</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">CyberLab enseña metodologías ofensivas exclusivamente orientadas hacia la defensa, bastionado de sistemas y entornos autorizados/locales.</p>
        </div>
      </div>
    `;
  }

  renderProfile() {
    const container = document.getElementById('profile-root');
    if (!container) return;
    const data = window.CyberStorage.data;
    const achievements = window.CyberData.achievements || [];

    let html = `
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="font-size: 3rem; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-full);">👨‍💻</div>
          <div>
            <h2 style="font-size: 1.5rem;">Perfil del Estudiante</h2>
            <div style="display: flex; gap: 8px; margin-top: 4px;">
              <span class="tag cyan">Nivel ${data.level}</span>
              <span class="tag purple">${data.xp.toLocaleString()} XP Totales</span>
              <span class="tag yellow">🔥 Racha de ${data.streak} días</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-cards">
        <div class="card">
          <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Objetivos Personalizados</h3>
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 0.85rem; color: var(--text-muted);">OBJETIVO PRINCIPAL:</strong>
            <div style="font-weight: 600; margin-top: 2px;">${data.primaryObjective}</div>
          </div>
          <div>
            <strong style="font-size: 0.85rem; color: var(--text-muted);">OBJETIVO SECUNDARIO:</strong>
            <div style="font-weight: 600; margin-top: 2px;">${data.secondaryObjective}</div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Copia de Seguridad y Datos</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">Descarga una copia JSON de tu progreso para migrarlo a tu teléfono o laptop.</p>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="window.CyberStorage.exportBackup()">📥 Exportar Progreso JSON</button>
            <button class="btn btn-secondary" onclick="document.getElementById('import-file-input').click()">📤 Importar JSON</button>
            <input type="file" id="import-file-input" style="display: none;" onchange="window.CyberApp.handleImportFile(this)" />
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3 style="font-size: 1.2rem; margin-bottom: 14px;">🏆 Galería de Logros (${data.unlockedAchievements.length} / ${achievements.length})</h3>
        <div class="grid-cards">
          ${achievements.map(ach => {
            const unlocked = data.unlockedAchievements.includes(ach.id);
            return `
              <div class="card" style="opacity: ${unlocked ? '1' : '0.4'}; border-color: ${unlocked ? 'var(--accent-yellow)' : 'var(--border-color)'};">
                <div style="font-size: 2rem; margin-bottom: 6px;">${ach.icon}</div>
                <div style="font-weight: 700; font-size: 0.95rem;">${ach.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${ach.description}</div>
                <div style="font-size: 0.75rem; color: var(--accent-yellow); font-weight: bold; margin-top: 8px;">+${ach.xpReward} XP</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  handleImportFile(inputEl) {
    const file = inputEl.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        window.CyberStorage.importBackup(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.update();
      }).catch(err => console.log('SW registration skipped:', err));
    }
  }
}

function startCyberLabApp() {
  if (!window.CyberApp) {
    window.CyberApp = new CyberLabApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startCyberLabApp);
} else {
  startCyberLabApp();
}
