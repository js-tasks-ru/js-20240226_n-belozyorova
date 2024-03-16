import { createElement } from "../../utils/dom";

export default class NotificationMessage {
  static lastInstance;

  constructor(
    message = '',
    options = {
      duration: 2000,
      type: 'success'
    }
  ) {
    this.message = message;
    this.duration = options?.duration;
    this.type = options?.type;
    this.element = createElement(this.createTemplate());
  }

  createTemplate() {
    return `
      <div class="notification ${this.getType()}" style="--value:${this.getDurationInSeconds()}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.getType()}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  getType() {
    return this.type === 'success' ? 'success' : 'error';
  }

  getDurationInSeconds() {
    return Math.trunc(this.duration / 1000) + 's';
  }

  setTimer() {
    this.timer = setTimeout(() => this.destroy(), this.duration);
  }

  removeTimer() {
    clearTimeout(this.timer);
  }

  show(targetContainer = document.body) {
    this.destroyLastInstance();
    this.updateLastInstance();
    this.render(targetContainer);
    this.setTimer();
  }

  destroyLastInstance() {
    if (NotificationMessage.lastInstance) {
      NotificationMessage.lastInstance.destroy();
    }
  }

  updateLastInstance() {
    NotificationMessage.lastInstance = this;
  }

  render(targetContainer) {
    targetContainer.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeTimer();
  }
}
