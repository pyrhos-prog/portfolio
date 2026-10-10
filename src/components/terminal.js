import { soundFx } from '../utils/audioEffects.js';
import { getProjects, getCtfs, getAllItems, getItemBySlug } from '../utils/markdownLoader.js';
import { profileData } from '../content/profile/data.js';

export class Terminal {
  constructor({ containerId, onOpenModal, onNavigateGui, onThemeChange, onMatrixToggle }) {
    this.container = document.getElementById(containerId);
    this.onOpenModal = onOpenModal;
    this.onNavigateGui = onNavigateGui;
    this.onThemeChange = onThemeChange;
    this.onMatrixToggle = onMatrixToggle;

    this.history = JSON.parse(localStorage.getItem('term_history') || '[]');
    this.historyIndex = this.history.length;
    this.promptUser = 'pyrhos';
    this.promptHost = 'cyber-lab';
    this.currentDir = '~';

    this.initDOM();
    this.bindEvents();
    this.printGreeting();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-titlebar">
          <div class="terminal-dots">
            <span class="dot dot-red" id="term-btn-close" title="Cerrar/Minimizar"></span>
            <span class="dot dot-yellow" id="term-btn-minimize" title="Minimizar"></span>
            <span class="dot dot-green" id="term-btn-maximize" title="Maximizar / Modo Pantalla Completa"></span>
          </div>
          <div class="terminal-title">
            <span class="terminal-icon">⚡</span>
            <span>${this.promptUser}@${this.promptHost}:${this.currentDir} — bash</span>
          </div>
          <div class="terminal-actions">
            <button class="term-btn-action" id="term-btn-split" title="Alternar Split View">◫ Split</button>
            <button class="term-btn-action" id="term-btn-clear" title="Limpiar (clear)">Clear</button>
          </div>
        </div>
        <div class="terminal-body" id="term-body">
          <div class="terminal-output" id="term-output"></div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">
              <span class="prompt-user">${this.promptUser}@${this.promptHost}</span>:<span class="prompt-path">${this.currentDir}</span>$
            </span>
            <input type="text" id="term-input" class="terminal-input" autocomplete="off" spellcheck="false" autofocus />
          </div>
        </div>
      </div>
    `;

    this.output = document.getElementById('term-output');
    this.input = document.getElementById('term-input');
    this.body = document.getElementById('term-body');
  }

  bindEvents() {
    // Click body to focus input
    this.body.addEventListener('click', () => {
      this.input.focus();
    });

    // Close / Minimize
    const btnClose = document.getElementById('term-btn-close');
    const btnMin = document.getElementById('term-btn-minimize');
    const btnMax = document.getElementById('term-btn-maximize');
    const btnSplit = document.getElementById('term-btn-split');
    const btnClear = document.getElementById('term-btn-clear');

    if (btnClose) btnClose.addEventListener('click', () => this.toggleTerminal(false));
    if (btnMin) btnMin.addEventListener('click', () => this.toggleTerminal(false));
    if (btnMax) btnMax.addEventListener('click', () => this.toggleFullscreen());
    if (btnSplit) btnSplit.addEventListener('click', () => this.toggleSplit());
    if (btnClear) btnClear.addEventListener('click', () => this.executeCommand('clear'));

    // Keyboard handlers
    this.input.addEventListener('keydown', (e) => {
      soundFx.key();

      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        soundFx.enter();
        this.executeCommand(cmd);
        if (cmd) {
          this.history.push(cmd);
          if (this.history.length > 50) this.history.shift();
          localStorage.setItem('term_history', JSON.stringify(this.history));
          this.historyIndex = this.history.length;
        }
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleAutocomplete();
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        this.executeCommand('clear');
      }
    });
  }

  printGreeting() {
    const lines = [
      ...profileData.terminalGreeting,
      "<span class='text-muted'>Sugerencia: Escribe <span class='text-neon'>'help'</span> para comandos o <span class='text-neon'>'ls'</span> para explorar contenido.</span>",
      ""
    ];
    lines.forEach(l => this.printLine(l));
  }

  printLine(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.innerHTML = htmlContent;
    this.output.appendChild(div);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.body.scrollTop = this.body.scrollHeight;
  }

  executeCommand(rawCmd) {
    if (!rawCmd) return;

    // Print command execution line
    this.printLine(`
      <span class="terminal-prompt">
        <span class="prompt-user">${this.promptUser}@${this.promptHost}</span>:<span class="prompt-path">${this.currentDir}</span>$
      </span>
      <span class="command-executed">${this.escapeHtml(rawCmd)}</span>
    `);

    const parts = rawCmd.split(' ').filter(Boolean);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        this.cmdHelp();
        break;

      case 'clear':
      case 'cls':
        this.output.innerHTML = '';
        break;

      case 'ls':
        this.cmdLs(args);
        break;

      case 'cat':
        this.cmdCat(args);
        break;

      case 'open':
        this.cmdOpen(args);
        break;

      case 'whoami':
      case 'bio':
        this.cmdWhoami();
        break;

      case 'skills':
        this.cmdSkills();
        break;

      case 'exp':
      case 'experience':
        this.cmdExp();
        break;

      case 'edu':
      case 'education':
        this.cmdEdu();
        break;

      case 'ctf':
      case 'ctfs':
        this.cmdCtf();
        break;

      case 'neofetch':
      case 'fastfetch':
        this.cmdNeofetch();
        break;

      case 'theme':
        this.cmdTheme(args);
        break;

      case 'gui':
        this.cmdGui(args);
        break;

      case 'matrix':
        if (this.onMatrixToggle) {
          const active = this.onMatrixToggle();
          this.printLine(`<span class="text-neon">[MATRIX] Digital rain ${active ? 'activado' : 'desactivado'}.</span>`);
        }
        break;

      case 'audio':
      case 'sound':
        const enabled = soundFx.toggle();
        this.printLine(`<span class="text-neon">[AUDIO] Efectos de sonido terminal: <b>${enabled ? 'ACTIVADOS' : 'SILENCIADOS'}</b>.</span>`);
        break;

      case 'socials':
      case 'contact':
        this.cmdContact();
        break;

      case 'sudo':
        soundFx.error();
        this.printLine(`<span class="text-danger">⚠️ [SECURITY ALERT] User ${this.promptUser} is not in the sudoers file. This incident has been logged to /var/log/auth.log</span>`);
        break;

      case 'date':
        this.printLine(`<span class="text-muted">${new Date().toLocaleString()}</span>`);
        break;

      case 'echo':
        this.printLine(this.escapeHtml(args.join(' ')));
        break;

      case 'history':
        this.history.forEach((h, i) => {
          this.printLine(`<span class="text-muted">${String(i + 1).padStart(3, ' ')}  ${this.escapeHtml(h)}</span>`);
        });
        break;

      case 'exit':
        this.toggleTerminal(false);
        break;

      default:
        soundFx.error();
        this.printLine(`<span class="text-danger">bash: comando no encontrado: ${this.escapeHtml(command)}</span>. Escribe <span class="text-neon">'help'</span> para ver los comandos válidos.`);
    }

    this.scrollToBottom();
  }

  cmdHelp() {
    const table = `
      <div class="help-grid">
        <div class="help-row"><span class="cmd-name">help</span><span class="cmd-desc">Muestra este panel de ayuda interactivo</span></div>
        <div class="help-row"><span class="cmd-name">ls [projects|ctfs]</span><span class="cmd-desc">Lista los archivos Markdown disponibles</span></div>
        <div class="help-row"><span class="cmd-name">cat &lt;slug&gt;</span><span class="cmd-desc">Lee el contenido Markdown dentro de la terminal</span></div>
        <div class="help-row"><span class="cmd-name">open &lt;slug&gt;</span><span class="cmd-desc">Abre el visor gráfico detallado del proyecto o CTF</span></div>
        <div class="help-row"><span class="cmd-name">whoami</span><span class="cmd-desc">Perfil profesional, identidad y bio</span></div>
        <div class="help-row"><span class="cmd-name">skills</span><span class="cmd-desc">Matriz de competencias y herramientas técnicas</span></div>
        <div class="help-row"><span class="cmd-name">exp</span><span class="cmd-desc">Trayectoria laboral y experiencia en sistemas</span></div>
        <div class="help-row"><span class="cmd-name">edu</span><span class="cmd-desc">Formación académica y certificaciones</span></div>
        <div class="help-row"><span class="cmd-name">ctf</span><span class="cmd-desc">Estadísticas y retos resueltos (HTB, THM)</span></div>
        <div class="help-row"><span class="cmd-name">neofetch</span><span class="cmd-desc">Resumen del sistema hacker con banner ASCII</span></div>
        <div class="help-row"><span class="cmd-name">gui [seccion]</span><span class="cmd-desc">Navega la interfaz visual (inicio, projects, ctfs, exp, contact)</span></div>
        <div class="help-row"><span class="cmd-name">theme [purple|green|cyan|red]</span><span class="cmd-desc">Cambia la paleta de colores de la terminal</span></div>
        <div class="help-row"><span class="cmd-name">matrix</span><span class="cmd-desc">Activa/desactiva la lluvia digital Matrix</span></div>
        <div class="help-row"><span class="cmd-name">audio</span><span class="cmd-desc">Activa o silencia los efectos sonoros</span></div>
        <div class="help-row"><span class="cmd-name">contact</span><span class="cmd-desc">Canales de contacto y clave pública PGP</span></div>
        <div class="help-row"><span class="cmd-name">clear</span><span class="cmd-desc">Limpia la pantalla de la terminal (Ctrl+L)</span></div>
      </div>
    `;
    this.printLine(table);
  }

  cmdLs(args) {
    const filter = (args[0] || '').toLowerCase();
    const projects = getProjects();
    const ctfs = getCtfs();

    if (filter === 'projects' || filter === 'proyectos') {
      this.renderFileList('📁 Proyectos (/src/content/projects/)', projects);
    } else if (filter === 'ctfs' || filter === 'ctf') {
      this.renderFileList('🚩 Retos CTF (/src/content/ctfs/)', ctfs);
    } else {
      this.renderFileList('📁 Proyectos (/src/content/projects/)', projects);
      this.renderFileList('🚩 Retos CTF (/src/content/ctfs/)', ctfs);
      this.printLine(`<span class="text-muted">Consejo: Usa <span class="text-neon">'cat &lt;slug&gt;'</span> para leer o <span class="text-neon">'open &lt;slug&gt;'</span> para abrir el visor.</span>`);
    }
  }

  renderFileList(title, items) {
    this.printLine(`<b>${title}:</b>`);
    if (items.length === 0) {
      this.printLine(`<span class="text-muted">&nbsp;&nbsp;(No hay elementos registrados)</span>`);
      return;
    }

    const lines = items.map(item => {
      const diffBadge = item.difficulty ? `<span class="badge badge-${item.difficulty.toLowerCase()}">[${item.difficulty}]</span>` : '';
      return `&nbsp;&nbsp;<span class="text-neon file-item" data-slug="${item.slug}">📄 ${item.slug}.md</span> &nbsp; <span class="text-muted">${item.date || ''}</span> ${diffBadge} <span class="file-title">— ${item.title}</span>`;
    }).join('<br/>');

    this.printLine(lines);
  }

  cmdCat(args) {
    if (!args[0]) {
      soundFx.error();
      this.printLine(`<span class="text-danger">Uso: cat &lt;slug&gt; (Ejemplo: cat honeypot-cowrie-grafana)</span>`);
      return;
    }

    const slug = args[0].replace('.md', '');
    const item = getItemBySlug(slug);

    if (!item) {
      soundFx.error();
      this.printLine(`<span class="text-danger">cat: ${slug}: Archivo no encontrado. Escribe 'ls' para listar archivos.</span>`);
      return;
    }

    soundFx.success();
    const rendered = `
      <div class="terminal-cat-block">
        <div class="cat-header">
          <span class="cat-title">📖 [FILE] ${item.title}</span>
          <button class="cat-open-btn" onclick="window.__openModal('${item.slug}')">↗ Abrir en Visor Gráfico</button>
        </div>
        <div class="cat-meta text-muted">
          <span>📅 Fecha: ${item.date || 'N/A'}</span> | 
          <span>🏷️ Tags: ${(item.tags || []).join(', ')}</span> | 
          <span>📊 Dificultad: ${item.difficulty || 'N/A'}</span>
        </div>
        <hr class="term-divider"/>
        <div class="cat-content markdown-body">
          ${item.renderedHtml}
        </div>
      </div>
    `;
    this.printLine(rendered);
  }

  cmdOpen(args) {
    if (!args[0]) {
      soundFx.error();
      this.printLine(`<span class="text-danger">Uso: open &lt;slug&gt; (Ejemplo: open htb-cozyhosting)</span>`);
      return;
    }
    const slug = args[0].replace('.md', '');
    const item = getItemBySlug(slug);
    if (!item) {
      soundFx.error();
      this.printLine(`<span class="text-danger">open: no se encuentra '${slug}'. Usa 'ls' para ver opciones.</span>`);
      return;
    }
    soundFx.success();
    if (this.onOpenModal) this.onOpenModal(item.slug);
    this.printLine(`<span class="text-neon">Abriendo visor gráfico para '${item.title}'...</span>`);
  }

  cmdWhoami() {
    const html = `
      <div class="card-terminal">
        <div class="whoami-header">
          <span class="text-neon" style="font-size:1.2rem;">👤 ${profileData.fullName}</span>
          <span class="badge badge-purple">${profileData.status}</span>
        </div>
        <p class="text-primary">${profileData.role} — 📍 ${profileData.location}</p>
        <p class="text-light">${profileData.bio}</p>
        <div class="whoami-links">
          <span>🔗 GitHub: <a href="${profileData.socials.github}" target="_blank">${profileData.socials.github}</a></span><br/>
          <span>🚩 HackTheBox: <a href="${profileData.socials.hackthebox}" target="_blank">${profileData.socials.hackthebox}</a></span><br/>
          <span>🛡️ TryHackMe: <a href="${profileData.socials.tryhackme}" target="_blank">${profileData.socials.tryhackme}</a></span><br/>
          <span>📧 Email: <a href="mailto:${profileData.socials.email}">${profileData.socials.email}</a></span>
        </div>
      </div>
    `;
    this.printLine(html);
  }

  cmdSkills() {
    let output = `<b class="text-neon">🛡️ MATRIZ DE COMPETENCIAS & HACKING:</b><br/>`;
    profileData.skills.forEach(cat => {
      output += `<br/><span class="text-purple"><b>[ ${cat.category} ]</b></span><br/>`;
      cat.items.forEach(skill => {
        output += `&nbsp;&nbsp;✔ <span class="text-light">${skill}</span><br/>`;
      });
    });
    this.printLine(output);
  }

  cmdExp() {
    let output = `<b class="text-neon">💼 EXPERIENCIA LABORAL & INFRAESTRUCTURA:</b><br/>`;
    profileData.experience.forEach(exp => {
      output += `
        <div class="timeline-item-term">
          <div class="text-purple"><b>${exp.role}</b> @ ${exp.company} <span class="text-muted">(${exp.period})</span></div>
          <div class="text-muted">${exp.location}</div>
          <p class="text-light">${exp.description}</p>
          <ul>
            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    this.printLine(output);
  }

  cmdEdu() {
    let output = `<b class="text-neon">🎓 FORMACIÓN ACADÉMICA & CERTIFICACIONES:</b><br/>`;
    profileData.education.forEach(edu => {
      output += `
        <div class="timeline-item-term">
          <div class="text-purple"><b>${edu.degree}</b></div>
          <div class="text-muted">${edu.institution} | ${edu.period}</div>
          <p class="text-light">${edu.description}</p>
        </div>
      `;
    });
    output += `<br/><b class="text-neon">📜 Certificaciones:</b><br/>`;
    profileData.certifications.forEach(cert => {
      output += `&nbsp;&nbsp;• <b>${cert.name}</b> (${cert.issuer}, ${cert.year}) — <span class="badge badge-purple">${cert.status}</span><br/>`;
    });
    this.printLine(output);
  }

  cmdCtf() {
    const ctfs = getCtfs();
    let output = `
      <b class="text-neon">🚩 CTF TRACKER & WRITEUPS</b><br/>
      <span class="text-muted">Retos resueltos y documentados en el portfolio:</span><br/><br/>
    `;
    ctfs.forEach(c => {
      output += `
        <div class="ctf-item-term">
          <span class="badge badge-purple">[${c.platform || 'CTF'}]</span>
          <b>${c.title}</b> <span class="badge badge-${(c.difficulty || 'medio').toLowerCase()}">${c.difficulty}</span>
          <br/>
          <span class="text-muted">&nbsp;&nbsp;${c.summary || ''}</span>
          <br/>
          &nbsp;&nbsp;Comando para leer: <span class="text-neon">cat ${c.slug}</span>
        </div>
      `;
    });
    this.printLine(output);
  }

  cmdNeofetch() {
    const art = `
<pre class="neofetch-art">
<span class="text-purple">       .---.        </span> <span class="text-neon"><b>pyrhos@cyber-lab</b></span>
<span class="text-purple">      /     \\       </span> <span class="text-muted">----------------</span>
<span class="text-purple">     | () () |      </span> <b>OS:</b> CyberSec Linux x86_64
<span class="text-purple">      \\  _  /       </span> <b>Host:</b> DevSecOps Lab VPS
<span class="text-purple">       '---'        </span> <b>Kernel:</b> 6.10.8-zen-hardened
<span class="text-purple">      /|   |\\       </span> <b>Uptime:</b> 42 days, 13 hours, 37 mins
<span class="text-purple">     / |   | \\      </span> <b>Packages:</b> docker, cowrie, loki, alloy
<span class="text-purple">    /  |   |  \\     </span> <b>Shell:</b> bash 5.2.26
<span class="text-purple">       |   |        </span> <b>Theme:</b> Neon Obsidian Purple
<span class="text-purple">       /   \\        </span> <b>Memory:</b> 4.2GB / 16.0GB
<span class="text-purple">      '     '       </span> <b>Status:</b> 🛡️ 0 breaches | Honeypot online
</pre>
    `;
    this.printLine(art);
  }

  cmdTheme(args) {
    const themeName = (args[0] || '').toLowerCase();
    const validThemes = ['purple', 'green', 'cyan', 'red'];
    if (!validThemes.includes(themeName)) {
      this.printLine(`<span class="text-danger">Temas disponibles: purple (defecto), green (matrix), cyan (cyber), red (blood)</span>`);
      this.printLine(`Ejemplo: <span class="text-neon">theme green</span>`);
      return;
    }
    if (this.onThemeChange) {
      this.onThemeChange(themeName);
      soundFx.success();
      this.printLine(`<span class="text-neon">Paleta de colores cambiada a: <b>${themeName.toUpperCase()}</b></span>`);
    }
  }

  cmdGui(args) {
    const section = args[0] || 'projects';
    if (this.onNavigateGui) {
      this.onNavigateGui(section);
      this.printLine(`<span class="text-neon">Navegando a la sección visual: #${section}</span>`);
    }
  }

  cmdContact() {
    const html = `
      <b class="text-neon">📡 ENLACES DE CONTACTO & CANALES SEGUROS:</b><br/>
      &nbsp;&nbsp;• GitHub: <a href="${profileData.socials.github}" target="_blank">${profileData.socials.github}</a><br/>
      &nbsp;&nbsp;• LinkedIn: <a href="${profileData.socials.linkedin}" target="_blank">${profileData.socials.linkedin}</a><br/>
      &nbsp;&nbsp;• Email: <a href="mailto:${profileData.socials.email}">${profileData.socials.email}</a><br/>
      &nbsp;&nbsp;• PGP Key Fingerprint: <span class="text-neon">${profileData.socials.pgp}</span>
    `;
    this.printLine(html);
  }

  handleAutocomplete() {
    const val = this.input.value.trim();
    const parts = val.split(' ');
    if (parts.length === 1) {
      const commands = ['help', 'ls', 'cat', 'open', 'whoami', 'skills', 'exp', 'edu', 'ctf', 'neofetch', 'theme', 'gui', 'matrix', 'audio', 'contact', 'clear', 'exit'];
      const matches = commands.filter(c => c.startsWith(val));
      if (matches.length === 1) {
        this.input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.printLine(`<span class="text-muted">Comandos: ${matches.join('  ')}</span>`);
      }
    } else if (parts[0] === 'cat' || parts[0] === 'open') {
      const target = parts[1] || '';
      const items = getAllItems().map(i => i.slug);
      const matches = items.filter(slug => slug.startsWith(target));
      if (matches.length === 1) {
        this.input.value = `${parts[0]} ${matches[0]}`;
      } else if (matches.length > 1) {
        this.printLine(`<span class="text-muted">Archivos: ${matches.join('  ')}</span>`);
      }
    } else if (parts[0] === 'theme') {
      const target = parts[1] || '';
      const themes = ['purple', 'green', 'cyan', 'red'];
      const matches = themes.filter(t => t.startsWith(target));
      if (matches.length === 1) {
        this.input.value = `theme ${matches[0]}`;
      }
    }
  }

  toggleTerminal(forceState) {
    const isVisible = this.container.classList.contains('terminal-active');
    const newState = forceState !== undefined ? forceState : !isVisible;

    if (newState) {
      this.container.classList.add('terminal-active');
      this.input.focus();
    } else {
      this.container.classList.remove('terminal-active');
    }
    return newState;
  }

  toggleFullscreen() {
    this.container.classList.toggle('terminal-fullscreen');
    this.scrollToBottom();
  }

  toggleSplit() {
    document.body.classList.toggle('layout-split-view');
    this.scrollToBottom();
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
