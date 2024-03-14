export default class ColumnChart {
  chartHeight = 50;
  loadingClassName = 'column-chart_loading';

  constructor(props) {
    this.initProperties(props);
    this.element = this.createElement(this.createTemplate());
  }

  initProperties(props) {
    this.label = props?.label ?? '';
    this.value = props?.value ?? 0;
    this.data = props?.data ?? [];
    this.link = props?.link ?? '';
    this.formatHeading = props?.formatHeading;
  }

  createTemplate() {
    return `
      <div class="column-chart ${this.getLoadingClass()}">
        <div class="column-chart__title">
          ${this.createTitleTemplate()}
        </div>
        <div class="column-chart__container">
          ${this.createChartAreaTemplate()}
        </div>
      </div>
    `;
  }

  createTitleTemplate() {
    let template = this.label;

    if (!!this.link) {
      template += `<a href="${this.link}" class="column-chart__link">Подробнее</a>`;
    }

    return template;
  }

  createChartAreaTemplate() {
    return `
      <div class="column-chart__header">${this.getHeading()}</div>
      <div class="column-chart__chart">${this.createChartTemplate()}</div>
    `;
  }

  createChartTemplate() {
    let chartTemplate = '';
    const chartColumns = this.getColumnsProps();

    for (let column of chartColumns) {
      chartTemplate += this.createChartColumnTemplate(column);
    }

    return chartTemplate;
  }

  createChartColumnTemplate(column) {
    return `
      <div
        style="--value:${column.height}"
        data-tooltip="${this.createTooltipTemplate(column.percent)}">
      </div>
    `;
  }

  createTooltipTemplate(percent) {
    return `${percent}`;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getHeading() {
    return typeof this.formatHeading === 'function' ? this.formatHeading(this.value) : this.value;
  }

  getNoData() {
    return !this.data || this.data?.length === 0;
  }

  getLoadingClass() {
    return this.getNoData() ? this.loadingClassName : '';
  }

  getScale(maxValue) {
    return this.chartHeight / maxValue;
  }

  getColumnHeight(item, scale) {
    return String(Math.floor(item * scale));
  }

  getColumnPercent(item, maxItem) {
    return (item / maxItem * 100).toFixed(0) + '%';
  }

  getColumnsProps() {
    if (this.getNoData()) {
      return [];
    }

    const maxValue = Math.max(...this.data);
    const scale = this.getScale(maxValue);

    return this.data.map(item => ({
      height: this.getColumnHeight(item, scale),
      percent: this.getColumnPercent(item, maxValue)
    }));
  }

  updateColumns() {
    const chartColumns = this.getColumnsProps();
    const chartTemplate = this.createChartTemplate(chartColumns);
    this.element.getElementsByClassName('column-chart__chart')[0].innerHTML = chartTemplate;
  }

  updateLoadingState() {
    if (this.getNoData()) {
      this.element.classList.add(this.loadingClassName);
    } else {
      this.element.classList.remove(this.loadingClassName);
    }
  }

  update(data) {
    this.data = data;
    this.updateColumns();
    this.updateLoadingState();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
