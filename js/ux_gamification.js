/* CyberLab UX Gamification Layer
 * Incremental enhancement: preserves existing theory/content and engines.
 */
(() => {
  'use strict';

  const QUESTION_BANK = {
    'concept-cia': [
      { q: 'Una política que impide que usuarios no autorizados lean información protege principalmente la…', options: ['Disponibilidad', 'Confidencialidad', 'Integridad', 'Redundancia'], answer: 1, explanation: 'La confidencialidad limita el acceso a la información a personas o sistemas autorizados.' },
      { q: 'Un atacante modifica el saldo de una cuenta bancaria sin permiso. ¿Qué propiedad se vulnera?', options: ['Integridad', 'Disponibilidad', 'Confidencialidad', 'Autenticación'], answer: 0, explanation: 'La integridad garantiza que la información no sea alterada sin autorización.' }
    ],
    'concept-risk-threat': [
      { q: '¿Qué elemento describe una debilidad del diseño, implementación o configuración de un sistema?', options: ['Amenaza', 'Exploit', 'Vulnerabilidad', 'Impacto'], answer: 2, explanation: 'Una vulnerabilidad es precisamente una debilidad aprovechable.' },
      { q: 'En la relación Amenaza → Vulnerabilidad → Exploit, el exploit es…', options: ['El impacto final', 'La técnica o herramienta que aprovecha la vulnerabilidad', 'La probabilidad de ataque', 'El control defensivo'], answer: 1, explanation: 'El exploit aprovecha una vulnerabilidad para producir un efecto o impacto.' }
    ],
    'concept-cpu-ram': [
      { q: '¿Qué nivel de la jerarquía de memoria se encuentra dentro del procesador y es el más rápido?', options: ['SSD', 'RAM', 'Registros CPU', 'HDD'], answer: 2, explanation: 'Los registros están dentro de la CPU y proporcionan acceso extremadamente rápido.' },
      { q: '¿Cuál es el orden correcto del ciclo de instrucción descrito en la lección?', options: ['Execute → Fetch → Writeback → Decode', 'Fetch → Decode → Execute → Writeback', 'Decode → Fetch → Execute → Writeback', 'Fetch → Execute → Decode → Writeback'], answer: 1, explanation: 'El flujo indicado es Fetch, Decode, Execute y Writeback.' }
    ],
    'concept-kernel-userland': [
      { q: '¿En qué modo se ejecuta normalmente el código de las aplicaciones de usuario?', options: ['Ring 0', 'Ring 1', 'Ring 2', 'Ring 3'], answer: 3, explanation: 'Las aplicaciones de usuario se ejecutan en Ring 3, con privilegios restringidos.' },
      { q: 'Para leer un archivo, una aplicación necesita pasar al kernel mediante una…', options: ['MAC address', 'System Call', 'VLAN', 'Firma digital'], answer: 1, explanation: 'Las system calls son la interfaz controlada entre aplicaciones y kernel.' }
    ],
    'concept-linux-permissions': [
      { q: 'En permisos Linux, ¿qué valor representa Write (w)?', options: ['1', '2', '4', '7'], answer: 1, explanation: 'Write vale 2; Read vale 4 y Execute vale 1.' },
      { q: '¿Qué significa chmod 755 para el propietario?', options: ['r--', 'r-x', 'rw-', 'rwx'], answer: 3, explanation: '7 = 4+2+1, por tanto el propietario obtiene lectura, escritura y ejecución.' }
    ],
    'concept-win-registry': [
      { q: '¿Qué hive representa la configuración del usuario actualmente conectado?', options: ['HKLM', 'HKCU', 'HKCR', 'HKCC'], answer: 1, explanation: 'HKCU significa HKEY_CURRENT_USER.' },
      { q: '¿Por qué Run y RunOnce son relevantes en seguridad?', options: ['Gestionan DNS', 'Controlan memoria RAM', 'Pueden iniciar programas automáticamente al iniciar sesión', 'Cambian el gateway'], answer: 2, explanation: 'Estas claves pueden usarse para persistencia durante el inicio de sesión.' }
    ],
    'concept-osi-tcp': [
      { q: '¿Qué paquete inicia el TCP 3-Way Handshake?', options: ['ACK', 'FIN', 'SYN', 'RST'], answer: 2, explanation: 'El cliente inicia la conexión enviando SYN.' },
      { q: '¿Qué ocurre tras el tercer paso, ACK?', options: ['Se destruye la conexión', 'La conexión queda establecida', 'Se cambia el puerto', 'Se desactiva TCP'], answer: 1, explanation: 'Con el ACK final, ambos extremos confirman la conexión y pasa a ESTABLISHED.' }
    ],
    'concept-subnetting': [
      { q: '¿Cuántas direcciones totales tiene una red IPv4 /28?', options: ['8', '16', '32', '64'], answer: 1, explanation: 'Un /28 deja 4 bits para hosts: 2^4 = 16 direcciones.' },
      { q: 'En una red /24, ¿cuántas IP son utilizables normalmente?', options: ['254', '256', '255', '252'], answer: 0, explanation: 'Se reservan la dirección de red y broadcast, dejando 254 utilizables.' }
    ],
    'concept-dns-http': [
      { q: '¿Qué ocurre antes de establecer TCP al acceder a un dominio por HTTPS?', options: ['El cliente ya conoce la IP siempre', 'Se resuelve el dominio mediante DNS', 'Se envía HTTP GET directamente', 'Se crea primero un usuario'], answer: 1, explanation: 'DNS traduce el nombre de dominio a una dirección IP antes de conectar.' },
      { q: '¿Qué puerto usa normalmente HTTPS?', options: ['22', '53', '80', '443'], answer: 3, explanation: 'HTTPS usa habitualmente el puerto TCP 443.' }
    ],
    'concept-python-sockets': [
      { q: '¿Qué librería de Python permite crear sockets TCP/UDP?', options: ['socket', 'json', 'hashlib', 'math'], answer: 0, explanation: 'El módulo estándar socket permite trabajar directamente con conexiones de red.' },
      { q: '¿Cuál es un flujo de automatización coherente para análisis de logs?', options: ['Ejecutar → borrar → ignorar', 'Leer archivos → procesar logs → buscar patrones → generar reporte', 'DNS → RAM → GPU → reporte', 'Cifrar → apagar → reiniciar'], answer: 1, explanation: 'Ese es el flujo de automatización presentado en la teoría.' }
    ],
    'concept-hardening': [
      { q: '¿Cuál es la idea central de la Defensa en Profundidad?', options: ['Confiar en un único control', 'Usar capas superpuestas de controles', 'Deshabilitar todos los servicios', 'Eliminar el logging'], answer: 1, explanation: 'La estrategia asume que ningún control es infalible y combina varias capas.' },
      { q: '¿Cuál es una medida de hardening mencionada en la lección?', options: ['Mantener software obsoleto', 'Usar credenciales por defecto', 'Deshabilitar servicios innecesarios', 'Abrir todos los puertos'], answer: 2, explanation: 'Reducir servicios innecesarios disminuye la superficie de ataque.' }
    ],
    'concept-first-lab': [
      { q: '¿Dónde deben ejecutarse los experimentos prácticos de seguridad?', options: ['En cualquier equipo de producción', 'En entornos controlados y aislados', 'En cuentas ajenas', 'En servicios públicos sin permiso'], answer: 1, explanation: 'La metodología exige un laboratorio seguro y aislado.' },
      { q: '¿Cuál es una fase del flujo de investigación del laboratorio?', options: ['Ignorar los logs', 'Captura de datos y análisis', 'Borrar evidencia', 'Desactivar todas las defensas'], answer: 1, explanation: 'El flujo incluye objetivo, captura, análisis y remediación.' }
    ]
  };

  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));
  const markdownLite = (value) => esc(value).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');

  class CyberUX {
    constructor() {
      this.storage = window.CyberStorage;
      this.readerState = {};
      this.lastLesson = null;
      this.started = false;
    }

    init() {
      if (this.started) return;
      this.started = true;
      this.injectHeaderAchievements();
      this.ensureDashboardPathMount();
      this.injectOnboardingWhenReady();
      this.patchLearningTreeWhenReady();
      this.patchLabsWhenReady();
      this.patchSpacedReviewWhenReady();
      window.addEventListener('cyberlab_state_updated', () => {
        this.injectHeaderAchievements();
        this.renderBothPaths();
      });
    }

    whenReady(cb, attempts = 120) {
      if (window.CyberData?.modules && window.CyberStorage?.activeAccountId) return cb();
      if (attempts <= 0) return;
      setTimeout(() => this.whenReady(cb, attempts - 1), 150);
    }

    injectHeaderAchievements() {
      const header = document.querySelector('.header-right');
      if (!header || !window.CyberData?.achievements || !window.CyberStorage) return;
      let wrap = document.getElementById('ux-achievements-strip');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'ux-achievements-strip';
        wrap.className = 'ux-achievements-strip';
        const stats = header.querySelector('.user-stats-pill');
        header.insertBefore(wrap, stats || header.firstChild);
      }
      const unlocked = new Set(window.CyberStorage.data.unlockedAchievements || []);
      wrap.innerHTML = window.CyberData.achievements.slice(0, 6).map(a => `
        <span class="ux-trophy ${unlocked.has(a.id) ? 'is-unlocked' : ''}" title="${esc(a.name)} — ${esc(a.description)}">${a.icon}</span>
      `).join('');
    }

    ensureDashboardPathMount() {
      const dashboard = document.getElementById('view-dashboard');
      if (!dashboard || document.getElementById('dashboard-learning-path')) return;
      const anchor = dashboard.querySelector('#dash-rec-title')?.closest('.card');
      const mount = document.createElement('div');
      mount.id = 'dashboard-learning-path';
      if (anchor?.nextElementSibling) dashboard.insertBefore(mount, anchor.nextElementSibling);
      else dashboard.appendChild(mount);
    }

    getModules() { return window.CyberData?.modules || []; }
    moduleDone(mod) {
      const d = this.storage.data;
      if (d.completedModules.includes(mod.id)) return true;
      return (mod.concepts || []).length > 0 && mod.concepts.every(c => (d.masteryLevels[c.id] || 0) >= 5);
    }
    moduleMastered(mod) {
      const d = this.storage.data;
      return (mod.concepts || []).length > 0 && mod.concepts.every(c => (d.masteryLevels[c.id] || 0) >= 6 && (d.lessonProgress?.[c.id]?.complete));
    }
    moduleUnlocked(mod) {
      const d = this.storage.data;
      if (d.startingModuleId === mod.id) return true;
      return (mod.prerequisites || []).every(id => d.completedModules.includes(id) || this.moduleDone(this.getModules().find(m => m.id === id) || { concepts: [] }));
    }

    renderPath(container, orientation='vertical') {
      const modules = this.getModules();
      if (!container || !modules.length) return;
      const d = this.storage.data;
      container.innerHTML = `
        <div class="ux-path ${orientation === 'horizontal' ? 'ux-path-horizontal' : ''}">
          <div class="ux-path-header"><div><span class="tag cyan">🧭 RUTA ÚNICA</span><h2>Camino de Aprendizaje</h2><p>La misma ruta en Inicio y Aprender: bloqueado → disponible → completado → dominado.</p></div></div>
          <div class="ux-path-track">
            ${modules.map((m, i) => {
              const mastered = this.moduleMastered(m), done = this.moduleDone(m), unlocked = this.moduleUnlocked(m);
              const state = mastered ? 'mastered' : done ? 'completed' : unlocked ? 'available' : 'locked';
              const icon = mastered ? '👑' : done ? '✓' : unlocked ? m.icon : '🔒';
              const current = d.startingModuleId === m.id ? '<span class="ux-recommended">Recomendado</span>' : '';
              return `
                <button class="ux-path-node ${state}" ${unlocked ? `onclick="window.CyberUX.openModule('${esc(m.id)}')"` : 'disabled'}>
                  <span class="ux-node-icon">${icon}</span>
                  <span class="ux-node-copy"><strong>${esc(m.title)}</strong><small>${esc(m.category)} · ${esc(m.estimatedTime)}</small>${current}</span>
                </button>${i < modules.length - 1 ? `<span class="ux-path-connector ${done ? 'done' : ''}"></span>` : ''}
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    renderBothPaths() {
      this.renderPath(document.getElementById('dashboard-learning-path'), 'horizontal');
      const tree = document.getElementById('learning-tree-root');
      if (tree && this._treePatched) this.renderLearningTree();
    }

    openModule(moduleId) {
      window.location.hash = 'tree';
      setTimeout(() => {
        const item = document.querySelector(`[data-module-id="${CSS.escape(moduleId)}"]`);
        if (item) item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    }

    splitTheory(theory) {
      const normalized = String(theory || '').replace(/\r/g, '').trim();
      if (!normalized) return [];
      const lines = normalized.split('\n');
      const blocks = [];
      let current = [];
      const flush = () => { if (current.join('\n').trim()) blocks.push(current.join('\n').trim()); current = []; };
      lines.forEach(line => {
        const t = line.trim();
        if (!t) return flush();
        if (/^(?:[-*]\s+|\d+\.\s+|⭐|🎯|🛡️|📖|🌐|Cliente\s+|Servidor\s+)/.test(t) && current.length) flush();
        current.push(line);
      });
      flush();
      return blocks.length ? blocks : [normalized];
    }

    renderLearningTree() {
      const container = document.getElementById('learning-tree-root');
      if (!container) return;
      const modules = this.getModules();
      const d = this.storage.data;
      container.innerHTML = '';
      modules.forEach(mod => {
        const wrap = document.createElement('section');
        wrap.className = 'ux-lesson-module';
        wrap.dataset.moduleId = mod.id;
        const unlocked = this.moduleUnlocked(mod);
        wrap.innerHTML = `<div class="ux-lesson-module-header"><div><span class="tag ${unlocked ? 'cyan' : ''}">${esc(mod.icon)} ${esc(mod.category)}</span><h2>${esc(mod.title)}</h2><p>${esc(mod.description)}</p></div><span class="tag ${unlocked ? 'green' : ''}">${unlocked ? 'Disponible' : '🔒 Bloqueado'}</span></div>`;
        if (!unlocked) {
          container.appendChild(wrap);
          return;
        }
        (mod.concepts || []).forEach(concept => wrap.appendChild(this.renderConcept(concept, mod)));
        container.appendChild(wrap);
      });
      this._treePatched = true;
    }

    renderConcept(concept, mod) {
      const key = concept.id;
      const saved = this.storage.data.lessonProgress?.[key] || { cardIndex: 0, readCards: [], answered: [], complete: false, bestCorrect: 0 };
      const blocks = this.splitTheory(concept.theory);
      const questions = QUESTION_BANK[key] || [];
      const state = { ...saved, blockCount: blocks.length, questionCount: questions.length };
      this.readerState[key] = state;
      const card = document.createElement('article');
      card.className = 'ux-lesson-card';
      card.dataset.conceptId = key;
      card.innerHTML = this.lessonHtml(concept, mod, blocks, questions, state);
      return card;
    }

    lessonHtml(concept, mod, blocks, questions, state) {
      const idx = Math.min(state.cardIndex || 0, Math.max(0, blocks.length - 1));
      const completedCards = state.readCards?.filter(Boolean).length || 0;
      const progress = Math.round((completedCards / Math.max(1, blocks.length)) * 100);
      const q = questions[idx % Math.max(1, questions.length)];
      const hasRead = !!state.readCards?.includes(idx);
      const hasAnswered = !!state.answered?.includes(idx);
      return `
        <div class="ux-lesson-top"><div><span class="tag purple">${esc(mod.icon)} ${esc(mod.title)}</span><h3>${esc(concept.name)}</h3><p>${esc(concept.summary)}</p></div><div class="ux-lesson-xp">📖 Lectura +25 XP</div></div>
        <div class="ux-lesson-progress"><div class="progress-bar-container"><div class="progress-bar-fill" style="width:${progress}%"></div></div><span>Bloques leídos: ${completedCards}/${blocks.length}</span></div>
        <div class="ux-lesson-body">
          <div class="ux-theory-card"><div class="ux-theory-kicker">TEORÍA · BLOQUE ${idx + 1}/${blocks.length}</div><div class="ux-theory-text">${markdownLite(blocks[idx] || concept.theory)}</div></div>
          <div class="ux-theory-actions">
            <button class="btn btn-secondary" onclick="window.CyberUX.showContext('${esc(key)}', 'example')">💡 Ver ejemplo</button>
            <button class="btn btn-secondary" onclick="window.CyberUX.showContext('${esc(key)}', 'practice')">🧪 Ver práctica</button>
            <button class="btn btn-primary" onclick="window.CyberUX.markRead('${esc(key)}', ${idx})" ${hasRead ? 'disabled' : ''}>${hasRead ? '✓ Bloque leído' : 'He leído este bloque →'}</button>
          </div>
          ${hasRead ? `<div class="ux-check-question"><div class="ux-question-label">🧠 Comprueba lo entendido</div><div class="ux-question-text">${esc(q?.q || '¿Cuál es la idea principal de este bloque?')}</div><div class="ux-options">${(q?.options || ['Sí', 'No']).map((opt, oi) => `<button class="quiz-option-btn" onclick="window.CyberUX.answerLessonQuestion('${esc(key)}', ${idx}, ${oi}, ${q?.answer ?? 0}, this)" ${hasAnswered ? 'disabled' : ''}>${esc(opt)}</button>`).join('')}</div><div class="ux-feedback" id="ux-feedback-${esc(key)}-${idx}"></div></div>` : '<div class="ux-locked-question">Lee el bloque completo para desbloquear la pregunta de comprensión.</div>'}
        </div>
        <div class="ux-context-panel" id="ux-context-${esc(key)}"></div>
        <div class="ux-lesson-footer">${state.complete ? '<span class="tag green">✓ Lección completada</span>' : ''}<button class="btn btn-primary" onclick="window.CyberUX.nextLessonBlock('${esc(key)}')">${idx >= blocks.length - 1 ? 'Completar lección 🎉' : 'Siguiente bloque →'}</button></div>
      `;
    }

    persistLesson(key, state) {
      const d = this.storage.data;
      d.lessonProgress = d.lessonProgress || {};
      d.lessonProgress[key] = state;
      this.storage.saveData(d);
    }

    showContext(key, type) {
      const concept = this.findConcept(key); if (!concept) return;
      const el = document.getElementById(`ux-context-${key}`); if (!el) return;
      const labels = { example: '💡 EJEMPLO', practice: '🧪 PRÁCTICA', defense: '🛡️ DEFENSA', detection: '🔍 DETECCIÓN' };
      el.innerHTML = `<div class="ux-context-card"><strong>${labels[type] || type}</strong><div>${markdownLite(concept[type] || '')}</div></div>`;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    findConcept(key) { return this.getModules().flatMap(m => m.concepts || []).find(c => c.id === key); }

    markRead(key, idx) {
      const s = this.readerState[key]; if (!s) return;
      s.readCards = Array.from(new Set([...(s.readCards || []), idx]));
      this.persistLesson(key, s);
      window.CyberGamification.addXP(25, 'Bloque teórico completado', `reading:${key}:${idx}`);
      this.rerenderConcept(key);
    }

    answerLessonQuestion(key, idx, selected, answer, btn) {
      const q = (QUESTION_BANK[key] || [])[idx % Math.max(1, (QUESTION_BANK[key] || []).length)];
      const buttons = btn.parentElement.querySelectorAll('.quiz-option-btn');
      buttons.forEach(b => { b.disabled = true; b.classList.remove('correct', 'incorrect'); });
      const correct = selected === answer;
      btn.classList.add(correct ? 'correct' : 'incorrect');
      if (!correct && buttons[answer]) buttons[answer].classList.add('correct');
      const feedback = document.getElementById(`ux-feedback-${key}-${idx}`);
      if (feedback) feedback.innerHTML = `<div class="ux-answer-feedback ${correct ? 'ok' : 'bad'}"><strong>${correct ? '✓ Correcto' : '✕ Incorrecto'}</strong><span>${esc(q?.explanation || 'Revisa el bloque teórico y vuelve a intentarlo en el repaso.')}</span></div>`;
      const s = this.readerState[key]; if (!s) return;
      s.answered = Array.from(new Set([...(s.answered || []), idx]));
      if (correct) { s.bestCorrect = Math.max(s.bestCorrect || 0, 1); window.CyberGamification.addXP(10, 'Pregunta de comprensión correcta', `question:${key}:${idx}`); }
      this.persistLesson(key, s);
    }

    nextLessonBlock(key) {
      const s = this.readerState[key]; if (!s) return;
      const blocks = this.splitTheory(this.findConcept(key)?.theory || '');
      const idx = s.cardIndex || 0;
      if (!s.readCards?.includes(idx)) {
        window.CyberGamification.showToast('Primero marca el bloque como leído para avanzar.','yellow');
        return;
      }
      if (idx < blocks.length - 1) {
        s.cardIndex = idx + 1; this.persistLesson(key, s); this.rerenderConcept(key); return;
      }
      if ((QUESTION_BANK[key] || []).length && !s.answered?.length) {
        window.CyberGamification.showToast('Responde la pregunta de refuerzo antes de cerrar la lección.','yellow');
        return;
      }
      if (!s.complete) {
        s.complete = true;
        this.persistLesson(key, s);
        const mod = this.getModules().find(m => (m.concepts || []).some(c => c.id === key));
        if (mod && !this.storage.data.completedModules.includes(mod.id) && (mod.concepts || []).every(c => this.storage.data.lessonProgress?.[c.id]?.complete)) {
          this.storage.data.completedModules.push(mod.id);
        }
        this.storage.saveData();
        window.CyberGamification.addXP(50, `Lección completada: ${this.findConcept(key)?.name || key}`, `lesson-complete:${key}`);
        this.celebrateLesson(key);
      }
      this.renderBothPaths();
      this.rerenderConcept(key);
    }

    rerenderConcept(key) {
      const old = document.querySelector(`.ux-lesson-card[data-concept-id="${CSS.escape(key)}"]`); if (!old) return;
      const concept = this.findConcept(key); const mod = this.getModules().find(m => (m.concepts || []).some(c => c.id === key));
      const fresh = this.renderConcept(concept, mod); old.replaceWith(fresh);
    }

    celebrateLesson(key) {
      const concept = this.findConcept(key);
      let overlay = document.getElementById('ux-celebration');
      if (!overlay) { overlay = document.createElement('div'); overlay.id = 'ux-celebration'; overlay.className = 'ux-celebration'; document.body.appendChild(overlay); }
      const s = this.storage.data.lessonProgress?.[key] || {};
      overlay.innerHTML = `<div class="ux-celebration-card"><div class="ux-celebration-icon">🎉</div><div class="tag green">LECCIÓN COMPLETADA</div><h2>¡Excelente trabajo!</h2><p>Acabas de consolidar <strong>${esc(concept?.name || '')}</strong>.</p><div class="ux-learned-summary"><strong>Lo que trabajaste</strong><span>📖 Teoría completa</span><span>🧠 ${s.answered?.length || 0} pregunta(s) de refuerzo</span><span>🛡️ Ejemplo, práctica, defensa y detección disponibles</span></div><div class="ux-celebration-xp">+75 XP</div><button class="btn btn-primary" onclick="document.getElementById('ux-celebration').classList.remove('active')">Continuar</button></div>`;
      overlay.classList.add('active');
    }

    patchLearningTreeWhenReady() {
      this.whenReady(() => {
        if (window.CyberLearningTree) {
          window.CyberLearningTree.render = () => this.renderLearningTree();
          this._treePatched = true;
          this.renderLearningTree();
          this.renderBothPaths();
        }
      });
    }

    patchLabsWhenReady() {
      this.whenReady(() => {
        if (!window.CyberLabs) return;
        window.CyberLabs.render = () => this.renderLabs();
        this.renderLabs();
      });
    }

    renderLabs() {
      const container = document.getElementById('labs-root'); if (!container) return;
      const labs = window.CyberData?.labs || [];
      const d = this.storage.data; d.labSteps = d.labSteps || {};
      container.innerHTML = '';
      labs.forEach(lab => {
        const done = d.completedLabs.includes(lab.id);
        const checked = new Set(d.labSteps[lab.id] || []);
        const total = (lab.steps || []).length;
        const pct = total ? Math.round((checked.size / total) * 100) : 0;
        const card = document.createElement('article'); card.className = 'card ux-lab-card';
        card.innerHTML = `<div class="card-header"><div><span class="tag cyan">${esc(lab.number)}</span> <span class="tag purple">${esc(lab.category)}</span><h3>${esc(lab.title)}</h3></div><span class="tag ${done ? 'green' : 'yellow'}">${done ? '✓ Completado' : 'En progreso'}</span></div><p class="ux-lab-objective">${esc(lab.objective)}</p><div class="ux-lab-full-content"><strong>📋 Preparación del entorno</strong><p>${markdownLite(lab.preparation)}</p></div><div class="ux-lab-progress"><div class="progress-bar-container"><div class="progress-bar-fill" style="width:${pct}%"></div></div><span>${checked.size}/${total} pasos completados (${pct}%)</span></div><div class="ux-lab-steps"><h4>Pasos Guiados de Ejecución</h4>${(lab.steps || []).map(st => `<label class="ux-lab-step ${checked.has(st.step) ? 'checked' : ''}"><input type="checkbox" ${checked.has(st.step) ? 'checked' : ''} onchange="window.CyberUX.toggleLabStep('${esc(lab.id)}', ${st.step})"><span><strong>Paso ${st.step}: ${esc(st.title)}</strong><small>${markdownLite(st.description)}</small><code>${esc(st.command)}</code></span></label>`).join('')}</div>${lab.questions?.length ? `<div class="ux-lab-questions"><h4>Evaluación de conocimiento</h4>${lab.questions.map((q, idx) => `<div class="ux-lab-q"><strong>Pregunta ${idx+1}: ${esc(q.question)}</strong><div>${q.options.map((opt, oi) => `<button class="quiz-option-btn" onclick="window.CyberLabs.answerQuestion('${esc(lab.id)}','${esc(q.id)}',${oi},${q.answer},this)">${esc(opt)}</button>`).join('')}</div></div>`).join('')}</div>` : ''}<div class="ux-lab-footer"><button class="btn btn-primary" onclick="window.CyberUX.completeLab('${esc(lab.id)}')" ${done ? 'disabled' : ''}>${done ? '✓ Laboratorio completado' : 'Finalizar laboratorio (+150 XP)'}</button></div>`;
        container.appendChild(card);
      });
    }

    toggleLabStep(labId, step) {
      const d = this.storage.data; d.labSteps = d.labSteps || {}; const set = new Set(d.labSteps[labId] || []);
      set.has(step) ? set.delete(step) : set.add(step); d.labSteps[labId] = Array.from(set).sort((a,b)=>a-b); this.storage.saveData(); this.renderLabs();
    }

    completeLab(labId) {
      const lab = (window.CyberData?.labs || []).find(l => l.id === labId); if (!lab) return;
      const doneSteps = new Set(this.storage.data.labSteps?.[labId] || []);
      if ((lab.steps || []).length && doneSteps.size < lab.steps.length) { window.CyberGamification.showToast('Completa todos los pasos del checklist antes de finalizar.','yellow'); return; }
      if (!this.storage.data.completedLabs.includes(labId)) { this.storage.data.completedLabs.push(labId); this.storage.saveData(); window.CyberGamification.addXP(150, 'Laboratorio completado', `lab:${labId}`); this.renderLabs(); }
    }

    patchSpacedReviewWhenReady() {
      this.whenReady(() => {
        const c = document.getElementById('spaced-repetition-root'); if (!c) return;
        const original = c.innerHTML;
        const dueConcepts = this.getModules().flatMap(m => m.concepts || []).filter(con => this.storage.data.lessonProgress?.[con.id]?.complete || (this.storage.data.masteryLevels?.[con.id] || 0) > 0).slice(0, 6);
        if (!dueConcepts.length) return;
        c.innerHTML = `<div class="card ux-review-card"><div class="card-header"><div><span class="tag purple">⚡ REPASO RÁPIDO</span><h2>Consolida lo aprendido</h2><p>Preguntas breves sobre temas ya vistos. No necesitas releer toda la teoría.</p></div><span class="tag yellow">${dueConcepts.length} temas</span></div><div id="ux-review-deck"></div></div>${original}`;
        const deck = document.getElementById('ux-review-deck'); let pos = 0;
        const ask = () => {
          const concept = dueConcepts[pos % dueConcepts.length]; const qs = QUESTION_BANK[concept.id] || []; const q = qs[(pos + Math.floor(pos/2)) % Math.max(1, qs.length)];
          if (!q) { deck.innerHTML = '<p>Completa algunas lecciones para activar el repaso.</p>'; return; }
          deck.innerHTML = `<div class="ux-review-question"><span class="tag cyan">${esc(concept.name)}</span><h3>${esc(q.q)}</h3><div>${q.options.map((o,i)=>`<button class="quiz-option-btn" onclick="window.CyberUX.answerReview(${i}, ${q.answer}, this, '${esc(q.explanation)}')">${esc(o)}</button>`).join('')}</div><div class="ux-feedback" id="ux-review-feedback"></div></div>`;
        };
        this._reviewNext = () => { pos += 1; ask(); }; window.CyberUX.answerReview = (selected, answer, btn, explanation) => { const parent = btn.parentElement; parent.querySelectorAll('button').forEach(b=>b.disabled=true); const ok=selected===answer; btn.classList.add(ok?'correct':'incorrect'); if(!ok && parent.children[answer]) parent.children[answer].classList.add('correct'); document.getElementById('ux-review-feedback').innerHTML=`<div class="ux-answer-feedback ${ok?'ok':'bad'}"><strong>${ok?'✓ Correcto':'✕ Revisa el concepto'}</strong><span>${esc(explanation)}</span><button class="btn btn-secondary" onclick="window.CyberUX._reviewNext()">Siguiente →</button></div>`; if(ok) window.CyberGamification.addXP(10,'Repaso espaciado correcto',`review:${Date.now()}`); };
        ask();
      });
    }

    injectOnboardingWhenReady() {
      this.whenReady(() => {
        const d = this.storage.data; if (d.onboardingComplete) return;
        let overlay = document.getElementById('ux-onboarding');
        if (!overlay) { overlay = document.createElement('div'); overlay.id='ux-onboarding'; overlay.className='ux-onboarding'; document.body.appendChild(overlay); }
        overlay.innerHTML = `<div class="ux-onboarding-card"><div class="ux-onboarding-brand">🛡️ CyberLab</div><span class="tag cyan">PRIMER INGRESO</span><h1>Vamos a ubicarte en la ruta</h1><p>Son unas preguntas rápidas. No reemplazan las lecciones y puedes empezar desde cero en cualquier momento.</p><div class="ux-level-options"><button class="ux-level-choice" data-level="0"><strong>🌱 Cero</strong><span>Quiero fundamentos.</span></button><button class="ux-level-choice" data-level="2"><strong>🧠 Básico</strong><span>Conozco informática y redes básicas.</span></button><button class="ux-level-choice" data-level="5"><strong>⚡ Intermedio</strong><span>Ya he trabajado con sistemas o redes.</span></button><button class="ux-level-choice" data-level="7"><strong>🔥 Avanzado</strong><span>Ya practico ciberseguridad.</span></button></div><button class="btn btn-primary" id="ux-onboarding-start">Empezar desde cero</button><button class="ux-skip" id="ux-onboarding-later">Omitir test por ahora</button></div>`;
        overlay.classList.add('active');
        let selected = 0;
        overlay.querySelectorAll('.ux-level-choice').forEach(btn => btn.addEventListener('click', () => { overlay.querySelectorAll('.ux-level-choice').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); selected = Number(btn.dataset.level); const start = this.getModules().find(m => m.stage >= selected) || this.getModules()[0]; overlay.querySelector('#ux-onboarding-start').textContent = `Empezar en ${start.title.replace(/^\d+\.\s*/, '')} →`; }));
        const finish = (stage) => { const start = this.getModules().find(m => m.stage >= stage) || this.getModules()[0]; d.onboardingComplete=true; d.onboardingLevel=stage; d.startingModuleId=start?.id || this.getModules()[0]?.id; this.storage.saveData(); overlay.classList.remove('active'); this.renderBothPaths(); };
        overlay.querySelector('#ux-onboarding-start').onclick = () => finish(selected);
        overlay.querySelector('#ux-onboarding-later').onclick = () => finish(0);
      });
    }
  }

  window.CyberUX = new CyberUX();
  const boot = () => window.CyberUX.init();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
