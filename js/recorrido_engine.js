/* ==========================================================================
   CyberLab — Recorrido Educativo Interactivo & Lesson Engine (Duolingo-style)
   ========================================================================== */

class RecorridoEngine {
  constructor() {
    this.storage = window.CyberStorage;
    this.currentLesson = null;
    this.lessonStepIndex = 0; // 0: Theory, 1: Practice, 2: Exam, 3: AI Analysis, 4: Celebration
    this.theoryCardIndex = 0;
    this.examAnswers = {};
    this.initConfettiCanvas();
  }

  initConfettiCanvas() {
    if (document.getElementById('confetti-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;display:none;';
    document.body.appendChild(canvas);
  }

  triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00f0ff', '#a371f7', '#39d353', '#ffc700', '#ff007a', '#ffffff'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.rotation += p.rSpeed;
        p.opacity = Math.max(0, 1 - elapsed / 2500);

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive && elapsed < 2500) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
      }
    };
    requestAnimationFrame(animate);
  }

  getNodeStatus(mod) {
    const data = this.storage.data;
    const isCompleted = data.completedModules.includes(mod.id);

    // Check prerequisites
    const isLocked = mod.prerequisites && mod.prerequisites.some(preId => !data.completedModules.includes(preId));

    if (isLocked) return { code: 'locked', icon: '🔒', label: 'Bloqueado', class: 'node-locked' };
    if (isCompleted) {
      // Check if all quizzes for this module have score >= 80%
      const modQuizzes = (window.CyberData?.quizzes || []).filter(q => q.moduleId === mod.id);
      const isMastered = modQuizzes.length > 0 && modQuizzes.every(q => data.passedQuizzes.includes(q.id));
      if (isMastered) {
        return { code: 'mastered', icon: '👑', label: 'Dominado', class: 'node-mastered' };
      }
      return { code: 'completed', icon: '✅', label: 'Completado', class: 'node-completed' };
    }

    const hasProgress = mod.concepts && mod.concepts.some(c => (data.masteryLevels[c.id] || 0) > 0);
    if (hasProgress) return { code: 'in_progress', icon: '📖', label: 'En Progreso', class: 'node-in-progress' };

    return { code: 'available', icon: '⚡', label: 'Disponible', class: 'node-available' };
  }

  renderPath() {
    const container = document.getElementById('recorrido-root') || document.getElementById('learning-tree-root');
    if (!container) return;

    const modules = window.CyberData?.modules || [];
    const data = this.storage.data;

    // Calculate total course completion
    const completedCount = modules.filter(m => data.completedModules.includes(m.id)).length;
    const progressPct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

    let html = `
      <div class="recorrido-header-card">
        <div class="recorrido-banner-info">
          <div class="banner-title-group">
            <span class="banner-badge">🧭 RECORRIDO PRINCIPAL</span>
            <h2>Carrera de Ciberseguridad</h2>
            <p>Aprende → Comprende → Practica → Evalúa → Domina</p>
          </div>
          <div class="recorrido-stats-summary">
            <div class="stat-box">
              <span class="stat-num">${progressPct}%</span>
              <span class="stat-lbl">Progreso Total</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">${completedCount} / ${modules.length}</span>
              <span class="stat-lbl">Módulos Listos</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">🔥 ${data.streak || 1} d</span>
              <span class="stat-lbl">Racha Actual</span>
            </div>
          </div>
        </div>
        <div class="progress-bar-container" style="margin-top:16px;">
          <div class="progress-bar-fill" style="width:${progressPct}%;"></div>
        </div>
      </div>

      <div class="recorrido-path-container">
        <div class="serpentine-path">
    `;

    // Group modules by stages
    const stagesMap = {};
    modules.forEach(mod => {
      const stageId = mod.stage ?? 0;
      if (!stagesMap[stageId]) stagesMap[stageId] = [];
      stagesMap[stageId].push(mod);
    });

    const stageTitles = {
      0: 'Etapa 0: Fundamentos & Alfabetización Digital',
      1: 'Etapa 1: Sistemas Operativos (Linux & Windows)',
      2: 'Etapa 2: Redes & Telecomunicaciones',
      3: 'Etapa 3: Arquitectura de Internet & Web',
      4: 'Etapa 4: Programación Orientada a Ciberseguridad',
      7: 'Etapa 7: Bastionado & Defensa en Profundidad',
      11: 'Etapa 11: SOC, Análisis Forense & Laboratorios'
    };

    let globalNodeIndex = 0;

    Object.keys(stagesMap).sort((a,b) => Number(a) - Number(b)).forEach(stageKey => {
      const stageMods = stagesMap[stageKey];
      const stageTitle = stageTitles[stageKey] || `Etapa ${stageKey}`;

      html += `
        <div class="path-stage-divider">
          <span class="stage-divider-tag">⚡ ${stageTitle}</span>
        </div>
      `;

      stageMods.forEach(mod => {
        const status = this.getNodeStatus(mod);
        globalNodeIndex++;

        // Calculate offset for serpentine curve (centered sinusoidal path)
        const curveOffset = Math.sin(globalNodeIndex * 0.9) * 90; // px offset

        html += `
          <div class="node-wrapper" style="transform: translateX(${curveOffset}px);">
            <button class="path-node-btn ${status.class}" 
                    data-module-id="${mod.id}" 
                    onclick="window.CyberRecorrido.openLesson('${mod.id}')"
                    ${status.code === 'locked' ? 'disabled' : ''}>
              <span class="node-icon">${mod.icon}</span>
              <span class="node-status-badge">${status.icon}</span>
              <div class="node-pulse-ring"></div>
            </button>
            <div class="node-info-card">
              <div class="node-title">${mod.title}</div>
              <div class="node-meta">${mod.category} · ${mod.estimatedTime}</div>
              <div class="node-status-tag ${status.code}">${status.label}</div>
            </div>
          </div>
        `;
      });
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /* ==========================================================================
     LESSON EXPERIENCE (Theory -> Practice -> Exam -> AI Review -> Celebration)
     ========================================================================== */

  openLesson(moduleId) {
    const mod = (window.CyberData?.modules || []).find(m => m.id === moduleId);
    if (!mod) return;

    this.currentLesson = mod;
    this.lessonStepIndex = 0;
    this.theoryCardIndex = 0;
    this.examAnswers = {};

    this.renderLessonModal();
  }

  renderLessonModal() {
    let modal = document.getElementById('lesson-experience-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'lesson-experience-modal';
      modal.className = 'modal-overlay lesson-modal-overlay active';
      document.body.appendChild(modal);
    } else {
      modal.classList.add('active');
    }

    const mod = this.currentLesson;
    const concepts = mod.concepts || [];
    const currentConcept = concepts[this.theoryCardIndex] || concepts[0] || {};
    const totalConcepts = concepts.length;

    let contentHtml = '';

    // Step 0: THEORY
    if (this.lessonStepIndex === 0) {
      const readPct = totalConcepts > 0 ? Math.round(((this.theoryCardIndex + 1) / totalConcepts) * 100) : 100;

      contentHtml = `
        <div class="lesson-modal-header">
          <div class="lesson-step-tag">📖 TEORÍA — CONCEPTO ${this.theoryCardIndex + 1} DE ${totalConcepts}</div>
          <button class="lesson-close-btn" onclick="window.CyberRecorrido.closeLessonModal()">✕</button>
        </div>

        <div class="lesson-progress-bar">
          <div class="progress-bar-fill" style="width:${readPct}%"></div>
        </div>

        <div class="lesson-content-body">
          <div class="concept-badge-header">
            <span class="concept-icon">${mod.icon}</span>
            <div>
              <h3 class="concept-title">${currentConcept.name}</h3>
              <p class="concept-summary">${currentConcept.summary}</p>
            </div>
          </div>

          <div class="theory-block card-glass">
            <h4 style="color:var(--accent-cyan);margin-bottom:10px">📘 Explicación Conceptual:</h4>
            <div class="theory-text">${this.formatMarkdown(currentConcept.theory)}</div>
          </div>

          ${currentConcept.example ? `
            <div class="example-block card-glass">
              <h4 style="color:var(--accent-yellow);margin-bottom:6px">💡 Ejemplo Real / Caso Contextual:</h4>
              <p style="font-size:0.95rem;color:var(--text-main)">${currentConcept.example}</p>
            </div>
          ` : ''}

          <div class="defense-detection-grid">
            <div class="defense-box">
              <strong style="color:var(--accent-green)">🛡️ Cómo Defender:</strong>
              <p style="font-size:0.88rem;margin-top:4px">${currentConcept.defense || 'Aplicar controles de seguridad.'}</p>
            </div>
            <div class="detection-box">
              <strong style="color:var(--accent-purple)">🔍 Cómo Detectar:</strong>
              <p style="font-size:0.88rem;margin-top:4px">${currentConcept.detection || 'Monitorear registros de auditoría.'}</p>
            </div>
          </div>

          <div class="inline-tutor-prompt card-glass">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:1.6rem">🤖</span>
              <div style="flex:1">
                <strong>CyberTutor:</strong> <span style="color:var(--text-muted);font-size:0.9rem">¿Tienes dudas sobre este tema?</span>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.CyberTutorAssistant.askAboutConcept('${currentConcept.name}')">Preguntar a IA</button>
            </div>
          </div>
        </div>

        <div class="lesson-modal-footer">
          <button class="btn btn-secondary" 
                  onclick="window.CyberRecorrido.prevTheoryCard()" 
                  ${this.theoryCardIndex === 0 ? 'disabled' : ''}>
            ← Anterior
          </button>

          <span style="font-size:0.85rem;color:var(--text-muted)">+25 XP por lectura</span>

          <button class="btn btn-primary" onclick="window.CyberRecorrido.nextTheoryCard()">
            ${this.theoryCardIndex < totalConcepts - 1 ? 'Siguiente Tarjeta →' : 'Ir a Práctica 🧪 →'}
          </button>
        </div>
      `;
    }

    // Step 1: PRACTICE
    else if (this.lessonStepIndex === 1) {
      const currentConcept = concepts[0] || {};
      contentHtml = `
        <div class="lesson-modal-header">
          <div class="lesson-step-tag yellow">🧪 FASE DE PRÁCTICA & EJERCICIO</div>
          <button class="lesson-close-btn" onclick="window.CyberRecorrido.closeLessonModal()">✕</button>
        </div>

        <div class="lesson-content-body">
          <div class="card-glass" style="margin-bottom:20px;border-left:4px solid var(--accent-yellow)">
            <h3 style="color:var(--accent-yellow);margin-bottom:8px">🧪 Ejercicio Práctico Sugerido</h3>
            <p style="font-size:1rem;color:var(--text-main);margin-bottom:12px">${currentConcept.practice || 'Realiza un análisis práctico del concepto estudiado.'}</p>
          </div>

          <div class="card-glass">
            <h4 style="color:var(--accent-cyan);margin-bottom:10px">💻 Caso de Análisis de Seguridad:</h4>
            <p style="font-size:0.92rem;color:var(--text-muted)">
              Analiza el siguiente escenario: Si se detecta un incidente en este módulo (<strong>${mod.title}</strong>), ¿cuál sería tu primera acción defensiva inmediata?
            </p>
            <div class="practice-action-box" style="margin-top:14px">
              <button class="btn btn-secondary" style="text-align:left;width:100%;margin-bottom:8px" onclick="window.CyberRecorrido.handlePracticeChoice(this, true)">
                ✅ Aplicar aislamiento de red / contención e inspección de logs.
              </button>
              <button class="btn btn-secondary" style="text-align:left;width:100%;" onclick="window.CyberRecorrido.handlePracticeChoice(this, false)">
                ❌ Reiniciar el servidor de inmediato sin guardar evidencias forenses.
              </button>
            </div>
            <div id="practice-feedback" style="margin-top:14px;display:none"></div>
          </div>
        </div>

        <div class="lesson-modal-footer">
          <button class="btn btn-secondary" onclick="window.CyberRecorrido.lessonStepIndex = 0; window.CyberRecorrido.renderLessonModal()">← Volver a Teoría</button>
          <button class="btn btn-primary" id="btn-to-exam" onclick="window.CyberRecorrido.goToExam()">Comenzar Mini Examen (Obligatorio) 📝 →</button>
        </div>
      `;
    }

    // Step 2: MINI EXAM
    else if (this.lessonStepIndex === 2) {
      const quizzes = (window.CyberData?.quizzes || []).filter(q => q.moduleId === mod.id);
      const examQuestions = quizzes.length > 0 ? quizzes.slice(0, 5) : [
        {
          id: `mod-q-${mod.id}-1`,
          question: `¿Cuál es el objetivo principal del módulo '${mod.title}'?`,
          options: [
            "Establecer controles y entender los mecanismos de protección",
            "Desactivar todos los cortafuegos del sistema",
            "Compartir contraseñas en texto claro",
            "Eliminar los registros de auditoría"
          ],
          answer: 0,
          explanation: "La finalidad fundamental es comprender los conceptos técnicos para aplicar defensas efectivas."
        }
      ];

      this.currentExamQuestions = examQuestions;

      let questionsHtml = '';
      examQuestions.forEach((q, idx) => {
        const selectedOpt = this.examAnswers[q.id];
        questionsHtml += `
          <div class="quiz-question-card card-glass" style="margin-bottom:16px;">
            <div style="font-weight:700;color:var(--accent-cyan);margin-bottom:8px">Pregunta ${idx + 1} de ${examQuestions.length}</div>
            <div style="font-size:1rem;margin-bottom:12px">${q.question}</div>
            <div class="options-list">
              ${q.options.map((opt, oIdx) => `
                <button class="option-btn ${selectedOpt === oIdx ? 'selected' : ''}" 
                        onclick="window.CyberRecorrido.selectExamAnswer('${q.id}', ${oIdx})">
                  <span class="opt-prefix">${String.fromCharCode(65 + oIdx)}.</span> ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      });

      contentHtml = `
        <div class="lesson-modal-header">
          <div class="lesson-step-tag purple">📝 MINI EXAMEN OBLIGATORIO — 80% PARA APROBAR</div>
          <button class="lesson-close-btn" onclick="window.CyberRecorrido.closeLessonModal()">✕</button>
        </div>

        <div class="lesson-content-body">
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px">
            Responde correctamente al menos el 80% de las preguntas para validar tu aprendizaje y desbloquear el siguiente nodo.
          </p>
          ${questionsHtml}
        </div>

        <div class="lesson-modal-footer">
          <button class="btn btn-secondary" onclick="window.CyberRecorrido.lessonStepIndex = 1; window.CyberRecorrido.renderLessonModal()">← Volver a Práctica</button>
          <button class="btn btn-primary" onclick="window.CyberRecorrido.submitExam()">Entregar Examen 📊</button>
        </div>
      `;
    }

    // Step 3: AI ANALYSIS & RESULTS
    else if (this.lessonStepIndex === 3) {
      const score = this.lastExamScore || 0;
      const total = this.lastExamTotal || 1;
      const pct = Math.round((score / total) * 100);
      const passed = pct >= 80;

      contentHtml = `
        <div class="lesson-modal-header">
          <div class="lesson-step-tag ${passed ? 'green' : 'yellow'}">
            ${passed ? '🎉 RESULTADO: ¡APROBADO!' : '⚠️ RESULTADO: REQUIERE REPASO'}
          </div>
          <button class="lesson-close-btn" onclick="window.CyberRecorrido.closeLessonModal()">✕</button>
        </div>

        <div class="lesson-content-body">
          <div class="score-display-card card-glass" style="text-align:center;padding:24px;">
            <div style="font-size:3rem;font-weight:800;color:${passed ? 'var(--accent-green)' : 'var(--accent-yellow)'}">
              ${pct}%
            </div>
            <div style="font-size:1.1rem;margin-top:4px">${score} de ${total} respuestas correctas</div>
          </div>

          <div class="card-glass" style="margin-top:20px;">
            <h4 style="color:var(--accent-cyan);display:flex;align-items:center;gap:8px">
              🤖 Análisis Diagnóstico de CyberTutor
            </h4>
            <div id="ai-exam-feedback" style="margin-top:10px;font-size:0.95rem;line-height:1.6">
              ${passed 
                ? `¡Excelente trabajo! Has demostrado una comprensión sólida de <strong>${mod.title}</strong>. Has dominado los conceptos clave y estás listo para avanzar.` 
                : `Obtuviste ${pct}%. Te sugerimos repasar la teoría de <strong>${mod.title}</strong> y realizar un breve repaso antes de intentar nuevamente.`}
            </div>
          </div>
        </div>

        <div class="lesson-modal-footer">
          ${!passed ? `
            <button class="btn btn-secondary" onclick="window.CyberRecorrido.lessonStepIndex = 0; window.CyberRecorrido.renderLessonModal()">Repasar Teoría 📖</button>
            <button class="btn btn-primary" onclick="window.CyberRecorrido.lessonStepIndex = 2; window.CyberRecorrido.renderLessonModal()">Reintentar Examen 🔄</button>
          ` : `
            <button class="btn btn-primary" onclick="window.CyberRecorrido.completeLessonCelebration()">Continuar a Celebración 🎉 →</button>
          `}
        </div>
      `;
    }

    // Step 4: CELEBRATION
    else if (this.lessonStepIndex === 4) {
      contentHtml = `
        <div class="lesson-modal-header">
          <div class="lesson-step-tag green">🏆 ¡LECCIÓN COMPLETADA!</div>
          <button class="lesson-close-btn" onclick="window.CyberRecorrido.closeLessonModal()">✕</button>
        </div>

        <div class="lesson-content-body" style="text-align:center;padding:20px 10px;">
          <div style="font-size:4rem;margin-bottom:10px">🎉</div>
          <h2 style="color:var(--accent-cyan);margin-bottom:8px">¡Felicitaciones!</h2>
          <p style="font-size:1.1rem;color:var(--text-main)">Has completado exitosamente <strong>${mod.title}</strong></p>

          <div class="celebration-rewards-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:24px 0;">
            <div class="reward-card card-glass">
              <span style="font-size:1.8rem">⚡</span>
              <div style="font-size:1.2rem;font-weight:800;color:var(--accent-yellow)">+150 XP</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">Recompensa de Lección</div>
            </div>
            <div class="reward-card card-glass">
              <span style="font-size:1.8rem">🔥</span>
              <div style="font-size:1.2rem;font-weight:800;color:var(--accent-green)">Racha Mantenida</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">${this.storage.data.streak} Días Consecutivos</div>
            </div>
          </div>

          <div class="card-glass" style="background:rgba(0,240,255,0.08);border-color:var(--accent-cyan)">
            <strong style="color:var(--accent-cyan)">🔓 Nuevo Nodo Desbloqueado en tu Recorrido</strong>
          </div>
        </div>

        <div class="lesson-modal-footer" style="justify-content:center">
          <button class="btn btn-primary btn-lg" onclick="window.CyberRecorrido.finishLessonAndReturn()">
            Continuar Recorrido 🧭
          </button>
        </div>
      `;
    }

    modal.innerHTML = `<div class="modal-card lesson-modal-card">${contentHtml}</div>`;
  }

  nextTheoryCard() {
    const concepts = this.currentLesson.concepts || [];
    window.CyberGamification.addXP(25, 'Bloque de teoría leído', `theory_read:${this.currentLesson.id}_${this.theoryCardIndex}`);

    if (this.theoryCardIndex < concepts.length - 1) {
      this.theoryCardIndex++;
      this.renderLessonModal();
    } else {
      this.lessonStepIndex = 1; // Go to Practice
      this.renderLessonModal();
    }
  }

  prevTheoryCard() {
    if (this.theoryCardIndex > 0) {
      this.theoryCardIndex--;
      this.renderLessonModal();
    }
  }

  handlePracticeChoice(btnEl, isCorrect) {
    const feedbackEl = document.getElementById('practice-feedback');
    if (!feedbackEl) return;

    feedbackEl.style.display = 'block';
    if (isCorrect) {
      feedbackEl.className = 'practice-feedback-box success';
      feedbackEl.innerHTML = `
        <strong style="color:var(--accent-green)">✓ CORRECTO (+30 XP)</strong>
        <p style="font-size:0.9rem;margin-top:4px">Aislar la máquina y preservar la memoria/logs es la primera regla forense para contención y análisis de causa raíz.</p>
      `;
      window.CyberGamification.addXP(30, 'Práctica completada con éxito', `practice_${this.currentLesson.id}`);
    } else {
      feedbackEl.className = 'practice-feedback-box error';
      feedbackEl.innerHTML = `
        <strong style="color:var(--accent-red)">✕ INCORRECTO</strong>
        <p style="font-size:0.9rem;margin-top:4px">Reiniciar el equipo borra la memoria RAM volátil y destruye los artefactos del ataque (procesos, sockets de red, claves en memoria).</p>
      `;
    }
  }

  goToExam() {
    this.lessonStepIndex = 2;
    this.renderLessonModal();
  }

  selectExamAnswer(questionId, optionIdx) {
    this.examAnswers[questionId] = optionIdx;
    this.renderLessonModal();
  }

  submitExam() {
    const questions = this.currentExamQuestions || [];
    let score = 0;

    questions.forEach(q => {
      if (this.examAnswers[q.id] === q.answer) {
        score++;
      }
    });

    this.lastExamScore = score;
    this.lastExamTotal = questions.length;

    const data = this.storage.data;

    // Check if passed (>= 80%)
    if ((score / questions.length) >= 0.8) {
      // Record passed quizzes
      questions.forEach(q => {
        if (!data.passedQuizzes.includes(q.id)) {
          data.passedQuizzes.push(q.id);
        }
      });

      // Add to completed modules
      if (!data.completedModules.includes(this.currentLesson.id)) {
        data.completedModules.push(this.currentLesson.id);
      }
      this.storage.saveData();
    } else {
      // Log mistakes for Spaced Repetition
      questions.forEach(q => {
        if (this.examAnswers[q.id] !== q.answer) {
          data.mistakes.push({
            questionId: q.id,
            moduleId: this.currentLesson.id,
            timestamp: Date.now(),
            reviewDate: Date.now() + 86400000 // 1 day later
          });
        }
      });
      this.storage.saveData();
    }

    this.lessonStepIndex = 3; // Go to AI Analysis
    this.renderLessonModal();
  }

  completeLessonCelebration() {
    window.CyberGamification.addXP(150, 'Lección completada', `lesson_completed_${this.currentLesson.id}`);
    this.triggerConfetti();
    this.lessonStepIndex = 4; // Go to Celebration
    this.renderLessonModal();
  }

  finishLessonAndReturn() {
    this.closeLessonModal();
    this.renderPath();
  }

  closeLessonModal() {
    const modal = document.getElementById('lesson-experience-modal');
    if (modal) modal.classList.remove('active');
  }

  formatMarkdown(str) {
    return String(str || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
}

window.CyberRecorrido = new RecorridoEngine();
