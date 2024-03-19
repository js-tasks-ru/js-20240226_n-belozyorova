
import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1';

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;
    this.initialSort();
    this.createEventListener();
  }

  initialSort() {
    if (!this.sorted?.id || !this.sorted?.order) {
      return;
    }

    this.sort(this.sorted?.id, this.sorted?.order);
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('[data-sortable="true"]');

    if (!cellElement) {
      return;
    }

    const dataset = cellElement.dataset;
    this.sort(dataset.id, dataset.order === 'desc' ? 'asc' : 'desc');
  }

  createEventListener() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyEventListener() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    this.destroyEventListener();
    super.destroy();
  }
}
