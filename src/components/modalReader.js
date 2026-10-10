import { getItemBySlug } from '../utils/markdownLoader.js';
import { soundFx } from '../utils/audioEffects.js';

export class ModalReader {
  constructor({ containerId, onRunInTerminal }) {
    this.container = document.getElementById(containerId);
    this.onRunInTerminal = onRunInTerminal;
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop"></div>
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-dots">
            <span class="dot dot-red" id="modal-close-btn" title="Cerrar (Esc)"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="modal-title-bar" id="modal-doc-title">Documento</div>
          <div class="modal-actions">
            <button class="btn-cyber-outline" id="modal-view-term-btn" title="Ver en Terminal">
              <span>>_ CLI</span>
            </button>
            <button class="btn-cyber-outline" id="modal-copy-raw-btn" title="Copiar Markdown">
              <span>📋 Copiar</span>
            </button>
            <button class="btn-cyber-close" id="modal-close-x" title="Cerrar">&times;</button>
          </div>
        </div>
        <div class="modal-meta-bar" id="modal-meta-bar"></div>
        <div class="modal-body markdown-body" id="modal-body-content"></div>
      </div>
    `;

    this.backdrop = document.getElementById('modal-backdrop');
    this.titleEl = document.getElementById('modal-doc-title');
    this.metaEl = document.getElementById('modal-meta-bar');
    this.bodyEl = document.getElementById('modal-body-content');
    this.currentSlug = null;
  }

  bindEvents() {
    const closeBtns = [
      document.getElementById('modal-close-btn'),
      document.getElementById('modal-close-x'),
      this.backdrop
    ];

    closeBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    const termBtn = document.getElementById('modal-view-term-btn');
    if (termBtn) {
      termBtn.addEventListener('click', () => {
        if (this.currentSlug && this.onRunInTerminal) {
          this.close();
          this.onRunInTerminal(`cat ${this.currentSlug}`);
        }
      });
    }

    const copyBtn = document.getElementById('modal-copy-raw-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const item = getItemBySlug(this.currentSlug);
        if (item && item.rawMarkdown) {
          navigator.clipboard.writeText(item.rawMarkdown);
          soundFx.success();
          copyBtn.innerHTML = '<span>✔ ¡Copiado!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>📋 Copiar</span>';
          }, 2000);
        }
      });
    }
  }

  open(slug) {
    const item = getItemBySlug(slug);
    if (!item) return;

    this.currentSlug = slug;
    this.titleEl.textContent = `[FILE: ${item.slug}.md] — ${item.title}`;

    const tagsHtml = (item.tags || []).map(t => `<span class="badge badge-tag">#${t}</span>`).join(' ');
    const diffBadge = item.difficulty ? `<span class="badge badge-${item.difficulty.toLowerCase()}">Dificultad: ${item.difficulty}</span>` : '';
    const platformBadge = item.platform ? `<span class="badge badge-purple">${item.platform}</span>` : '';
    const categoryBadge = item.category ? `<span class="badge badge-cyber">${item.category}</span>` : '';
    const dateHtml = item.date ? `<span class="meta-date">📅 ${item.date}</span>` : '';
    const githubLink = item.github ? `<a href="${item.github}" target="_blank" class="meta-link">⚡ GitHub Repo</a>` : '';
    const demoLink = item.demo ? `<a href="${item.demo}" target="_blank" class="meta-link">🌐 Ver Demo</a>` : '';

    let flagBadges = '';
    if (item.flag_user) {
      flagBadges += `<span class="badge badge-flag" title="User Flag">🏴 User: ${item.flag_user}</span> `;
    }
    if (item.flag_root) {
      flagBadges += `<span class="badge badge-flag" title="Root Flag">🚩 Root: ${item.flag_root}</span>`;
    }

    this.metaEl.innerHTML = `
      <div class="meta-left">
        ${categoryBadge}
        ${platformBadge}
        ${diffBadge}
        ${dateHtml}
      </div>
      <div class="meta-right">
        ${flagBadges}
        ${githubLink}
        ${demoLink}
      </div>
      <div class="meta-tags-row">
        ${tagsHtml}
      </div>
    `;

    this.bodyEl.innerHTML = item.renderedHtml;

    // Attach copy button to code blocks
    this.bodyEl.querySelectorAll('pre').forEach(pre => {
      const copyCodeBtn = document.createElement('button');
      copyCodeBtn.className = 'btn-code-copy';
      copyCodeBtn.textContent = 'Copiar';
      copyCodeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText);
        soundFx.success();
        copyCodeBtn.textContent = '¡Copiado!';
        setTimeout(() => copyCodeBtn.textContent = 'Copiar', 2000);
      });
      pre.style.position = 'relative';
      pre.appendChild(copyCodeBtn);
    });

    this.container.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
    soundFx.enter();
  }

  close() {
    this.container.classList.remove('modal-visible');
    document.body.style.overflow = '';
    this.currentSlug = null;
  }

  isOpen() {
    return this.container.classList.contains('modal-visible');
  }
}
