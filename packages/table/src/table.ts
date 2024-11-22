import { Control, customElements, ControlElement, IMediaQuery, IControlMediaQueryProps, observable, I18n} from '@ijstech/base';
import { TableColumn, SortDirection, TableColumnElement } from './tableColumn';
import { Pagination } from '@ijstech/pagination';
import { paginate, orderBy, getSorter, getColumnKey, filterBy, getColumnIndex } from './utils';
import { getTableMediaQueriesStyleClass, tableStyle, getCustomStylesClass } from './style/table.css';
import { TableRow } from './tableRow';
import { Icon } from '@ijstech/icon';
import { TableCell } from './tableCell';

type cellClickCallback = (target: Table, rowIndex: number, columnIdx: number, record: any) => void
type emptyCallback = (target: Table) => void
type sortCallback = (target: Table, key: string, value: string) => void

interface ITableExpandable {
  onRenderExpandedRow: (record: any) => any;
  rowExpandable: boolean;
  onRenderExpandIcon?: (target: Table, expand: boolean) => Icon
}
export interface ITableMediaQueryProps extends IControlMediaQueryProps{
  fieldNames?: string[];
  expandable?: ITableExpandable
}
export type ITableMediaQuery = IMediaQuery<ITableMediaQueryProps>;

export interface TableElement extends ControlElement {
  heading?: boolean;
  data?: any;
  columns?: TableColumnElement[];
  rows?: TableRow[];
  pagination?: string;
  expandable?: ITableExpandable;
  mediaQueries?: ITableMediaQuery[];
  headingStyles?: ControlElement;
  bodyStyles?: ControlElement;
  onRenderEmptyTable?: emptyCallback;
  onCellClick?: cellClickCallback;
  onColumnSort?: sortCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-table']: TableElement
    }
  }
}

// @customElements("i-table", {
//   icon: 'table',
//   group: GroupType.BASIC,
//   className: 'Table',
//   props: {
//     heading: {
//       type: 'boolean',
//       default: true
//     },
//     data: {
//       type: 'object'
//     },
//     columns: {
//       type: 'array',
//       default: []
//     },
//     pagination: {
//       type: 'string',
//       default: ''
//     },
//     expandable: {type: 'object'}
//   },
//   events: {},
//   dataSchema: {
//     type: 'object',
//     properties: {
//       heading: {
//         type: 'boolean',
//         format: 'boolean'
//       },
//       columns: {
//         type: 'array',
//         items: {
//           type: 'object',
//           properties: {
//             fieldName: {
//               type: 'string'
//             },
//             title: {
//               type: 'string'
//             },
//             textAlign: {
//               type: 'string',
//               enum: ['left', 'right', 'center'],
//               default: 'left'
//             },
//             sortable: {
//               type: 'boolean',
//               format: 'boolean'
//             },
//           }
//         }
//       }
//     }
//   }
// })
@customElements("i-table")
export class Table extends Control {
  private wrapperElm: HTMLElement;
  private tableElm: HTMLTableElement;
  private tHeadElm: HTMLElement;
  private tBodyElm: HTMLElement;
  private pagingElm: HTMLElement;

  public onCellClick: cellClickCallback;
  public onRenderEmptyTable: emptyCallback;
  public onColumnSort: sortCallback;

  @observable('data', true)
  private _data: any;
  private _filteredData: any;
  private _tableID: string;
  private _columns: TableColumnElement[];
  private _rows: TableRow[] = [];
  private _pagination: Pagination;
  private firstLoad: boolean = true;
  private _mediaQueries: ITableMediaQuery[];

  private _expandable: ITableExpandable;
  private _sortConfig: { [key: string]: SortDirection } = {};
  private _heading: boolean;
  private _headingStyles: ControlElement;
  private _bodyStyles: ControlElement;
  private _bodyStyle: string = '';
  private _headingStyle: string = '';

  constructor(parent?: Control, options?: any) {
    super(parent, options, {
      heading: true
    });
  }

  get data(): any {
    return this._data;
  }
  set data(value: any) {
    this._data = value;
    this.filteredData = value;
    if (this.pagination)
      this.pagination.totalPages = Math.ceil(value.length / this.pagination.pageSize);

    if (typeof this.renderBody === 'function')
      this.renderBody();
  }

  get filteredData(): any {
    return this.sortFn(this._filteredData)
  }
  set filteredData(value: any) {
    this._filteredData = value;
  }

  private get hasData() {
    return this.filteredData && this.filteredData.length;
  }

  private get sortConfig() {
    if (!this._sortConfig || !Object.keys(this._sortConfig).length) return [];
    const list = [];
    for (const col of this.columns) {
      const direction = this._sortConfig[col.fieldName];
      if (direction && direction !== 'none') {
        list.push({ key: col.fieldName, direction });
      }
    }
    return list;
  }

  private sortFn(list: any) {
    if (!list) return [];
    if (this.sortConfig.length) {
      return orderBy([...list], this.sortConfig, this.columns);
    }
    return list;
  }

  get columns(): TableColumnElement[] {
    return this._columns || [];
  }
  set columns(value: TableColumnElement[]) {
    this._columns = value;
    this._heading && this.renderHeader();
    !this.firstLoad && typeof this.renderBody === 'function' && this.renderBody();
  }

  get rows(): TableRow[] {
    return this._rows;
  }
  // set rows(value: TableRow[]) {
  //   this._rows = value;
  // }

  get pagination(): Pagination {
    return this._pagination;
  }
  set pagination(value: string | Pagination) {
    if (typeof value === 'string') {
      const elm = document.querySelector(`#${value}`) as Pagination;
      if (elm instanceof Pagination) this._pagination = elm;
    } else if (value) {
      this._pagination = value;
      this.pagingElm.innerHTML = '';
      this.pagingElm.appendChild(this.pagination);
    }
  
    if (this._pagination) {
      this.pagingElm.style.display = 'flex';
      if (this.data)
        this._pagination.totalPages = Math.ceil(this.data.length / this._pagination.pageSize);
      this._pagination.onPageChanged = this.onPageChanged.bind(this)
      this.renderBody();
    } else {
      this.pagingElm.style.display = 'none';
    }
  }

  get expandable(): ITableExpandable {
    return this._expandable;
  }
  set expandable(value: ITableExpandable) {
    this._expandable = value;
  }

  private get hasExpandColumn() {
    return  this.expandable && !!this.expandable.onRenderExpandIcon;
  }
  private get columnLength() {
    return this.columns.length;
  }

  get mediaQueries(){
    return this._mediaQueries;
  }
  set mediaQueries(value: ITableMediaQuery[]){
    this._mediaQueries = value;
    const style = getTableMediaQueriesStyleClass(this.columns, this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style;
    this.classList.add(style);
  }

  get headingStyles(){
    return this._headingStyles;
  }
  set headingStyles(value: ControlElement){
    this._headingStyles = value;
    const newStyle = getCustomStylesClass(value);
    if (this._headingStyle) {
      const ths = this.querySelectorAll('th.i-table-cell');
      for (let th of ths) {
        if (th.classList.contains(this._headingStyle)) {
          th.classList.remove(this._headingStyle);
          th.classList.add(newStyle);
        }
      }
    }
    this._headingStyle = newStyle;
  }

  get bodyStyles(){
    return this._bodyStyles;
  }
  set bodyStyles(value: ControlElement){
    this._bodyStyles = value;
    const newStyle = getCustomStylesClass(value);
    if (this._bodyStyle) {
      const tds = this.querySelectorAll('td.i-table-cell');
      for (let td of tds) {
        if (td.classList.contains(this._bodyStyle)) {
          td.classList.remove(this._bodyStyle);
          td.classList.add(newStyle);
        }
      }
    }
    this._bodyStyle = newStyle;
  }

  // private updateExpandColumn() {
  //   const expandIcon = this.expandable.onRenderExpandIcon;
  //   if (this.hasExpandColumn && expandIcon) {
  //     const trHeader = this.tHeadElm.querySelector('tr');
  //     const firstHeader = trHeader?.firstElementChild;
  //     if (firstHeader && firstHeader.classList.contains('i-table-cell--expand')) return;
  //     const thElm = this.createElement('th');
  //     thElm.classList.add('i-table-cell', 'i-table-cell--expand', 'text-center');
  //     if (firstHeader && firstHeader.parentNode)
  //       firstHeader.parentNode.insertBefore(thElm, firstHeader);
  //     const trBody = this.tBodyElm.querySelectorAll('tr');
  //     trBody.forEach(trElm => {
  //       const tdElm = this.createElement('td');
  //       tdElm.classList.add('i-table-cell', 'i-table-cell--expand', 'text-center');
  //       tdElm.appendChild(expandIcon(this, false));
  //       const tdFirst = trElm?.firstChild;
  //       if (tdFirst && tdFirst.parentNode)
  //         tdFirst.parentNode.insertBefore(tdElm, tdFirst);
  //     })
  //   } else {
  //     const expandedTd = this.querySelectorAll('.i-table-cell--expand');
  //     expandedTd.forEach(td => td.remove());
  //   }
  // }

  private onPageChanged(source: Control, value: number) {
    this.renderBody()
  }

  private onSortChange(source: Control, key: string, value: SortDirection) {
    this._sortConfig = this._sortConfig || {};
    this._sortConfig[key] = value;
    if (this.filteredData) this.renderBody();
    if (typeof this.onColumnSort === 'function')
      this.onColumnSort(this, key, value)
  }

  private renderHeader() {
    this._headingStyle = getCustomStylesClass(this.headingStyles);
    this.tHeadElm.innerHTML = '';
    const rowElm = this.createElement('tr', this.tHeadElm);
    if (this.hasExpandColumn) {
      const thElm = this.createElement('th', rowElm);
      thElm.classList.add('i-table-cell', 'i-table-cell--expand', 'text-center', this._headingStyle);
    }
    if (!Array.isArray(this.columns)) return;
    this.columns.forEach((column: TableColumnElement, colIndex: number) => {
      const thElm = this.createElement('th', rowElm);
      column.visible === false && (thElm.style.display = 'none');
      thElm.classList.add('i-table-cell', this._headingStyle);
      thElm.setAttribute('data-fieldname', column.fieldName || 'action');
      if (column.width)
        thElm.style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
      column.textAlign && (thElm.style.textAlign = column.textAlign);

      const columnElm = new TableColumn(undefined, { ...column, header: true });
      columnElm.onSortChange = this.onSortChange.bind(this);
      thElm.appendChild(columnElm);
      rowElm.appendChild(thElm);
    })
  }

  updateLocale(i18n: I18n): void {
    if (this.tHeadElm) {
      const columns = this.tHeadElm.querySelectorAll('i-table-column');
      for (const column of columns) {
        (column as TableColumn).updateLocale(i18n);
      }
    }
  }

  _handleClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    if (target && this.hasData) {
      const rowElm = target.closest('.i-table-row') as HTMLElement;
      let colElm = target.closest('i-table-column') as TableColumn;
      if (!colElm) colElm = target.firstChild as any;

      const tdElm = target.closest('td');
      const rowData = colElm ? (<any>colElm).rowData : null;
      const rowIndex = rowElm?.getAttribute('data-index') || -1;
      const colIndex = tdElm?.getAttribute('data-index') || -1;

      if (typeof this.onCellClick === 'function' && rowIndex !== -1)
        this.onCellClick(this, +rowIndex, +colIndex, rowData);

      if (this.expandable && rowElm) {
        const expandTd = rowElm.querySelector('.i-table-cell--expand') as HTMLElement;
        this.expandRow(rowElm, expandTd);
      }
    }
    return super._handleClick(event, true);
  }

  private expandRow(rowElm: HTMLElement, expandTd?: HTMLElement) {
    rowElm.classList.toggle('is--expanded');
    const expandElm = rowElm.nextElementSibling as HTMLElement;
    if (expandElm) {
      const hidden = expandElm.style.display === 'none';
      if (expandTd && this.expandable.onRenderExpandIcon) {
        expandTd.innerHTML = '';
        expandTd.appendChild(this.expandable.onRenderExpandIcon(this, hidden));
      }
      expandElm.style.display = hidden ? 'table-row' : 'none';
    }
  }

  private async renderRow(rowElm: HTMLElement, rowData: any, rowIndex: number) {
    if (this.expandable) {
      const expandIcon = this.expandable.onRenderExpandIcon;
      if (expandIcon) {
        const expandTd = this.createElement('td', rowElm);
        expandTd.appendChild(expandIcon(this, false));
        expandTd.classList.add('i-table-cell', 'i-table-cell--expand', 'text-center', this._bodyStyle);
      }
    }
  
    let row: TableCell[] = [];

    for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
      const column = this.columns[colIndex];
      const columnData = rowData[column.fieldName];
      const cell = new TableCell({
        columnSpan: 1,
        rowSpan: 1,
        value: columnData ?? '--'
      });
  
      const tdElm = this.createElement('td', rowElm);
      column.visible === false && (tdElm.style.display = 'none');
      tdElm.classList.add('i-table-cell', this._bodyStyle);
      tdElm.setAttribute('data-index', colIndex.toString());
      tdElm.setAttribute('data-fieldname', column.fieldName || 'action');
  
      if (column.width)
        tdElm.style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
      column.textAlign && (tdElm.style.textAlign = column.textAlign);
      
      const columnElm = new TableColumn(this, {
        ...column,
        data: columnData ?? '--'
      });
      tdElm.appendChild(columnElm);
      await columnElm.appendNode({ tdElm, rowData, rowIndex, cell });
  
      row.push(cell);
    }
  
    if (this._rows)
      this._rows[rowIndex] = new TableRow(row);
  }

  private renderBody() {
    if (!this.tBodyElm) return;
    this._bodyStyle = getCustomStylesClass(this.bodyStyles);
    this.tBodyElm.innerHTML = '';
    if (this.hasData) {
      const currentPage = this.pagination?.currentPage || 1;
      const pageSize = this.pagination?.pageSize || 10;
      const dataList = this.pagination ? paginate(this.filteredData, pageSize, currentPage) : this.filteredData;
      dataList.forEach(async (row: any, rowIndex: number) => {
        const rowElm = this.createElement('tr', this.tBodyElm);
        rowElm.classList.add('i-table-row');
        const orderClass = (rowIndex + 1) % 2 === 0 ? 'even' : 'odd';
        rowElm.classList.add(orderClass);
        // TODO: get index from rows
        const rIndex = rowIndex + ((currentPage - 1) * pageSize);
        rowElm.setAttribute('data-index', rIndex.toString());
        this.renderRow(rowElm, row, rowIndex);
        if (this.expandable && this.expandable.onRenderExpandedRow) {
          const childElm = this.createElement('tr', this.tBodyElm);
          childElm.classList.add('i-table-row--child');
          childElm.style.display = 'none';
          const tdChild = this.createElement('td', childElm);
          tdChild.setAttribute('colspan', `${this.columnLength + (this.hasExpandColumn ? 1 : 0)}`);
          const expandElm = await this.expandable.onRenderExpandedRow(row);
          if (typeof expandElm === 'string')
            tdChild.innerHTML = expandElm;
          else
            tdChild.appendChild(expandElm);
          const hideExpanded = this.expandable.rowExpandable === false;
          if (hideExpanded) childElm.classList.add('hidden-desktop');
        }
      })
    } else {
      const rowElm = this.createElement('tr', this.tBodyElm);
      const tdElm = this.createElement('td', rowElm);
      tdElm.setAttribute('colspan', `${this.columnLength + (this.hasExpandColumn ? 1 : 0)}`);
      tdElm.classList.add('i-table-cell', 'text-center', this._bodyStyle);
      if (typeof this.onRenderEmptyTable === 'function') {
        this.onRenderEmptyTable(this);
      } else {
        const label = this.createElement('span');
        label.textContent = 'No data';
        tdElm.appendChild(label);
      }
    }
    this.firstLoad = false;
  }

  private createTable() {
    const tableID = 'TTable_' + Date.now();
    this._tableID = tableID;
    this.tableElm = <HTMLTableElement>this.createElement('table', this.wrapperElm);
    this.tableElm.id = tableID;
    this.tableElm.style.width = '100%';
  
    if (this._heading) {
      this.tHeadElm = this.createElement('thead', this.tableElm);
      this.tHeadElm.classList.add('i-table-header');
    }
    
    this.tBodyElm = this.createElement('tbody', this.tableElm);
    this.tBodyElm.classList.add('i-table-body');
  }

  filter(predicate: (dataItem: any) => boolean) {
    const dataList = [...this.data];
    this.filteredData = dataList.filter(predicate);
    this.renderBody();
  }

  protected init() {
    if (!this.tableElm) {
      this.classList.add('i-table', tableStyle);
      if (this.options?.onRenderEmptyTable)
        this.onRenderEmptyTable = this.options.onRenderEmptyTable;
      if (this.options?.onColumnSort)
        this.onColumnSort = this.options.onColumnSort;
      if (this.options?.onCellClick)
        this.onCellClick = this.options.onCellClick;

      this.headingStyles = this.getAttribute('headingStyles', true);
      this.bodyStyles = this.getAttribute('bodyStyles', true);
      this.wrapperElm = this.createElement('div', this);
      this.wrapperElm.classList.add('i-table-container');
      this._heading = this.getAttribute('heading', true, false);
      this.createTable();
      
      this.expandable = this.getAttribute('expandable', true);
      const columnsAttr = this.getAttribute('columns', true);
      columnsAttr && (this.columns = columnsAttr);

      this.pagingElm = this.createElement('div', this.wrapperElm);
      this.pagingElm.classList.add('i-table-pagi');
      this.pagingElm.style.display = 'none';
      const paginationAttr = this.getAttribute('pagination');
      paginationAttr && (this.pagination = paginationAttr);

      const dataAttr = this.getAttribute('data', true);
      dataAttr && (this.data = dataAttr);

      const mediaQueries = this.getAttribute('mediaQueries', true);
      if (mediaQueries) this.mediaQueries = mediaQueries;

      super.init();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.pagination) {
      const pagination = this.getAttribute('pagination');
      pagination && (this.pagination = pagination);
    }
  }

  static async create(options?: TableElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }  
}