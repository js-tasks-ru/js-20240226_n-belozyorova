import {createElement} from '../../utils/dom';

const SLIDER_PADDING = 60;
const PROGRESS_PADDING = 14;
export default class DoubleSlider {
  sliderWidth;
  maxRangeWidth;
  sliderPadding

  constructor(options = {
    min: 0,
    max: 100,
    selected: null,
    formatValue: value => value,
  }) {    
    this.options = options;
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
        <span data-element="from">${this.getValueLabel(this.range.left)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.percent.left}%; right: ${this.percent.right}%"></span>
          <span class="range-slider__thumb-left" style="left: ${this.percent.left}%"></span>
          <span class="range-slider__thumb-right" style="right: ${this.percent.right}%"></span>
        </div>
        <span data-element="to">${this.getValueLabel(this.range.right)}</span>
      </div>
    `;
  }

  setSliderWidth() {
    this.sliderWidth = this.element.getBoundingClientRect().width;
  }

  getValueLabel(value) {
    if (this.options?.formatValue && typeof this.options?.formatValue === 'function') {
      return this.options.formatValue(value);
    }

    return value;
  }

  createEventListeners() {
    this.element.addEventListener('pointerdown', this.onSliderPointerDown);
    document.addEventListener('pointerup', this.onSliderPointerUp);
  }

  destroyEventListeners() {
    this.element.removeEventListener('pointerdown', this.onSliderPointerDown);
    document.removeEventListener('pointerup', this.onSliderPointerUp);
  }

  onSliderPointerDown = (e) => {
    if (!e.target.classList.contains('range-slider__thumb-left') &&
      !e.target.classList.contains('range-slider__thumb-right')) {
      return;
    }

    this.thumbMoving = e.target;
    this.setSliderWidth();
    document.body.style.cursor = 'grabbing';
    document.addEventListener('pointermove', this.onSliderPointerMove);
  }

  onSliderPointerUp = () => {
    document.body.style.cursor = 'grab';
    document.removeEventListener('pointermove', this.onSliderPointerMove);
    this.thumbMoving = null;
    this.dispatchRangeSelectEvent();
  }

  onSliderPointerMove = (e) => {
    const side = this.thumbMoving.classList[0].includes('left') ? 'left' : 'right';
    const offsetPercent = this.getOffsetPercent(e.clientX, side);

    this.percent[side] = offsetPercent;
    this.changeSideValue(side);
    this.moveThumb(side);
  }

  moveThumb(side) {
    this.thumbMoving.style[side] = this.percent[side] + '%';
    this.subElements.progress.style[side] = this.percent[side] + '%';
  }

  updateLabel(side) {
    const labelData = side === 'left' ? 'from' : 'to';
    const label = this.element.querySelector(`[data-element="${labelData}"]`);
    label.textContent = this.getValueLabel(this.range[side]);
  }

  changeSideValue(side) {
    this.range[side] = this.getValueByPercent(this.percent[side], side);
    this.updateLabel(side);
  }

  
  getOffsetPercent(x, side) {
    const boundedX = this.boundX(x);
    const thumbToSide = (side === 'left') ? boundedX : this.sliderWidth - boundedX;
    const offsetPercent = thumbToSide / this.sliderWidth * 100;
    const otherSide = side === 'left' ? 'right' : 'left';

    if (offsetPercent + this.percent[otherSide] > 100) {
      return 100 - this.percent[otherSide];
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
    this.min = this.getValueLabel(this.options.min);
    this.max = this.getValueLabel(this.options.max);
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

  getPercentOfValue(value, side) {
    const diff = side === 'left' ? value - this.options.min : this.options.max - value;
    return diff / (this.options.max - this.options.min) * 100;
  }

  getValueByPercent(percent, side) {
    const percentFromLeft = side === 'left' ? percent : 100 - percent;
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
