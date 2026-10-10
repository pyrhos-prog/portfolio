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
            <span class="badge-text">OPERATOR: OSMAN (PYRHOS) // LOC: SEGOVIA, ES // RED TEAM & PENTESTING</span>
          </div>
          <h1 class="hero-title glitch-text" data-text="OSMAN // PYRHOS">
            OSMAN <span class="text-neon">//</span> PYRHOS
          </h1>
          <p class="hero-subtitle">
            <b>Junior Penetration Tester & Red Team Enthusiast</b> • Segovia, España.<br/>
            Especializado en evaluación de <span class="highlight">Active Directory</span>, auditoría de <span class="highlight">aplicaciones web</span>, telemetría y <span class="highlight">tooling ofensivo en Python</span>.
          </p>
          
          <div class="hero-terminal-snippet">
            <div class="snippet-header">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="snippet-title">bash — pyrhos@segovia-lab:~</span>
            </div>
            <div class="snippet-body">
              <span class="text-neon">pyrhos@segovia-lab:~$</span> cat /etc/identity<br/>
              <span class="text-muted">> Certificaciones: eJPT v2 | HTB Hacker | CPTS (HTB Academy ~50% en curso)</span><br/>
              <span class="text-muted">> Formación: CFGS ASIR (IES Julián Marías) + CFGM Telecomunicaciones (IES María Moliner)</span><br/>
              <span class="text-neon">pyrhos@segovia-lab:~$</span> <span class="typing-cursor">whoami --objective</span>
            </div>
          </div>

          <div class="hero-actions">
            <button class="btn-cyber-primary" id="btn-hero-term">
              <span class="btn-icon">>_</span> Abrir Terminal Interactiva
            </button>
            <a href="https://pyrhos.gitbook.io" target="_blank" class="btn-cyber-secondary">
              <span>📚 Wiki Técnica (GitBook)</span>
            </a>
            <a href="https://beacons.ai/pyrhos" target="_blank" class="btn-cyber-secondary">
              <span>🌐 Hub Personal</span>
            </a>
            <a href="#proyectos" class="btn-cyber-secondary">
              <span>📁 Ver Proyectos</span>
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

  renderWikiSection() {
    return `
      <section class="section-container" id="wiki">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 05. BASE_DE_CONOCIMIENTO_PUBLICA ]</div>
            <h2 class="section-title">Wiki Técnica & Recursos</h2>
            <p class="section-desc">Documentación, apuntes estructurados y cheatsheets de ciberseguridad ofensiva en español alojados en GitBook.</p>
          </div>

          <div class="timeline-glass-card wiki-banner-card">
            <div class="wiki-banner-content">
              <div class="wiki-header-badge">
                <span class="live-dot"></span>
                <span>PLATAFORMA PÚBLICA ENLACE DIRECTO</span>
              </div>
              <h3 class="wiki-main-title">📚 pyrhos.gitbook.io</h3>
              <p class="wiki-main-desc">
                Metodología propia de documentación basada en Markdown y Obsidian, estructurada para consulta rápida durante evaluaciones y retos ofensivos.
              </p>
              
              <div class="wiki-topics-grid">
                <div class="wiki-topic-card">
                  <span class="topic-icon">🎯</span>
                  <div class="topic-title">Web Fuzzing & Enumeración</div>
                  <div class="topic-tags">FFuF, dirbusting, parameter fuzzing</div>
                </div>
                <div class="wiki-topic-card">
                  <span class="topic-icon">🔑</span>
                  <div class="topic-title">Ataques a Credenciales</div>
                  <div class="topic-tags">Hydra, Medusa, Hashcat rules</div>
                </div>
                <div class="wiki-topic-card">
                  <span class="topic-icon">🏰</span>
                  <div class="topic-title">Directorio Activo & Kerberos</div>
                  <div class="topic-tags">Pass the Ticket (PtT), OverPass-the-Hash, LLMNR</div>
                </div>
                <div class="wiki-topic-card">
                  <span class="topic-icon">🛡️</span>
                  <div class="topic-title">Proxies de Intercepción</div>
                  <div class="topic-tags">Burp Suite, Caido, OWASP ZAP</div>
                </div>
                <div class="wiki-topic-card">
                  <span class="topic-icon">🌐</span>
                  <div class="topic-title">OSINT Estructurado</div>
                  <div class="topic-tags">Shodan dorks, FOFA syntax, Subfinder</div>
                </div>
                <div class="wiki-topic-card">
                  <span class="topic-icon">📡</span>
                  <div class="topic-title">Auditoría Inalámbrica</div>
                  <div class="topic-tags">hcxdumptool, PMKID, WPA2/WPA3</div>
                </div>
              </div>

              <div class="wiki-actions-row">
                <a href="${profileData.socials.gitbook}" target="_blank" class="btn-cyber-primary">
                  <span>📖 Abrir Wiki en pyrhos.gitbook.io &rarr;</span>
                </a>
                <a href="${profileData.socials.beacons}" target="_blank" class="btn-cyber-secondary">
                  <span>🔗 Visitar Hub Personal (Beacons)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderContactSection() {
    return `
      <section class="section-container" id="contacto">
        <div class="cyber-container">
          <div class="section-header">
            <div class="section-tag">[ 06. CANALES_DE_COMUNICACION ]</div>
            <h2 class="section-title">Contacto & Enlaces Oficiales</h2>
            <p class="section-desc">Canales de comunicación directa, perfiles de seguridad ofensiva y clave pública.</p>
          </div>

          <div class="guide-contact-grid" style="grid-template-columns: minmax(320px, 680px); justify-content: center;">
            <!-- Canales de Contacto & Enlaces -->
            <div class="contact-card">
              <h3 class="guide-title">
                <span class="text-neon">📡</span> Canales de Enlace & Contacto
              </h3>
              <div class="contact-links-list">
                <a href="${profileData.socials.gitbook}" target="_blank" class="contact-link-item">
                  <span class="link-icon">📚</span>
                  <div>
                    <b>Wiki Técnica (GitBook)</b>
                    <span class="link-sub">${profileData.socials.gitbook}</span>
                  </div>
                </a>
                <a href="${profileData.socials.beacons}" target="_blank" class="contact-link-item">
                  <span class="link-icon">🌐</span>
                  <div>
                    <b>Hub Personal (Beacons)</b>
                    <span class="link-sub">${profileData.socials.beacons}</span>
                  </div>
                </a>
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
                    <b>HackTheBox (Rango Hacker)</b>
                    <span class="link-sub">${profileData.socials.hackthebox}</span>
                  </div>
                </a>
                <a href="mailto:${profileData.socials.email}" class="contact-link-item">
                  <span class="link-icon">📧</span>
                  <div>
                    <b>Email Directo</b>
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
      ${this.renderWikiSection()}
      ${this.renderContactSection()}
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
