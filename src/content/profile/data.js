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
      period: "2025 - PRESENTE",
      isCurrent: true,
      role: "Desarrollador Frontend Senior & UI/UX Tech Lead",
      company: "TechCorp Inc.",
      location: "Madrid / Remoto",
      badgeColor: "emerald",
      icon: "⚛️",
      description: "Liderazgo técnico en la arquitectura de interfaces, diseño de sistemas escalables y optimización de rendimiento en aplicaciones web de misión crítica.",
      highlights: [
        "Lideré el diseño y despliegue del nuevo Design System corporativo modular, reduciendo la deuda técnica en un 35% y acelerando en un 50% los ciclos de entrega de nuevos componentes.",
        "Optimicé los Core Web Vitals y flujos de renderizado, logrando puntuaciones Lighthouse de 98+ y reduciendo los tiempos de carga percibidos por debajo de 800ms.",
        "Arquitecté la integración de microservicios y APIs en tiempo real mediante WebSockets y GraphQL, garantizando una experiencia de usuario fluida y libre de latencia."
      ],
      skills: ["React 19", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "WebSockets", "UI/UX"]
    },
    {
      period: "2023 - 2025",
      isCurrent: false,
      role: "Desarrollador Web Full Stack & DevOps",
      company: "Innova Software",
      location: "España",
      badgeColor: "purple",
      icon: "⚡",
      description: "Desarrollo integral de plataformas SaaS de alto tráfico, diseño de arquitecturas cloud y automatización de procesos de ingeniería del software.",
      highlights: [
        "Construí e iteré servicios backend altamente concurrentes con Node.js, Express y PostgreSQL, optimizando consultas complejas y reduciendo el tiempo de respuesta de API en un 40%.",
        "Diseñé arquitecturas de microservicios desacoplados y flujos ágiles, mejorando la disponibilidad global del sistema hasta un 99.9%.",
        "Implementé pipelines automatizados de CI/CD con Docker y GitHub Actions, garantizando pruebas unitarias automatizadas y despliegues sin tiempo de inactividad (zero-downtime)."
      ],
      skills: ["Node.js", "Express", "PostgreSQL", "Docker", "CI/CD", "REST APIs", "Jest"]
    }
  ],
  education: [
    {
      period: "2019 - 2023",
      isCurrent: false,
      degree: "Grado en Ingeniería Informática",
      institution: "Universidad de Barcelona / Escuela Técnica Superior",
      location: "Barcelona",
      badgeColor: "purple",
      icon: "🎓",
      description: "Formación universitaria superior enfocada en ingeniería del software, algoritmia avanzada, sistemas distribuidos y arquitectura de computadores.",
      highlights: [
        "Especialización en Ingeniería del Software y Tecnologías Web, con foco en estructuras de datos complejas, bases de datos relacionales y redes distribuidas.",
        "Matrícula de Honor en el Proyecto Final de Grado por el diseño e implementación de una plataforma web distribuida y escalable.",
        "Mención de Excelencia Académica en Algoritmia Avanzada, Computación Paralela y Seguridad de Sistemas."
      ],
      skills: ["Algoritmia", "Arquitectura Software", "Sistemas Distribuidos", "Redes & Protocolos", "Bases de Datos"]
    },
    {
      period: "2023 - 2024",
      isCurrent: false,
      degree: "Programa Avanzado en Frontend Architecture & UI/UX",
      institution: "Escuela de Tecnología & Desarrollo Web",
      location: "Online / Especialización",
      badgeColor: "cyan",
      icon: "💻",
      description: "Especialización intensiva en patrones arquitectónicos avanzados de frontend, accesibilidad web internacional (WCAG) y rendimiento de cliente.",
      highlights: [
        "Dominio profundo del ciclo de renderizado de React, gestión de estado reactiva compleja (Zustand, Redux Toolkit) y Micro-Frontends.",
        "Implementación de estándares de accesibilidad WCAG 2.1 AA y creación de microanimaciones fluidas a 60fps orientadas a producto premium.",
        "Auditoría y securización de clientes web frente a vectores de ataque comunes (XSS, CSRF y sanitización de dependencias NPM)."
      ],
      skills: ["Micro-Frontends", "State Management", "WCAG 2.1", "Micro-Animations", "Web Security"]
    }
  ],
  certifications: [
    { name: "Meta Frontend Professional Certificate", issuer: "Meta", year: "2024", status: "Certificado" },
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2025", status: "Completado" },
    { name: "CompTIA Security+ / Linux Professional", issuer: "CompTIA", year: "2024", status: "Acreditado" }
  ]
};
