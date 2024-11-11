import {Control, Container, customElements, ControlElement} from '@ijstech/base';
import {application} from '@ijstech/application';
import {Checkbox} from '@ijstech/checkbox';
import {Datepicker} from '@ijstech/datepicker'
import {ComboBox, IComboItem} from '@ijstech/combo-box'
import {Label} from '@ijstech/label'
import {moment, Moment}  from '@ijstech/moment';
import { IconElement } from '@ijstech/icon';
import './style/dataGrid.css';

export type ColRowType = "datePicker" | "dateTimePicker" | "timePicker" | "checkBox" | "comboBox" | "number" | "integer" | "string";
type DataType = "date" | "dateTime" | "time" | "boolean" | "number" | "integer" | "string";
export type cellValueChangedCallback = (source: DataGrid, cell: DataGridCell, oldValue: any, newValue: any)=>void;

export interface IDataGridElement extends ControlElement{
    caption?: string;
	// mode?: GridMode; 
};
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-data-grid']: IDataGridElement
        }
    }
};
interface IGridOptions{
    autoAddRow?: boolean;    
};
interface IDataGrid{
    colCount: number;
    columns: {[colIdx: number]: any};
    rowHeights: any[];
    getColWidth(col: number): number;
    setColWidth(col: number, value: number): void;
    enableUpdateTimer(): void;
};
function parseNumber(value: any, decimal?: number): number{
	if (typeof(value) == 'string')
		value = value.replace(/,/g, '')

	if (decimal)
		return parseFloat(parseFloat(value).toFixed(decimal))
	else
		return parseFloat(value)
};
function getCursorPosX(event: MouseEvent){
	event = event;// || window.event;
    let pos = 0;
    if (event instanceof TouchEvent){
        if (event.changedTouches && event.changedTouches[0])
            pos = event.changedTouches[0].pageX || event.changedTouches[0].clientX
        else if (event.touches && event.touches[0])
            pos = event.touches[0].pageX || event.touches[0].clientX
    }	
	else
		pos = event.pageX || event.clientX
	return pos + document.body.scrollLeft + document.documentElement.scrollLeft;
};
function getCursorPosY(event: MouseEvent){
	event = event;// || window.event;
    let pos = 0;
    if (event instanceof TouchEvent){
        if (event.changedTouches && event.changedTouches[0])
            pos = event.changedTouches[0].pageY || event.changedTouches[0].clientY
        else if (event.touches && event.touches[0])
            pos = event.touches[0].pageY || event.touches[0].clientY
    }	
	else
	    pos = event.pageY || event.clientY
	return pos + document.body.scrollTop + document.documentElement.scrollTop;
};
function getInputCaretPos(input: HTMLInputElement){
	try{
		let CaretPos = 0;
		if (input.selectionStart)
			CaretPos = input.selectionStart;
		return (CaretPos);	
	}
	catch(err){
		return 0;
	}	
};
class TGridOptions {
    private owner: IDataGrid;
    private _autoRowHeight = false;
    private _rowSelect = false;
	public autoAddRow = false;
	public fileDropUpload = false;
	public sortOnClick = true;

    constructor(owner: DataGrid){
        this.owner = <any>owner;        
    };	
	get autoRowHeight(): boolean {
        return this._autoRowHeight;
    };
    set autoRowHeight(value: boolean){
        if (value != this._autoRowHeight) {
            this.owner.rowHeights = [];
            this._autoRowHeight = value;
            this.owner.enableUpdateTimer();
        };
    };
    get rowSelect(): boolean{
        return this._rowSelect;
    };
    set rowSelect(value: boolean){
        if (this._rowSelect != value){
            this._rowSelect = value;
            this.owner.enableUpdateTimer();
        };
    };
};
export class DataGridCell {
    private grid: IDataGrid;
    private _col: number;
    private _row: number;
    private _visible: boolean = true;
    private _button: boolean;
    private _checkBox: boolean;
    private _color: string;
    private _formula: string;
    private _hint: string;
    private _horizontalAlign: boolean;
    private _html: string;
    private _image: string;
    private _object: any;
    private _readOnly: boolean;
    private _text: string;
    // private _imgUrl: string | undefined;
    private _value: any;
    public mergeRect: any;
    // private _height: number | undefined;

    constructor(grid: DataGrid, col: number, row: number){
        this.grid = <any>grid;
		this._col = col;
		this._row = row;
    };
    get button(): boolean{
        return this._button;
    };
    set button(value: boolean){
        this._button = value;
        this.grid.enableUpdateTimer();
    };
    get checkBox(): boolean{
        return this._checkBox;
    };
    set checkBox(value: boolean){
        this._checkBox = value;
        this.grid.enableUpdateTimer();
    };
    get col(): number{
        return this._col;
    };
    set col(value: number){
        this._col = value;
    };
    get color(): string{
        return this._color;
    };
    set color(value: string){
        this._color = value;
        this.grid.enableUpdateTimer();
    };
    get displayValue(): any{
        return;
        // let col = this.grid.columns.getColumn(this._col)
        // if (this._displayValue != undefined)
        //     return this._displayValue
        // return this._displayValue || this.grid._getDisplayValue(col, this) || '';	
    };
    get formula(){
        return this._formula;
    };
    set formula(value: any){
        this._formula = value;
        this.grid.enableUpdateTimer();
    };
    get hint(): string{
        return this._hint;
    };
    set hint(value: string){
        this._hint = value;
        this.grid.enableUpdateTimer();
    };
    get horizontalAlign(): boolean{
        return this._horizontalAlign;
    };
    set horizontalAlign(value: boolean){
        this._horizontalAlign = value;
        this.grid.enableUpdateTimer();
    };
    get html(): string{
        return this._html;
    };
    set html(value: string){
        this._html = value;
        this.grid.enableUpdateTimer();
    };
    get image(): string{
        return this._image;
    };
    set image(value: string){
        this._image = value;
        this.grid.enableUpdateTimer();
    };
    get object(): any{
        return this._object;
    };
    set object(value: any){
        this._object = value;
        this.grid.enableUpdateTimer();
    };
    get readOnly(): boolean{
        return this._readOnly;
    };
    set readOnly(value: boolean){
        this._readOnly = value;
        this.grid.enableUpdateTimer();
    };
    get row(): number{
        return this._row;
    };
    set row(value: number){
        this._row = value;
    };
    get text(): string{
        return this._text;
    };
    set text(value: string){
        this._text = value;
        this.grid.enableUpdateTimer();
    };
    get value(){
        return this._value;
    };
    set value(value: any){
        // this._imgUrl = undefined;
        this._value = value
        // this._height = undefined;
        this.grid.enableUpdateTimer();
    };
    get visible(){
        return this._visible;
    };
    set visible(value: boolean){
        this._visible = value;
        this.grid.enableUpdateTimer();
    };
}
class DataGridCells {
    private grid: DataGrid;
    public data: any[] = [[]];

    constructor(owner: DataGrid){
        this.grid = owner;
    };
	assign(data: any[]) {
		for (let r = 0; r < data.length; r++) {
			let d = data[r]['data'];
			let row = data[r]['row'];
			for (let c = 0; c < d.length; c++) {
				this.setValue(c, row, d[c])
			}
			// this.data[d.row] = d.data;
		}
	};
	cells(aCol: number, aRow: number, refresh?: boolean): DataGridCell {
		if (refresh)
			return this.getCell(aCol, aRow)
		else if (this.data[aRow]) {
			let cell = this.data[aRow][aCol];
			if (cell && cell.mergeRect && (aCol != cell.mergeRect.startCol || aRow != cell.mergeRect.startRow)) {
				cell = this.data[cell.mergeRect.startRow][cell.mergeRect.startCol];
			}
			return cell || this.getCell(aCol, aRow);
		} else
			return this.getCell(aCol, aRow);
	};
	clear() {
		// for (let r = 0; r < this.data.length; r++) {			
			// let row = this.data[r];
			// for (let c = 0; c < row.length; c++) {
				// let cell = row[c];
				// if (cell){
					// cell._object = null;
					// cell.grid = null;
					// if (cell._font){
						// cell._font.grid = null;
						// cell._cell = null;
					// }
					// cell._font = null;
				// }
				// row[c] = null;	
			// }
		// }
		this.data = [[]];
	};
	deleteCol(aCol: number) {
		for (let r = 0; r < this.data.length; r++) {
			let row = this.data[r];
			if (row)
				row.splice(aCol, 1);
		}
		this.updateCellIndex();
	};
	deleteRow(aRow: number) {
		if (this.data.length > aRow)
			this.data.splice(aRow, 1);
		this.updateCellIndex();
	};
	getCell(aCol: number, aRow: number, refresh?: boolean): DataGridCell {
		if (typeof(this.data[aRow]) == "undefined")
			this.data[aRow] = [];
		if (typeof(this.data[aRow][aCol]) == "undefined")
			this.data[aRow][aCol] = new DataGridCell(this.grid, aCol, aRow);
		if (refresh && this.data[aRow][aCol])
			this.data[aRow][aCol]._displayValue = undefined;
		return this.data[aRow][aCol];
	};
	getObject(aCol: number, aRow: number): any {
		let cell = this.cells(aCol, aRow);
		if (cell)
			return cell.object
		else
			return undefined;
	};
	getValue(aCol: number, aRow: number): any {		
		let cell = this.cells(aCol, aRow);
		if (cell) {
			if (cell.mergeRect)
				cell = this.getCell(cell.mergeRect.startCol, cell.mergeRect.startRow);
			if (cell.value != undefined) {
				return cell.value
			} else
				return '';
		};
	};
	getExcelValue(aCol: number, aRow: number, callback: any){
		// let cell = this.cells(aCol, aRow);
		// if (cell) {
		// 	let result = {};
		// 	if (cell.mergeRect){
		// 		if (aCol == cell.mergeRect.startCol && aRow == cell.mergeRect.startRow)				
		// 			let cell = this.getCell(cell.mergeRect.startCol, cell.mergeRect.startRow)
		// 		else if (callback)
		// 			return callback({})
		// 		else
		// 			return {};
		// 	}			
		// 	if (cell._row < this.grid.fixedRow || cell._col < this.grid.fixedCol){
		// 		let value = $ML(cell._value, this.grid.parentForm)
		// 		if (value != undefined)
		// 			result['v'] = value;
		// 		if (cell._formula != undefined)
		// 			result['f'] = cell._formula;
		// 		if (callback)
		// 			return callback(result)
		// 		else
		// 			return result;
		// 	}
		// 	else if (this.grid['onDisplayCell']) {
		// 		let disp = {
		// 			'button': cell._button,
		// 			'checkBox': cell._checkBox,
		// 			'col': cell._col,
		// 			'color': cell._color,
		// 			'dataType': cell._dataType,
		// 			'font': {},
		// 			'formula': cell._formula,
		// 			'horizontalAlign': cell._horizontalAlign,
		// 			'html': cell._html,
		// 			'image': cell._image,
		// 			'object': cell._object,
		// 			'readOnly': cell._readOnly,
		// 			'row': cell._row,
		// 			'text': cell._text,
		// 			'value': cell._value,
		// 			'visible': cell._visible
		// 		}
		// 		try {
		// 			this.grid['onDisplayCell'](this['__this'], disp);
		// 			let value = disp.value;
		// 		} catch(e) {
		// 			let value = '';
		// 		}
		// 	} 
		// 	else
		// 		let value = cell._value;
		// 	if (value != undefined){// || cell._formula != undefined){				
		// 		let grid = this.grid
		// 		if (grid.columns)
		// 			let column = grid.columns.getColumn(aCol);				
		// 		if (column){
		// 			if (column && (column._type == 'lookupDetail')){							
		// 				if (cell._record)
		// 					let rd = cell._record
		// 				else{
		// 					let record = this.getObject(0, aRow);
		// 					if (record){
		// 						let rs = record[column._lookupTable]
		// 						if (rs){
		// 							let rd = rs['first'];									
		// 							cell._field = column._lookupField;
		// 							let v1 = column._lookupDetailValue;
		// 							switch (column._lookupDetailType){
		// 								case 'date':
		// 									v1 = new Date(v1)
		// 									v1.setHours(0,0,0,0);
		// 									break;
		// 								case 'numeric':
		// 									if (typeof(v1) == 'string')
		// 										v1 = parseFloat(v1);
		// 									break;
		// 							}
		// 							while (rd){
		// 								let v2 = rd[column._lookupField];
		// 								switch (column._lookupDetailType){
		// 									case 'date':
		// 										v2 = new Date(rd[column._lookupDetailField])
		// 										v2.setHours(0,0,0,0);
		// 										break;
		// 									case 'numeric':
		// 										if (typeof(v2) == 'string')
		// 											v2 = parseFloat(v2);
		// 										break;
		// 								}
		// 								if (v1 == v2)
		// 									break
		// 								else if (column._lookupDetailType == 'date' && v1.getTime() == v2.getTime())											
		// 									break
		// 								rd = rs['next']
		// 							}
		// 						}	
		// 					}									
		// 				}								
		// 				if (rd){
		// 					value = rd[column._lookupField];
		// 				}
		// 			}
		// 			else if (column._type == 'listOfValue' && column._listOfValue){
		// 				let lsv = grid.listOfValue[column._listOfValue];
		// 				if (lsv != undefined){
		// 					value = lsv[value] || value
		// 				}
		// 			}
		// 			else if (column._type == 'lookup' || column._type == 'lookupCombo'){							
		// 				if (!column._lookupContext)
		// 					let context = grid.context
		// 				else
		// 					let context = grid.parentForm[column._lookupContext];
		// 				if (context){								
		// 					let rs = context[column._lookupTable]
		// 					if (rs && value){									
		// 						let records = rs['_fetchRecordsByKeyValue']([value])									
		// 						if (records.length == 1){										
		// 							// let value = records[0][column._lookupField] || ''
		// 							if (value && (column._displayUserName)){
		// 								let name = application.userNameList[value];
		// 								if (name != undefined){
		// 									value = name || ''
		// 								}
		// 								else if (callback){
		// 									application.getUserNameList([value], function(){									
		// 										let name = application.userNameList[value];
		// 										value = name || ''
		// 										if (value != undefined)
		// 											result['v'] = value;
		// 										if (cell._formula != undefined)
		// 											result['f'] = cell._formula;
		// 										callback(result);
		// 									})
		// 									return;
		// 								}
		// 								else {
		// 									let name = application.userNameList[value];
		// 									value = name || ''
		// 									if (value != undefined)
		// 										result['v'] = value;
		// 									if (cell._formula != undefined)
		// 										result['f'] = cell._formula;
		// 									return result;
		// 								}	
		// 							}
		// 							else{
		// 								let fields = column._lookupField.split(' ');
		// 								let value = '';
		// 								for (let i = 0; i < fields.length; i ++){
		// 									if (value)
		// 										value += ' ' + (records[0][fields[i]] || '')
		// 									else
		// 										value = records[0][fields[i]] || ''
		// 								}
		// 								value =  value
		// 							}
		// 						}
		// 					}
		// 				}
		// 			}
		// 			else if (column && column._type == '{userAccount}'){
		// 				if (value){
		// 					let name = application.userNameList[value];
		// 					if (name != undefined)
		// 						value = name || ''
		// 					else if (callback){
		// 						application.getUserNameList([value], function(){		
		// 							result['v'] = application.userNameList[value] || ''
		// 							if (cell._formula != undefined)
		// 								result['f'] = cell._formula;
		// 							callback(result);
		// 						})
		// 						return;
		// 					}
		// 					else{
		// 						result['v'] = application.userNameList[value] || ''
		// 						if (cell._formula != undefined)
		// 							result['f'] = cell._formula;
		// 						return result;
		// 					}
		// 				}
		// 				else
		// 					value =  '';
		// 			}
		// 			else if (cell && cell._dataType == 4){
		// 				value = formatDateTimeStr(value);
		// 			}
		// 			else if (cell && cell._dataType == 2)
		// 				value = formatDateStr(value);
		// 			else if (column._dataType == 4 || column._type == 'dateTime'){							
		// 				value = formatDateTimeStr(value);
		// 			}
		// 			else if (column._dataType == 3 || column._type == 'time'){
		// 				value = formatTimeStr(value);
		// 			}
		// 			else if (column._dataType == 2 || column._type == 'date'){
		// 				value = formatDateStr(value);
		// 			}
		// 		}				
		// 		if (value != undefined)
		// 			result['v'] = value;
		// 		if (cell._formula != undefined)
		// 			result['f'] = cell._formula;				
		// 		if (callback)
		// 			callback(result)
		// 		else
		// 			return result;
		// 	}
		// 	else if (callback)
		// 		callback()
		// 	else
		// 		return;
		// }
	};
	getExcelValues(startCol: number, startRow: number, callback?: any){
		// let startCol = startCol || 0;
		// let startRow = startRow || 0;
		// let count = 0;
		// function datenum(v: number, date1904?: boolean) {
		// 	if (date1904)
		// 		v += 1462;
		// 	let epoch = Date.parse(v);
		// 	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
		// }

		// let ws = {};
		// let range = {
		// 	's': {
		// 		'c': 0,
		// 		'r': 0
		// 	},
		// 	'e': {
		// 		'c': this.grid.colCount - startCol - 1,
		// 		'r': this.grid.rowCount - startRow - 1
		// 	}
		// };	
		// let grid = this.grid;
		// let self = this;	
		// function getCellValues(row, col, callback){
		// 	if (row < grid.rowCount){
		// 		if (col < grid.colCount){
		// 			self.getExcelValue(col, row, function(cell){						
		// 				if(cell && col - startCol > -1 && row - startRow > -1){
		// 					let cell_ref = window['XLSX']['utils']['encode_cell']({
		// 						"c": col - startCol,
		// 						"r": row - startRow
		// 					});
							
		// 					if ( typeof cell['v'] === 'number')
		// 						cell['t'] = 'n';
		// 					else if ( typeof cell['v'] === 'boolean')
		// 						cell['t'] = 'b';
		// 					else if (cell['v'] instanceof Date) {
		// 						cell['t'] = 'n';
		// 						// cell['z'] = window['XLSX']['SSF._table'][14];
		// 						cell['v'] = datenum(cell['v']);
		// 					} else
		// 						cell['t'] = 's';
							
		// 					ws[cell_ref] = cell;
		// 				}	
		// 				count++
		// 				if (count > 1000)					
		// 					setTimeout(function(){
		// 						count = 0;
		// 						getCellValues(row, col+1, callback)
		// 					},0)
		// 				else
		// 					getCellValues(row, col+1, callback)
		// 			});						
		// 		}
		// 		else{
		// 			count ++
		// 			if (count > 1000)
		// 				setTimeout(function(){
		// 					getCellValues(row+1, 0, callback)
		// 				},0)
		// 			else
		// 				getCellValues(row+1, 0, callback)
		// 		}
		// 	}
		// 	else
		// 		callback()
		// }
		// getCellValues(startRow, startCol, function(){
		// 	ws['!ref'] = window['XLSX']['utils']['encode_range'](range);
		// 	let colWidths = [];
		// 	for (let col = startCol; col < grid.colCount; col ++){
		// 		colWidths.push({
		// 			'wpx': grid.getColWidth(col)
		// 		})
		// 	}
		// 	ws['!cols'] = colWidths;
		// 	callback(ws)
		// })			
	};
	getExcelValues1(startCol: number, startRow: number, callback?: any) {
		// let startCol = startCol || 0;
		// let startRow = startRow || 0;

		// function datenum(v, date1904) {
		// 	if (date1904)
		// 		v += 1462;
		// 	let epoch = Date.parse(v);
		// 	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
		// }

		// let ws = {};
		// let range = {
		// 	's': {
		// 		'c': 0,
		// 		'r': 0
		// 	},
		// 	'e': {
		// 		'c': this.grid.colCount - startCol - 1,
		// 		'r': this.grid.rowCount - startRow - 1
		// 	}
		// };		
		// for (let row = 0; row < this.grid.rowCount; row++) {
		// 	for (let col = 0; col < this.grid.colCount; col++) {
		// 		let cell = this.getExcelValue(col, row);
		// 		if(!cell) continue;
		// 		let cell_ref = window['XLSX']['utils']['encode_cell']({
		// 			"c": col - startCol,
		// 			"r": row - startRow
		// 		});
				
		// 		if ( typeof cell['v'] === 'number')
		// 			cell['t'] = 'n';
		// 		else if ( typeof cell['v'] === 'boolean')
		// 			cell['t'] = 'b';
		// 		else if (cell['v'] instanceof Date) {
		// 			cell['t'] = 'n';
		// 			// cell['z'] = window['XLSX']['SSF._table'][14];
		// 			cell['v'] = datenum(cell['v']);
		// 		} else
		// 			cell['t'] = 's';
		// 		ws[cell_ref] = cell;
		// 	}
		// }
		// ws['!ref'] = window['XLSX']['utils']['encode_range'](range);
		// let colWidths = [];
		// for (let col = startCol; col < this.grid.colCount; col ++){
		// 	colWidths.push({
		// 		'wpx': this.grid.getColWidth(col)
		// 	})
		// }
		// ws['!cols'] = colWidths;
		// if (callback)
		// 	callback(ws)
		// else
		// 	return ws;
	};
	insertCol(aCol: number) {
		for (let r = 0; r < this.data.length; r++) {
			let row = this.data[r];
			if (row)
				row.splice(aCol, 0, undefined);
		}
		this.updateCellIndex();
	};
	insertRow(aRow: number) {
		this.data.splice(aRow, 0, []);
		this.updateCellIndex();
	};
	loadFromJSON(json: any) {
		let data = json['data'];
		for (let i = 0; i < data.length; i++) {
			let row = data[i];
			for (let k = 0; k < row.length; k++) {
				let cell = row[k];
				if (cell)
					this.setValue(k, i, cell['v'])
			}
		}
	};
	moveRow(fromIdx: number, toIdx: number) {
		if (toIdx < this.data.length) {
			this.data.splice(toIdx, 0, this.data.splice(fromIdx, 1)[0]);
			this.updateCellIndex();			
		}
	};
	saveToJSON(json: any) {
		let data:any[] = []
		json['data'] = data;
		for (let i = 0; i < this.data.length; i++) {
			let row = this.data[i];
			data[i] = [];
			for (let k = 0; k < row.length; k++) {
				let cell = row[k];
				if (cell)
					data[i][k] = {
						'v': cell._value
					}
			}
		}
	};
	setDateValue(aCol: number, aRow: number, aValue: any) {
		let cell = this.getCell(aCol, aRow);
		(<any>cell)._value = aValue;
		(<any>cell)._isDate = true;
	};
	setMergeCell(rect: any) {
		for (let col = rect.startCol; col <= rect.endCol; col++)
			for (let row = rect.startRow; row <= rect.endRow; row++) {
				let cell = this.getCell(col, row);
				cell.mergeRect = rect;
			}
	};
	setObject(aCol: number, aRow: number, aObject: any) {
		let cell = this.getCell(aCol, aRow);
		cell.object = aObject;
	};
	setRowCount(value: any) {
		if (this.data.length > value)
			this.data.length = value;
	};
	setValue(aCol: number, aRow: number, aValue: any, disp?: boolean) {			
		let cell = this.getCell(aCol, aRow);
		if (!disp)
			(<any>cell)._value = aValue
		else
            (<any>cell)._dispValue = aValue		
	};
	setFile(aCol: number, aRow: number, aValue: any) {			
		let cell = this.getCell(aCol, aRow);
		(<any>cell)._file = aValue;
	};
	sort(col: number, descending?: boolean) {
		let fixedRow = this.data.slice(0, this.grid.fixedRow);
		let data = this.data.slice(this.grid.fixedRow);
		for (let i = 0; i < data.length; i ++){
			if (data[i] && data[i][col])
				data[i][col]._idx = i;
		};
		let self = this;
		data.sort(function(item1: any, item2: any) {
			if (self.grid['onSort']){
				if (item1[col] && item2[col])
					return self.grid['onSort'](self.grid, descending, col, item1[col]._row, item2[col].row)
				else if (item1[col]){
					if (descending)
						return -1
					else
						return 1
				}
				else{	
					if (descending)
						return 1
					else
						return -1
				}
			}
			else{
				let value1;
				let value2;
				let idx1 = 0;
				let idx2 = 0;;
				if (item1[col]){
					value1 = item1[col]._displayValue || item1[col]._value;
					idx1 = item1[col]._idx;
				}
				if (value1 == undefined)
					value1 = '';

				if (item2[col]){
					value2 = item2[col]._displayValue || item2[col]._value;
					idx2 = item2[col]._idx;
				}
				if (value2 == undefined)
					value2 = '';

				if (typeof(value1) == 'string')
					value1 = value1.toLowerCase()
				if (typeof(value2) == 'string')
					value2 = value2.toLowerCase()

				if (value1 == value2)
					return idx1>idx2?1:idx1<idx2?-1:0
				else if (value1 > value2)
					return (descending?-1:1)
				else
					return (descending?1:-1)
			}						
		});		
		this.data = fixedRow.concat(data);		
		this.updateCellIndex();
	};
	updateCellIndex() {
		for (let r = 0; r < this.data.length; r++) {
			let row = this.data[r];
			for (let c = 0; c < row.length; c++) {
				let cell = this.data[r][c];
				if (cell) {
					cell._col = c;
					cell._row = r;
				};
			};
		};
	};
};
class TGridColumn {
    private grid: IDataGrid;
    private _colIdx: number;
    private _dataType: DataType;
    private _visible = true;
    private _resizable = true;
    private _sortable = true;
    private _color: string;
    private _horizontalAlign: number;
    private _type: ColRowType;
    private _readOnly = false;
    private _lookupContext: any;
    private _lookupTable: string;
    private _suggestTable: string;
    private _lookupField: string;
    private _lookupDetailField: string;
    private _lookupDetailValue: any;
    private _lookupDetailType: string;
    private _listOfValue: string;
    private _format: string;
    private _formula: string;
    private _displayUserName: boolean;
    private _binding: any;
	private _comboItems: IComboItem[];
    private _rows: number;

	constructor(grid: IDataGrid, colIdx: number) {
		this.grid = grid;
		this._colIdx = colIdx;
		if (!this._type) this._type = "string" 
	};
    get asJSON(): any{
        return {
            "color": (this._color && this._color != 'clNone')?this._color:undefined,
            "horizontalAlign": (this._horizontalAlign != undefined && this._horizontalAlign != 1)?this._horizontalAlign:undefined,
            "type": (this._type && this._type != 'string')?this._type:undefined,
            "width": this.width,
            "readOnly": this._readOnly?this._readOnly:undefined,
            "visible": !this._visible?this._visible: undefined,
            "resizable": !this._resizable?this._resizable:undefined,
            "lookupContext": this._lookupContext?this._lookupContext:undefined,
            "lookupTable": this._lookupTable?this._lookupTable:undefined,
            "suggestTable": this._suggestTable?this._suggestTable:undefined,
            "lookupField": this._lookupField?this._lookupField:undefined,
            "lookupDetailField": this._lookupDetailField?this._lookupDetailField:undefined,
            "lookupDetailValue": this._lookupDetailValue?this._lookupDetailValue:undefined,
            "lookupDetailType": this._lookupDetailType?this._lookupDetailType:undefined,
            "listOfValue": this._listOfValue?this._listOfValue:undefined,
            "format": this._format?this._format:undefined,
            "formula": this._formula?this._formula:undefined,
            "displayUserName": this._displayUserName,
            "binding": this._binding
        }
    };
    set asJSON(value: any){
        this._color = value.color;
			this._horizontalAlign = value['horizontalAlign'] != undefined?value['horizontalAlign']:value['alignment']; 
			this._type = value['type'] || value['dataType'];
			this._readOnly = value['readOnly'];
			this._visible = value['visible']
			this._resizable = value['resizable']
			this._lookupContext = value['lookupContext']
			this._lookupTable = value['lookupTable']
			this._lookupField = value['lookupField']
			this._suggestTable = value['suggestTable']
			this._lookupDetailField = value['lookupDetailField'];
			this._lookupDetailValue = value['lookupDetailValue'];
			this._lookupDetailType = value['lookupDetailType'];
			this._listOfValue = value['listOfValue'];			
			this._displayUserName = value['displayUserName'];
			this._format = value['format'];
			this._formula = value['formula'];
			this._binding = value['binding'];
			// switch (this._horizontalAlign){
			// 	case 'center':
			// 		this._horizontalAlign = 0;
			// 		break;
			// 	case 'left':
			// 		this._horizontalAlign = 1;
			// 		break;
			// 	case 'right':
			// 		this._horizontalAlign = 2;
			// 		break;
			// }
			if (value['width'] != undefined)
				this["width"] = value['width']
			// if (value['caption'] != undefined)
			// 	this.grid.setValue(value['colIdx'], 0, value['caption'])			
			if (value['rows'] && value['rows'] > 1)
				this._rows = value['rows'];
			this.grid.enableUpdateTimer();
    };
    get binding(): any{
        return this._binding;
    };
    set binding(value: any){
        this._binding = value;
    };
    get colIdx(): number{
        return this._colIdx;
    };
    set colIdx(value: number){
        if (this.colIdx > -1)
			this.grid.columns[this.colIdx] = null;
        this._colIdx = value;
        this.grid.columns[value] = this;
        this.grid.enableUpdateTimer();
    };
    get color(): string{
        return this._color || 'clNone';
    };
    set color(value: string){
        this._color = value;
        this.grid.enableUpdateTimer();
    };
	get comboItems(): IComboItem[]{
		return this._comboItems
	}
	set comboItems(value: IComboItem[]){
		this._comboItems = value;
		this.grid.enableUpdateTimer();
	}
    get default(): boolean{
        return (!this._color || this._color =='clNone') &&
			 	(this._horizontalAlign == undefined || this._horizontalAlign == 1) &&
				(!this._type || this._type == 'string') &&
				!this._readOnly && 
				this._visible &&
				(!this._dataType) && 
				this._resizable &&
				!this._lookupContext &&
				!this._lookupTable &&
				!this._lookupField &&
				!this._listOfValue
    };
    get format(): string{
        return this._format;
    };
    set format(value: string){
        this._format = value;
        this.grid.enableUpdateTimer();
    };
    get formula(): string{
        return this._formula;
    };
    set formula(value: string){
        this._formula = value;
        this.grid.enableUpdateTimer();
    };
    get horizontalAlign(): number{
        return this._horizontalAlign || 1;
    };
    set horizontalAlign(value: number){
        this._horizontalAlign = value
        this.grid.enableUpdateTimer();
    };
    get readOnly(): boolean{
        return this._readOnly;
    };
    set readOnly(value: boolean){
        this._readOnly = value;
        this.grid.enableUpdateTimer();
    };
    get resizable(): boolean{
        return this._resizable !== false;
    };
    set resizable(value: boolean){
        this._resizable = value;
        this.grid.enableUpdateTimer();
    };
    get sortable(): boolean{
        return this._sortable !== false;
    };
    set sortable(value: boolean){
        this._sortable = value;
    };
    get type(): ColRowType{
        return this._type;
    };
    set type(value: ColRowType){
        this._type = value;
		switch(value) {
			case "checkBox":
				this._dataType = "boolean";
				break;
			case "comboBox":
				this._dataType = "string";
				break;
			case "datePicker":
				this._dataType = "date";
				break;
			case "dateTimePicker":
				this._dataType = "dateTime";
				break;
			case "integer":
				this._dataType = "integer";
				break;
			case "number":
				this._dataType = "number";
				break;
			case "string":
				this._dataType = "string";
				break;
			case "timePicker":
				this._dataType = "time";
				break;
			default:
				this._dataType = "string";
				break;
		}
        this.grid.enableUpdateTimer();
    };
	get dataType(): DataType{
        return this._dataType;
    };
    get visible(): boolean{
        return this._visible !== false;
    };
    set visible(value: boolean){
        this._visible = value;
        this.grid.enableUpdateTimer();
    };
    get width(): number{
        return this.grid.getColWidth(this._colIdx);
    };
    set width(value: number){
        this.grid.setColWidth(this._colIdx, value);
        this.grid.enableUpdateTimer();
    };
};
class TGridColumns {
    private grid: IDataGrid;
    private columns: any[] = [];
    private count: number;

    constructor(grid: DataGrid) {
		this.grid = <any>grid;
	};
	// assign(option: any) {
	// 	this.columns = [];
	// 	for (let i = 0; i < option.length; i++) {
	// 		let item = option[i];
	// 		let col = this.getColumn(item.col);
	// 		col.checkBox = item['checkBox'] || item['checkBox'] == 'Y';
	// 	};		
	// 	this.count = this.columns.length;
	// 	this.grid.colCount = this.count;
	// };
	clear(){
		// for (let i = 0; i < this.columns.length; i++)
			// if (this.columns[i])
				// this.columns[i].grid = null;
		this.columns = [];		
	};
	deleteCol(aCol: number) {
		this.columns.splice(aCol, 1)
		this.updateColIndex();
	};
	getColumn(index: number): TGridColumn {
		if (index > this.columns.length){
			let len = this.columns.length;
			for (let i = len; i <= index; i++)
				this.columns.push('');
		}
		let col = this.columns[index];
		if (!col) {
			col = new TGridColumn(this.grid, index);
			this.columns[index] = col;
		}
		return col;
	};
	insertCol(colIdx: number) {
		let col = new TGridColumn(this.grid, colIdx);
		this.columns.splice(colIdx, 0, col);
		this.updateColIndex();
	};
	loadFromJSON(value: any){
		this.count = value.length;
		for (let i = 0; i < value.length; i ++){
			if (value[i]){
				let col = this.getColumn(i)
				if (value[i]['colIdx'] == undefined)
					value[i]['colIdx'] = i;
				col['asJSON'] = value[i];
			}
		}
		this.grid.colCount = this.count;
	};
	_loadFromJSON(value: any){
		this.loadFromJSON(value);
	};
	saveToJSON(){
		let result = [];
		let withValue = false;
		for (let i = 0; i < this.columns.length; i++){
			if (this.columns[i] && !this.columns[i]['default']){
				withValue = true;
				result.push(this.columns[i]['asJSON'])
			}
			else
				result.push('')
		}
		if (withValue)
			return result
	};
	setColCount(value: number){
		this.columns.length = value;
	};
	updateColIndex() {
		for (let i = 0; i < this.columns.length; i++)
			this.columns[i]._colIdx = i;
	};
};
class TGridRow  {
    private grid: IDataGrid;
	private _comboItems: IComboItem[];
    private _visible: boolean = true;
    private _color: string;
    private _height: number;
    private _readOnly: boolean;
    private _resizable:boolean = false;
	private _type: ColRowType;
	private _dataType: DataType;

	constructor(grid: DataGrid) {
		this.grid = <any>grid;
		if (!this._type) this._type = "string" 
	};
    get color(): string{
        return this._color;
    };
    set color(value: string){
        this._color = value;
        this.grid.enableUpdateTimer();
    };
	get comboItems(): IComboItem[]{
		return this._comboItems
	}
	set comboItems(value: IComboItem[]){
		this._comboItems = value;
		this.grid.enableUpdateTimer();
	}
    get height(): number{
        return this._height;
    };
    set height(value: number){
        this._height = value;
        this.grid.enableUpdateTimer();
    };
    get readOnly(): boolean{
        return this._readOnly;
    };
    set readOnly(value: boolean){
        this._readOnly = value;
        this.grid.enableUpdateTimer();
    };
    get resizable(): boolean{
        return this._resizable;
    };
    set resizable(value: boolean){
        this._resizable = value;
        this.grid.enableUpdateTimer();
    };
	get type(): ColRowType{
        return this._type;
    };
    set type(value: ColRowType){
        this._type = value;
		switch(value) {
			case "checkBox":
				this._dataType = "boolean";
				break;
			case "comboBox":
				this._dataType = "string";
				break;
			case "datePicker":
				this._dataType = "date";
				break;
			case "dateTimePicker":
				this._dataType = "dateTime";
				break;
			case "integer":
				this._dataType = "integer";
				break;
			case "number":
				this._dataType = "number";
				break;
			case "string":
				this._dataType = "string";
				break;
			case "timePicker":
				this._dataType = "time";
				break;
			default:
				this._dataType = "string";
				break;
		}
        this.grid.enableUpdateTimer();
    };
	get dataType(): DataType{
        return this._dataType;
    };
    get visible(): boolean{
        return this._visible;
    };
    set visible(value: boolean){
        this._visible = value;
        this.grid.enableUpdateTimer();
    };
};
class TGridRows {
    private grid: DataGrid;
    public rows: any[] = [];
    private defaultHeight: number;

	constructor(grid: DataGrid, defaultHeight: number) {
		this.grid = grid;
        this.defaultHeight = defaultHeight;
	};
	clear() {
		this.rows = [];
	};
	getHeight(index: number) {
		let row = this.rows[index];
		if (row)
			return row.height
		else
			return this.defaultHeight;
	};
	getRow(index: number): TGridRow {
		let row = this.rows[index];
		if (!row) {
			row = new TGridRow(this.grid);
			this.rows[index] = row;
		};
		return row;
	};
};
export type TGridLayout = 'grid'|'card';
// export type GridMode = 'vertical'|'horizontal';

@customElements('i-data-grid')
export class DataGrid extends Control {
    private _colResizing: boolean;
    private _listOfValue: any = {};
    private _defaultRowHeight: number = 19;
	private _defaultColWidth: number = 64;
    private _layout: TGridLayout = 'grid';
    private mergeRect: any[] = [];
    private tableCells: any[] = [[]];
    private tableSplitters: any[] = [];
    private selectedCells: any[] = [];
    private selectedCellsHighlight: any[] = [];
    private placeHolder: HTMLElement;
    private _table: HTMLTableElement;
    private edit: HTMLInputElement | Datepicker | ComboBox;
    private cellHighlight: HTMLElement;
    private selectedRangeHighlight: HTMLElement;
    private _scrollBox: HTMLElement;
    private tableContainer: HTMLElement;  

    private data: DataGridCells;
    public columns: TGridColumns;
    public gridRows: TGridRows; // private

	// private _mode: GridMode; // = "horizontal";// "vertical";
    private _colCount = 3;
	private _rowCount = 3;
    private editor: any;
    private editorMode: boolean;
	private _cardPanel: any;
    private colWidths: any[] = [];		
	private _rowHeights: any[] = [];
    private mouseDownPosX: number;
    private resizeCol: number;
    private origColWidth: number;
	private _fixedCol = 0;
	private _fixedRow = 1;
	private _leftCol = 0;
	private _topRow = 1;
	private _row = 0;
	private _col = 0;
    private _readOnly: boolean;
	private _scrollLeft = 0;
	private _scrollTop = 0;
    private _dataBindingContext: any;
	private dataBinding: any;
    private _skipRefreshData: boolean;
    private _bindingRecordSet: any;
    // private updateRowHeightFlag = false;
    // private updateColWidthFlag = false;
	private showDataInternalFlag = false;
    private _updateTableTimer: any;
    // private updateTimerCounter = 0;
	// private updateCounter = 0;
    private _sorting = false;
    private _setScrollLeftInterval: any;
	private _setScrollTopInterval: any;
    private _restScrollboxHandler: any;
	private scrollHorizontalTimer: any;
	private scrollVerticalTimer: any;
	
    private _updateTableInternalFlag = false;
    private _totalColWidth = 0;
    private _totalRowHeight = 0;
    private visibleRowCount = 0;
    private visibleColCount = 0;
    private _needUpdate: boolean;
    private showDataFlag: boolean;
    private _showDataTimeout: any;
    private _refreshDataTimeout: any;
    private _destroyed: boolean;
    private sortingCol: number;
    private sortingDescending = false;
    private _currCell: HTMLTableCellElement | undefined;
    private resizeTimer: any;
    private lastClickCell: DataGridCell;
    private formula: any;
    private formulaCell: DataGridCell;
	private origValue: any;

    public onSort: any;
    public onRowChange: any;
    public onCellSelect: any;
    public onColResize: any;
    public onButtonClick: any;
    public onCellClick: any;
    public onCellChange: cellValueChangedCallback;
    public onDisplayCell: any;
    public onEditModeChanged: any;
	public onGetEditControl: any;
	public onKeyDown: any;

    static async create(options?: IDataGridElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    };
    constructor(parent?: Control, options?: IDataGridElement) {        
        super(parent, options);   
        // setTimeout(()=>{
        //     this._init();
        // }, 100);
    };
    get fixedCol(): number{
        return this._fixedCol;
    };
    set fixedCol(value: number){
        this._fixedCol = value;
		if (this._leftCol < this._fixedCol)
			this._leftCol = this._fixedCol;
    };
    get fixedRow(): number{
        return this._fixedRow;
    };
    set fixedRow(value: number){
        this._fixedRow = value;
		if (this._topRow < this._fixedRow)
			this._topRow = this._fixedRow;
    }
    get layout(): TGridLayout{
        return this._layout;
    };
    set layout(value: TGridLayout){
        this._layout = value;
    };
    async init(){
        await super.init();
        this._init();
    }
    private _init(){

		// this._mode = this.getAttribute('mode', true);
		// if (!this.mode)
		// 	this._mode = "vertical";

		// if (this._mode == "vertical") {
			this._fixedCol = 0;
			this._fixedRow = 1;
			this._leftCol = 0;
			this._topRow = 1;
		// } else if (this._mode == "horizontal") {
		// 	this._fixedCol = 1;
		// 	this._fixedRow = 0;
		// 	this._leftCol = 1;
		// 	this._topRow = 0;
		// } else {
		// 	this._fixedCol = 0;
		// 	this._fixedRow = 0;
		// 	this._leftCol = 0;
		// 	this._topRow = 0;
		// }

		this.options = new TGridOptions(this);

		// this.cardViewOptions = new TGridCardViewOptions(this);
		
		// let container = createElement(this, 'div');

		this.placeHolder = this.createElement('div', this);
		this._table = <HTMLTableElement>this.createElement('table', this);

		this.data = new DataGridCells(this);
		// this.dataBinding = {};
		// this.dataBindingAuto = true;

		this.columns = new TGridColumns(this);//, this.defaultColWidth);
		this.gridRows = new TGridRows(this, this._defaultRowHeight)

		this.cellHighlight = this.createElement('div', this);
        this.placeHolder.style.position = 'absolute';

		this.cellHighlight.className = 'grid_curr_cell'			
		this.cellHighlight.style.position = 'absolute';
		this.cellHighlight.style.display = 'none';
		this.cellHighlight.style.zIndex = '3';
        // this.cellHighlight.style.border = '2px solid black';

		this.selectedRangeHighlight = this.createElement('div', this);
		this.selectedRangeHighlight.className = 'grid_selected_cell'
		this.selectedRangeHighlight.style.position = 'absolute';
		this.selectedRangeHighlight.style.display = 'none';
		this.selectedRangeHighlight.style.zIndex = '3';

		this._table.className = 'grid';
		this._table.style.tableLayout = 'fixed';
		this._table.style.position = 'relative';
		// table.style.top = '-1px';

		this.tableContainer = this.createElement('div', this);
        this.tableContainer.className = 'container';
		// this.tableContainer.style.overflow = 'hidden'
        // this.tableContainer.style.width = '100%';
        // this.tableContainer.style.height = '100%';
		this.tableContainer.appendChild(this._table)

        this._scrollBox = this.createElement('div', this);
        this._scrollBox.className = 'scrollBox';
		// this._scrollBox.style.position = 'absolute';
		// this._scrollBox.style.top = '0px';
		this._scrollBox.tabIndex = 0;
		// this._scrollBox.style.zIndex = '4'

        this._scrollBox.appendChild(this.placeHolder);
		
        this.edit = <any>this.createElement('input', this);
		this.edit.setAttribute('autocomplete', 'disabled');
		this.edit.className = 'grid_edit';

		// this.edit.owner = this;
		// this.table.owner = this;
		// this.placeHolder.owner = this;

		this.edit.style.border = '0px';
		this.edit.style.width = '10px';
		this.edit.style.height = '10px';
		this.edit.style.position = 'absolute';
		this.edit.style.top = '-100px';
		this.edit.style.left = '-100px';

		// this['font'] = new TFont(this);
		// this['font']['size'] = 12;
		
		// this.eventOptions.bindDblClick = true;
		this.style.overflow = 'hidden';
		this.style.backgroundColor = '#FFFFFF';		

        this._height = 89;
		this._width = 324;

		this.colWidths = [];		
		// this.colWidths[0] = 10;
	
		this._scrollLeft = 0;
		this._scrollTop = 0;

		this._scrollBox.addEventListener('mousewheel', (event: any)=>{
			// abortEvent(event)	
            console.dir(event);
			let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));	
            this._handleMouseWheel(event, delta);
		})

		this._handleInput = this._handleInput.bind(this);
		this._handleDragOver = this._handleDragOver.bind(this);
		this._handleFileDrop = this._handleFileDrop.bind(this);
		this.edit.addEventListener('input', this._handleInput);
		this.edit.addEventListener('propertychange', this._handleInput);
		this.addEventListener('dragover', this._handleDragOver);
		this.addEventListener('drop', this._handleFileDrop);		

		this._scrollBox.onscroll = this._handleScroll.bind(this);		
		// this._updateTable();		
		this.setCurrCell(this._fixedCol, this._fixedRow);
		this._updateLanguage()
		this._updateListOfValues();
		this.enableUpdateTimer(true, true);	
    };
	calcTopRow(rowIdx: number) {
		if (rowIdx == this._fixedRow)
			return rowIdx;
		let row = rowIdx;
		let height = this._scrollBox.clientHeight;// this.heightValue;
		if (this.layout == 'card'){
			// row = rowIdx - Math.floor(height / this._cardHeight);
			// if (row <= this.fixedRow)
			// 	row = this.fixedRow;
		}
		else{
			for (let i = 0; i < this._fixedRow; i++)
				height = height - this.getRowHeight(i) - 0.8;
			height = height - this.getRowHeight(row);
			while (row > this._fixedRow) {
				// try {
					let h = this.getRowHeight(row) + 0.8;
					height = height - h;					
					if (height < h - 4){
						return row -1;
					};
					row--;
				// } catch(err) {
				// 	return row;
				// }
			}
		}			
		return row;
	};
	cells(aCol: number, aRow: number, refresh?: boolean) {
		return this.data.getCell(aCol, aRow, refresh)
	};
    get col(): number{
        return this._col;
    };
    set col(value: number){
        this._col = value;
    };
    get row(): number{
        return this._row;
    };
    set row(value: number){
        this._row = value;
    }
    get colCount(): number{
        return this._colCount;
    };
    set colCount(value: number){
        this._colCount = value;
        this.enableUpdateTimer(false, true);
    };
    // get currCell(): HTMLTableCellElement | undefined{
    //     return this._currCell;
    // };
    // set currCell(value: HTMLTableCellElement | undefined){
    //     this._currCell = value;
    // };
	// get mode(): GridMode{
	// 	return this._mode;
	// }
	// set mode(value: GridMode){
	// 	this._mode = value;
	// 	this.init();
	// }
    get readOnly(): boolean{
        return this._readOnly;
    };
    set readOnly(value: boolean){
        this._readOnly = value;
    };
    get rowCount(): number{
        return this._rowCount;
    };
    set rowCount(value: number){
        this._rowCount = value;
		this.enableUpdateTimer(true, false);
    };
    get topRow(): number{
        return this._topRow;
    };
    set topRow(value: number){
        this._topRow = value;
    };
	private _updateRowHeights(row: number) {
		let height = this._defaultRowHeight;
		for (let col = 0; col < this._colCount; col++) {
			let cell: any = this.data.cells(col, row);
			if (cell && cell._height && cell._height > height) {
				height = cell._height;
			}
		};
		this._rowHeights[row] = height;
		this._updateTotalRowHeight();
		return height;
	};
	setObject(aCol: number, aRow: number, aObject: any) {
		if (this.data)
			this.data.setObject(aCol, aRow, aObject);
	};
	private setJSONValue(value: string, prop: string, newValue: any): string{
		let obj;
		try{
			if (value)
				obj = JSON.parse(value)
			else
				obj = {}
		}
		catch(err){
			obj = {}
		}
		obj[prop] = newValue
		return JSON.stringify(obj)
	};
	private updateBindingData(cell: DataGridCell, column?: TGridColumn){
		column = column || this.columns.getColumn((<any>cell)._col);
		if (column && column.binding){
			let obj = this.getObject(0, (<any>cell)._row);
			if (!obj){
				obj = {};
				this.setObject(0, this._row, obj);
			}
			obj[column.binding] = (<any>cell)._value;
		}
	};
    private _updateCurrCellValue(editor?: any) {
		console.dir('### _updateCurrCellValue')	
		let cardViewEditor = false;	
		if (editor)
			cardViewEditor = true;
		if (this.editorMode || this._cardPanel) {			
			let oldValue = this.data.getValue(this._col, this._row);
			editor = editor || this.editor;
			if (!editor || editor._isModified === false)
				return;
			// if (typeof(TDateTimePicker) != 'undefined' && (editor instanceof DatePicker))
			// 	let newValue = editor.date
			// else 
			let cell = this.data.getCell(this._col, this._row);
			// let rowOrColDataType = (this.mode == "vertical")? this.cols(this._col).dataType : this.rows(this._row).dataType;
			// let rowOrColType = (this.mode == "vertical")? this.cols(this._col).type : this.rows(this._row).type;
			let rowOrColDataType = this.cols(this._col).dataType;
			let rowOrColType = this.cols(this._col).type;

			if (rowOrColDataType == "boolean" && rowOrColType == "checkBox") {
				(<any>cell)._value = (editor as Checkbox).checked as boolean;
			} else if (rowOrColDataType == "date" && rowOrColType == "datePicker") {
				(<any>cell)._value = (editor as Datepicker).value as Moment;
			} else if (rowOrColDataType == "dateTime" && rowOrColType == "dateTimePicker") {
				(<any>cell)._value = (editor as Datepicker).value as Moment;
			} else if (rowOrColDataType == "time" && rowOrColType == "timePicker") {
				(<any>cell)._value = (editor as Datepicker).value as Moment;
			} else if (rowOrColDataType == "string" && rowOrColType == "comboBox") {
				(<any>cell)._value = ((editor as ComboBox).selectedItem)?.value as string;
			} else if (rowOrColDataType == "number" && rowOrColType == "number") {
				(<any>cell)._value = parseFloat((editor as HTMLInputElement).value) as number;
			} else if (rowOrColDataType == "integer" && rowOrColType == "integer") {
				(<any>cell)._value = parseInt((editor as HTMLInputElement).value) as number;
			} else {
				let newValue;
				if (editor.valueCode)
					newValue = editor.valueCode
				else if (editor.getText)
					newValue = editor.getText()
				else
					newValue = application.xssSanitize(editor.value);
				let text: string = '';
				if (editor.getText)
					text = editor.getText()
				else
					text = newValue;
				if (cell.mergeRect && (this._col != cell.mergeRect.startCol || this._row != cell.mergeRect.startRow))
					cell = this.data.getCell(cell.mergeRect.startCol, cell.mergeRect.startRow);
				if(true /*!this._cardPanel*/){
					if (this.options._autoRowHeight) {
						let div = (<any>this._currCell).div;
						div.textContent = text;
						let height = div.clientHeight + 3;
						if (cell.mergeRect) {
							height = height / (cell.mergeRect.endRow - cell.mergeRect.startRow + 1)
							for (let i = cell.mergeRect.startRow; i <= cell.mergeRect.endRow; i++) {
								// let c = this.data.cells(cell.startCol, i);
								(<any>cell)._height = height;
								this._updateRowHeights(i)
							}
						} else {
							(<any>cell)._height = height;
							this._updateRowHeights(this._row)
						}
					} else
						(<any>this._currCell).div.textContent = text;
				}	
				(<any>cell)._value = newValue;
				this.origValue = undefined;		
				if (!cardViewEditor)	
					this.enableUpdateTimer();	
				if ((<any>cell)._field){
					if (!(<any>cell)._record){
						let column = this.columns.getColumn((<any>cell)._col)
						let record = this.getObject(0, (<any>cell)._row);
						let rs: any = record[(<any>cell)._lookupTable];
						(<any>cell)._record = rs.append()
						let v = (<any>column)._lookupDetailValue;
						switch ((<any>column)._lookupDetailType){
							case 'date':
								v = new Date(v)
								v.setHours(0,0,0,0);
								break;
							case 'numeric':
								if (typeof(v) == 'string')
									v = parseFloat(v);
								break;
						};
						(<any>cell)._record[(<any>column)._lookupDetailField] = v;
					}
					(<any>cell)._record[(<any>cell)._field] = newValue;
				}
				else if (this._dataBindingContext) {
					let record = this.getObject(0, this._row);
					let field = this.getObject(this._col, 0);
					let idx = 0;
					let jsonValue;
					if (typeof(field) == 'number'){
						idx = field;
						field = this.dataBinding['fields'][idx];
						if (this.dataBinding['jsonValues'])
							jsonValue = this.dataBinding['jsonValues'][idx];
					}
					(<any>this.data.getCell(0, this._row))._newRow = false;				
					// let idx = this.dataBinding['fields'].indexOf(field)
					let fieldType = this.dataBinding['fieldTypes'][idx];				
					if (fieldType == 'float')
						newValue = parseNumber(newValue)
					else if (fieldType == 'integer')
						newValue == Math.round(parseNumber(newValue))
					else if (editor && editor['dataType'] == 'dtNumber')
						newValue = parseNumber(newValue)
					if (!record && field) {
						record = this._dataBindingContext['append']();
						this.setObject(0, this._row, record);
					}
					if (record && field) {
						if (jsonValue)
							newValue = this.setJSONValue(record[field], jsonValue, newValue);
						if (record[field] != newValue)
							record[field] = newValue
					}
					if (true /*!cardViewEditor*/)
						this.enableUpdateTimer();
				}
				this.updateBindingData(cell);
				if (this.onCellChange)
					this.onCellChange(this, cell, oldValue, newValue);
			}
			this.enableUpdateTimer();
		};
	};
    private hideEditor(updateValue?: boolean){
        this.edit.value = '';
		if (updateValue && this.editor && this.editor['dataType'] == 'dtUserAccount'){
			let editor = this.editor;
			editor['dataType'] = '';
			this.editor = null;
			let self = this;
			// application['get']('/admin/service/userInfo.tsp', {
			// 	"userID": [editor.text]
			// }, function (result) {
			// 	self.editor = editor;
			// 	if (result && Array.isArray(result['data']) && result['data']['length'] > 0)
			// 		self.editor.text = result['data'][0]['guid']
			// 	self.hideEditor(updateValue)			
			// })			
			return;
		}
		if (updateValue && this.editor && this.editor['dataType'] == 'dtFile')
			updateValue = false;
		else if (this.editor && this.editor.buildInEditor && this.editor['dataType'] == 'dtLookup'){
			this.editor['onChange'] = undefined;
			this.editor.hide(updateValue);
		}
		if (updateValue)
			this._updateCurrCellValue()
		// globalEvents.editor = undefined;
		// if (this.editLookup)
		// 	this.editLookup['setVisible'](false);
		if (this.editor) {
			this.editorMode = false;
			let editor = this.editor;
			this.editor = undefined;
			this.removeChild(editor);
			// if (editor.buildInEditor) {
				// editor.free();
			// } else {
			// 	editor['setVisible'](false);
			// }			
			this.edit.removeEventListener('propertychange', this._handleInput);
			this.edit.removeEventListener('input', this._handleInput);
			this.edit.value = '';
			this.edit.addEventListener('propertychange', this._handleInput);
			this.edit.addEventListener('input', this._handleInput);
			this.focus();
			this.edit.focus();		
			if (this.onEditModeChanged)
				this.onEditModeChanged(this);
		};
    };
    checkEmptyRow(row: number): boolean {
		let cell = this.data.getCell(0, row);
		if ((<any>cell)._newRow != undefined)
			return (<any>cell)._newRow
		
		for (let i = 0; i < this._colCount; i++) {
			if (this.data.getValue(i, row) != '' && this.data.getValue(i, row) != undefined) {
				return false;
			}
		}
		return true;
	};
    setRowCount(aRowCount: number) {
		if (this._rowCount != aRowCount) {
			this._rowCount = aRowCount;
			if (this._row >= this._rowCount || this._row < this._fixedRow)
				this._row = this._fixedRow;
			this.data.setRowCount(aRowCount);			
			this.refresh();
			this.enableUpdateTimer(true);
		}
	};
    refresh(){
        super.refresh();       
		this.highlightCurrCell(); 
		// if (this.autoHeight){
		// 	this['height'] = this.rowCount * (this.defaultRowHeight)
		// 	this.container.style.height = 'auto';//100%';
		// 	this._scrollBox.style.height = '100%';
		// }
		// else{
		// 	this.container.style.height = this['height'] + 'px';
		// 	this._scrollBox.style.height = this['height'] + 'px'
		// }

		// if (this.autoWidth)
		// 	this.container.style['width'] = '100%'
		// else
		// 	this.container.style['width'] = this['width'] + 'px';
		
		// this.container.style['height'] = this['height'] + 'px';
		if (this._scrollBox){
			this._scrollBox.style.height = this.heightValue + 'px';
			this._scrollBox.style.width = this.widthValue + 'px';
		};		
        // this.enableUpdateTimer();
	};
    deleteRow(row: number) {
		if (this._dataBindingContext && this._dataBindingContext['readOnly'])
			return;
		this.data.deleteRow(row);
		if (this._rowHeights.length > row)
			this._rowHeights.splice(row, 1);
		this.setRowCount(this._rowCount - 1);
		if (this._dataBindingContext) {
			let record = this.getObject(0, this._row);
			if (record && this._dataBindingContext['current'] !== record) {
				if (this._bindingRecordSet) 
					this._bindingRecordSet['current'] = record;
				this._dataBindingContext['current'] = record;
			}
		};
		this.enableUpdateTimer();
	};
    getObject(aCol: number, aRow: number) {
		return this.data.getObject(aCol, aRow);
	};
    getValue(col: number, row: number): any {
		return this.data.getValue(col, row);
	};
    setScrollLeft() {
		console.dir('#setScrollLeft');
		this._scrollBox.onscroll = null;	
		clearTimeout(this._restScrollboxHandler);
		clearTimeout(this._setScrollLeftInterval);
		this._setScrollLeftInterval = setTimeout(() => {
			this.setScrollLeftInternal();
			this._restScrollboxHandler = setTimeout(()=>{
				this._scrollBox.onscroll = this._handleScroll.bind(this);
			}, 10);
		}, 10);
	};
    setScrollLeftInternal(){
		if (this._leftCol == this._fixedCol) {
			this._scrollBox.scrollLeft = 0;
			this._scrollLeft = this._scrollBox.scrollLeft;
		} else {
			let w = 0;
			for (let i = 0; i < this._fixedCol; i++)
				w = w + this.getColWidth(i) + 0.8;
			for (let i = this._leftCol; i < this._colCount; i++)
				w = w + this.getColWidth(i) + 0.8;
			this._scrollBox.scrollLeft = this._scrollBox.scrollWidth - w;
			this._scrollLeft = this._scrollBox.scrollLeft;
		};
	};
	setScrollTop() {	
		this._scrollBox.onscroll = null;	
		clearInterval(this._restScrollboxHandler);
		clearInterval(this._setScrollTopInterval);
		this._setScrollTopInterval = setTimeout(() => {
			this.setScrollTopInternal();
			this._restScrollboxHandler = setTimeout(()=>{
				this._scrollBox.onscroll = this._handleScroll.bind(this);
			}, 10);
		}, 10);
	};
	setScrollTopInternal() {
		console.dir('setScrollTopInternal')
		if (this._topRow == this._fixedRow) {
			this._scrollBox.scrollTop = 0;
			this._scrollTop = this._scrollBox.scrollTop;
		}
		if (this.layout == 'card'){
			// let h = this.topRow * this._cardHeight;
			// this.scrollTop = h;
			// this._scrollBox.scrollTop = this.scrollTop;
			// this._updateCardPanelTop();						
		}	
		else{
			let h = 0;
			for (let i = 0; i < this._fixedRow; i++)
				h = h + this.getRowHeight(i) + 0.8;
			for (let i = this._topRow; i < this._rowCount; i++)
				h = h + this.getRowHeight(i) + 0.8;
			this._scrollBox.scrollTop = this._scrollBox.scrollHeight - h;
			this._scrollTop = this._scrollBox.scrollTop;
		};
	};
    setLeftCol(aLeftCol: number, skipSetScroll?: boolean) {
		if (aLeftCol != this._leftCol) {
			if (this.editorMode) {
				this.hideEditor(true);
			};
			if (aLeftCol < this._fixedCol)
				this._leftCol = this._fixedCol
			else if (aLeftCol >= this._colCount)
				this._leftCol = this._colCount - 1
			else
				this._leftCol = aLeftCol;

			this.showData(100);
			if (!skipSetScroll)
				this.setScrollLeft();
			this.enableUpdateTimer();
		}
	};
	private setTopRow(row: number, skipSetScroll?: boolean){
		if (row != this._topRow){
			if (this.editorMode) {
				this.hideEditor(true);
			};
			if (row < this._fixedRow)
				this._topRow = this._fixedRow
			else if (row >= this._rowCount)
				this._topRow = this._rowCount - 1
			else
				this._topRow = row;

			this.showData(100);
			if (!skipSetScroll)
				this.setScrollTop();
			this.enableUpdateTimer();
		};
    };
    showData(interval: number) {
		let self = this;
		self.showDataFlag = true;
		if (self._showDataTimeout) {
			clearTimeout(self._showDataTimeout);
		}
		if (interval && !self._refreshDataTimeout) {
			self._refreshDataTimeout = setTimeout(function() {
				clearTimeout(self._refreshDataTimeout);
				self._refreshDataTimeout = undefined;
				// if (!self._destroyed)
				// 	self.showDataInternal();
			}, 10)
		};
		self._showDataTimeout = setTimeout(function() {
			if (self._refreshDataTimeout) {
				clearTimeout(self._refreshDataTimeout);
				self._refreshDataTimeout = undefined;
			}
			clearTimeout(self._showDataTimeout);
			self._showDataTimeout = undefined;
			if (self.showDataFlag) {
				self.showDataFlag = false;
				self._updateTableInternal();
				if (!self['_destroyed'])
					self.showDataInternal();
			}
		}, 100)
	};
    getTableCellByActualIndex(aColIdx: number, aRowIdx: number): HTMLTableCellElement | undefined {
        let aCol: number;
        let aRow: number;
		if (aColIdx < this._fixedCol)
			aCol = aColIdx
		else
			aCol = aColIdx - this._leftCol + this._fixedCol;
		if (aRowIdx < this._fixedRow)
			aRow = aRowIdx
		else
			aRow = aRowIdx - this._topRow + this._fixedRow;
		for (let i = this._topRow; i < aRow; i ++){
			if (this.gridRows.rows[i] && this.gridRows.rows[i]._visible == false)
				aRow --
		}
		if (aRow >= this._fixedRow && aCol >= this._fixedCol && this.tableCells[aRow] && this.tableCells[aRow][aCol])
			return this.tableCells[aRow][aCol]
		else
			return undefined;
	};
    getTableCell(aColIdx: number, aRowIdx: number) {
		if (this.tableCells && this.tableCells[aRowIdx])
			return this.tableCells[aRowIdx][aColIdx]
		else
			return undefined;
	};
    highlightCurrCell() {
		this._currCell = this.getTableCellByActualIndex(this._col, this._row);
		if (!this.options._rowSelect){
			if (!this._currCell){
				if (this.cellHighlight)
					this.cellHighlight.style.display = 'none';
				return;
			};
			// if (this._currCell && (this._currCell.offsetTop + this._currCell.clientHeight) > this['height'])
			// 	return this.setTopRow(this._topRow + 1);		
		};	
		this.highlightSelectedCell();
		this.selectedRangeHighlight.style.display = 'none';

		if (this._currCell || (this.options._rowSelect && this._row < this._rowCount)) {			
			if (this.options._rowSelect) {				
				this.cellHighlight.style.display = 'block';
			
				if (this._currCell){
					this.cellHighlight.style.display = ''
					this.cellHighlight.style.top = this._currCell.offsetTop - 1 + 'px';
					this.cellHighlight.style.height = this._currCell.offsetHeight + 1 + 'px';
				}
				else	
					this.cellHighlight.style.display = 'none'
				this.cellHighlight.style.left = '0px';
				if ((this._totalColWidth + 2) < this.tableContainer.clientWidth)
					this.cellHighlight.style.width = (this._totalColWidth + 2) + 'px'
				else
					this.cellHighlight.style.width = (this.tableContainer.clientWidth + 2) + 'px';// (width) + 1 + 'px';				
			} else if (this._currCell) {
				let tableCell = this.getTableCell(this._col, this._row);
				if (tableCell && (<any>this._currCell).cell){
					let edit = this.edit;
					edit.value = (<any>this._currCell).cell._displayValue || (<any>this._currCell).cell._value || '';
					if (edit instanceof HTMLInputElement) edit.setSelectionRange(0, edit.value.length)
					// if (globalEvents.activeControl == this)
					// 	setTimeout(function(){
					// 		edit.focus();
					// 		edit.setSelectionRange(0, edit.value.length) 
					// 	},5)
				}
				else{
					this.edit.value = ''
				};
				this.cellHighlight.style.display = 'block';

				let parentRect = this.getBoundingClientRect();
				let elemRect = this._currCell?.getBoundingClientRect();
				this.cellHighlight.style.top = this._currCell.offsetTop + 'px';
				this.cellHighlight.style.left = this._currCell.offsetLeft + 'px';
                if (this._currCell?.offsetWidth)
				    this.cellHighlight.style.width = this._currCell.offsetWidth + 1 + 'px'
                else
                    this.cellHighlight.style.width = '0px';
                if (this._currCell?.offsetHeight)
				    this.cellHighlight.style.height = this._currCell.offsetHeight + 1 + 'px'
                else
                    this.cellHighlight.style.height = '0px';
			};
		} else {
			this.cellHighlight.style.display = 'none';
		}
		if (this._currCell && (<any>this._currCell).cell)
			this.cellHighlight.title = (<any>this._currCell).cell._hint || ''
		else
			this.cellHighlight.title = '';
	}
    setCurrCell(aCol: number, aRow: number, triggerEvent?: boolean){
        if (this._col == aCol && this._row == aRow)
			return;
		// if (!globalEvents.ctrlKey){
			this.selectedCells = [];
		// }
		let cell = this.data.getCell(aCol, aRow);				
		let idx = this.selectedCells.indexOf(cell)
		if (idx < 0){			
			this.selectedCells.push(cell)
		}
		else{
			this.selectedCells.splice(idx, 1)
		}
		this.highlightSelectedCell()

		if (this.editorMode) {
			this.hideEditor(true);
		};
		// if (aCol < 0)
		// 	aCol = 0;
		if (aCol < this._fixedCol)
			aCol = this._fixedCol;
		if (aRow < this._fixedRow)
			aRow = this._fixedRow;
        let rowChange: boolean = false;
		if (aCol < this._colCount && aRow < this._rowCount) {
			this._col = aCol;
			if (this._row != aRow) {
				rowChange = true;
				if (!this._readOnly && this.options._autoAddRow && this._row == this._rowCount - 1 && this.checkEmptyRow(this._row)) {
					if (this._dataBindingContext){
						let record = this.getObject(0, this._row);
						if (record)
							this._dataBindingContext['delete'](record)
						this.deleteRow(this._row);
					}
					else
						this._rowCount = this._rowCount -1
					this.enableUpdateTimer();
				}
			}
			this._row = aRow;

			if (aCol < this._leftCol)
				this.setLeftCol(aCol);
			if (aRow < this._topRow)
				this.setTopRow(aRow);
			if (this._scrollBox.clientWidth > 0) {//the grid is visible
				let topRow = this.calcTopRow(aRow);
				if (topRow > this._topRow)
					this.setTopRow(topRow);

				let leftCol = this.calcLeftCol(aCol);
				if (leftCol > this._leftCol)
					this.setLeftCol(leftCol);
				// this._currCell = this.getTableCellByActualIndex(aCol, aRow);
			}
			this.highlightCurrCell();
			if (rowChange) {
				let record = this.getObject(0, this._row);
				if (this._bindingRecordSet && this._bindingRecordSet['current'] !== record) 
					this._bindingRecordSet['current'] = record;

				if (this._dataBindingContext && this._dataBindingContext['current'] !== record) {					
					this._skipRefreshData = true;
					if (this._bindingRecordSet) 
						this._bindingRecordSet['current'] = record;
					this._dataBindingContext['current'] = record;
				}
				if (triggerEvent && this.onRowChange) {
					this.onRowChange(this);
				}
			}
			if (triggerEvent && this.onCellSelect) {				
				this.onCellSelect(this, cell);
			}
		};
    };
    private highlightSelectedCell(){
        if (this.selectedCells.length > 1){
			let idx: any = {};
			for (let i = 0; i < this.selectedCells.length; i++){
				let cell = this.selectedCells[i]
				idx[cell.col + '-' + cell.row] = false;
			}
			for (let i = this.selectedCellsHighlight.length -1; i > -1; i --){
				let div = this.selectedCellsHighlight[i];
				if (typeof(idx[div.col + '-' + div.row]) == 'undefined'){
					this.removeChild(this.selectedCellsHighlight[i])
					this.selectedCellsHighlight['splice'](i, 1)
				}
				else
					idx[div.col + '-' + div.row] = true;
			}
			for (let i = 0; i < this.selectedCells.length; i++){
				let cell = this.selectedCells[i]				
				if (idx[cell['col'] + '-' + cell['row']] == false){
					let tableCell = this.getTableCellByActualIndex(cell.col, cell.row)
					if (tableCell){
						let div = this.createElement('div', this);
						this.appendChild(div);
						this.selectedCellsHighlight.push(div)
						div.className = 'grid_selected_cell'
						div.style.position = 'absolute';
						div.style.display = 'block'
						div.style.zIndex = '3';
						(<any>div).col = cell['col'];
						(<any>div).row = cell['row']

						div.style.top = tableCell.offsetTop + 'px';
						div.style.left = tableCell.offsetLeft + 'px';
						div.style.width = tableCell.offsetWidth + 'px';
						div.style.height = tableCell.offsetHeight + 'px';
					};
				};
			};
		}
		else{
			for (let i = this.selectedCellsHighlight.length -1; i > -1; i --)
				this.removeChild(this.selectedCellsHighlight[i]);
			this.selectedCellsHighlight = [];
		};
    };
    private _updateLanguage(){

    };
    private _updateListOfValues(){

    };
	private _handleScrollHorizontal(sender: HTMLElement) {
		if (sender.scrollLeft == 0) {
			this.setLeftCol(this._fixedCol, true)
			return;
		}
		let width = sender.scrollWidth - sender.scrollLeft - sender.clientWidth;
		for (let i = 0; i < this._fixedCol; i++)
			width = width - this.getColWidth(i) - 1;

		for (let i = this._colCount - 1; i > 0; i--) {
			let w = this.getColWidth(i)
			width = width - w - 1;
			if (width <= 0) {
				let col = this.calcLeftCol(i);
				this.setLeftCol(col, true);
				break;
			}
		}		
		this.highlightCurrCell();
	};
	_handleScrollVertical(sender: HTMLElement) {
		if (sender.scrollTop == 0) {
			if (this._cardPanel)
				this._cardPanel['setTop'](0);
			this.setTopRow(this._fixedRow, true)
			return;
		}
		
		if (this.layout == 'card'){
			// sender.focus();
			// if (this.scrollTop <= this._cardHeight)
			// 	this.setTopRow(this.fixedRow, true)
			// else{
			// 	let row = Math.floor(sender.scrollTop / this._cardHeight) + this.fixedRow;
			// 	this.setTopRow(row, true);
			// }	
		}
		else{
			let height = sender.scrollHeight - sender.scrollTop - sender.clientHeight;
			for (let i = 0; i < this._fixedRow; i++){
				height = height - this.getRowHeight(i);
			}
	
			for (let i = this._rowCount - 1; i > 0; i--) {
				let h = this.getRowHeight(i);
				height = height - h;
				if (height <= 0) {
					let row = this.calcTopRow(i);
					this.setTopRow(row, true);
					break;
				}
			};
		}	
		this.highlightCurrCell();
	};
    private _handleScroll(event: Event){
        // let sender = getSender(event)
		// let self = sender.owner;		
		let target = <HTMLElement>event.target
		clearTimeout(this.scrollHorizontalTimer);
		clearTimeout(this.scrollVerticalTimer);
		if (this._scrollLeft != target.scrollLeft) {
			this._scrollLeft = target.scrollLeft
			this.scrollHorizontalTimer = setTimeout(() => {
				this._handleScrollHorizontal(target);
			}, 10);
		}
		else if (this._scrollTop != target.scrollTop) {
			this._scrollTop = target.scrollTop
			this.scrollVerticalTimer = setTimeout(() => {
				this._handleScrollVertical(target);
			}, 10);
		}
    };
    private _handleFileDrop(event: Event){
        console.dir('## _handleFileDrop')
    };
    private _handleDragOver(event: Event){
        console.dir('## _handleDragOver')
    };
    private _handleInput(event: Event){
		this.showEditor(this.edit.value);
		// if (owner._chineseInput && !owner.edit['value']['trim']()){
		// 	owner._chineseInput = false;			
		// 	return;
		// }
		// if (owner && owner == globalEvents.activeControl)
			
    };
    protected _handleMouseWheel(event: WheelEvent, delta: number){
        console.dir('## _handleMouseWheel')
    };
    private getColLeft(aCol: number) {		
		let cell = this.getTableCellByActualIndex(aCol, 1)
		if (cell)
			return cell.offsetLeft;

		let r = 0;
		for (let i = 0; i < this._fixedCol; i++) {
			r = r + this.getColWidth(i);
		}
		
		for (let i = this._leftCol; i < aCol; i++) {
			r = r + this.getColWidth(i)
		}
		return r;
	};
	private getColRight(aCol: number) {		
		let cell = this.getTableCellByActualIndex(aCol, 1)
		if (cell)
			return cell.offsetLeft + this.getColWidth(aCol);
					
		let r = 0;
		for (let i = 0; i < this._fixedCol; i++) {
			r = r + this.getColWidth(i);
			if (i == aCol)
				return r;
		};
		
		for (let i = this._leftCol; i < aCol; i++) {
			r = r + this.getColWidth(i)
		};
		return r + this.getColWidth(aCol);
	};
    getColWidth(col: number): number{
        let column = this.cols(col);
		if (column && (<any>column)._visible === false)
			return 0;
		let w = this.colWidths[col]
		if (w != undefined)
			return w
		else
			return this._defaultColWidth;
    };
    private getRowHeight(row: number): number{
        let h = this._rowHeights[row];
		if (h)
			return h
		else
			return this._defaultRowHeight;
    };
    private _updateTotalRowHeight(){
        this._totalRowHeight = 0;
		for (let i = 0; i < this._rowCount; i++) {
			this._totalRowHeight = this._totalRowHeight + this.getRowHeight(i) + 0.8;
		}
		this.placeHolder.style.height = this._totalRowHeight + 'px';
    };
    private _updateTotalColWidth(){
        this._totalColWidth = 0;
		for (let i = 0; i < this._colCount; i++) {
			this._totalColWidth = this._totalColWidth + this.getColWidth(i);
		}
		if (this._totalColWidth < parseFloat(this['width'].toString()))
			this.placeHolder.style.width = '100%'
		else
			this.placeHolder.style.width = this._totalColWidth + 'px';
		// this.tableContainer.style.width = this._scrollBox.clientWidth + 'px';
    };
    private _updateTableRows(){
        for (let i = this._table.rows.length - 1; i >= 0; i--) {
			this._table.deleteRow(i)
		}
		this.visibleRowCount = Math.round(this.heightValue / (this._defaultRowHeight)) + 1;
		if (this.visibleRowCount > this._rowCount)
			this.visibleRowCount = this._rowCount;
		// for (let i = this._fixedRow; i < this._rowCount; i ++){
		// 	if (this.gridRows.rows[i] && this.gridRows.rows[i]._visible == false)
		// 		this.visibleRowCount --;
		// };
		for (let i = this._table.rows.length; i < this.visibleRowCount; i++) {
			let r = this._table.insertRow(this._table.rows.length);			
		};
    };
    private getActualColIdx(col: number): number{
        if (col < this._fixedCol)
			return col
		else
			return col + this._leftCol - this._fixedCol;
    };
    private getActualRowIdx(row: number): number{
        if (row < this._fixedRow)
			return row
		else{
			let result = row + this._topRow - this._fixedRow;
			for (let i = this._topRow; i <= result; i ++){
				if (this.gridRows.rows[i] && this.gridRows.rows[i]._visible == false)
					result ++
			};
			return result;
		};
    };
    cols(colIdx: number) {
		return this.columns.getColumn(colIdx);
	};
	rows(rowIdx: number) {
		return this.gridRows.getRow(rowIdx);
	};
    private _updateTableCellDiv(tableCell: HTMLTableCellElement, col: number, row: number){

        if (!(<any>tableCell).div) {
			let div = this.createElement('div');			
			(<any>tableCell).div = div;			
			(<any>div).owner = this;
			// if (this.mode == "vertical") {
				if (row < this._fixedRow)
					tableCell.className = 'header grid_fixed_cell';
				else if (col < this._fixedCol)
					tableCell.className = 'grid_fixed_cell';
			// } else {
			// 	if (col < this._fixedCol)
			// 		tableCell.className = 'header grid_fixed_cell';
			// 	else if (row < this._fixedRow)
			// 		tableCell.className = 'grid_fixed_cell';
			// }
			
            let actCol = this.getActualColIdx(col);
            let actRow = this.getActualRowIdx(row);
			let cell = this.data.cells(actCol, actRow);
            let w = 0;
            let h = 0;
			if (cell && cell.mergeRect) {
				let divRect = this.createElement('div');
				divRect.style.overflow = 'hidden';
				divRect.style.position = 'relative';
				tableCell.appendChild(divRect);

				w = this.getColWidth(cell.mergeRect.startCol) - 2;
				h = this.getRowHeight(cell.mergeRect.startRow) - 1;
				for (let i = cell.mergeRect.startCol + 1; i <= cell.mergeRect.endCol; i++)
					w = w + this.getColWidth(i) - 2;
				for (let i = cell.mergeRect.startRow + 1; i <= cell.mergeRect.endRow; i++)
					h = h + this.getRowHeight(i) - 2;

                let left = 0;
                let top = 0;
				if (cell.mergeRect.startCol > this._fixedCol && cell.mergeRect.startCol < this._leftCol) {
					for (let i = cell.mergeRect.startCol; i < this._leftCol; i++)
						left = left + this.getColWidth(i) - 2;
				}
				if (cell.mergeRect.startRow > this._fixedRow && cell.mergeRect.startRow < this._topRow) {
					for (let i = cell.mergeRect.startRow; i < this._topRow; i++)
						top = top + this.getRowHeight(i) - 1;
				}
				divRect.appendChild(div);
				divRect.style.width = (w - left) + 'px';
				divRect.style.height = (h - top) + 'px';
				div.style.position = 'absolute'
				div.style.left = -left + 'px';
				div.style.top = -top + 'px';
			} else {
				w = this.getColWidth(actCol) - 2
				let column = this.cols(actCol);
				if (column && (<any>column)._visible === false)
					tableCell.className += ' grid_cell_hidden'
                    h = this.getRowHeight(actRow) - 2;				
				if (row < this._fixedRow)
					tableCell.style.minWidth = w + 'px';
				tableCell.style.position = 'relative'
				tableCell.appendChild(div);
			}

			div.style.width = w + 'px';

			// if (this.options._autoRowHeight) {
				div.style.height = 'auto'
				div.style.whiteSpace = 'wrap'
			// } else {
			// 	div.style.maxHeight = h + 'px';
			// 	div.style.whiteSpace = 'nowrap';
			// }
			div.style.maxHeight = h + 'px';
			div.style.overflow = 'hidden';
			if (col == 0)
				div.style.minHeight = h + 'px'			
			// div.style.whiteSpace = 'pre-line';
			div.className = 'grid_cell_value';
		};
    };
    private _updateTableCols(){
        let w = 0;		
		for (let i = 0; i < this._fixedCol; i++)
			w = w + this.getColWidth(i);//this.colWidths[i];
		this.visibleColCount = this._fixedCol;        
		let width = this.widthValue;//this._scrollBox.clientWidth;		
		if (width == 0)
			this._needUpdate = true
		else
			this._needUpdate = false;
		for (let i = this._leftCol; i < this._colCount; i++) {
			w = w + this.getColWidth(i);
			if (this.visibleColCount < this._colCount)
				this.visibleColCount++;
			if (w >= width)
				break;
		};
		for (let row = 0; row < this._table.rows.length; row++) {
			let r = this._table.rows[row];
			this.tableCells[row] = [];
			for (let col = 0; col < this.visibleColCount; col++) {
				let tableCell = r.insertCell(r.cells.length);	
				if (col == 0)
					tableCell.style.height = this._defaultRowHeight + 'px';			
				(<any>tableCell).owner = this;
				if ((col + this._leftCol) % 2 == 0)				
					tableCell.className = 'grid_cell even_col';
				else
					tableCell.className = 'grid_cell odd_col';
				if ((row + this._topRow) % 2 == 0)
					tableCell.className += ' even_row'
				else
					tableCell.className += ' odd_row'
				this._updateTableCellDiv(tableCell, col, row)
				this.tableCells[row][col] = tableCell;
				if (row == 0 && (col < this._fixedCol && col == this.sortingCol || (col >= this._fixedCol && col + (this._leftCol>0?this._leftCol - this._fixedCol:0)) == this.sortingCol)){ 
					tableCell.style.position = 'relative';
					let elm = this.createElement('div');
					elm.style.position = 'absolute';
					elm.style.width = '6px';
					elm.style.height = '6px';					
					elm.style.right = '4px'
					if (this.sortingDescending){
						elm.style.top = '2px';
						elm.className = 'fa fa-sort-desc'
					}
					else{
						elm.style.top = '6px';
						elm.className = 'fa fa-sort-asc'
					}
					tableCell.appendChild(elm);
				}
			}
		}
    };
    setColWidth(aColIndex: number, width: number, trigerEvent?: boolean) {
        let orig = 0;
        orig = this.colWidths[aColIndex];
        this.colWidths[aColIndex] = width
        // if (aColIndex > this._fixedCol)
        // let col = aColIndex - this._leftCol + this.fixedCol
        // else
        // let col = aColIndex;
        // this.totalColWidth = this.totalColWidth + width - orig;			
        for (let i = 0; i < this.tableCells.length; i++) {
            let tableCell = this.getTableCell(aColIndex, i);
			let tableCellDiv: HTMLTableCellElement = (<any>tableCell)?.div;
            let column = this.cols(aColIndex);
            if (tableCell && tableCell.div && !(<any>column)._checkBox && !(<any>column)._radioButton)
                tableCellDiv.style.width = (width - 3) + 'px';
            // if (this.tableCells[i].length > col)
            // this.tableCells[i][col].childNodes[0].style.width = width -3 + 'px';
        }
        // this.rowHeights = [];
        for (let i = 0; i < this._rowCount; i++) {
            let cell = this.cells(aColIndex, i);
            if (cell)
                (<any>cell)._height = undefined;
            // this.rowHeights[i] = undefined;
        }
        if (trigerEvent && this.onColResize){
            if (this.resizeTimer) 
                clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(()=>{
                this.onColResize(this, aColIndex, width);
            }, 50)
        }
        this.enableUpdateTimer(true, true);
	};
    private _updateTableMergedCells(){
        console.dir('### _updateTableMergedCells')
    };
    sort(col: number, descending?: boolean) {
		let currRow = this.data.data[this._row];		
		if (this.editorMode)
			this.hideEditor()
		this._rowHeights = []
		if (this.data.data.length > this._rowCount) 
			this.data.data.length = this._rowCount
		if (col >= 0)
			this.data.sort(col, descending)
		this.sortingDescending = descending || false;
		this.sortingCol = col		
		if (currRow)
			this._row = this.data.data.indexOf(currRow)
		this.enableUpdateTimer();
	};
	private getEditor(col: number, row: number, cell: DataGridCell, inputValue?: string | Moment | IComboItem | IComboItem[]): any{
		// let colOrRowType: ColRowType;
		// colOrRowType = (this.mode == "vertical")? this.columns.getColumn(col).type : this.gridRows.getRow(row).type;
		let colOrRowType = this.columns.getColumn(col).type;
		if (colOrRowType == "checkBox") {
			let editor = new Checkbox(undefined, {
				checked: (cell.value!=undefined)? cell.value : false
			});
			editor.style.marginLeft = "1px"
			editor.className = 'grid_edit';
			this.appendChild(editor);
			return editor;
		} else if (colOrRowType == "datePicker") {
			let editor = new Datepicker(undefined, {
				type: "date",
				width: this.getColWidth(cell.col)-1
			})
			editor.className = 'grid_edit';
			this.appendChild(editor);
			if (cell.value!=undefined) {
				editor.value = cell.value as Moment;
			} else {
				editor.value = moment.unix(moment.now()/1000) as Moment;
			}
			// adjust style of datePicker
			let inputElm = editor.getElementsByTagName("input")[0] as HTMLInputElement;
			inputElm.style.height = "";
			inputElm.style.padding = "0px";
			inputElm.style.backgroundColor = "white";
			let btn = editor.getElementsByClassName("datepicker-toggle")[0] as HTMLElement;
			btn.style.backgroundColor = "white";
			
			return editor;
		} else if (colOrRowType == "timePicker") {
			let editor = new Datepicker(undefined, {
				type: "time",
				width: this.getColWidth(cell.col)-1
			})
			editor.className = 'grid_edit';
			this.appendChild(editor);
			if (cell.value!=undefined) {
				editor.value = cell.value as Moment;
			} else {
				editor.value = moment.unix(moment.now()/1000) as Moment;
			}
			// adjust style of datePicker
			let inputElm = editor.getElementsByTagName("input")[0] as HTMLInputElement;
			inputElm.style.height = "";
			inputElm.style.padding = "0px";
			inputElm.style.backgroundColor = "white";
			let btn = editor.getElementsByClassName("datepicker-toggle")[0] as HTMLElement;
			btn.style.backgroundColor = "white";
			
			return editor;
		} else if (colOrRowType == "dateTimePicker") {
			let editor = new Datepicker(undefined, {
				type: "dateTime",
				width: this.getColWidth(cell.col)-1
			})
			editor.className = 'grid_edit';
			this.appendChild(editor);
			if (cell.value!=undefined) {
				editor.value = cell.value as Moment;
			} else {
				editor.value = moment.unix(moment.now()/1000) as Moment;
			}
			// adjust style of datePicker
			let inputElm = editor.getElementsByTagName("input")[0] as HTMLInputElement;
			inputElm.style.height = "";
			inputElm.style.padding = "0px";
			inputElm.style.backgroundColor = "white";
			let btn = editor.getElementsByClassName("datepicker-toggle")[0] as HTMLElement;
			btn.style.backgroundColor = "white";
			
			return editor;
		} else if (colOrRowType == "comboBox") {
			// let colOrRowComboItems: IComboItem[];
			// colOrRowComboItems = (this.mode == "vertical")? this.cols(col).comboItems : this.rows(row).comboItems;
			let colOrRowComboItems = this.cols(col).comboItems;
			let _selectedItem: IComboItem = colOrRowComboItems[0];
			for(let i=0; i<colOrRowComboItems.length; i++) {
				if (cell.value === colOrRowComboItems[i].value) {
					_selectedItem = colOrRowComboItems[i]; break;
				}
			}
			let editor = new ComboBox(undefined, {
				items: colOrRowComboItems,
				selectedItem: _selectedItem,
				icon: { name: 'caret-down', width: '16px', height: '16px' } as IconElement
			})
			editor.className = 'grid_edit comboBoxEditor';
			this.appendChild(editor);

			// adjust style of comboBox
			let rowHeight: number = this.getRowHeight(cell.row);
			let selectionElm = editor.getElementsByClassName("selection")[0] as HTMLElement;
			selectionElm.style.maxWidth = `100%`;
			selectionElm.style.padding = "0px";
			let inputElm = selectionElm.getElementsByTagName("input")[0] as HTMLElement;
			inputElm.style.padding = "0px";
			let iconBtn = editor.getElementsByClassName("icon-btn")[0] as HTMLElement;
			iconBtn.style.padding = "0px"
			iconBtn.style.width = rowHeight + 'px';
			iconBtn.style.height = rowHeight + 'px';
			let iconElm = iconBtn.getElementsByTagName('i-icon')[0] as HTMLElement;
			iconElm.style.width = rowHeight + 'px';
			iconElm.style.height = rowHeight + 'px';

			return editor;
		} else if (colOrRowType == "number") {
			let editor = <any>this.createElement('input', this);
			editor.type = "number";
			editor.value = cell.value as number;
			editor.setAttribute('autocomplete', 'disabled');
			editor.className = 'grid_edit';
			this.appendChild(editor);
			return editor;
		} else if (colOrRowType == "integer") {
			let editor = <any>this.createElement('input', this);
			editor.type = "text";
			editor.addEventListener('input', () => {
				const currentValue = editor.value;
				const sanitizedValue = currentValue.replace(/[^0-9]/g, '');
				editor.value = sanitizedValue;
			});
			editor.value = cell.value as number;
			editor.setAttribute('autocomplete', 'disabled');
			editor.className = 'grid_edit';
			this.appendChild(editor);
			return editor;
		} 
		// else if (this.columns.getColumn(col).type == "string") {
		// 	let editor = <any>this.createElement('input', this);
		// 	editor.setAttribute('autocomplete', 'disabled');
		// 	editor.className = 'grid_edit';
		// 	editor.setAttribute('editorType', this.columns.getColumn(col).type);
		// 	this.appendChild(editor);
		// 	return editor;
		// } 
		else {
			let editor = <any>this.createElement('input', this);
			if (inputValue)
				editor.value = inputValue
			editor.setAttribute('autocomplete', 'disabled');
			editor.className = 'grid_edit';
			// this.appendChild(editor);
			return editor;
		}
	};
	private handleEditControlChange(event: Event){
		console.dir('## handleEditControlChange')
	};
	protected _handleEditDblClick(event: Event, stopPropagation?: boolean): boolean {
        return true;
    };
	protected colLeft(){
		let aRow = this._row;
		let aCol = this._col - 1;
		while (aCol > this._fixedCol){
			let column = this.cols(aCol);
			if (column && column.visible === false)
				aCol --
			else	
				break;
		};	
		if (aCol < this._colCount){
			let cell = this.data.cells(aCol, aRow);
			if (cell && cell.mergeRect) {
				if (cell.mergeRect.startRow != aRow) {
					aRow = cell.mergeRect.endRow + 1;
				};
				this.setCurrCell(aCol, aRow, true);
			} else
				this.setCurrCell(aCol, aRow, true);
		};
	};
	protected colRight(){	
		let aRow = this._row;
		let aCol = this._col + 1;				
		while (aCol < this._colCount -1){
			let column = this.cols(aCol);
			if (column && column.visible === false)
				aCol ++
			else	
				break;
		};	
		if (aCol < this._colCount){
			let cell = this.data.cells(aCol, aRow);
			if (cell && cell.mergeRect) {
				if (cell.mergeRect.startRow != aRow) {
					aRow = cell.mergeRect.endRow + 1;
				}
				this.setCurrCell(aCol, aRow, true);
			} else
				this.setCurrCell(aCol, aRow, true);
		};
	};
	protected autoAddRow() {
		if (!this._readOnly && !this.options._rowSelect && this.options._autoAddRow && this._row == this._rowCount - 1) {
			let emptyRow = this.checkEmptyRow(this._row);
			if (!emptyRow) {				
				this._rowCount = this._rowCount + 1;
				this.setCurrCell(this._col, this._row + 1, true)
				let cell = this.data.getCell(0, this._row);								
				if (this._dataBindingContext) {
					(<any>cell)._newRow = true;
					let rd = this._dataBindingContext['append']();
					this.setObject(0, this._row, rd);
					this._skipRefreshData = true;
					if (this._bindingRecordSet) 
						this._bindingRecordSet['current'] = rd;
					this._dataBindingContext['current'] = rd;
				}				
				this._updateTotalRowHeight()				
				this.enableUpdateTimer();
			}
		}
	};
	protected rowDown(disableAutoAddRow?: boolean) {
		let aCol = this._col;
		let aRow = this._row + 1;
		while (aRow < this._rowCount -1 && this.gridRows.rows[aRow] && this.gridRows.rows[aRow]._visible == false){
			aRow ++;
		}
		if (this.gridRows.rows[aRow] && this.gridRows.rows[aRow]._visible == false)
			aRow = this._row
			this.gridRows.rows[aRow] && this.gridRows.rows[aRow]._visible == false
		if (!disableAutoAddRow)
			this.autoAddRow();
		if (aRow < this._rowCount){
			let cell = this.data.cells(aCol, aRow);
			if (cell && cell.mergeRect) {
				if (cell.mergeRect.startRow != aRow) {
					aRow = cell.mergeRect.endRow + 1;
				}
				this.setCurrCell(aCol, aRow, true);
			} else
				this.setCurrCell(aCol, aRow, true);
		};
	};
	protected calcBottomRow(topRowIdx: number): number {
		if (topRowIdx == this._rowCount - 1)
			return topRowIdx;
		let row = topRowIdx;
		let height = this._scrollBox.clientHeight;
		if (this.layout == 'card'){
			// row = topRowIdx + Math.ceil(height / this._cardHeight);
			// if (row >= this.rowCount)
			// 	row = this.rowCount -1;
		}
		else{
			for (let i = 0; i < this._fixedRow; i++)
				height = height - this.getRowHeight(i) - 0.8;
			height = height - this.getRowHeight(row);
			while (row < this._rowCount - 1) {
				let h = this.getRowHeight(row - 1) + 0.8;
				height = height - h;
				if (height <= 0)
					return row;
				row++;
			};
		};
		return row;
	};
	protected calcLeftCol(colIdx: number): number {
		if (colIdx == this._fixedCol)
			return colIdx;
		let col = colIdx;
		let width = this._scrollBox.clientWidth;
		for (let i = 0; i < this._fixedCol; i++)
			width = width - this.getColWidth(i) - 0.8;
		width = width - this.getColWidth(col) - 0.8;
		while (col > this._fixedCol - 1) {
			let w = this.getColWidth(col - 1) + 0.8;
			width = width - w;
			if (width <= 0) {
				return col;
			}
			col--
		}
		return col;
	};
	protected rowUp() {
		let aCol = this._col;
		let aRow = this._row - 1;
		
		let cell = this.data.cells(aCol, aRow);
		if (cell && cell.mergeRect) {
			if (cell.mergeRect.endRow != aRow) {
				aRow = cell.mergeRect.startRow - 1;
			};
			this.setCurrCell(aCol, aRow, true);
		} 
		else
			this.setCurrCell(aCol, aRow, true);
	};
	protected restoreOrigCellValue() {
		if (this.origValue != undefined) {
			if (this.editorMode) 
				this.editor.value = this.origValue
			else
				(<any>this._currCell).div.textContent = this.origValue;
		};
	};
	protected _handleKeyDown(event: KeyboardEvent, stopPropagation?: boolean): boolean | undefined{
		if (!this.editorMode)
			this.edit.focus();				
		
		if (!this.enabled)
			return false
		else if (event.keyCode == 229){
			// this._chineseInput = true;
			setTimeout(()=>{
				// this._chineseInput = false;
			}, 10)
			return true;
		};
		// if (event.bubbles && this.onKeyDown)
		// 	this['onKeyDown'].call(this.parentForm, this['__this'], keyInfo, event)
		// if (event && event['cancelBubble'])
		// 	return;

		// if (this['_destroyed'])
		// 	return;
		let keyCode = event.keyCode;	
		switch (keyCode) {
			case 9:{
				//tab
				if (event.shiftKey)
					this.colLeft();
				else
					this.colRight();
				return true;
			}
			case 13:{
				//enter
				if (this.editorMode){
					// if ((typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox) || this.editor['listOfValue']){						
					// 	if (this.editor['listOfValue']){
					// 		if (this.editor instanceof TComboBox){
					// 			if (this.editor.itemIndex > -1)
					// 				this.editor.setItemIndex(this.editor.itemIndex)
					// 			else
					// 				this.editor.setValueCode(this.editor.input.value)
					// 		}
					// 		else
					// 			this.editor.setItemIndex(this.editor.itemIndex);
					// 	}
					// 	else if (typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox){
					// 		let text = this.editor.items.getString(this.editor.itemIndex);
					// 		let v = this.editor.input.value;
					// 		if (v)
					// 			v = v.toLowerCase()
					// 		if (text && text.toLowerCase().indexOf(v) == 0)
					// 			this.editor.valueCode = text;
					// 	}
					// 	this.editor.hideDropDownPanel(false, true);
					// }	
					if (!event.shiftKey){
						// if (this.editor instanceof TEdit && this.editor['dataType'] == 'dtLookup'){
						// 	this.hideEditor(true);
						// }
						// else {
							this.hideEditor(true);
							this.colRight();
						// }
					}
				}
				else{					
					this.setCurrCell(this._col + 1, this._row, true);
				}
				return true;
			}
			case 32: {
				//space
				let col = this.cols(this._col);
				let row = this.rows(this._row);				
				let cell = this.cells(this._col, this._row)
				if (cell && cell.checkBox) {
					if (this._currCell) {
						this.toggleCellValue(col, cell)
						this._updateCell(this._currCell, cell, col, row);
					};
					event.stopPropagation();
				}
				break;
			}
			case 33:{
				//page up
				// if (this.editorMode && ((typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox) || this.editor['listOfValue'])){					
				// 	return true;
				// }
				let bottomRow = this.calcBottomRow(this._topRow);
				let row = this.calcTopRow(bottomRow);
				row = this.calcTopRow(row);
				this.setCurrCell(this._col, row);
				return true;
			}
			case 34:{
				//page down
				// if (this.editorMode && ((typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox) || this.editor['listOfValue'])){				
				// 	return true;
				// }
				let bottomRow = this.calcBottomRow(this._topRow);
				let row = this.calcBottomRow(bottomRow);				
				this.setCurrCell(this._col, row);
				return true;
			}
			case 35:{
				//end
				if (!this.editorMode) {
					if (event.ctrlKey) {
						this.setCurrCell(this._colCount - 1, this._rowCount - 1);
					} else
					this.setCurrCell(this._colCount - 1, this._row);
				}
				return true;
			}
			case 36:{
				//home
				if (!this.editorMode) {
					if (event.ctrlKey)
						this.setCurrCell(this._fixedCol, this._fixedRow);
					else
						this.setCurrCell(this._fixedCol, this._row);
				}
				return true;
			}
			case 38:{
				//arrow up
				// if (this.editorMode && ((this.editor instanceof TEdit && this.editor['dataType'] == 'dtLookup') || (typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox) || this.editor['listOfValue'])){					
				// 	return true;
				// }
				this.rowUp();
				return true;
			}
			case 40:{
				//arrow down
				// if (this.editorMode && ((this.editor instanceof TEdit && this.editor['dataType'] == 'dtLookup') || (typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox) || this.editor['listOfValue'])){
				// 	return true;
				// }
				if (this.editorMode){
					// if ((typeof(TComboBox) != 'undefined' && this.editor instanceof TComboBox) || this.editor['listOfValue'])
					// 	this.editor.hideDropDownPanel(false, true);
					this.hideEditor(true);
				}
				this.rowDown();
				return true;
			}
			default:{
				let col = this.cols(this._col);
				let cell = this.cells(this._col, this._row)
				if (cell && cell.checkBox)
					event.stopPropagation();
			}
		};
		if (this.editorMode) {
			switch(keyCode) {
			case 27:
				//escape
				this.restoreOrigCellValue();
				this.hideEditor();
				this.focus();
				return true;
			case 37:
				//arrow left
				// if (getInputCaretPos(this.editor) == 0)
				// 	this.colLeft()
				return;
			case 39:
				//arrow right
				// if (getInputCaretPos(this.editor) == this.editor.value.length)
				// 	this.colRight();
				return;
			};
		} else {
			switch(keyCode) {
			case 37:
				//arrow left
				this.colLeft();	
				return true;
			case 39:
				//arrow right
				this.colRight();
				return true;
			}
		};
    };
	protected _handleBlur(event: Event, stopPropagation?: boolean): boolean {
		return true;
	};
	private showEditor(inputValue?: string | Moment | IComboItem | IComboItem[]) {		
		let column:any = this.columns.getColumn(this._col);
		let contextReadonly = false;
		if (this._dataBindingContext){
			contextReadonly = this._dataBindingContext['readOnly'] || this._dataBindingContext['_context']['options']['_readOnly']
		}
		if (!column._file && contextReadonly)
			return;
		if (!column._file && this.checkCellReadOnly())
			return;
		let cell = this.data.cells(this._col, this._row)
		this._currCell = this.getTableCellByActualIndex(this._col, this._row)
		if (this._currCell && !this.editorMode) {
			let top = this._currCell.offsetTop -1;
			//this.table.style.zIndex = 1;
			this.editorMode = true;
			this.origValue = (<any>this._currCell).div.innerHTML || '';
			
			if (this.editor){
				this.editor.owner = null;
				this.editor['onChange'] = null;
				this.editor['onDblClick'] = null;
				this.editor['onKeyDown'] = null;				
				this.editor['onHideDropDownPanel'] = null;
			}
			let editor: HTMLInputElement | Datepicker | ComboBox | undefined;
			if (this.onGetEditControl) {
				editor = this.onGetEditControl(this, cell);
				if (editor)
					this.appendChild(editor)
			}
			if (!editor) {	
				editor = this.getEditor(this._col, this._row, cell, inputValue);
				// editor.editorMode = true;
				// editor.buildInEditor = true;
				// globalEvents.editor = this
			}
			if (editor) {
				// editor.owner = this;
				editor.onchange = this.handleEditControlChange.bind(this);
				editor.ondblclick = this._handleEditDblClick.bind(this);
				editor.onkeydown = this._handleKeyDown.bind(this);
				// editor['onHideDropDownPanel'] = this.handHideDropDownPanel.bind(this);
				editor.onblur =this._handleBlur.bind(this);
				this.editor = editor;
				editor.style.position = 'absolute';
				editor.style.display = 'block'; //['setVisible'](true);
				// editor.value = this.edit.value;
				// if (editor instanceof Datepicker) {
				// 	editor.value = this.edit.value as Moment;
				// } else if (editor instanceof ComboBox) {
				// 	editor.value = this.edit.value as IComboItem;
				// } else {
				// 	editor.value = this.edit.value as string
				// }
				// else if (this.edit instanceof HTMLInputElement) {
				// 	if (editor.getAttribute("editorType"), "number")
				// 		editor.value = parseFloat(this.edit.value) as number
				// 	else if (editor.getAttribute("editorType"), "integer")
				// 		editor.value = parseInt(this.edit.value) as number
				// 	else if (editor.getAttribute("editorType"), "string")
				// 		editor.value = this.edit.value as string
				// }
				editor.focus();
				if (cell.mergeRect){
					let w = 0;
					let h = 0;
					for (let i = cell.mergeRect.startCol; i < cell.mergeRect.endCol; i++)
						w += this.getColWidth(i)
					editor.style.width = (w-1) + 'px';//['setWidth'](w -1);
					for (let i = cell.mergeRect.startCol; i < cell.mergeRect.endCol; i++)
						h += this.getRowHeight(i) + 0.8
					editor.style.height = (h-1) + 'px';
					// this.editor['setHeight'](h -1);
					this.editor['setTop'](this._currCell.offsetTop + 1);
					this.editor['setLeft'](this._currCell.offsetLeft + 1);
				}
				else{
					editor.style.width = (this.getColWidth(this._col) - 2) + 'px';
					editor.style.height = (this.getRowHeight(this._row) - 2) + 'px';
					editor.style.top = (this._currCell.offsetTop + 2) + 'px';
					editor.style.left = (this._currCell.offsetLeft + 2) + 'px';

					// this.editor['setWidth'](this.getColWidth(this.col) - 2);
					// this.editor['setHeight'](this.getRowHeight(this.row) - 2);			
					// this.editor['setTop'](this.currCell.offsetTop + 2);				
					// this.editor['setLeft'](this.currCell.offsetLeft + 2);
				}				

			}
			// if (this['onGetEditLookup']) {
			// 	globalEvents.editor = null;				
			// 	if (!cell)
			// 		cell = this.data.getCell(this.col, this.row)
			// 	if (this.editLookup){
			// 		document.body.appendChild(this.editLookup.container)
			// 		this.editLookup.parent = null;
			// 	}
			// 	let editLookup = this['onGetEditLookup'](this['__this'], cell);
			// 	if (editLookup) {
			// 		if (editLookup['__self'])
			// 			editLookup = editLookup['__self'];					
			// 		this.editLookup = editLookup;
			// 		// this.editLookup.parent = this;
			// 		document.body.appendChild(editLookup.container)
			// 		if (this.editLookup instanceof TButton){
			// 			this.editLookup['setTop'](clientToScreenY(this, this['top']) + this.getRowHeightTop(this.row));
			// 			this.editLookup['setLeft'](clientToScreenX(this, this['left']) +  this.getColLeft(this.col +1) - this.editLookup['width']);
			// 			this.editLookup['setHeight'](this.getRowHeight(this.row));
			// 		}
			// 		else{
			// 			this.editLookup['setTop'](clientToScreenY(this, this['top']) + this.getRowHeightTop(this.row + 1));
			// 			this.editLookup['setLeft'](clientToScreenX(this, this['left']) +  this.getColLeft(this.col));
			// 		}					
			// 		this.editLookup['setVisible'](true);
			// 		this.editLookup.bringToFront();
			// 	}
			// }
			if (this.onEditModeChanged) {
				this.onEditModeChanged(this);
			};
			this.editor = editor;
			let self = this;			
			setTimeout(()=>{
				if (editor){
					editor.style.zIndex = '9999';
					editor.focus();
					// if (typeof(TDateTimePicker) != 'undefined' && (editor instanceof TDateTimePicker)) {					
					// 	editor['setVisible'](true)		
					// 	editor.focus();	
					// 	if (cell._value)
					// 		editor.setDateTimeValue(new Date(cell._value))
					// 	if (editor.kind == 'time')
					// 		editor.showTimePicker()
					// 	else
					// 		editor.showDatePicker()	
					// } 
					// else{					
					// 	if (editor instanceof TEdit)
					// 		let enforcce = true;
					// 	editor['setVisible'](true)		
					// 	editor.focus();					
					// 	if (editor instanceof TEdit && editor['dataType'] == 'dtLookup'){
					// 		editor.input['value'] = self.edit.value || '';						
					// 	}
					// 	else if (editor.setText){
					// 		if (editor['readOnly'] || (editor.input && editor.input.readOnly))
					// 			editor.setText(cell._value, enforcce)
					// 		else
					// 			editor.setText(self.edit.value, enforcce)						
					// 	} else if (editor.setValue){ 
					// 		if (editor['readOnly'] || (editor.input && editor.input.readOnly))
					// 			editor.setValue(cell._value, enforcce)
					// 		else
					// 			editor.setValue(self.edit.value, enforcce);
					// 	}										
					// 	if (editor['dataType'] == 'dtLookupCombo' || (typeof(TComboBox) != 'undefined' &&  editor instanceof TComboBox) || editor['listOfValue'])
					// 		editor.showDropDownPanel();
					// 	else if (editor instanceof TEdit && editor['dataType'] == 'dtLookup')
					// 		editor.showLookupGrid()
					// }
				};									
			}, 10);
		} else
			this.edit.value = '';		
	};
    protected _handleMouseDown(event: MouseEvent): boolean {		
		if (!this.enabled)
			return true;
		let target = <any>event.target;	
		if (target && target.isSpliter)
			return true;
		let aCol = 0;
		let aRow = 0;		
		
        if (target == this.editor) {
            return true;
        // } else if (self.skipContainerClick) {
        //     self.skipContainerClick = false
        } else {
            let rect = this.getBoundingClientRect()
            let x = getCursorPosX(event) - rect.left;
            let y = getCursorPosY(event) - rect.top;	
            if (x > this._scrollBox.clientWidth || y > this._scrollBox.clientHeight)
                return true;				
            for (let row = 0; row < this._table.rows.length; row++) {
                let tableCell = this.tableCells[row][0];
				
                if (tableCell.offsetTop + tableCell.clientHeight >= y) {
                    let r = this.tableCells[row];
                    for (let col = 0; col < r.length; col++) {							
                        tableCell = r[col];						
                        if (tableCell && tableCell.offsetLeft + tableCell.clientWidth >= x && tableCell.offsetTop + tableCell.clientHeight >= y) {
							let tableCellDiv: HTMLTableCellElement = (<any>tableCell)?.div;
                            aCol = this.getActualColIdx(col);
                            aRow = this.getActualRowIdx(row);
                            let cell = this.cells(aCol, aRow)
                            this.lastClickCell = cell;
                            let elms = tableCellDiv.querySelectorAll('button')
                            if (elms.length > 0){
                                let offsetX = x - tableCell.offsetLeft;
                                for (let i = 0; i < elms.length; i ++){
                                    if (elms[i].offsetLeft + elms[i].clientWidth > offsetX){
                                        this.setCurrCell(aCol, aRow, true);
                                        let btn;
                                        if (Array.isArray((<any>cell)._value))
                                            btn = (<any>cell)._value[i]
                                        else
                                            btn = (<any>cell)._value						
                                        if (this.onButtonClick) {
                                            this.onButtonClick(this, cell, btn);
                                        }												
                                        if (this.onCellClick) {
                                            this.onCellClick(this, cell);
                                        }												
                                    }
                                }
                                return true;
                            }
                            let column = this.columns.getColumn(aCol);
							let gridRow = this.gridRows.getRow(aRow);
                            if (column && ((cell && (<any>cell)._checkBox) || (<any>column)._checkBox || (<any>column)._radioButton)) {
                                if (aRow >= this._fixedRow || (!cell.readOnly && (<any>cell)._checkBox)){
                                    this.toggleCellValue(column, cell)
                                    this._updateCell(tableCell, cell, column, gridRow)
                                    this.setCurrCell(aCol, aRow, true);
                                }	
                                else if (this.options._sortOnClick && (<any>column)._sortable){											
                                    if (aCol == this.sortingCol)
                                    this.sort(aCol, !this.sortingDescending)
                                    else
                                    this.sort(aCol);
                                }	
                            } else if ((aCol == this._col) && (aRow == this._row)) {
                                if (!this.editorMode) {
                                    let cell = this.data.cells(aCol, aRow);
                                    this.edit.value = (<any>cell)._displayValue || (<any>cell)._value || '';//self.getValue(aCol, aRow);											
                                    this.showEditor((<any>cell)._displayValue || (<any>cell)._value || '');
                                }
                            }
                            else if (aRow < this._fixedRow){
                                application.globalEvents.abortEvent(event)
                                if (this.editorMode)
                                    this.hideEditor()
                                if (this.options._sortOnClick){
                                    if (aCol == this.sortingCol)
                                        this.sort(aCol, !this.sortingDescending)
                                    else
                                        this.sort(aCol);
                                }	
                            } 
                            else {
                                this.setCurrCell(aCol, aRow, true);
                            }
                            if (cell && this.onCellClick)
                                this.onCellClick(this, cell);
                            break;									
                        }
                    }
                    if (aRow != undefined)
                        break;
                }
            }
        }
		if (aRow == undefined && this.editorMode) {
			// self._updateCurrCellValue();
			this.hideEditor(true);
		}
		if (!this.editorMode){
			this.edit.focus();
		};
		return true;
	};
    private _updateCell(tableCell: HTMLTableCellElement, cell: DataGridCell, column?: TGridColumn, row?: TGridRow) {
        let tableCellDiv: HTMLTableCellElement = (<any>tableCell)?.div;
        let _cell = <any>cell;
        let _column = <any>column;
		let _row = <any>row;
		let _tableCell = <any> tableCell;
		let withDispValue: boolean = false;
		let disp: any;

		// handle undefined data
		if (!tableCell.classList.contains("header")) {
			// let colOrRowType: ColRowType = (this.mode == "vertical")? this.cols(cell.col).type : this.rows(cell.row).type;
			let colOrRowType: ColRowType = this.cols(cell.col).type;
			switch(colOrRowType) {
				case "string": 
					if (cell.value == undefined) (<any>cell)._value = ""; break;
				case "checkBox":
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = false; break;
				case "datePicker":
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = (moment.unix(moment.now()/1000) as Moment); break;
				case "dateTimePicker":
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = (moment.unix(moment.now()/1000) as Moment); break;
				case "timePicker":
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = (moment.unix(moment.now()/1000) as Moment); break;
				case "comboBox":
					// let colOrRowComboItems = (this.mode == "vertical")? this.cols(cell.col).comboItems : this.rows(cell.row).comboItems;
					let colOrRowComboItems = this.cols(cell.col).comboItems;
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = (colOrRowComboItems)? colOrRowComboItems[0].value : undefined; break;
				case "number":
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = 0; break;
				case "integer":
					if (cell.value == undefined || cell.value == "") (<any>cell)._value = 0; break;
			}
		}

		if (tableCellDiv) {			
			tableCell.style.display = '';
			if ((<any>cell)._encrypted)
                tableCellDiv.style.color = 'green'
			else
                tableCellDiv.style.color = '';
			tableCellDiv.style.display = '';
			if (cell) {
				_cell._tableCell = tableCellDiv;
				let font = {
					'bold': this.font.bold,
					'color': this.font.color,
					'italic': this.font.italic,
					'name': this.font.name,
					'size': this.font.size,
					'underline': this.font.underline
				};
				let value: any;
				if (this.onDisplayCell) {
					disp = {
						'button': _cell._button,
						'checkBox': _cell._checkBox,
						'col': _cell._col,
						'color': _cell._color,
						'dataType': _cell._dataType,
						'font': font,
						'formula': _cell._formula,
						'horizontalAlign': _cell._horizontalAlign,
						'html': _cell._html,
						'image': _cell._image,
						'object': _cell._object,
						'readOnly': _cell._readOnly,
						'row': _cell._row,
						'text': _cell._text,
						'value': _cell._value,
						'visible': _cell._visible
					}
					try {
						this.onDisplayCell(this, disp);
						if (disp.value != _cell._value){
							_cell._displayValue = disp['value'];
							withDispValue = true;
						}
						value = disp['value'];
					} catch(e) {
						value = '';
					}
				} 
				else if (column && _column._formula){
					if (this.formula){
						this.formulaCell = cell;
						value = this.formula['parse']((<any>column)._formula)['result'];
					}
					else{
						// loadLibrary('/libs/formula/1.11.1/formula-parser.min.js', () =>{
						// 	if (!self.formula){
						// 		self.formula = new window['formulaParser']['Parser']();
						// 		self.formula['on']('callVariable', function(name, done){
						// 			let rd = self.getObject(0, self.formulaCell._row);
						// 			if (rd)
						// 				done(rd[name])
						// 		})
						// 		self.enableUpdateTimer()
						// 	}
						// })
					}
				}				
				else
					value = _cell._value;				
				let c = (_cell?_cell._color:'') || (_column?_column._color:'')
				tableCell.classList.remove('bg-warning', 'bg-success', 'bg-info', 'bg-danger', 'bg-highlight');
				if (c){
					if (['warning', 'success', 'info', 'danger', 'highlight'].indexOf(c) > -1)
						tableCell.classList.add('bg-' + c)
					else
						tableCell.style.backgroundColor = c;
				}
				else
					tableCellDiv.style.backgroundColor = '';
				let align;
				if (_cell._horizontalAlign != undefined)
					align = _cell._horizontalAlign
				else if (_column && _column._horizontalAlign != undefined){
					align = _column._horizontalAlign
				}
				if (align != undefined) {		
					switch (align) {
						case 0:
							tableCellDiv.style.textAlign = 'center';
							break;
						case 1:
							tableCellDiv.style.textAlign = 'left';
							break;
						case 2:
							tableCellDiv.style.textAlign = 'right';
							break;
					}
				}
				if (!_cell.visible)
					tableCellDiv.style.display = 'none'
				else
					tableCellDiv.style.display = ''				
				// if (_cell._font) {
				// 	let font = _cell._font;
				// 	if (font.size != undefined)
				// 		tableCell.style.fontSize = font.size + 'px'
				// 	else
				// 		tableCell.style.fontSize = '';
				// 	if (font['color']) {
				// 		let c = color[font['color']];
				// 		if (c == undefined)
				// 			c = font['color'];
				// 		tableCell.style.color = c;
				// 	} else
				// 		tableCell.style.color = '';

				// 	if (font.bold)
				// 		tableCell.style.fontWeight = 'bold'
				// 	else
				// 		tableCell.style.fontWeight = '';
				// 	if (font.italic)
				// 		tableCell.style.fontStyle = 'italic'
				// 	else
				// 		tableCell.style.fontStyle = '';
				// } else {
				// 	tableCellDiv.style.fontSize = font['size'] + 'px';
				// 	if (font['color']) {
				// 		let c = color[font['color']];
				// 		if (c == undefined)
				// 			c = font['color'];
				// 		tableCell.style.color = c;
				// 	} else
				// 		tableCell.style.color = '';
				// 	tableCellDiv.style.fontWeight = font['bold'];
				// 	tableCellDiv.style.fontStyle = font['italic'];
				// }
				let colOrRowType: ColRowType;
				let colOrRowDataType: DataType;
				if (_column && _row) {
					// if (this.mode == "vertical") {
						colOrRowType = _column._type;
						colOrRowDataType = _column._dataType;
					// }
					// else {
					// 	colOrRowType = _row._type;
					// 	colOrRowDataType = _row._dataType;
					// }
				} else if (_column){
					colOrRowType = _column._type;
					colOrRowDataType = _column._dataType;
				} else {
					colOrRowType = _row._type;
					colOrRowDataType = _row._dataType;
				}

				if (colOrRowDataType == 'boolean') {
					let item = new Checkbox(undefined, {
						checked: cell.value
					})
					tableCellDiv.appendChild(item);
					// adjust style of check box
					// tableCellDiv.style.display = "flex";
					// tableCellDiv.style.justifyContent = "center";
					// item.style.top = "50%";
					// item.style.marginTop = "-7.5px";
					// item.style.position = "absolute";
				} else if (colOrRowDataType == 'date') {
					let item = new Label(undefined, {
						caption: cell.value.format('YYYY-MM-DD')
					});
					tableCellDiv.appendChild(item);
				} else if (colOrRowDataType == 'dateTime') {
					let item = new Label(undefined, {
						caption: cell.value.format('YYYY-MM-DD HH:mm:ss')
					});
					tableCellDiv.appendChild(item);
				} else if (colOrRowDataType == 'time') {
					let item = new Label(undefined, {
						caption: cell.value.format('HH:mm:ss')
					});
					tableCellDiv.appendChild(item);
				} 
				else if (colOrRowDataType == 'string') {
					let item = new Label(undefined, {
						caption: cell.value.toString()
					});
					tableCellDiv.appendChild(item);
				} 
				else if (colOrRowDataType == "number") {
					let item = new Label(undefined, {
						caption: cell.value.toString()
					});
					tableCellDiv.appendChild(item);
				} else if (colOrRowDataType == "integer") {
					let item = new Label(undefined, {
						caption: cell.value.toString()
					});
					tableCellDiv.appendChild(item);
				}
				else {
					if ((_column && _column._type == 'image') && _cell._file && _cell._file['url']){
						tableCellDiv.classList.add('image');
						// addClass(tableCelDiv, 'image')
						tableCellDiv.style.height = this._defaultRowHeight + 'px';					
						tableCellDiv.innerHTML = '<img src="' + withDispValue?_cell._displayValue:_cell._file['url'] + '?size=t" style="max-height:100%;max-width=100%"/>'					
					}
					else if (disp && disp.image){ //image
						tableCellDiv.classList.add('image');
						tableCellDiv.style.height = this._defaultRowHeight + 'px';
						tableCellDiv.innerHTML = '<img src="' + withDispValue?value:disp.value + '"/>'
					}				
					else if (disp && disp.html){ //html
						tableCellDiv.innerHTML = withDispValue?value:application.xssSanitize(disp.value)
					}
					else if ((_cell && (_cell.image || _cell._dataType == 5)) || (_column && _column._dataType == 5)){ //image
						tableCellDiv.classList.add('image');
						tableCellDiv.style.height = this._defaultRowHeight + 'px';
						tableCellDiv.innerHTML = '<img src="' + withDispValue?value:_cell._value + '"/>'
					}				
					else if ((_cell && (_cell.html || _cell._dataType == 6)) || (_column && _column._dataType == 6)){ //html
						tableCellDiv.innerHTML = withDispValue?value:application.xssSanitize(_cell._value)
					}
					else if (value && !Array.isArray(value) && !(value instanceof Date) && typeof(value) == 'object'){					
						if (Array.isArray(value)){
							let html = '';
							for (let i = 0; i < value.length; i++)
								 html += '<button>' + (value[i]['caption'] || '...') + '</button>'	
								 tableCellDiv.innerHTML = html;
						}
						else
						tableCellDiv.innerHTML = '<button>' + (value['caption'] || '...') + '</button>'
					}
					else if (_column && _column._button){
						tableCellDiv.innerHTML = '<button>' + (value || '...') + '</button>'
					}
					else if ((_cell && _cell._checkBox) || (_column && _column._checkBox)) {
						if (value)
							tableCellDiv.className = 'check_box_checked'
						else
							tableCellDiv.className = 'check_box_unchecked'
						tableCellDiv.style.position = 'relative';
						tableCellDiv.style.margin = 'auto';
						tableCellDiv.style.top = (this._defaultRowHeight - 13) / 2 + 'px';
						tableCellDiv.style.left = '1px';
						tableCellDiv.style['height'] = '100%';
						tableCellDiv.style['width'] = '13px';
					} else if (_column && _column._radioButton) {
						if (value)
							tableCellDiv.className = 'radio_button.checked'
						else
							tableCellDiv.className = 'radio_button.unchecked'
						tableCellDiv.style.position = 'relative';
						tableCellDiv.style.margin = 'auto';
						tableCellDiv.style.top = (this._defaultRowHeight - 13) / 2 + 'px';
						tableCellDiv.style.left = '1px';
						tableCellDiv.style['height'] = '100%';
						tableCellDiv.style['width'] = '13px';
					} 
					else {					
						if (_cell._dispValue && tableCell.classList.contains('grid_fixed_cell')) {
							tableCellDiv.textContent = _cell._dispValue;
						} 
						else if (withDispValue){
							tableCellDiv.textContent = value;
						}	
						else if (_cell.row < this._fixedRow){
							tableCellDiv.textContent = value;
						}
						else{						
							if (column && (_column._type == 'lookupDetail')){			
								let rd: any;				
								if (_cell._record)
									rd = _cell._record
								else{
									let record = this.getObject(0, _cell._row);
									if (record){
										let rs = record[_column._lookupTable]									
										if (rs){
											rd = rs.first;									
											_cell._field = _column._lookupField;
											let v1 = _column._lookupDetailValue;
											switch (_column._lookupDetailType){
												case 'date':
													v1 = new Date(v1)
													v1.setHours(0,0,0,0);
													break;
												case 'numeric':
													if (typeof(v1) == 'string')
														v1 = parseFloat(v1);
													break;
											}
											while (rd){
												let v2 = rd[_column._lookupField];
												switch (_column._lookupDetailType){
													case 'date':
														v2 = new Date(rd[_column._lookupDetailField])
														v2.setHours(0,0,0,0);
														break;
													case 'numeric':
														if (typeof(v2) == 'string')
															v2 = parseFloat(v2);
														break;
												}
												if (v1 == v2)
													break
												else if (_column._lookupDetailType == 'date' && v1.getTime() == v2.getTime())											
													break
												rd = rs['next']
											}
										}	
									}									
								}								
								if (rd){
									_cell._value = rd[_column._lookupField];
									_cell._record = rd;
									tableCellDiv.textContent = rd[_column._lookupField];
								}
							}
							else if (column && _column._type == 'listOfValue' && _column._listOfValue){
								let lsv = this._listOfValue[_column._listOfValue];
								if (lsv != undefined)
									tableCellDiv.textContent = lsv[value] || value
								else
									tableCellDiv.textContent = value;
							}
							else if (column && (_column._type == 'lookup' || _column._type == 'lookupCombo')){
								// let context: any;
								// if (!_column._lookupContext)
								// 	context = this.context
								// else
								// 	context = this.parentForm[column._lookupContext];
								// if (context){
								// 	let rs = context[column._lookupTable]
								// 	if (rs && value){
								// 		let record = rs['getRecordByPrimaryKey'](value);		
								// 		if (record){
								// 			if (value && (column._displayUserName)){
								// 				let name = application.userNameList[value];
								// 				if (name != undefined){
								// 					tableCell.div['textContent'] = name || ''
								// 					cell._displayValue = name || ''
								// 				}
								// 				else{
								// 					application.getUserNameList([value], function(){									
								// 						let name = application.userNameList[value];
								// 						tableCell.div['textContent'] = name || ''
								// 						cell._displayValue = name || ''
								// 						tableCell = null;
								// 					})
								// 				}	
								// 			}
								// 			else{
								// 				let fields = column._lookupField.split(' ');
								// 				let value = '';
								// 				for (let i = 0; i < fields.length; i ++){
								// 					if (value)
								// 						value += ' ' + (record[fields[i]] || '')
								// 					else
								// 						value = record[fields[i]] || ''
								// 				}
								// 				tableCell.div['textContent'] =  value
								// 				cell._displayValue = value;
								// 				tableCell = null;
								// 			}
								// 		}
								// 	}
								// 	else{
								// 		tableCell.div['textContent'] =  '';
								// 		cell._displayValue = '';
								// 		tableCell = null;
								// 	}
								// }
							}
							else if (_column && _column._type == '{userAccount}'){
								// if (value){
								// 	let name = application.userNameList[value];
								// 	if (name != undefined)
								// 		tableCell.div['textContent'] = name || ''
								// 	else{
								// 		let self = this;
								// 		application.getUserNameList([value], function(){									
								// 			let name = application.userNameList[value];
								// 			tableCell.div['textContent'] = name || ''
								// 			self = null;
								// 		})
								// 	}
								// }
								// else
								// 	tableCell.div['textContent'] =  '';
							}						
							// else if (cell && cell._dataType == 4){
							// 	tableCell.div['textContent'] = formatDateTimeStr(value);
							// }
							// else if (cell && cell._dataType == 2)
							// 	tableCell.div['textContent'] = formatDateStr(value);
							// else if (column && (column._dataType == 4 || column._type == 'dateTime')){							
							// 	tableCell.div['textContent'] = formatDateTimeStr(value);
							// }
							// else if (column && (column._dataType == 3 || column._type == 'time')){
							// 	tableCell.div['textContent'] = formatTimeStr(value);
							// }
							// else if (column && (column._dataType == 2 || column._type == 'date')){
							// 	tableCell.div['textContent'] = formatDateStr(value);
							// }
							// else if (column && column._format){
							// 	tableCell.div['textContent'] = window['numeral'](value)['format'](column._format)	
							// }
							else{														
								let type = typeof (value);
								if (type != 'undefined') {
									if (type == 'number')
										tableCellDiv.textContent = parseNumber(value.toPrecision(12)).toString()
									else {
										tableCellDiv.textContent = value;
									}
								} else
									tableCellDiv.textContent = '';
							}
						}
					}
				}
			} else {
				if ((cell && _cell._checkBox) || (column && _column._checkBox)) {
					tableCellDiv.className = 'check_box_unchecked'
					tableCellDiv.style.position = 'relative';
					tableCellDiv.style.top = '1px';
					tableCellDiv.style.left = '1px';
					tableCellDiv.style['height'] = '13px';
					tableCellDiv.style['width'] = '13px';
				} else if (column && _column._radioButton) {
					tableCellDiv.className = 'radio_button.unchecked'
					tableCellDiv.style.position = 'relative';
					tableCellDiv.style.top = '1px';
					tableCellDiv.style.left = '1px';
					tableCellDiv.style['height'] = '13px';
					tableCellDiv.style['width'] = '13px';
				} else
					tableCellDiv.textContent = '';
			}
		}
	};
    private checkCellReadOnly(col?: number, row?: number): boolean {			
		if (!this._enabled || this._readOnly || this.options._rowSelect)
			return true
		else {
			if (col == undefined)
				col = this._col
			if (row == undefined)
				row = this._row;			
			if ((col < this._fixedCol || row < this._fixedRow) && this.layout != 'card')
				return true;
			let column = this.cols(col);
			if ((<any>column)._readOnly)
				return true			
			else {
				let record = this.getObject(0, row);
				if (record && record['_isReadOnly'])
					return true

				let cell = this.data.cells(col, row)
				if (cell)
					return cell.readOnly || !cell.visible
				else
					return false;
			};
		};
	};
    private toggleCellValue(column: TGridColumn, cell: DataGridCell) {
		if (!this.checkCellReadOnly(cell.col, cell.row)) {
			(<any>cell)._value = !(<any>cell)._value;
			if (this._dataBindingContext) {
				let record = this.getObject(0, (<any>cell)._row);
				let field = this.getObject((<any>cell)._col, 0);
				if (!record && field) {
					record = this._dataBindingContext['append']();
					this.setObject(0, (<any>cell)._row, record);
				}
				if (record && field) {
					record[field] = (<any>cell)._value;
				}
				this.enableUpdateTimer();
			}
			this.updateBindingData(cell, column)
			if (this.onCellChange)
				this.onCellChange(this, cell, !(<any>cell)._value, (<any>cell)._value);
		}
	}
    protected _handleMouseMove(event: MouseEvent): boolean {
		if (application.globalEvents._leftMouseButtonDown){
			// let cell = this.getMouseOverCell(event)
			// if (cell && cell != this.selectedCell){
			// 	this.selectedCell = cell;
			// 	this.selectCellRange(cell)
			// 	if (this['onCellSelect']) 
			// 		this['onCellSelect'](this['__this'], cell);
			// }				
		}			
		if (this._colResizing) {
			// if (self._designMode)
			// 	application.postMessage('$WISONE_IDE_MODULE_CHANGED')
			let pos = getCursorPosX(event);
			this.setColWidth(this.resizeCol, this.origColWidth + (pos - this.mouseDownPosX), true);
			this.showData(100);
			this.highlightCurrCell();
			return true;
		}
        return true;
	}
    protected _handleMouseUp(event: Event): boolean {
		if (this._colResizing) {
			// this.skipContainerClick = true;
			this._colResizing = false;
			this._updateTableSplitter();
		}
		// self.handleDesignEvent = false;
		return true;
	}
    private _handleColumnResizeStart(event: MouseEvent){
        if (this.editorMode) {
            this.hideEditor(true);
        };
        // globalEvents.activeControl = self;
        let pos = getCursorPosX(event);
        this.mouseDownPosX = pos;
        this.resizeCol = this.getActualColIdx((<any>event.target).cellIndex);
        
        this.origColWidth = this.getColWidth(this.resizeCol);
        this._colResizing = true;
        // this.handleDesignEvent = true;
    }
    private _updateTableSplitter(){
        let splitter: any;
        for (let i = this.tableSplitters.length - 1; i < this.visibleColCount; i++) {
			splitter = this.tableSplitters[i];
			if (splitter)
				splitter.style.display = 'none';
		};
		for (let col = 0; col < this.visibleColCount; col++) {
			splitter = this.tableSplitters[col];
			if (!splitter) {
				splitter = this.createElement('div', this);
				this.tableSplitters[col] = splitter;
				splitter.isSpliter = true;
				splitter.owner = this;
				splitter.cellIndex = col;
				splitter.onmousedown = this._handleColumnResizeStart.bind(this);
				this.appendChild(splitter);
				splitter.style.zIndex = 5;
				splitter.style.cursor = 'e-resize';
				splitter.style.position = 'absolute';
				splitter.style.top = '0px';
				splitter.style.width = '6px';
			};  
			let colIdx = this.getActualColIdx(col);
			let left = this.getColRight(colIdx)
			let height = 0;
			for (let row = 0; row < this._fixedRow; row++) {
				height = height + this.getRowHeight(row) + 0.8;
			}
			splitter.style.left = left + 'px';
			if (this._fixedCol > 0 && col == this._fixedCol - 1)
				splitter.style.height = '100%'
			else
				splitter.style.height = height + 'px';
			splitter.style.display = '';
		}
    };
	private _showDataInternalGrid(){		
		if (!this._table)
			return;		
		//load fixed cell value
		for (let r = 0; r < this._fixedRow; r++) {
			for (let c = 0; c < this._fixedCol; c++) {
				let tableCell = this.getTableCell(c, r);
				let column: any = null;
				let row: any = null;
				if (this.columns)
					column = this.columns.getColumn(c);
				if (this.gridRows)
					row = this.gridRows.getRow(r);		
				if (tableCell) {
					let cell = this.data.cells(c, r);
					this._updateCell(tableCell, cell, column, row);
				}
			}
		}
		//load fixed row value
		for (let r = 0; r < this._fixedRow; r++) {
			for (let c = this._fixedCol; c < this.visibleColCount; c++) {
				let row = this.gridRows.getRow(r);
				let tableCell = this.getTableCell(c, r);
				if (tableCell) {
					let cell = this.data.cells(this.getActualColIdx(c), r);
					if (cell)
						tableCell.cell = cell;
					this._updateCell(tableCell, cell, undefined, row);
				}
			}
		}
		//load fixed col value
		for (let r = this._fixedRow; r < this.visibleRowCount; r++) {
			for (let c = 0; c < this._fixedCol; c++) {
				let column = this.columns.getColumn(c);				
				let tableCell = this.getTableCell(c, r);
				if (tableCell) {
					let cell = this.data.cells(c, this.getActualRowIdx(r))
					if (cell)
						tableCell.cell = cell;
					this._updateCell(tableCell, cell, column);
				}
			}
		}		
		//get lookup values
		for (let c = this._fixedCol; c < this.visibleColCount; c++) {
			let colIdx = this.getActualColIdx(c);
			let _column = <any>this.columns.getColumn(colIdx);
			if (_column && (_column._type == 'lookup' || _column._type == 'lookupCombo')){
				// if (!_column._lookupContext)
				// 	let context = this.context
				// else
				// 	let context = this.parentForm[_column._lookupContext];
				// if (context){								
				// 	let rs = context[_column._lookupTable]
				// 	if (rs && _column._lookupKeys){	
				// 		rs['_fetchRecordsByKeyValue'](_column._lookupKeys, true)
				// 		_column._lookupKeys = undefined;
				// 	}
				// }
			}
		}
		//load cell value
		for (let r = this._fixedRow; r < this.visibleRowCount; r++) {
			let rowIdx = this.getActualRowIdx(r);
			for (let c = this._fixedCol; c < this.visibleColCount; c++) {
				let colIdx = this.getActualColIdx(c);
				let column = this.columns.getColumn(colIdx);
				let row = this.gridRows.getRow(rowIdx);			
				let tableCell = this.getTableCell(c, r);
				if (tableCell) {
					let cell = this.data.cells(colIdx, rowIdx);																	
					tableCell.cell = cell;					
					this._updateCell(tableCell, cell, column, row);
				};
			};
		};

		//get and store the cell height
		if (this.options._autoRowHeight) {
			for (let r = 0; r < this.visibleRowCount; r++) {
				if (this._table.rows[r].clientHeight > this._defaultRowHeight) {
					for (let c = 0; c < this.visibleColCount; c++) {
						let tableCell = this.getTableCell(c, r);
						if (tableCell && tableCell.cell) {
							let cell = tableCell.cell;
							let row = this.getActualRowIdx(r);
							if (!cell._height) {
								cell._height = tableCell.div.clientHeight + 3;
							}
							if (!this._rowHeights[row] || this._rowHeights[row] < cell._height) {
								this._rowHeights[row] = cell._height;
							}

						}
					}
				}
			}
		};

		//hide table columns larger than colCount
		let row = this._table.rows[0];
		if (row) {
			if (row.cells.length > (this._colCount - this._leftCol + this._fixedCol)) {
				for (let r = 0; r < this._table.rows.length; r++) {
					let row = this._table.rows[r];
					for (let c = this._colCount - this._leftCol + this._fixedCol; c < row.cells.length; c++) {
						row.cells[c].style.display = 'none';
					};
				};
			};
		};

		//hide table rows larger than rowCount
		if (this._table.rows.length > (this._rowCount - this._topRow + this._fixedRow)) {
			for (let c = this._rowCount - this._topRow + this._fixedRow; c < this._table.rows.length; c++) {
				if (c > -1) {
					this._table.rows[c].style.display = 'none';
				};
			};
		};
		this.highlightCurrCell();
	};
    private showDataInternal(){
		this.showDataFlag = false;
		if (!this.showDataInternalFlag) {
			this.showDataInternalFlag = true;
			try {
				if (this.layout == 'card'){
					// this._updateCardView()
				}
				else
					this._showDataInternalGrid()
			} finally {
				this.showDataInternalFlag = false;
			};
		};
    };
    private _updateTableInternal(updateRowHeightFlag?: boolean, updateColWidthFlag?: boolean){
		if (!this._updateTableInternalFlag) {
			this._updateTableInternalFlag = true;
			try {
				// this.setTopRow(this._topRow)
				if (this.layout == 'card'){
					// this._updateCardView();
				}
				else{
					// if (this._cardPanel){
					// 	this._cardPanel.free();
					// 	this._cardPanel = null;
					// }
										
					if (updateRowHeightFlag) {
						// this.updateRowHeightFlag = false;
						this._updateTotalRowHeight();
					};
					if (updateColWidthFlag) {
						// this.updateColWidthFlag = false;
						this._updateTotalColWidth();
					};

					this.tableCells = [[]];
					if (this._totalColWidth < parseFloat(this.width.toString()))

						this.placeHolder.style.width = '100%'
					else
						this.placeHolder.style.width = this._totalColWidth + 'px';
					this.placeHolder.style.height = this._totalRowHeight + 'px';						
					// this.tableContainer.style.width = this._scrollBox.clientWidth + 'px';				
					// this.tableContainer.style.height = this._scrollBox.clientHeight + 'px';
					this._updateTableRows();
					this._updateTableCols();
					this._updateTableMergedCells();
					this._updateTableSplitter();
				}	
			} catch(err) {
			} finally {
				this._updateTableInternalFlag = false;
			};
		};
    };
    enableUpdateTimer(updateRowHeightFlag?: boolean, updateColWidthFlag?: boolean){        
		updateRowHeightFlag = updateRowHeightFlag || false;
        updateColWidthFlag = updateColWidthFlag || false;
        // this.updateRowHeightFlag = this.updateRowHeightFlag || updateRowHeightFlag;
		// this.updateColWidthFlag = this.updateColWidthFlag || updateColWidthFlag;
		clearTimeout(this._updateTableTimer);
		// if (!this.updateTimer) {
			// this.updateTimerCounter = 0;
			// this.updateCounter = 0;
			this._updateTableTimer = setTimeout(() => {
				// if (this.updateTimerCounter == this.updateCounter) {					
					// clearInterval(this.updateTimer);
					if (this._scrollBox.clientWidth){
						this._updateTableTimer = undefined;
						this._sorting = false;
						if (updateRowHeightFlag)
                            this._rowHeights = [];						
						this._updateTableInternal(updateRowHeightFlag, updateColWidthFlag);
						this.showDataInternal();					
					}					
					else {
						this._updateTableTimer = setTimeout(()=>{
							this._sorting = false;
							if (updateRowHeightFlag)
                                this._rowHeights = [];						
							this._updateTableInternal(updateRowHeightFlag, updateColWidthFlag);
							this.showDataInternal();					
						}, 100)
					}
				// } else
                //     this.updateTimerCounter = this.updateCounter;
			}, 10);
		// }
		// else {
		// 	this.updateCounter++;
		// };
    };
};