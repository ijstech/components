import './style/table.css';
import { TableCell } from './tableCell';

export class TableRow {
  private _cells: TableCell[];

  constructor(cells: TableCell[]) {
    this.cells = cells;
  }

  get cells(): TableCell[] {
    return this._cells;
  }

  set cells(value: TableCell[]) {
    this._cells = value;
  }
}