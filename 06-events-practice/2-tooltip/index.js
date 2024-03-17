class Tooltip {
  static instance;
  dataSelector = 'tooltip';

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.element = this.createElement(this.createTemplate);
  }

  initialize () {
    this.createEventListeners();
  }

  createTemplate() {
    return `<div class="tooltip"></div>`;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  render(targetContainer) {
    if (!targetContainer) {
      targetContainer = document.body;
    }

    targetContainer.appendChild(this.element);
  }

  createEventListeners() {
    document.addEventListener('pointerover', this.onDocumentPointerOver);
    document.addEventListener('pointerout', this.onDocumentPointerOut);
  }

  destroyEventListeners() {
    document.removeEventListener('pointerover', this.onDocumentPointerOver);
    document.removeEventListener('pointerout', this.onDocumentPointerOut);
  }

  setText(text) {
    this.element.innerHTML = text;
  }

  onDocumentPointerOver = (e) => {
    const tooltipText = e.target?.dataset[this.dataSelector];

    if (tooltipText) {
      this.setText(tooltipText);
      this.render();
    }
  };

  onDocumentPointerOut = (e) => {
    this.remove();
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyEventListeners();
    this.remove();
  }
}

export default Tooltip;
