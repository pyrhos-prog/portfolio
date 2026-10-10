import { getProjects, getCtfs } from '../utils/markdownLoader.js';
import { profileData } from '../content/profile/data.js';
import { soundFx } from '../utils/audioEffects.js';

export class CardsView {
  constructor({ onOpenModal, onRunInTerminal }) {
    this.onOpenModal = onOpenModal;
    this.onRunInTerminal = onRunInTerminal;
    this.projects = getProjects();
    this.ctfs = getCtfs();

    this.projectFilter = 'all';
    this.ctfFilter = 'all';
    this.searchQuery = '';
  }

  renderHero() {
    return `
      <section class="hero-section" id="inicio">
        <div class="cyber-container">
          <div class="hero-terminal-badge">
            <span class="live-dot"></span>
            <span class="badge-text">STATUS: SECURE_HOST_ONLINE // PORT_22: FILTERED</span>
          </div>
          <h1 class="hero-title glitch-text" data-text="PYRHOS // CYBER_PORTFOLIO">
            PYRHOS <span class="text-neon">//</span> PORTFOLIO
          </h1>
          <p class="hero-subtitle">
            Laboratorio de <span class="highlight">Ciberseguridad</span>, <span class="highlight">Honeypots</span>, 
            <span class="highlight">SysAdmin Linux</span> y documentación de retos <span class="highlight">CTF</span>.
          </p>
          
          <div class="hero-terminal-snippet">
            <div class="snippet-header">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="snippet-title">bash — quick-access</span>
            </div>
            <div class="snippet-body">
              <span class="text-neon">pyr0s@cyber-lab:~$</span> cat /etc/motd<br/>
              <span class="text-muted">> Bienvenido. Puedes navegar usando la interfaz gráfica o la terminal interactiva.</span><br/>
              <span class="text-neon">pyr0s@cyber-lab:~$</span> <span class="typing-cursor">neofetch</span>
            </div>
          </div>

          <div class="hero-actions">
            <button class="btn-cyber-primary" id="btn-hero-term">
              <span class="btn-icon">>_</span> Abrir Terminal Interactiva
            </button>
            <a href="#proyectos" class="btn-cyber-secondary">
              <span>📁 Explorar Proyectos</span>
            </a>
            <a href="#ctfs" class="btn-cyber-secondary">
              <span>🚩 Retos CTF</span>
            </a>
          </div>

          <div class="hero-stats-grid">
            <div class="stat-card">
              <div class="stat-number">${this.projects.length}</div>
              <div class="stat-label">Proyectos Publicados</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${this.ctfs.length}</div>
              <div class="stat-label">Writeups CTF</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Honeypot Activo</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">100%</div>
              <div class="stat-label">Markdown Driven</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderProjectsSection() {
    const categories = ['all', ...new Set(this.projects.map(p => p.category).filter(Boolean))];
    return `
      <section class="section-container" id="proyectos">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 01. REPOSITORIO_DE_PROYECTOS ]</div>
            <h2 class="section-title">Proyectos & Infraestructura</h2>
            <p class="section-desc">Despliegues reales, telemetría de ciberseguridad, automatización y scripting.</p>
          </div>

          <div class="filter-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="project-search-input" placeholder="Buscar proyecto por nombre, tag o herramienta..." value="${this.searchQuery}" />
            </div>
            <div class="category-chips" id="project-category-chips">
              ${categories.map(c => `
                <button class="chip ${this.projectFilter === c ? 'active' : ''}" data-cat="${c}">
                  ${c === 'all' ? 'Todos' : c}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="cards-grid" id="projects-grid">
            ${this.renderProjectCards()}
          </div>
        </div>
      </section>
    `;
  }

  renderProjectCards() {
    const filtered = this.projects.filter(p => {
      const matchCat = this.projectFilter === 'all' || p.category === this.projectFilter;
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || 
        p.title?.toLowerCase().includes(q) || 
        p.summary?.toLowerCase().includes(q) || 
        (p.tags || []).some(t => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      return `
        <div class="empty-state">
          <span class="empty-icon">📂</span>
          <p>No se encontraron proyectos con ese filtro.</p>
        </div>
      `;
    }

    return filtered.map(p => {
      const tags = (p.tags || []).map(t => `<span class="badge badge-tag">#${t}</span>`).join(' ');
      const diffBadge = p.difficulty ? `<span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>` : '';
      return `
        <div class="cyber-card" data-slug="${p.slug}">
          <div class="card-glow-edge"></div>
          <div class="card-header">
            <span class="badge badge-cyber">${p.category || 'Proyecto'}</span>
            ${diffBadge}
            <span class="card-date">${p.date || ''}</span>
          </div>
          <h3 class="card-title">${p.title}</h3>
          <p class="card-summary">${p.summary || 'Ver detalles del proyecto...'}</p>
          <div class="card-tags">${tags}</div>
          <div class="card-footer">
            <button class="btn-read-more" data-slug="${p.slug}">
              <span>Documentación &rarr;</span>
            </button>
            <button class="btn-open-cli" data-slug="${p.slug}" title="Ver comando en terminal">
              <span>>_ CLI</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderCtfsSection() {
    const platforms = ['all', ...new Set(this.ctfs.map(c => c.platform).filter(Boolean))];
    return `
      <section class="section-container" id="ctfs">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 02. HACKING_LAB_WRITEUPS ]</div>
            <h2 class="section-title">Retos & CTFs</h2>
            <p class="section-desc">Resolución técnica paso a paso de máquinas de HackTheBox, TryHackMe y retos de seguridad ofensiva.</p>
          </div>

          <div class="filter-controls">
            <div class="category-chips" id="ctf-platform-chips">
              ${platforms.map(p => `
                <button class="chip ${this.ctfFilter === p ? 'active' : ''}" data-plat="${p}">
                  ${p === 'all' ? 'Todas las Plataformas' : p}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="cards-grid" id="ctfs-grid">
            ${this.renderCtfCards()}
          </div>
        </div>
      </section>
    `;
  }

  renderCtfCards() {
    const filtered = this.ctfs.filter(c => {
      return this.ctfFilter === 'all' || c.platform === this.ctfFilter;
    });

    if (filtered.length === 0) {
      return `
        <div class="empty-state">
          <span class="empty-icon">🚩</span>
          <p>No se encontraron writeups para esta categoría.</p>
        </div>
      `;
    }

    return filtered.map(c => {
      const tags = (c.tags || []).map(t => `<span class="badge badge-tag">#${t}</span>`).join(' ');
      const diffBadge = c.difficulty ? `<span class="badge badge-${c.difficulty.toLowerCase()}">${c.difficulty}</span>` : '';
      const platformBadge = c.platform ? `<span class="badge badge-purple">${c.platform}</span>` : '';
      return `
        <div class="cyber-card card-ctf" data-slug="${c.slug}">
          <div class="card-glow-edge"></div>
          <div class="card-header">
            ${platformBadge}
            ${diffBadge}
            <span class="card-date">${c.date || ''}</span>
          </div>
          <h3 class="card-title">${c.title}</h3>
          <p class="card-summary">${c.summary || 'Análisis de intrusión y escalada de privilegios...'}</p>
          <div class="card-tags">${tags}</div>
          <div class="card-footer">
            <button class="btn-read-more" data-slug="${c.slug}">
              <span>Ver Writeup &rarr;</span>
            </button>
            <button class="btn-open-cli" data-slug="${c.slug}" title="Ver comando en terminal">
              <span>>_ cat ${c.slug}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTimelineSection() {
    return `
      <section class="section-container" id="trayectoria">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 03. HISTORIAL_Y_TRAYECTORIA ]</div>
            <h2 class="section-title">Experiencia & Educación</h2>
            <p class="section-desc">Evolución técnica, liderazgo en proyectos web de alto impacto y formación académica continua.</p>
          </div>

          <div class="timeline-dual-grid">
            <!-- Columna Experiencia Laboral -->
            <div class="timeline-column">
              <div class="timeline-column-header">
                <span class="col-icon-badge">💼</span>
                <div>
                  <h3 class="timeline-col-title">Experiencia Laboral</h3>
                  <span class="timeline-col-subtitle">Trayectoria profesional & roles técnicos</span>
                </div>
              </div>

              <div class="timeline-tree">
                ${profileData.experience.map(exp => `
                  <div class="timeline-node ${exp.isCurrent ? 'node-current' : ''}">
                    <div class="node-marker ${exp.isCurrent ? 'marker-pulse' : ''}">
                      <div class="marker-core"></div>
                    </div>
                    
                    <div class="timeline-glass-card">
                      <div class="card-glow-reflection"></div>
                      <div class="timeline-card-header">
                        <div class="capsule-wrap">
                          ${exp.isCurrent 
                            ? `<span class="badge-capsule badge-capsule-current"><span class="badge-dot-live"></span>${exp.period}</span>`
                            : `<span class="badge-capsule badge-capsule-historical">${exp.period}</span>`
                          }
                        </div>
                        <span class="milestone-badge-icon">${exp.icon || '💼'}</span>
                      </div>

                      <h4 class="timeline-role-title">${exp.role}</h4>
                      
                      <div class="timeline-company-row">
                        <span class="company-name">🏢 ${exp.company}</span>
                        <span class="company-sep">•</span>
                        <span class="company-location">📍 ${exp.location}</span>
                      </div>

                      <p class="timeline-card-desc">${exp.description}</p>

                      <div class="timeline-achievements-title">🎯 Logros Clave & Responsabilidades:</div>
                      <ul class="timeline-bullet-list">
                        ${exp.highlights.map(h => `
                          <li>
                            <span class="bullet-arrow">▹</span>
                            <span class="bullet-text">${h}</span>
                          </li>
                        `).join('')}
                      </ul>

                      ${exp.skills && exp.skills.length > 0 ? `
                        <div class="timeline-tech-pills">
                          ${exp.skills.map(s => `<span class="pill-tech-tag">${s}</span>`).join('')}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Columna Educación & Certificaciones -->
            <div class="timeline-column">
              <div class="timeline-column-header">
                <span class="col-icon-badge">🎓</span>
                <div>
                  <h3 class="timeline-col-title">Estudios & Formación</h3>
                  <span class="timeline-col-subtitle">Grados académicos & especialización técnica</span>
                </div>
              </div>

              <div class="timeline-tree">
                ${profileData.education.map(edu => `
                  <div class="timeline-node">
                    <div class="node-marker">
                      <div class="marker-core"></div>
                    </div>

                    <div class="timeline-glass-card">
                      <div class="card-glow-reflection"></div>
                      <div class="timeline-card-header">
                        <div class="capsule-wrap">
                          <span class="badge-capsule badge-capsule-historical">${edu.period}</span>
                        </div>
                        <span class="milestone-badge-icon">${edu.icon || '🎓'}</span>
                      </div>

                      <h4 class="timeline-role-title">${edu.degree}</h4>
                      
                      <div class="timeline-company-row">
                        <span class="company-name">🏛️ ${edu.institution}</span>
                        ${edu.location ? `<span class="company-sep">•</span><span class="company-location">📍 ${edu.location}</span>` : ''}
                      </div>

                      <p class="timeline-card-desc">${edu.description}</p>

                      <div class="timeline-achievements-title">📚 Asignaturas Clave & Logros Académicos:</div>
                      <ul class="timeline-bullet-list">
                        ${edu.highlights.map(h => `
                          <li>
                            <span class="bullet-arrow">▹</span>
                            <span class="bullet-text">${h}</span>
                          </li>
                        `).join('')}
                      </ul>

                      ${edu.skills && edu.skills.length > 0 ? `
                        <div class="timeline-tech-pills">
                          ${edu.skills.map(s => `<span class="pill-tech-tag">${s}</span>`).join('')}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Tarjeta de Certificaciones -->
              <div class="timeline-glass-card certs-glass-box">
                <div class="certs-header-row">
                  <span class="certs-icon">📜</span>
                  <h4 class="certs-title">Certificaciones Profesionales & Acreditaciones</h4>
                </div>
                <div class="certs-list">
                  ${profileData.certifications.map(c => `
                    <div class="cert-item">
                      <div class="cert-info">
                        <span class="cert-name">${c.name}</span>
                        <span class="cert-issuer">${c.issuer} // ${c.year}</span>
                      </div>
                      <span class="badge badge-purple">${c.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderSkillsSection() {
    return `
      <section class="section-container" id="skills">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 04. ARSENAL_TECNOLOGICO ]</div>
            <h2 class="section-title">Habilidades & Herramientas</h2>
            <p class="section-desc">Stack técnico utilizado en auditorías, defensa y administración de servidores.</p>
          </div>

          <div class="skills-matrix-grid">
            ${profileData.skills.map(group => `
              <div class="skill-group-card">
                <div class="skill-group-header">
                  <span class="group-icon">🛡️</span>
                  <h3 class="group-title">${group.category}</h3>
                </div>
                <div class="skill-items-wrap">
                  ${group.items.map(item => `
                    <div class="skill-pill">
                      <span class="pill-check">✔</span>
                      <span>${item}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderGuideAndContactSection() {
    return `
      <section class="section-container" id="contacto">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 05. WORKFLOW_Y_CONTACTO ]</div>
            <h2 class="section-title">Contacto & Guía de Contenido</h2>
            <p class="section-desc">Cómo añadir contenido nuevo de forma inmediata y canales de contacto.</p>
          </div>

          <div class="guide-contact-grid">
            <!-- Guía de Subida de Archivos -->
            <div class="guide-card">
              <h3 class="guide-title">
                <span class="text-neon">⚡</span> ¿Cómo subir nuevos Proyectos y CTFs?
              </h3>
              <p class="guide-desc">
                Este portfolio lee automáticamente los archivos Markdown en tiempo de ejecución. <b>No necesitas modificar código HTML ni JavaScript.</b>
              </p>
              <div class="guide-steps">
                <div class="guide-step">
                  <span class="step-num">1</span>
                  <div>
                    <b>Para un nuevo Proyecto:</b> Crea un archivo <code>nombre-proyecto.md</code> dentro de <code>src/content/projects/</code>.
                  </div>
                </div>
                <div class="guide-step">
                  <span class="step-num">2</span>
                  <div>
                    <b>Para un nuevo CTF:</b> Crea un archivo <code>nombre-reto.md</code> dentro de <code>src/content/ctfs/</code>.
                  </div>
                </div>
                <div class="guide-step">
                  <span class="step-num">3</span>
                  <div>
                    <b>Plantillas listas:</b> Puedes duplicar <code>_template.md</code> ubicado en cada carpeta para mantener la misma estructura de frontmatter.
                  </div>
                </div>
                <div class="guide-step">
                  <span class="step-num">4</span>
                  <div>
                    <b>Despliegue automático:</b> Al hacer <code>git push</code> a GitHub, el GitHub Action compilará y publicará tus cambios al instante.
                  </div>
                </div>
              </div>
            </div>

            <!-- Canales de Contacto -->
            <div class="contact-card">
              <h3 class="guide-title">
                <span class="text-neon">📡</span> Canales de Enlace
              </h3>
              <div class="contact-links-list">
                <a href="${profileData.socials.github}" target="_blank" class="contact-link-item">
                  <span class="link-icon">⚡</span>
                  <div>
                    <b>GitHub</b>
                    <span class="link-sub">${profileData.socials.github}</span>
                  </div>
                </a>
                <a href="${profileData.socials.hackthebox}" target="_blank" class="contact-link-item">
                  <span class="link-icon">🚩</span>
                  <div>
                    <b>HackTheBox</b>
                    <span class="link-sub">${profileData.socials.hackthebox}</span>
                  </div>
                </a>
                <a href="${profileData.socials.tryhackme}" target="_blank" class="contact-link-item">
                  <span class="link-icon">🛡️</span>
                  <div>
                    <b>TryHackMe</b>
                    <span class="link-sub">${profileData.socials.tryhackme}</span>
                  </div>
                </a>
                <a href="mailto:${profileData.socials.email}" class="contact-link-item">
                  <span class="link-icon">📧</span>
                  <div>
                    <b>Email Seguro</b>
                    <span class="link-sub">${profileData.socials.email}</span>
                  </div>
                </a>
              </div>

              <div class="pgp-box">
                <div class="pgp-header">
                  <span>🔐 PGP FINGERPRINT</span>
                  <button id="btn-copy-pgp" class="btn-copy-tiny">Copiar</button>
                </div>
                <code class="pgp-code" id="pgp-code-text">${profileData.socials.pgp}</code>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderAll() {
    return `
      ${this.renderHero()}
      ${this.renderProjectsSection()}
      ${this.renderCtfsSection()}
      ${this.renderTimelineSection()}
      ${this.renderSkillsSection()}
      ${this.renderGuideAndContactSection()}
    `;
  }

  bindEvents(container) {
    // Open modal on read more or card click
    container.querySelectorAll('.btn-read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-slug');
        if (this.onOpenModal) this.onOpenModal(slug);
      });
    });

    container.querySelectorAll('.cyber-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-slug');
        if (slug && this.onOpenModal) this.onOpenModal(slug);
      });
    });

    // Run in terminal button on card
    container.querySelectorAll('.btn-open-cli').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-slug');
        if (this.onRunInTerminal) this.onRunInTerminal(`cat ${slug}`);
      });
    });

    // Project category filter
    const catChips = container.querySelectorAll('#project-category-chips .chip');
    catChips.forEach(chip => {
      chip.addEventListener('click', () => {
        catChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.projectFilter = chip.getAttribute('data-cat');
        soundFx.key();
        const grid = document.getElementById('projects-grid');
        if (grid) grid.innerHTML = this.renderProjectCards();
        this.rebindCardEvents(grid);
      });
    });

    // Project search input
    const searchInput = document.getElementById('project-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const grid = document.getElementById('projects-grid');
        if (grid) grid.innerHTML = this.renderProjectCards();
        this.rebindCardEvents(grid);
      });
    }

    // CTF platform filter
    const platChips = container.querySelectorAll('#ctf-platform-chips .chip');
    platChips.forEach(chip => {
      chip.addEventListener('click', () => {
        platChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.ctfFilter = chip.getAttribute('data-plat');
        soundFx.key();
        const grid = document.getElementById('ctfs-grid');
        if (grid) grid.innerHTML = this.renderCtfCards();
        this.rebindCardEvents(grid);
      });
    });

    // Hero terminal open button
    const heroBtn = document.getElementById('btn-hero-term');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        if (this.onRunInTerminal) this.onRunInTerminal('help');
      });
    }

    // PGP Copy button
    const pgpBtn = document.getElementById('btn-copy-pgp');
    if (pgpBtn) {
      pgpBtn.addEventListener('click', () => {
        const text = document.getElementById('pgp-code-text')?.innerText || '';
        navigator.clipboard.writeText(text);
        soundFx.success();
        pgpBtn.textContent = '¡Copiado!';
        setTimeout(() => pgpBtn.textContent = 'Copiar', 2000);
      });
    }
  }

  rebindCardEvents(grid) {
    if (!grid) return;
    grid.querySelectorAll('.btn-read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-slug');
        if (this.onOpenModal) this.onOpenModal(slug);
      });
    });

    grid.querySelectorAll('.cyber-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-slug');
        if (slug && this.onOpenModal) this.onOpenModal(slug);
      });
    });

    grid.querySelectorAll('.btn-open-cli').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute('data-slug');
        if (this.onRunInTerminal) this.onRunInTerminal(`cat ${slug}`);
      });
    });
  }
}
