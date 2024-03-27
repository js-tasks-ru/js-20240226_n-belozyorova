import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import {createElement} from '../../utils/dom';

const BACKEND_URL = 'https://course-js.javascript.ru';
const PAGE_SIZE = 30;

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = false,
    url = ''
  } = {}) {
    super(headersConfig, data, sorted);
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;

    this.setSorting();
    this.setPageFrame(false);
    this.sortOnServer(this.sorted?.id, this.sorted?.order);
  }

  createLoadingTemplate() {
    return '<div data-element="loading" class="loading-line sortable-table__loading-line"></div>';
  }

  createEmptyPlaceholderTemplate() {
    return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  makeElement() {
    super.makeElement();

    this.subElements = {
      ...this.subElements,
      loadingLine: this.addSubElement(this.createLoadingTemplate()),
      emptyPlaceholder: this.addSubElement(this.createEmptyPlaceholderTemplate())
    };
  }

  addSubElement(template) {
    return this.subElements.body.parentNode.appendChild(createElement(template));
  }

  showSubElement(name) {
    this.subElements[name].style.display = 'block';
  }

  hideSubElement(name) {
    this.subElements[name].style.display = 'none';
  }

  manageEmptyPlaceholder() {
    if (this.data.length === 0) {
      this.showSubElement('emptyPlaceholder');
    } else {
      this.hideSubElement('emptyPlaceholder');
    }
  }

  createEventListeners() {
    super.createEventListeners();
    document.addEventListener('scrollend', this.handleDocumentScrollEnd.bind(this));
  }

  destroyEventListeners() {
    super.destroyEventListeners();
    document.removeEventListener('scrollend', this.handleDocumentScrollEnd.bind(this));
  }

  handleDocumentScrollEnd(e) {
    const scrolledTo = window.scrollY + window.innerHeight;

    if (scrolledTo < document.body.scrollHeight) {
      return;
    }

    console.log('go next page');
    this.setPageFrame();
    this.sortOnServer(this.sorted?.id, this.sorted?.order);
  }

  async sort(id, order) {
    this.setSorting(id, order);
    this.setPageFrame(false);

    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      await this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }

  sortOnClient (id, order) {
    super.sort(id, order);
  }

  async sortOnServer(id, order) {
    this.showSubElement('loadingLine');
    this.updateUrl(id, order);
    await this.render();
  }

  async loadData() {
    const newData = await fetchJson(this.url);

    this.data = this.pageFrame.start > 0 ? [...this.data, ...newData] : newData;
  }

  async render() {
    await this.loadData();
    this.manageEmptyPlaceholder();
    super.render(this.sorted.id, this.sorted.order);
    this.hideSubElement('loadingLine');
  }

  updateUrl() {
    this.url.searchParams.set('_sort', this.sorted?.id);
    this.url.searchParams.set('_order', this.sorted?.order);
    this.url.searchParams.set('_start', this.pageFrame.start);
    this.url.searchParams.set('_end', this.pageFrame.end);
  }

  setSorting(id, order) {
    if (id !== undefined && order !== undefined) {
      this.sorted = {id, order};
      return;
    }

    this.sorted = {
      id: this.headerConfig.find(columnConfig => columnConfig.sortable).id,
      order: 'asc'
    };
  }

  setPageFrame(goForward = true) {
    if (!goForward) {
      this.pageFrame = {
        start: 0,
        end: PAGE_SIZE
      };

      return;
    }
    
    this.pageFrame.start += PAGE_SIZE;
    this.pageFrame.end += PAGE_SIZE;
  }
}
