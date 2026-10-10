import { soundFx } from '../utils/audioEffects.js';

export class Navbar {
  constructor({ onToggleTerminal, onToggleCrt, onToggleSplit }) {
    this.onToggleTerminal = onToggleTerminal;
    this.onToggleCrt = onToggleCrt;
    this.onToggleSplit = onToggleSplit;
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    const header = document.getElementById('main-navbar');
    header.innerHTML = `
      <div class="nav-container">
        <a href="#inicio" class="nav-brand">
          <span class="brand-bracket">[</span>
          <span class="brand-user">pyr0s</span>
          <span class="brand-at">@</span>
          <span class="brand-host">portfolio</span>
          <span class="brand-bracket">]</span>
          <span class="brand-cursor">_</span>
        </a>

        <nav class="nav-links" id="nav-links">
          <a href="#inicio" class="nav-link active">Inicio</a>
          <a href="#proyectos" class="nav-link">Proyectos</a>
          <a href="#ctfs" class="nav-link">CTFs</a>
          <a href="#trayectoria" class="nav-link">Trayectoria</a>
          <a href="#skills" class="nav-link">Skills</a>
          <a href="#wiki" class="nav-link">Wiki</a>
          <a href="#contacto" class="nav-link">Contacto</a>
        </nav>

        <div class="nav-tools">
          <button class="nav-tool-btn" id="nav-btn-audio" title="Efectos de Sonido">
            <span id="nav-audio-icon">🔇</span>
          </button>
          <button class="nav-tool-btn" id="nav-btn-crt" title="Alternar efecto CRT / Scanlines">
            <span>📺 CRT</span>
          </button>
          <button class="nav-tool-btn" id="nav-btn-split" title="Modo Pantalla Dividida (Terminal + GUI)">
            <span>◫ Split</span>
          </button>
          <button class="nav-term-trigger" id="nav-btn-term" title="Abrir Terminal Interactiva (Ctrl+K)">
            <span class="term-pulse-dot"></span>
            <span class="term-btn-label">>_ Terminal</span>
            <span class="term-kbd">Ctrl+K</span>
          </button>
          <button class="nav-mobile-toggle" id="nav-mobile-btn" aria-label="Menú">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Terminal toggle
    const termBtn = document.getElementById('nav-btn-term');
    if (termBtn) {
      termBtn.addEventListener('click', () => {
        soundFx.enter();
        this.onToggleTerminal();
      });
    }

    // Split toggle
    const splitBtn = document.getElementById('nav-btn-split');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => {
        soundFx.key();
        this.onToggleSplit();
      });
    }

    // CRT toggle
    const crtBtn = document.getElementById('nav-btn-crt');
    if (crtBtn) {
      crtBtn.addEventListener('click', () => {
        soundFx.key();
        this.onToggleCrt();
      });
    }

    // Audio toggle
    const audioBtn = document.getElementById('nav-btn-audio');
    const audioIcon = document.getElementById('nav-audio-icon');
    if (audioBtn) {
      const updateIcon = (enabled) => {
        audioIcon.textContent = enabled ? '🔊' : '🔇';
      };
      updateIcon(soundFx.enabled);
      audioBtn.addEventListener('click', () => {
        const state = soundFx.toggle();
        updateIcon(state);
      });
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById('nav-mobile-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('nav-links-open');
        mobileBtn.classList.toggle('open');
      });

      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('nav-links-open');
          mobileBtn.classList.remove('open');
        });
      });
    }

    // Global keyboard shortcut for terminal (Ctrl+K or `)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '`' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        soundFx.enter();
        this.onToggleTerminal();
      }
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
      const sections = ['inicio', 'proyectos', 'ctfs', 'trayectoria', 'skills', 'wiki', 'contacto'];
      const scrollPos = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(l => {
              l.classList.toggle('active', l.getAttribute('href') === `#${sectionId}`);
            });
            break;
          }
        }
      }
    });
  }
}
