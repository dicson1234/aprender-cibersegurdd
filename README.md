# 🛡️ CyberLab — Academia Personal Interactiva de Ciberseguridad

**CyberLab** es una plataforma web educativa completa, responsive y estática, diseñada para guiar a estudiantes desde cero hasta alcanzar un nivel profesional y avanzado en ciberseguridad.

Diseñada bajo la filosofía:
`TEORÍA → EJEMPLO → PRÁCTICA → RETO → EVALUACIÓN → REPASO → DOMINIO`

---

## 🌟 Características Principales

1. **100% Estática & Compatible con GitHub Pages**: Funciona en el navegador sin necesidad de servidores backend complejos.
2. **Offline First & PWA**: Guarda todo tu progreso localmente (`localStorage`) y puede instalarse como aplicación en teléfonos Android, iOS, tablets o computadoras.
3. **Sistema de Gamificación**:
   - Experiencia (XP), Niveles y Rachas de estudio diarias.
   - 10+ Logros y Medallas desbloqueables.
4. **Dashboard Interactivo**:
   - Indicadores de progreso general por áreas (Redes, Linux, Windows, Web, Pentesting, SOC).
   - Motor Inteligente de Recomendación sobre "Qué estudiar después".
5. **Mapa de Conocimientos & Árbol de Aprendizaje**:
   - Visualización de la carrera completa dividida en Etapas (0 a 18).
   - Nodos interactivos con estado de prerrequisitos (🔴 No iniciado, 🟡 En progreso, 🟢 Aprendido, 🔵 Dominado, 🔒 Bloqueado).
   - Escala de Dominio (Nivel 0 al Nivel 6: Reconozco, Explico, Uso, Analizo, Aplico, Enseño).
6. **Contenido Educativo Completo Incluido**:
   - **10 Módulos de Fundamentos** (50+ conceptos detallados).
   - **30 Preguntas de Examen** con estándar del 80% de aprobación.
   - **10 Retos de Razonamiento y Análisis de Logs**.
   - **5 Laboratorios Guiados Paso a Paso** con simulador de terminal CLI.
   - **30 Recursos Curados** (Videos 🇪🇸, Cursos, Documentaciones, Libros).
   - **20+ Términos de Glosario** (definición sencilla y técnica).
   - **10 Herramientas Esenciales** (Nmap, Wireshark, Burp Suite, Volatility, Ghidra...).
   - **8 Proyectos Prácticos de Seguridad**.
   - **CyberCases**: Simulador de investigación de incidentes ficticios.
   - **Matriz Educativa MITRE ATT&CK**.
7. **Repaso Espaciado ("Errores que cometí")**:
   - Registra automáticamente tus fallos en exámenes y programa repeticiones periódicas (Día 1, 3, 7, 14, 30).
8. **Mis Apuntes & "Lo que todavía no entiendo"**:
   - Gestor de notas personales con etiquetas y detección de lagunas de conocimiento.
9. **CyberTutor (IA Educativa)**:
   - Interfaz interactiva de asistente IA con guía de arquitectura backend segura.
10. **Respaldo & Migración**:
    - Exporta e Importa todo tu progreso en un archivo JSON en un solo clic.

---

## 📁 Estructura del Proyecto

```
cyberlab/
├── index.html                # Shell principal de la aplicación SPA
├── manifest.json             # Manifiesto de PWA para instalación móvil
├── sw.js                     # Service Worker para funcionamiento Offline
├── README.md                 # Guía de documentación y despliegue
├── css/
│   ├── variables.css         # Tokens de diseño y colores del tema oscuro
│   ├── main.css              # Layout responsive (Sidebar + Navigation)
│   └── components.css        # Estilos de tarjetas, consola CLI y modales
├── js/
│   ├── storage.js            # Administrador de LocalStorage y Backups JSON
│   ├── gamification.js       # Motor de XP, Niveles y Logros
│   ├── navigation.js         # Enrutador SPA e interfaz móvil
│   ├── dashboard.js          # Renderizador de Dashboard y Recomendaciones
│   ├── knowledge_map.js      # Mapa interactivo de conocimientos
│   ├── learning_tree.js      # Árbol de lecciones y escala de dominio 0-6
│   ├── labs_engine.js        # Laboratorios guiados interactivos
│   ├── quizzes_engine.js     # Exámenes con estándar de 80%
│   ├── spaced_repetition.js  # Motor de repaso espaciado de errores
│   ├── notes_engine.js       # Gestor CRUD de apuntes personales
│   ├── resources_engine.js   # Biblioteca de recursos curados (ES/EN)
│   ├── cybertutor.js         # Interfaz de asistente IA tutor
│   ├── search.js             # Buscador global instantáneo
│   └── app.js                # Inicializador de la aplicación
└── data/
    ├── modules.json          # Módulos educativos y conceptos
    ├── quizzes.json          # Banco de preguntas de examen
    ├── challenges.json       # Retos de razonamiento
    ├── labs.json             # Laboratorios prácticos guiados
    ├── resources.json        # Recursos externos curados
    ├── glossary.json         # Glosario y diccionario técnico
    ├── tools.json            # Herramientas de ciberseguridad
    ├── achievements.json     # Logros desbloqueables
    ├── projects.json         # Proyectos prácticos progresivos
    ├── roadmaps.json         # Rutas y especializaciones de carrera
    ├── cases.json            # Investigaciones de casos (CyberCases)
    └── mitre.json            # Matriz MITRE ATT&CK educativa
```

---

## 🚀 Cómo Ejecutar Localmente

No requiere Node.js ni instalación de dependencias.

### Opción A: Usando Python (Recomendado)
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Para Python 3:
python3 -m http.server 8000
```
Luego abre tu navegador en: `http://localhost:8000`

### Opción B: Usando VS Code (Live Server)
1. Abre la carpeta `ciberseguridad` en VS Code.
2. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.

---

## 🌐 Cómo Publicar en GitHub Pages

Para publicar tu **CyberLab** en **GitHub Pages** de forma 100% gratuita:

1. Crea un nuevo repositorio en GitHub llamado `cyberlab`.
2. En tu terminal local dentro de la carpeta del proyecto, inicializa git y sube los archivos:

```bash
git init
git add .
git commit -m "Initial commit of CyberLab Platform"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cyberlab.git
git push -u origin main
```

3. Ve a tu repositorio en GitHub: **Settings (Configuración)** → **Pages**.
4. En **Build and deployment** → **Source**, selecciona `Deploy from a branch`.
5. Elige la rama `main` y la carpeta `/ (root)`. Presiona **Save**.
6. En un par de minutos tu plataforma estará disponible públicamente en:
   `https://TU_USUARIO.github.io/cyberlab/`

---

## ➕ Cómo Agregar Nuevos Módulos y Recursos

Todos los datos de la plataforma están desacoplados del código en la carpeta `/data/`. Podrás ampliar la plataforma durante años sin tocar el código JavaScript.

### Para agregar un nuevo Módulo Educativo (`data/modules.json`):
Añade un objeto al arreglo:

```json
{
  "id": "mod-11",
  "stage": 1,
  "title": "11. Nuevo Módulo",
  "category": "Linux",
  "icon": "🐧",
  "description": "Descripción del módulo",
  "prerequisites": ["mod-04"],
  "estimatedTime": "40 min",
  "concepts": [
    {
      "id": "concept-ejemplo",
      "name": "Nombre del Concepto",
      "summary": "Resumen breve",
      "theory": "Explicación teórica...",
      "example": "Ejemplo de aplicación...",
      "practice": "Ejercicio recomendado...",
      "defense": "Cómo defender...",
      "detection": "Cómo detectar...",
      "tags": ["#linux"]
    }
  ]
}
```

### Para agregar un nuevo Recurso External (`data/resources.json`):
```json
{
  "id": "res-nuevo",
  "title": "Título del Curso o Video",
  "description": "Descripción educativa",
  "language": "es",
  "type": "🎥 Video",
  "level": "Principiante",
  "category": "Redes",
  "duration": "2 hrs",
  "url": "https://...",
  "rating": 5
}
```

---

## 🔄 Respaldar y Migrar tu Progreso

1. En el encabezado superior o en tu sección **Mi Perfil**, presiona **📥 Exportar Progreso JSON**.
2. Se descargará un archivo `cyberlab_backup_FECHA.json`.
3. Abre CyberLab en cualquier otro dispositivo (teléfono o laptop), ve a **Mi Perfil**, presiona **📤 Importar JSON** y selecciona tu archivo para restaurar instantáneamente tus notas, nivel, XP, laboratorios y rachas.

---

## ⚖️ Principios Éticos y Legales

Toda la plataforma CyberLab enseña ciberseguridad desde una perspectiva **estrictamente defensiva, ética y legal**. Todos los experimentos ofensivos presentados deben realizarse exclusivamente en entornos autorizados, redes locales propias o máquinas virtuales aisladas.
