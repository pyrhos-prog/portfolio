# ⚡ Pyrhos // Hacker Portfolio & Cyber Lab

Portfolio web de ciberseguridad con estética hacker minimalista de terminal, paleta oscura con acento morado neón, navegación híbrida (Terminal CLI interactiva + GUI clásica) y gestión ultra fácil de proyectos y CTFs mediante archivos **Markdown (`.md`)**.

---

## 🚀 Inicio Rápido en Local

Para probarlo y editarlo en tu máquina:

```bash
cd portfolio-hacker
npm install
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 📝 ¿Cómo Subir Proyectos y CTFs Fácilmente?

El sistema detecta automáticamente cualquier archivo `.md` nuevo que agregues **sin necesidad de tocar código JS ni HTML ni editar listas**:

### 📁 Para un Nuevo Proyecto
1. Ve a la carpeta `src/content/projects/`
2. Puedes copiar la plantilla `_template.md` y renombrarla (ejemplo: `mi-firewall.md`)
3. Rellena los datos en la cabecera (frontmatter):
   ```markdown
   ---
   title: "Mi Firewall en Linux con NFTables"
   slug: "mi-firewall-nftables"
   date: "2026-10-10"
   category: "Blue Team / Infra"
   tags: ["linux", "nftables", "seguridad"]
   difficulty: "Medio" # Fácil | Medio | Difícil | Insane
   featured: true
   summary: "Configuración y endurecimiento de red perimetral..."
   github: "https://github.com/tu-usuario/repo"
   ---

   # Contenido en Markdown normal
   Aquí redactas tu documentación con código, tablas, diagramas, etc.
   ```
4. ¡Listo! Aparecerá automáticamente en la sección de proyectos de la web y en la terminal (`ls projects`, `cat mi-firewall-nftables`).

### 🚩 Para un Nuevo Reto CTF (HackTheBox, TryHackMe, etc.)
1. Ve a la carpeta `src/content/ctfs/`
2. Duplica `_template.md` (ejemplo: `htb-sherlocks.md`)
3. Define tu plataforma y flags si deseas:
   ```markdown
   ---
   title: "Sherlocks: DFIR Investigation"
   slug: "htb-sherlocks"
   date: "2026-10-10"
   platform: "HackTheBox"
   category: "Forensics"
   tags: ["dfir", "wireshark", "memory-dump"]
   difficulty: "Difícil"
   summary: "Investigación forense digital de una intrusión mediante volcados de memoria y PCAP."
   flag_user: "HTB{user_found_1337}"
   ---
   ```

---

## 👤 Personalizar tu Perfil, Experiencia y Estudios

Toda tu información personal, laboral y académica se encuentra centralizada en:
📁 `src/content/profile/data.js`

Allí puedes editar:
- **`handle` y `fullName`:** Tu nombre o alias.
- **`bio` y `role`:** Tu rol y descripción profesional.
- **`experience`:** Tu historial laboral y puestos.
- **`education`:** Tus estudios académicos.
- **`certifications`:** Certificados obtenidos o en curso.
- **`skills`:** Categorías de herramientas, lenguajes y sistemas.
- **`socials`:** Enlaces a GitHub, HackTheBox, TryHackMe, LinkedIn, Email y huella PGP.

---

## 🖥️ Comandos de la Terminal Interactiva (`>_ CLI`)

Puedes abrir la terminal en cualquier momento haciendo clic en el botón **`>_ Terminal`** o con el atajo de teclado **`Ctrl + K`** (o pulsando la tecla `~`).

Comandos disponibles:
| Comando | Descripción |
|---|---|
| `help` | Manual de ayuda con todos los comandos |
| `ls [projects\|ctfs]` | Lista los archivos Markdown cargados |
| `cat <slug>` | Lee el artículo completo dentro de la terminal |
| `open <slug>` | Abre el visor visual enriquecido del proyecto o CTF |
| `whoami` | Muestra tu perfil profesional y bio |
| `skills` | Matriz de habilidades y herramientas |
| `exp` | Historial de experiencia laboral |
| `edu` | Estudios y certificaciones |
| `ctf` | Resumen de retos CTF resueltos |
| `neofetch` | Información del sistema con arte ASCII |
| `theme [purple\|green\|cyan\|red]` | Cambia la paleta de colores en tiempo real |
| `matrix` | Activa o desactiva la lluvia digital Matrix |
| `audio` | Activa o silencia efectos de sonido retro |
| `gui [seccion]` | Desplaza la vista clásica a la sección indicada |
| `contact` | Canales de contacto y clave PGP |
| `clear` | Limpia la pantalla de la terminal |

---

## 🌐 Despliegue en GitHub Pages (mediante SSH)

El proyecto ya incluye el flujo automatizado de GitHub Actions en `.github/workflows/deploy.yml`:

1. Crea un repositorio en tu cuenta de GitHub (por ejemplo `portfolio-hacker` o `<tu-usuario>.github.io`).
2. Comprueba que tu clave SSH pública esté añadida en tu cuenta de GitHub (**Settings > SSH and GPG keys**):
   ```bash
   # Ver tu clave pública para copiarla en GitHub:
   cat ~/.ssh/id_ed25519.pub
   # (o cat ~/.ssh/id_rsa.pub si usas RSA)
   ```
3. Verifica la conexión por SSH con GitHub:
   ```bash
   ssh -T git@github.com
   # Debe responder: "Hi <tu-usuario>! You've successfully authenticated..."
   ```
4. Vincula el repositorio por **SSH** y sube los cambios:
   ```bash
   cd portfolio-hacker
   git remote add origin git@github.com:<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
5. En GitHub, ve a **Settings > Pages**:
   - En **Build and deployment > Source**, selecciona **GitHub Actions**.
6. ¡El workflow compilará y desplegará tu portfolio automáticamente en segundos!

