import {createElement} from '../../utils/dom';

export default class DoubleSlider {
  sliderWidth;
  maxRangeWidth;
  thumbMoving;
  movingSide;
  otherSide;

  constructor(options = {
    min: 0,
    max: 100,
    selected: null,
    formatValue: value => value,
  }) {    
    this.options = options;
    this.formatValue = this.options.formatValue;
    this.setInitialData();

    this.element = createElement(this.createTemplate());
    this.subElements = {
      thumbLeft: this.element.querySelector('.range-slider__thumb-left'),
      thumbRight: this.element.querySelector('.range-slider__thumb-right'),
      progress: this.element.querySelector('.range-slider__progress'),
      sliderInner: this.element.querySelector('.range-slider__inner')
    };
    this.createEventListeners();
  }

  createTemplate() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.range.left)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.percent.left}%; right: ${this.percent.right}%"></span>
          <span class="range-slider__thumb-left" style="left: ${this.percent.left}%"></span>
          <span class="range-slider__thumb-right" style="right: ${this.percent.right}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.range.right)}</span>
      </div>
    `;
  }

  setSliderWidth() {
    this.sliderWidth = this.element.getBoundingClientRect().width;
  }

  createEventListeners() {
    this.element.addEventListener('pointerdown', this.onSliderPointerDown);
  }

  destroyEventListeners() {
    this.element.removeEventListener('pointerdown', this.onSliderPointerDown);
  }

  onSliderPointerDown = (e) => {
    if (!e.target.classList.contains('range-slider__thumb-left') &&
      !e.target.classList.contains('range-slider__thumb-right')) {
      return;
    }

    this.thumbMoving = e.target;
    this.movingSide = this.thumbMoving.classList[0].includes('left') ? 'left' : 'right';
    this.otherSide = this.movingSide === 'left' ? 'right' : 'left';

    this.setSliderWidth();
    document.body.style.cursor = 'grabbing';
    document.addEventListener('pointermove', this.onDocumentPointerMove);
    document.addEventListener('pointerup', this.onDocumentPointerUp);
  }

  onDocumentPointerUp = () => {
    document.body.style.cursor = 'grab';
    document.removeEventListener('pointermove', this.onDocumentPointerMove);
    document.addEventListener('pointerup', this.onDocumentPointerUp);
    this.thumbMoving = null;
    this.dispatchRangeSelectEvent();
  }

  onDocumentPointerMove = (e) => {
    const offsetPercent = this.getOffsetPercent(e.clientX, this.movingSide);

    this.percent[this.movingSide] = offsetPercent;
    this.changeSideValue();
    this.moveThumb();
  }

  moveThumb() {
    this.thumbMoving.style[this.movingSide] = this.percent[this.movingSide] + '%';
    this.subElements.progress.style[this.movingSide] = this.percent[this.movingSide] + '%';
  }

  updateLabel() {
    const labelData = this.movingSide === 'left' ? 'from' : 'to';
    const label = this.element.querySelector(`[data-element="${labelData}"]`);
    label.textContent = this.formatValue(this.range[this.movingSide]);
  }

  changeSideValue() {
    this.range[this.movingSide] = this.getValueByPercent(this.percent[this.movingSide]);
    this.updateLabel();
  }

  
  getOffsetPercent(x) {
    const boundedX = this.boundX(x);
    const thumbToSide = (this.movingSide === 'left') ? boundedX : this.sliderWidth - boundedX;
    const offsetPercent = thumbToSide / this.sliderWidth * 100;

    if (offsetPercent + this.percent[this.otherSide] > 100) {
      return 100 - this.percent[this.otherSide];
    }

    return offsetPercent;
  }

  boundX(x) {
    if (x < 0) {
      return 0;
    }

    if (x > this.sliderWidth) {
      return this.sliderWidth;
    }

    return x;
  }

  setInitialData() {
    this.min = this.formatValue(this.options.min);
    this.max = this.formatValue(this.options.max);
    this.maxRangeWidth = this.options.max - this.options.min;
    this.setInitialRange();
    this.setInitialPercentsRange();
  }

  setInitialRange() {
    this.range = {
      left: this.options?.selected?.from || this.options.min,
      right: this.options?.selected?.to || this.options.max
    };
  }

  setInitialPercentsRange() {
    this.percent = {
      left: this.getPercentOfValue(this.range.left, 'left'),
      right: this.getPercentOfValue(this.range.right, 'right')
    };
  }

  getPercentOfValue(value) {
    const diff = this.side === 'left' ? value - this.options.min : this.options.max - value;
    return diff / (this.options.max - this.options.min) * 100;
  }

  getValueByPercent(percent) {
    const percentFromLeft = this.movingSide === 'left' ? percent : 100 - percent;
    return Math.round(this.options.min + percentFromLeft / 100 * this.maxRangeWidth);
  }

  dispatchRangeSelectEvent() {
    const event = new CustomEvent(
      'range-select', {
        detail: { from: this.range.left, to: this.range.right }
      });
    this.element.dispatchEvent(event);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyEventListeners();
    this.remove();
  }
}
