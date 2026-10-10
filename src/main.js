import './style.css';
import { Navbar } from './components/navbar.js';
import { Terminal } from './components/terminal.js';
import { CardsView } from './components/cardsView.js';
import { ModalReader } from './components/modalReader.js';
import { MatrixRain } from './utils/matrixRain.js';
import { soundFx } from './utils/audioEffects.js';

// Setup Matrix digital rain
const matrixCanvas = document.getElementById('matrix-canvas');
const matrix = new MatrixRain(matrixCanvas);
matrix.init('#a855f7');

// Setup Modal Reader
const modalReader = new ModalReader({
  containerId: 'modal-container',
  onRunInTerminal: (cmd) => {
    terminal.toggleTerminal(true);
    terminal.executeCommand(cmd);
  }
});

// Global modal opener for terminal links
window.__openModal = (slug) => {
  modalReader.open(slug);
};

// Setup Cards View (Classic GUI)
const cardsView = new CardsView({
  onOpenModal: (slug) => {
    modalReader.open(slug);
  },
  onRunInTerminal: (cmd) => {
    terminal.toggleTerminal(true);
    terminal.executeCommand(cmd);
  }
});

// Render GUI content
const guiContainer = document.getElementById('gui-content');
guiContainer.innerHTML = cardsView.renderAll();
cardsView.bindEvents(guiContainer);

// Setup Terminal
const terminal = new Terminal({
  containerId: 'terminal-container',
  onOpenModal: (slug) => {
    modalReader.open(slug);
  },
  onNavigateGui: (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  },
  onThemeChange: (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    const themeColors = {
      purple: '#a855f7',
      green: '#10b981',
      cyan: '#06b6d4',
      red: '#f43f5e'
    };
    if (themeColors[themeName]) {
      matrix.setColor(themeColors[themeName]);
    }
  },
  onMatrixToggle: () => {
    return matrix.toggle();
  }
});

// Setup Navbar
new Navbar({
  onToggleTerminal: () => {
    terminal.toggleTerminal();
  },
  onToggleCrt: () => {
    const crt = document.getElementById('crt-overlay');
    crt.classList.toggle('crt-disabled');
  },
  onToggleSplit: () => {
    terminal.toggleSplit();
  }
});

// Floating terminal toggle button
const floatBtn = document.getElementById('floating-term-toggle');
if (floatBtn) {
  floatBtn.addEventListener('click', () => {
    soundFx.enter();
    terminal.toggleTerminal();
  });
}

// Log startup in browser console
console.log(
  '%c[ PYRHOS CYBER LAB ONLINE ]%c\nTerminal CLI and GUI initialized successfully.',
  'background: #7e22ce; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
  'color: #a855f7;'
);
