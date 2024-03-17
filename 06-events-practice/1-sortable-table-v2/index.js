
import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1';

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;

    this.makeSubelementsForTests();
    this.initialSort();
    this.createEventListeners();
  }

  makeSubelementsForTests() {
    this.subElements.header = {};
    this.subElements.header.children = Object.values(this.subElements.headerCells);
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

  createEventListeners() {
    for (let cell of Object.values(this.subElements.headerCells)) {
      if (!cell.dataset.sortable) {
        continue;
      }

      cell.addEventListener('pointerdown', this.handleHeaderCellClick);
    }
  }

  destroyEventListeners() {
    for (let cell of Object.values(this.subElements.headerCells)) {
      if (!cell.dataset.sortable) {
        continue;
      }

      cell.removeEventListener('pointerdown', this.handleHeaderCellClick);
    }
  }

  destroy() {
    this.destroyEventListeners();
    super.destroy();
  }
}
