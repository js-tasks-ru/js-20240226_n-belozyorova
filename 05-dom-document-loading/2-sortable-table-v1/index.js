import {createElement} from '../../utils/dom';

export default class SortableTable {
  lastSortField;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = createElement(this.createTemplate());
    this.subElements = {
      body: this.element.querySelector('[data-element="body"]'),
      header: this.element.querySelector('[data-element="header"]'),
    };
  }

  createTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.createHeaderTemplate()}
          ${this.createBodyTemplate()}
        </div>
      </div>
    `;
  }

  createHeaderTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(column => this.createHeaderCellTemplate(column)).join('')}
      </div>
    `;
  }

  createHeaderCellTemplate(column) {
    return `
      <div class="sortable-table__cell" data-id="${column?.id}" data-sortable="${column?.sortable}" data-order="">
        <span>${column?.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  createBodyTemplate() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.createAllRowsTemplate()}
      </div>
    `;
  }

  createAllRowsTemplate() {
    return this.data.map(rowData => this.createRowTemplate(rowData)).join('');
  }

  createRowTemplate(rowData) {
    return `
      <a href="/products/${rowData.id}" class="sortable-table__row">
        ${this.crateCellChain(rowData)}
      </a>
    `;
  }

  crateCellChain(rowData) {
    return this.headerConfig.map(
      columnConfig => this.createCellTemplate(rowData[columnConfig.id], columnConfig?.template)
    ).join('');
  }

  createCellTemplate(data, templateFunc) {
    return templateFunc
      ? templateFunc(data)
      : `<div class="sortable-table__cell">${data}</div>`;
  }

  getColumnConfig(field) {
    return this.headerConfig?.find(item => item.id === field);
  }

  sort(field, order) {
    this.sortData(field, order);
    this.updateHeader(field, order);
    this.updateBody();
    this.lastSortField = field;
  }

  sortData(field, order) {
    this.data = this.data.sort(this.compareField(field, order));
  }

  compareField(field, order) {
    const columnConfig = this.getColumnConfig(field);
    const orderFactor = order === 'asc' ? 1 : -1;

    return (a, b) => {
      if (columnConfig?.sortType === 'string') {
        return orderFactor * this.compareStrings(a[field], b[field]);
      } else {
        return orderFactor * this.compareNumbers(a[field], b[field]);
      }
    };
  }

  compareNumbers = (a, b) => {
    return a - b;
  }

  compareStrings = (a, b) => {
    return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
  }

  updateHeader(field, order) {
    if (this.lastSortField) {
      this.subElements.header.querySelector(`[data-id="${this.lastSortField}"]`)?.removeAttribute('data-order');
    }
    
    this.subElements.header.querySelector(`[data-id="${field}"]`)?.setAttribute('data-order', order);
  }

  updateBody() {
    this.subElements.body.innerHTML = this.createAllRowsTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

