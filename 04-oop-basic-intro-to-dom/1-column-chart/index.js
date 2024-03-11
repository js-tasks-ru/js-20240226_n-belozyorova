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
      <div class="column-chart ${this.getLoadingClass(this.getNoData(this.data))}">
        <div class="column-chart__title">
          ${this.createTitleTemplate(this.label, this.link)}
        </div>
        <div class="column-chart__container">
          ${this.createChartAreaTemplate(this.getHeading(this.value, this.formatHeading), this.getColumnsProps(this.data))}
        </div>
      </div>
    `;
  }

  createTitleTemplate(label, link) {
    let template = label;

    if (!!link) {
      template += `<a href="${link}" class="column-chart__link">Подробнее</a>`;
    }

    return template;
  }

  createChartAreaTemplate(heading, chartColumns) {
    return `
      <div class="column-chart__header">${heading}</div>
      <div class="column-chart__chart">${this.createChartTemplate(chartColumns)}</div>
    `;
  }

  createChartTemplate(chartColumns) {
    let chartTemplate = '';

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

  getHeading(value, formatHeading) {
    return typeof formatHeading === 'function' ? formatHeading(value) : value;
  }

  getNoData(data) {
    return !data || data?.length === 0;
  }

  getLoadingClass(noData) {
    return noData ? this.loadingClassName : '';
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

  getColumnsProps(data) {
    if (this.getNoData(data)) {
      return [];
    }

    const maxValue = Math.max(...data);
    const scale = this.getScale(maxValue);

    return data.map(item => ({
      height: this.getColumnHeight(item, scale),
      percent: this.getColumnPercent(item, maxValue)
    }));
  }

  updateColumns(data) {
    const chartColumns = this.getColumnsProps(data);
    const chartTemplate = this.createChartTemplate(chartColumns);
    this.element.getElementsByClassName('column-chart__chart')[0].innerHTML = chartTemplate;
  }

  updateLoadingState(noData) {
    if (noData) {
      this.element.classList.add(this.loadingClassName);
    } else {
      this.element.classList.remove(this.loadingClassName);
    }
  }

  update(data) {
    this.data = data;
    this.updateColumns(this.data);
    this.updateLoadingState(this.getNoData(this.data));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
