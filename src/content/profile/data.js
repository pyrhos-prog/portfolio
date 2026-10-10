export const profileData = {
  handle: "pyrhos",
  fullName: "Osman // Pyrhos",
  role: "Junior Penetration Tester & Red Team Enthusiast",
  age: 20,
  location: "Segovia, España",
  status: "OPEN_FOR_OPPORTUNITIES",
  objective: "Red Team / Pentesting / Seguridad Ofensiva",
  bio: "Estudiante de ASIR y apasionado de la seguridad ofensiva y el adversario simulation. Especializado en evaluación de Active Directory, auditoría de aplicaciones web, despliegue de telemetría y desarrollo de herramientas tooling en Python y TypeScript.",
  terminalGreeting: [
    "  ___  _   _ ____  _   _  ___  ____  ",
    " |  _ \\| | | |  _ \\| | | |/ _ \\/ ___| ",
    " | |_) | |_| | |_) | |_| | | | \\___ \\ ",
    " |  __/ \\__, |_  _ <|  _  | |_| |___) |",
    " |_|    |___/|_| \\_\\_| |_|\\___/|____/ ",
    "",
    " > OPERATOR: Osman (pyrhos) // LOC: Segovia, ES",
    " > TARGET OBJECTIVE: Red Team / Pentesting / Adversary Emulation",
    " > Terminal lista. Escribe 'help' para explorar proyectos, writeups y wiki."
  ],
  socials: {
    github: "https://github.com/pyrhos-prog",
    gitbook: "https://pyrhos.gitbook.io",
    beacons: "https://beacons.ai/pyrhos",
    hackthebox: "https://app.hackthebox.com/profile/pyrhos",
    tryhackme: "https://tryhackme.com/p/pyrhos",
    email: "pyrhos@sec-lab.net",
    pgp: "4A7B 9C12 88DF 33A1 55E0 99BB CC81 22F4"
  },
  skills: [
    {
      category: "Seguridad Ofensiva & Red Team",
      items: ["Active Directory Attacks", "BloodHound / NetExec", "Responder (LLMNR/NBT-NS)", "Sliver C2 Framework", "Burp Suite / Caido", "FFuF (Web Fuzzing)", "Nmap & Recon Scripting", "hcxdumptool (WiFi)"]
    },
    {
      category: "Desarrollo & Tooling",
      items: ["Python 3 (FastAPI, Flask)", "SQLAlchemy 2.0 / Pydantic v2", "JavaScript / TypeScript", "React / Next.js 14", "PostgreSQL / SQLite", "Alembic (Migrations)"]
    },
    {
      category: "Sistemas & Infraestructura",
      items: ["Proxmox VE (Homelab & AD)", "Docker & Docker Compose", "Linux (CachyOS, Fedora, Debian)", "iptables Hardening", "PowerShell Scripting", "Bash Automation", "Grafana Alloy & Loki", "Systemd Services"]
    },
    {
      category: "Hardware & Fabricación Aditiva",
      items: ["Anycubic Kobra X (PETG, PLA, PLA +)", "OrcaSlicer Tuning", "FreeCAD (Modelado 3D)"]
    }
  ],
  experience: [
    {
      period: "2025 - 2026",
      isCurrent: true,
      role: "Técnico / Becario de Ciberseguridad & Sistemas (Técnico de SOC)",
      company: "EVOLK SL",
      location: "Segovia, España",
      badgeColor: "emerald",
      icon: "🛡️",
      description: "Operaciones de SOC, monitorización en soluciones EPDR ante incidentes reales, administración de sistemas y desarrollo de tooling interno para automatización.",
      highlights: [
        "Realicé el triaje, detección y análisis forense inicial en soluciones EPDR ante cadenas de ataque complejas en producción (detección de dropper en JavaScript con ejecución de implante PowerShell fileless en memoria mediante wmiprvse.exe).",
        "Diseñé, desarrollé y puse en producción la herramienta interna 'Backup Error Tracker' (Flask, SQLite y JavaScript vanilla), automatizando la monitorización y captura de incidencias mediante APIs de Datos101 y MSP360.",
        "Automaticé directivas y restricciones de seguridad perimetrales y de puesto en PowerShell para despliegues masivos en entornos educativos y clientes corporativos.",
        "Elaboré documentación técnica de alto impacto: redacción de dossiers de auditoría comercial para pymes e informe técnico de estado de migración de firewalls WatchGuard presentado al CTO.",
        "Brindé soporte técnico remoto de nivel 2 y resolución de incidencias en servidores e infraestructuras de clientes."
      ],
      skills: ["EPDR Forensics", "PowerShell", "Flask", "WatchGuard", "SOC Triage", "APIs Integration"]
    }
  ],
  education: [
    {
      period: "2026 - PRESENTE",
      isCurrent: true,
      degree: "CFGS Administración de Sistemas Informáticos en Red (ASIR)",
      institution: "IES Julián Marías",
      location: "Distancia (1er año en curso)",
      badgeColor: "emerald",
      icon: "🎓",
      description: "Especialización oficial en diseño, implantación y administración de arquitecturas de red empresariales, sistemas operativos y seguridad perimetral.",
      highlights: [
        "Administración avanzada de sistemas operativos de servidor (Linux y Windows Server) y servicios corporativos.",
        "Planificación e implantación de direccionamiento IP, conmutación, enrutamiento y políticas de seguridad perimetral.",
        "Automatización de tareas de administración mediante scripting en Bash y PowerShell."
      ],
      skills: ["Redes TCP/IP", "Linux Server", "Windows Server", "Seguridad Perimetral", "Bash", "PowerShell"]
    },
    {
      period: "2024 - 2026",
      isCurrent: false,
      degree: "CFGM Instalaciones de Telecomunicaciones",
      institution: "IES María Moliner",
      location: "Segovia (Completado)",
      badgeColor: "purple",
      icon: "📡",
      description: "Formación técnica de base en redes de transmisión de datos, cableado estructurado e infraestructura de telecomunicación física.",
      highlights: [
        "Despliegue y certificación de cableado estructurado (cobre y fibra óptica) y armarios de comunicaciones (racks).",
        "Configuración física y lógica de equipos de conmutación, routing y puntos de acceso inalámbrico.",
        "Mantenimiento e integración de sistemas de telecomunicaciones e infraestructuras de enlace."
      ],
      skills: ["Cableado Estructurado", "Conmutación", "Fibra Óptica", "Hardware de Red", "Infraestructura Física"]
    }
  ],
  certifications: [
    {
      id: "cpts",
      name: "CPTS (Certified Penetration Testing Specialist)",
      issuer: "HTB Academy",
      year: "2025 - 2026",
      status: "En Curso (~50%)",
      icon: "🎯",
      url: "", // Pega aquí el enlace de tu certificado o perfil de HTB
      description: "Evaluación integral de infraestructuras corporativas, pivoting de múltiples saltos, auditoría avanzada de Active Directory, evasión de AV y redacción de informes técnicos.",
      skills: ["Active Directory", "Network Pivoting", "Evasión de Defensas", "Web Pentesting", "Privilege Escalation"]
    },
    {
      id: "ejpt-v2",
      name: "eJPT v2 (Junior Penetration Tester)",
      issuer: "eLearnSecurity / INE",
      year: "2024",
      status: "Certificado Oficial",
      icon: "🛡️",
      url: "", // Pega aquí el enlace de tu título oficial de eJPT v2
      description: "Certificación práctica oficial de evaluación y explotación de vulnerabilidades en redes empresariales, routing con Nmap, explotación con Metasploit y escalada de privilegios.",
      skills: ["Evaluación de Vulnerabilidades", "Auditoría de Redes", "Metasploit", "Nmap Routing", "Explotación Manual"]
    },
    {
      id: "hack4u-web",
      name: "Hacking Web Profesional",
      issuer: "Hack4u",
      year: "2026",
      status: "En Curso",
      icon: "🌐",
      url: "", // Pega aquí el enlace de tu certificado de Hack4u
      description: "Identificación y explotación exhaustiva de vectores vulnerables web basados en OWASP Top 10: SQLi, XSS, CSRF, SSRF, IDOR, LFI/RFI y manipulación de tokens de sesión.",
      skills: ["OWASP Top 10", "SQL Injection", "XSS & CSRF", "Burp Suite", "SSRF", "Autenticación Web"]
    },
    {
      id: "hack4u-intro",
      name: "Introducción al Hacking Ético",
      issuer: "Hack4u",
      year: "2025",
      status: "Certificado Oficial",
      icon: "💻",
      url: "", // Pega aquí el enlace de tu título oficial de Hack4u
      description: "Bases y metodología estructurada de intrusión ética, reconocimiento pasivo/activo, OSINT, escaneo de puertos y análisis de superficie de ataque.",
      skills: ["Reconocimiento", "OSINT", "Escaneo de Redes", "Conceptos de Explotación", "Metodología Ofensiva"]
    },
    {
      id: "hack4u-linux",
      name: "Introducción a Linux & Administración",
      issuer: "Hack4u",
      year: "2025",
      status: "Certificado Oficial",
      icon: "🐧",
      url: "", // Pega aquí el enlace de tu título oficial de Hack4u
      description: "Administración avanzada de sistemas GNU/Linux por consola, automatización con Bash scripting, permisos especiales (SUID, SGID, Capabilities) y tratamiento de streams.",
      skills: ["GNU/Linux CLI", "Bash Scripting", "Permisos SUID/SGID", "Gestión de Procesos", "RegEx & Filtrado"]
    }
  ],
  wiki: {
    url: "https://pyrhos.gitbook.io",
    title: "Pyrhos Technical GitBook",
    topics: [
      "Conocimientos generales de Redes, Programación, Sistemas Operativos, Fundamentos de Hardware",
      "Web Fuzzing & Enumeración (FFuF)",
      "Ataques de Fuerza Bruta y Credenciales (Hydra, Medusa, Hashcat)",
      "Directorio Activo & Kerberos (Pass the Ticket, OverPass-the-Hash, LLMNR/NBT-NS)",
      "Proxies de Intercepción Web (Burp Suite, Caido, OWASP ZAP)",
      "OSINT Estructurado (Shodan, FOFA)",
      "Auditoría Inalámbrica (hcxdumptool, WPA/WPA2 capture)"
    ]
  }
};
