import {Control, customElements, ControlElement, I18n} from '@ijstech/base';
import { Icon } from '@ijstech/icon';
import { TableCell } from './tableCell';
import * as Styles from '@ijstech/style';
import './style/table.css';
import { application } from '@ijstech/application';
const Theme = Styles.Theme.ThemeVars;

export type SortDirection = 'asc' | 'desc' | 'none';
type renderCallback = (target: TableColumn, columnData: any, rowData: any, rowIndex?: number, cell?: TableCell) => any;
type TextAlign = 'left' | 'right' | 'center';

export interface TableColumnElement extends ControlElement {
  title: string;
  fieldName: string;
  key?: string | number;
  sortable?: boolean;
  sortOrder?: SortDirection;
  textAlign?: TextAlign,
  sorter?: (a: any, b: any) => number;
  onRenderCell?: renderCallback;
}

@customElements('i-table-column')
export class TableColumn extends Control {
  fieldName: string;
  key?: string | number;
  sortable?: boolean;

  private columnElm: HTMLElement;
  private sortElm: HTMLElement;
  private ascElm: Icon;
  private descElm: Icon;

  private isHeader: boolean;
  private _sortOrder: SortDirection;
  private _data: number | string;
  private _textAlign: TextAlign;
  private _rowData: any; 
  private _caption: string;

  public onSortChange: (source: Control, key: string, value: SortDirection) => void;
  public onRenderCell: renderCallback;
  public sorter: (a: any, b: any) => number;

  constructor(parent?: Control, options?: any) {   
    super(parent, options);
  }

  get data(): number | string {
    return this._data;
  }
  set data(value: number | string) {
    this._data = value;
    this.columnElm.innerHTML = `${value}`;
  }

  get rowData(): number | string {
    return this._rowData;
  }
  set rowData(value: any) {
    this._rowData = value;
  }

  get sortOrder(): SortDirection {
    return this._sortOrder;
  }
  set sortOrder(value: SortDirection) {
    this._sortOrder = value;
    if (value === 'asc') {
      this.ascElm && this.ascElm.classList.add('sort-icon--active');
      this.descElm && this.descElm.classList.remove('sort-icon--active');
    } else if (value === 'desc') {
      this.ascElm && this.ascElm.classList.remove('sort-icon--active');
      this.descElm && this.descElm.classList.add('sort-icon--active');
    } else {
      this.ascElm && this.ascElm.classList.remove('sort-icon--active');
      this.descElm && this.descElm.classList.remove('sort-icon--active');
    }
    if (value && typeof this.onSortChange === 'function')
      this.onSortChange(this, this.fieldName, value)
  }

  get textAlign(): TextAlign {
    return this._textAlign;
  }
  set textAlign(value: TextAlign) {
    this._textAlign = value || 'left';
    this.style.textAlign = value;
  }

  get caption(): string {
    let value = this._caption || '';
    if (value?.startsWith('$')) {
      const translated =
        this.parentModule?.i18n?.get(value) ||
        application.i18n?.get(value) ||
        ''
      return translated;
    }
    return value;
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value;
    this.columnElm && (this.columnElm.innerHTML = this.caption);
  }

  updateLocale(i18n: I18n): void {
    if (this.columnElm && this._caption?.startsWith('$'))
      this.columnElm.innerHTML = i18n.get(this._caption) || '';
  }

  private renderSort() {
    if (!this.sortable) {
      this.sortElm && (this.sortElm.style.display = 'none');
      return;
    }
    if (!this.sortElm) {
      this.sortElm = this.createElement('div', this);
      this.sortElm.classList.add('i-table-sort');
      this.ascElm = new Icon(this, {
        name: 'caret-up',
        width: 14,
        height: 14,
        fill: Theme.text.primary
      });
      this.ascElm.classList.add('sort-icon', 'sort-icon--asc');
      this.ascElm.onClick = () => this.sortOrder = this.sortOrder === 'asc' ? 'none' : 'asc';
      
      this.descElm = new Icon(this, {
        name: 'caret-down',
        width: 14,
        height: 14,
        fill: Theme.text.primary
      });
      this.descElm.classList.add('sort-icon', 'sort-icon--desc');
      this.descElm.onClick = () => this.sortOrder = this.sortOrder === 'desc' ? 'none' : 'desc';
      this.sortElm.appendChild(this.ascElm);
      this.sortElm.appendChild(this.descElm);
    }
    this.sortElm.style.display = 'block'
  }

  async appendNode(params: any) {
    if (!params) return;
    const { tdElm, rowData, rowIndex, cell } = params;
    this.rowData = rowData;
    if (!this.columnElm || !this.onRenderCell) return;
    let node = await this.onRenderCell(this, this.data, rowData, rowIndex, cell);
    if(!node) return;

    if (cell.rowSpan === 0 || cell.columnSpan === 0) {
      this.remove();
      tdElm.remove();
      return;
    }
    (cell.columnSpan > 1) && tdElm.setAttribute('colspan', cell.columnSpan + '');
    (cell.rowSpan > 1) && tdElm.setAttribute('rowspan', cell.rowSpan + '');
    if (typeof node === 'string' || typeof node === 'number') {
      this.columnElm.innerHTML = node + '';
    } else {
      this.columnElm.innerHTML = '';
      this.columnElm.appendChild(node);
    }
  }

  init() {
    if (!this.columnElm) {
      this._caption = this.options.title;
      this.fieldName = this.options.fieldName;
      if (this.options.key)
        this.key = this.options.key;
      if (this.options.onRenderCell)
        this.onRenderCell = this.options.onRenderCell.bind(this);
      if (this.options.textAlign)
        this.textAlign = this.options.textAlign;
      this.setAttributeToProperty('grid');
      this.setAttributeToProperty('display');

      this.isHeader = this.options.header || false;
      this.visible = typeof this.options.visible === 'boolean' ? this.options.visible : true;
      this.columnElm = this.createElement('div', this);
      this.data = this.getAttribute('data', true);

      if (this.isHeader) {
        this.columnElm.innerHTML = this.caption;
        this.sortable = this.getAttribute('sortable', true, false);
        if (this.options.onSortChange)
          this.onSortChange = this.options.onSortChange;
        if (this.options.sorter)
          this.sorter = this.options.sorter;
        this.renderSort();
        const sortOrder = this.getAttribute('sortOrder', true);
        if (sortOrder) this.sortOrder = sortOrder;
      }
    }
  }
}