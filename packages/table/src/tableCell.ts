import './style/table.css';

export interface ITableCell {
  rowSpan: number
  columnSpan: number
  value: string
}

export class TableCell {
  private _rowSpan: number;
  private _columnSpan: number;
  private _value: string;

  constructor(options: ITableCell) {
    this.rowSpan = options.rowSpan;
    this.columnSpan = options.columnSpan;
    this.value = options.value;
  }

  get rowSpan(): number {
    return this._rowSpan;
  }
  set rowSpan(value: number) {
    this._rowSpan = value;
  }

  get columnSpan(): number {
    return this._columnSpan;
  }
  set columnSpan(value: number) {
    this._columnSpan = value;
  }

  get value(): string {
    return this._value;
  }
  set value(data: string) {
    this._value = data;
  }
}