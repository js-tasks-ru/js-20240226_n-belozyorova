class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.element = this.createElement(this.createTemplate);
  }

  initialize() {
    this.createEventListeners();
  }

  createTemplate() {
    return '<div class="tooltip"></div>';
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

  onDocumentPointerOver = (e) => {
    if (!e.target?.dataset?.tooltip) {
      return;
    }

    this.element.innerHTML = e.target.dataset.tooltip;
    this.render();
    e.target.addEventListener('pointermove', this.onDocumentPointerMove);
  };

  onDocumentPointerOut = (e) => {
    if (!e.target?.dataset?.tooltip) {
      return;
    }

    e.target.removeEventListener('pointermove', this.onDocumentPointerMove);
    this.remove();
  };

  onDocumentPointerMove = (e) => {
    this.element.style.setProperty('top', e.y + 10 + 'px');
    this.element.style.setProperty('left', e.x + 10 + 'px');
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
