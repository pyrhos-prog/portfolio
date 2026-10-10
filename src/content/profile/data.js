export const profileData = {
  handle: "pyrhos",
  fullName: "Pyrhos // CyberSec & SysAdmin",
  role: "Cybersecurity Analyst & Infrastructure Enthusiast",
  location: "Madrid / Remoto",
  status: "OPEN_FOR_OPPORTUNITIES",
  bio: "Apasionado por la ciberseguridad defensiva y ofensiva, monitorización con honeypots, automatización de sistemas Linux y resolución de retos CTF en HackTheBox y TryHackMe.",
  terminalGreeting: [
    "  ___  _   _ ____  _   _  ___  ____  ",
    " |  _ \\| | | |  _ \\| | | |/ _ \\/ ___| ",
    " | |_) | |_| | |_) | |_| | | | \\___ \\ ",
    " |  __/ \\__, |_  _ <|  _  | |_| |___) |",
    " |_|    |___/|_| \\_\\_| |_|\\___/|____/ ",
    "",
    " > SYSTEM INITIALIZED. SECURE PROTOCOL ACTIVE.",
    " > Terminal interactiva en línea. Escribe 'help' para comandos disponibles."
  ],
  socials: {
    github: "https://github.com/pyrhos",
    linkedin: "https://linkedin.com/in/tu-perfil",
    hackthebox: "https://app.hackthebox.com/profile/pyrhos",
    tryhackme: "https://tryhackme.com/p/pyrhos",
    email: "pyrhos@sec-lab.net",
    pgp: "4A7B 9C12 88DF 33A1 55E0 99BB CC81 22F4"
  },
  skills: [
    { category: "Sistemas & Cloud", items: ["Linux / Debian / Ubuntu", "Docker & Docker Compose", "Bash Scripting", "IPTables / UFW", "SSH Hardening"] },
    { category: "Seguridad & SOC", items: ["Cowrie Honeypot", "Grafana & Loki", "Grafana Alloy", "Threat Intelligence", "Análisis Forense", "Wireshark"] },
    { category: "Pentesting & CTF", items: ["Nmap", "Burp Suite", "Metasploit", "GTFOBins", "SQL Injection", "Privilege Escalation"] },
    { category: "Desarrollo & Datos", items: ["Python 3", "JSON / YAML", "Git / GitHub Actions", "SQL / PostgreSQL", "HTML5 / CSS / JS"] }
  ],
  experience: [
    {
      period: "2024 - Presente",
      role: "SysAdmin & Monitorización de Seguridad",
      company: "Laboratorio Personal / Proyectos Independientes",
      location: "Remoto",
      description: "Despliegue y administración de VPS público con honeypots interactivos (Cowrie) para captura y telemetría de amenazas globales. Configuración de pipelines con Grafana Alloy y Loki.",
      highlights: [
        "Monitorización activa de más de 25,000 intentos de intrusión mensuales.",
        "Automatización de alertas y correlación de vectores de ataque con GeoIP.",
        "Mantenimiento de infraestructura dockerizada con políticas de firewall estrictas."
      ]
    },
    {
      period: "2023 - 2024",
      role: "Técnico de Sistemas & Redes",
      company: "Prácticas / Soporte TI",
      location: "España",
      description: "Administración de redes locales, configuración de servidores Linux/Windows y gestión de copias de seguridad automatizadas.",
      highlights: [
        "Desarrollo de scripts en Bash y Python para tareas recurrentes de mantenimiento.",
        "Implementación de auditorías básicas de seguridad en servicios expuestos."
      ]
    }
  ],
  education: [
    {
      period: "2023 - 2025",
      degree: "CFGS Administración de Sistemas Informáticos en Red (ASIR)",
      institution: "Centro de Estudios Tecnológicos",
      description: "Especialización en redes y telecomunicaciones, administración avanzada de servidores Linux/Windows, seguridad informática y servicios de red."
    },
    {
      period: "2024",
      degree: "Especialización en Ciberseguridad & Pentesting",
      institution: "Formación Continua / Plataformas Prácticas",
      description: "Resolución de máquinas y laboratorios en HackTheBox, TryHackMe y retos de CTFtime centrados en OWASP Top 10 y escalada de privilegios."
    }
  ],
  certifications: [
    { name: "eJPTv2 (en preparación)", issuer: "INE Security", year: "2026", status: "In Progress" },
    { name: "CompTIA Security+ / Linux+", issuer: "CompTIA", year: "2025", status: "Completado" },
    { name: "TryHackMe Top 5% Global", issuer: "TryHackMe", year: "2024", status: "Logro" }
  ]
};
