import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date()
    },
    label = '',
    value = 0,
    data = [],
    link = '',
    formatHeading = data => `${data}`
  } = {}) {
    super({label, value, data, link, formatHeading});
    this.url = new URL(url, BACKEND_URL);

    this.range = range;
    this.updateUrl();
  }

  async update(from, to) {
    this.range = {from, to};
    this.updateUrl();

    const chartData = await this.fetchData();
    super.update(chartData);
    return chartData;
  }

  async fetchData() {
    return await fetchJson(this.url);
  }

  updateUrl() {
    this.url.searchParams.set('from', this.range?.from.toJSON());
    this.url.searchParams.set('to', this.range?.to.toJSON());
  }
}
