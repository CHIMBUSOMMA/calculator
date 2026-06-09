class Calculator {
  constructor() {
    this.display = document.getElementById('display');
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.lastAnswer = 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (button.dataset.value) {
        button.addEventListener('click', () => this.inputValue(button.dataset.value));
      } else if (button.dataset.action) {
        const action = button.dataset.action;
        if (action === 'clear') {
          button.addEventListener('click', () => this.clear());
        } else if (action === 'back') {
          button.addEventListener('click', () => this.backspace());
        } else if (action === 'eval') {
          button.addEventListener('click', () => this.evaluate());
        } else if (action === 'power') {
          button.addEventListener('click', () => this.inputValue('^'));
        } else if (action === 'ans') {
          button.addEventListener('click', () => this.answerInput());
        } else if (action === 'func') {
          const func = button.dataset.func;
          button.addEventListener('click', () => this.applyFunction(func));
        } else if (action === 'const') {
          const constant = button.dataset.const;
          button.addEventListener('click', () => this.inputConstant(constant));
        }
      }
    });
  }

  inputValue(value) {
    if (this.currentValue === '0' && value !== '.') {
      this.currentValue = value;
    } else if (value === '.' && this.currentValue.includes('.')) {
      return;
    } else {
      this.currentValue += value;
    }
    this.updateDisplay();
  }

  inputConstant(constant) {
    if (constant === 'pi') {
      this.currentValue = String(Math.PI);
      this.updateDisplay();
    }
  }

  applyFunction(func) {
    try {
      let result;
      const value = parseFloat(this.currentValue);
      
      switch (func) {
        case 'sin':
          result = Math.sin(value * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(value * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(value * Math.PI / 180);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        default:
          return;
      }
      
      this.currentValue = String(result);
      this.updateDisplay();
    } catch (error) {
      this.display.value = 'Error';
    }
  }

  answerInput() {
    this.currentValue = String(this.lastAnswer);
    this.updateDisplay();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.updateDisplay();
  }

  backspace() {
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = '0';
    }
    this.updateDisplay();
  }

  evaluate() {
    try {
      // Replace mathematical symbols with JavaScript operators
      let expression = this.currentValue
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-')
        .replace(/\^/g, '**')
        .replace(/π/g, String(Math.PI));
      
      // Evaluate the expression
      const result = Function('"use strict"; return (' + expression + ')')();
      
      if (isNaN(result) || !isFinite(result)) {
        this.display.value = 'Error';
        this.currentValue = '0';
        return;
      }
      
      this.lastAnswer = result;
      this.currentValue = String(result);
      this.previousValue = '';
      this.operation = null;
      this.updateDisplay();
    } catch (error) {
      this.display.value = 'Error';
      this.currentValue = '0';
    }
  }

  updateDisplay() {
    this.display.value = this.currentValue;
  }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
