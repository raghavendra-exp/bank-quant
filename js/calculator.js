/**
 * ULTRA CALC v1.0 - Engine, Audio Synthesis & Key Bindings
 * Integrated as a top floating tool for Banking Quant Master
 */

class UltraCalculator {
  constructor() {
    this.currentInput = '0';
    this.expression = '';
    this.previousValue = null;
    this.pendingOperator = null;
    this.isNewInput = true;
    this.history = [
      { expr: '25 + 10 =', val: '35' },
      { expr: '50 * 2 =', val: '100' }
    ];
    this.isScientific = false;
    this.soundEnabled = true;
    this.audioCtx = null;
    this.isOpen = false;

    this.initDOMElements();
    this.loadPersistedState();
    this.bindEvents();
    this.updateDisplay();
    this.renderHistory();
  }

  initDOMElements() {
    this.modal = document.getElementById('calcModal');
    this.calcWindow = document.getElementById('calcWindow');
    this.expressionDisplay = document.getElementById('expressionDisplay');
    this.mainDisplay = document.getElementById('mainDisplay');
    this.displayCard = document.getElementById('displayCard');

    this.btnDisplayClear = document.getElementById('btnDisplayClear');
    this.btnDisplayBack = document.getElementById('btnDisplayBack');

    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.themeToggleBtn = document.getElementById('calcThemeToggleBtn');
    this.btnClose = document.getElementById('btnClose');
    this.btnMinimize = document.getElementById('btnMinimize');
    this.btnMaximize = document.getElementById('btnMaximize');

    this.historyList = document.getElementById('historyList');
    this.historyClearBtn = document.getElementById('historyClearBtn');
    this.sciToggle = document.getElementById('sciToggle');
    this.scientificFlyout = document.getElementById('scientificFlyout');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('open');
    this.isOpen = true;
    this.playSound('click');
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('open');
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  loadPersistedState() {
    try {
      const savedHist = localStorage.getItem('ultra_calc_history');
      if (savedHist) {
        this.history = JSON.parse(savedHist);
      }
      const savedSound = localStorage.getItem('ultra_calc_sound');
      if (savedSound !== null) {
        this.soundEnabled = savedSound === 'true';
      }
      this.updateSoundIcon();
    } catch (e) {
      console.warn('Could not read state:', e);
    }
  }

  /* ==========================================================================
     Audio Synthesis (Mechanical Click, Chime & Alerts)
     ========================================================================== */
  initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.035);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'op') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.045);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'equals') {
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now);
        osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        gain2.gain.setValueAtTime(0.22, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.14);
        osc2.stop(now + 0.16);
      } else if (type === 'clear') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (err) {}
  }

  /* ==========================================================================
     Display & Formatting
     ========================================================================== */
  formatNumber(valStr) {
    if (valStr === '' || valStr === null || valStr === undefined) return '0';
    if (valStr === 'Error' || valStr === 'NaN' || valStr === 'Infinity') return valStr;

    const parts = valStr.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const isNegative = integerPart.startsWith('-');
    const cleanInteger = isNegative ? integerPart.slice(1) : integerPart;

    const formattedInt = cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const signedInt = isNegative ? '-' + formattedInt : formattedInt;

    if (decimalPart !== undefined) {
      return `${signedInt}.${decimalPart}`;
    }
    return signedInt;
  }

  updateDisplay() {
    if (this.mainDisplay) {
      this.mainDisplay.textContent = this.formatNumber(this.currentInput);
    }
    if (this.expressionDisplay) {
      this.expressionDisplay.textContent = this.expression || '0';
    }
  }

  /* ==========================================================================
     Calculator Core Operations
     ========================================================================== */
  handleNumber(num) {
    this.playSound('click');

    if (this.isNewInput) {
      this.currentInput = num;
      this.isNewInput = false;
    } else {
      if (this.currentInput === '0' && num !== '0') {
        this.currentInput = num;
      } else if (this.currentInput !== '0' || num !== '0') {
        if (this.currentInput.replace(/[^0-9]/g, '').length < 16) {
          this.currentInput += num;
        }
      }
    }

    if (this.pendingOperator && this.previousValue !== null) {
      this.expression = `${this.formatNumber(this.previousValue)} ${this.getOperatorSymbol(this.pendingOperator)} ${this.formatNumber(this.currentInput)}`;
    } else {
      this.expression = this.formatNumber(this.currentInput);
    }

    this.updateDisplay();
  }

  handleDecimal() {
    this.playSound('click');
    if (this.isNewInput) {
      this.currentInput = '0.';
      this.isNewInput = false;
    } else if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  getOperatorSymbol(op) {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      case '^': return '^';
      default: return op;
    }
  }

  handleOperator(op) {
    this.playSound('op');
    const inputVal = parseFloat(this.currentInput);

    if (this.previousValue === null) {
      this.previousValue = inputVal;
    } else if (this.pendingOperator && !this.isNewInput) {
      const result = this.executeCalculation(this.previousValue, inputVal, this.pendingOperator);
      this.previousValue = result;
      this.currentInput = result.toString();
    }

    this.pendingOperator = op;
    this.isNewInput = true;
    this.expression = `${this.formatNumber(this.previousValue)} ${this.getOperatorSymbol(op)}`;
    this.updateDisplay();
  }

  executeCalculation(a, b, op) {
    let res = 0;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/':
        if (b === 0) return 'Error';
        res = a / b;
        break;
      case '^': res = Math.pow(a, b); break;
      default: return b;
    }
    return parseFloat(res.toFixed(10));
  }

  calculate() {
    if (this.pendingOperator === null || this.previousValue === null) {
      return;
    }

    const currentVal = parseFloat(this.currentInput);
    const result = this.executeCalculation(this.previousValue, currentVal, this.pendingOperator);

    if (result === 'Error') {
      this.currentInput = 'Error';
      this.expression = 'Cannot divide by 0';
      this.updateDisplay();
      this.isNewInput = true;
      this.pendingOperator = null;
      this.previousValue = null;
      return;
    }

    this.playSound('equals');

    const fullExpr = `${this.formatNumber(this.previousValue)} ${this.getOperatorSymbol(this.pendingOperator)} ${this.formatNumber(currentVal)} =`;
    this.addHistory(fullExpr, this.formatNumber(result));

    this.expression = fullExpr;
    this.currentInput = result.toString();
    this.previousValue = null;
    this.pendingOperator = null;
    this.isNewInput = true;

    this.updateDisplay();
  }

  handleBackspace() {
    this.playSound('click');
    if (this.isNewInput || this.currentInput === 'Error') {
      this.currentInput = '0';
      this.expression = '0';
    } else {
      this.currentInput = this.currentInput.slice(0, -1);
      if (this.currentInput === '' || this.currentInput === '-') {
        this.currentInput = '0';
      }
    }
    this.updateDisplay();
  }

  clearAll() {
    this.playSound('clear');
    this.currentInput = '0';
    this.expression = '';
    this.previousValue = null;
    this.pendingOperator = null;
    this.isNewInput = true;
    this.updateDisplay();
  }

  /* ==========================================================================
     Scientific Functions
     ========================================================================== */
  handleScientific(func) {
    this.playSound('op');
    const val = parseFloat(this.currentInput);
    let result = 0;

    switch (func) {
      case 'sin': result = Math.sin((val * Math.PI) / 180); break;
      case 'cos': result = Math.cos((val * Math.PI) / 180); break;
      case 'tan': result = Math.tan((val * Math.PI) / 180); break;
      case 'sqrt':
        if (val < 0) return this.showError('Invalid input');
        result = Math.sqrt(val);
        break;
      case 'log':
        if (val <= 0) return this.showError('Invalid input');
        result = Math.log10(val);
        break;
      case 'pi':
        this.currentInput = Math.PI.toFixed(8).toString();
        this.isNewInput = false;
        this.updateDisplay();
        return;
      case 'e':
        this.currentInput = Math.E.toFixed(8).toString();
        this.isNewInput = false;
        this.updateDisplay();
        return;
    }

    result = parseFloat(result.toFixed(10));
    this.expression = `${func}(${this.formatNumber(val)}) =`;
    this.addHistory(this.expression, this.formatNumber(result));
    this.currentInput = result.toString();
    this.isNewInput = true;
    this.updateDisplay();
  }

  showError(msg) {
    this.currentInput = 'Error';
    this.expression = msg;
    this.updateDisplay();
    this.isNewInput = true;
  }

  toggleScientific() {
    this.playSound('click');
    this.isScientific = !this.isScientific;
    const thumb = document.getElementById('pillThumb');
    const stdLabel = document.querySelector('.pill-std');
    const sciLabel = document.querySelector('.pill-sci');

    if (this.isScientific) {
      if (this.scientificFlyout) this.scientificFlyout.classList.remove('hidden');
      if (thumb) thumb.style.transform = 'translateX(28px)';
      if (stdLabel) stdLabel.classList.remove('active');
      if (sciLabel) sciLabel.classList.add('active');
    } else {
      if (this.scientificFlyout) this.scientificFlyout.classList.add('hidden');
      if (thumb) thumb.style.transform = 'translateX(0px)';
      if (stdLabel) stdLabel.classList.add('active');
      if (sciLabel) sciLabel.classList.remove('active');
    }
  }

  /* ==========================================================================
     History Drawer
     ========================================================================== */
  addHistory(expr, val) {
    this.history.unshift({ expr, val });
    if (this.history.length > 20) this.history.pop();
    this.renderHistory();
    try {
      localStorage.setItem('ultra_calc_history', JSON.stringify(this.history));
    } catch (e) {}
  }

  renderHistory() {
    if (!this.historyList) return;
    this.historyList.innerHTML = '';
    this.history.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.dataset.res = item.val;
      div.innerHTML = `
        <span class="history-expr">${item.expr}</span>
        <span class="history-val">${item.val}</span>
      `;
      div.addEventListener('click', () => {
        this.playSound('click');
        this.currentInput = item.val.replace(/,/g, '');
        this.isNewInput = true;
        this.updateDisplay();
      });
      this.historyList.appendChild(div);
    });
  }

  clearHistory() {
    this.playSound('clear');
    this.history = [];
    this.renderHistory();
    try {
      localStorage.removeItem('ultra_calc_history');
    } catch (e) {}
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.updateSoundIcon();
    try {
      localStorage.setItem('ultra_calc_sound', this.soundEnabled.toString());
    } catch (e) {}
    if (this.soundEnabled) this.playSound('click');
  }

  updateSoundIcon() {
    if (!this.soundToggleBtn) return;
    const iconOn = this.soundToggleBtn.querySelector('.icon-sound-on');
    const iconOff = this.soundToggleBtn.querySelector('.icon-sound-off');
    if (iconOn && iconOff) {
      iconOn.classList.toggle('hidden', !this.soundEnabled);
      iconOff.classList.toggle('hidden', this.soundEnabled);
    }
  }

  createRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const x = e.clientX ? (e.clientX - rect.left - radius) : (rect.width / 2 - radius);
    const y = e.clientY ? (e.clientY - rect.top - radius) : (rect.height / 2 - radius);

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('calc-ripple');

    const existing = element.querySelector('.calc-ripple');
    if (existing) existing.remove();

    element.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }

  /* ==========================================================================
     Event Listeners & Key Bindings
     ========================================================================== */
  bindEvents() {
    if (this.calcWindow) {
      this.calcWindow.addEventListener('click', (e) => {
        const btn = e.target.closest('.calc-btn, .sci-btn');
        if (!btn) return;

        this.createRipple(e, btn);
        const action = btn.dataset.action;
        const val = btn.dataset.val;

        switch (action) {
          case 'number': this.handleNumber(val); break;
          case 'decimal': this.handleDecimal(); break;
          case 'operator': this.handleOperator(val); break;
          case 'calculate': this.calculate(); break;
          case 'sci': this.handleScientific(val); break;
        }
      });
    }

    if (this.btnDisplayClear) this.btnDisplayClear.addEventListener('click', () => this.clearAll());
    if (this.btnDisplayBack) this.btnDisplayBack.addEventListener('click', () => this.handleBackspace());

    if (this.sciToggle) this.sciToggle.addEventListener('click', () => this.toggleScientific());
    if (this.historyClearBtn) this.historyClearBtn.addEventListener('click', () => this.clearHistory());
    if (this.soundToggleBtn) this.soundToggleBtn.addEventListener('click', () => this.toggleSound());

    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.btnMinimize) this.btnMinimize.addEventListener('click', () => this.close());

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return;

      let selector = null;

      if (e.key >= '0' && e.key <= '9') {
        this.handleNumber(e.key);
        selector = `.btn-num[data-val="${e.key}"]`;
      } else if (e.key === '.') {
        this.handleDecimal();
        selector = `.calc-btn[data-action="decimal"]`;
      } else if (['+', '-', '*', '/', '^'].includes(e.key)) {
        this.handleOperator(e.key);
        selector = `.btn-op[data-val="${e.key}"]`;
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        this.calculate();
        selector = `#btnEquals`;
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        this.handleBackspace();
        selector = `#btnDisplayBack`;
      } else if (e.key === 'Escape') {
        this.close();
      } else if (e.key.toLowerCase() === 's' && !e.ctrlKey) {
        this.toggleSound();
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleScientific();
      }

      if (selector) {
        const el = this.calcWindow?.querySelector(selector);
        if (el) {
          el.classList.add('simulated-active');
          this.createRipple({ clientX: null, clientY: null }, el);
          setTimeout(() => el.classList.remove('simulated-active'), 130);
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ultraCalc = new UltraCalculator();
  const toggleBtn = document.getElementById('calc-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => window.ultraCalc.toggle());
  }
});
