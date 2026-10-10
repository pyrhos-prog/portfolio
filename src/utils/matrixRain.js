// Matrix digital rain canvas effect
export class MatrixRain {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.animationId = null;
    this.characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$+-*/=%\"\'#&_(),.;:?!\\|{}<>[]^~';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.color = '#a855f7'; // default purple neon
    this.active = false;

    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
  }

  init(color = '#a855f7') {
    this.color = color;
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  setColor(hexColor) {
    this.color = hexColor;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -50);
    }
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.canvas.style.display = 'block';
    this.draw();
  }

  stop() {
    this.active = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.canvas.style.display = 'none';
  }

  toggle() {
    if (this.active) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  draw() {
    if (!this.active) return;

    // Semi-transparent black to create fade trail effect
    this.ctx.fillStyle = 'rgba(8, 4, 16, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.color;
    this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Glow head character
      if (Math.random() > 0.9) {
        this.ctx.fillStyle = '#ffffff';
      } else {
        this.ctx.fillStyle = this.color;
      }

      this.ctx.fillText(text, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    this.animationId = requestAnimationFrame(this.draw);
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }
}
