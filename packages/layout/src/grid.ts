import { Control, customElements, ControlElement, Container, IMediaQuery, DisplayType, IBackground, IControlMediaQueryProps} from '@ijstech/base';
import { getGridLayoutMediaQueriesStyleClass, getTemplateAreasStyleClass, getTemplateColumnsStyleClass, getTemplateRowsStyleClass, gridStyle, justifyContentCenterStyle, justifyContentEndStyle, justifyContentSpaceBetweenStyle, justifyContentStartStyle, justifyContentSpaceAroundStyle, justifyContentSpaceEvenlyStyle } from './style/panel.css';
import { GroupType } from '@ijstech/types';

export interface IGap {
    row?: string | number;
    column?: string | number;
}

export interface IGridLayoutMediaQueryProps extends IControlMediaQueryProps {
    templateColumns?: string[];
    templateRows?: string[];
    templateAreas?: string[][];
    justifyContent?: GridLayoutJustifyContentType;
    display?: DisplayType;
    gap?: IGap;
    background?: IBackground;
};

export type IGridLayoutMediaQuery = IMediaQuery<IGridLayoutMediaQueryProps>;
export type GridLayoutHorizontalAlignmentType = "stretch" | "start" | "end" | "center";
export type GridLayoutJustifyContentType = "start"|"center"|"end"|"space-between"|"space-around"|"space-evenly";
export type GridLayoutVerticalAlignmentType = "stretch" | "start" | "end" | "center" | "baseline";
export interface GridLayoutElement extends ControlElement {
    autoColumnSize?: string;
    autoFillInHoles?: boolean;
    autoRowSize?: string;
    columnsPerRow?: number;
    gap?: IGap;
    horizontalAlignment?: GridLayoutHorizontalAlignmentType;
    justifyContent?: GridLayoutJustifyContentType;
    mediaQueries?: IGridLayoutMediaQuery[];
    templateAreas?: string[][];
    templateColumns?: string[];
    templateRows?: string[];
    verticalAlignment?: GridLayoutVerticalAlignmentType;
}

const DEFAULT_VALUES = {
    autoFillInHoles: false,
    columnsPerRow: 1,
    horizontalAlignment: 'start',
    verticalAlignment: 'start',
    gap: {}
}

export const gridSchemaProps: any = {
    templateColumns: {
        type: 'array',
        items: {type: 'string'}
    },
    templateRows: {
        type: 'array',
        items: {type: 'string'}
    },
    templateAreas: {
        type: 'array',
        items: {type: 'array', items: {type: 'string'}}
    },
    autoColumnSize: {
        type: 'string',
        default: ''
    },
    autoRowSize: {
        type: 'string',
        default: ''
    },
    columnsPerRow: {
        type: 'number',
        default: DEFAULT_VALUES.columnsPerRow
    },
    gap: {
        type: 'object',
        properties: {
            row: {
                type: 'string',
                default: ''
            },
            column: {
                type: 'string',
                default: ''
            }
        }
    },
    autoFillInHoles: {
        type: 'boolean',
        default: DEFAULT_VALUES.autoFillInHoles
    },
    horizontalAlignment: {
        type: 'string',
        enum: ['stretch', 'start', 'end', 'center'],
        default: DEFAULT_VALUES.horizontalAlignment
    },
    verticalAlignment: {
        type: 'string',
        enum: ['stretch', 'start', 'end', 'center', 'baseline'],
        default: DEFAULT_VALUES.verticalAlignment
    }
}

export const gridProps: any = {
    templateColumns: {type: 'array'},
    templateRows: {type: 'array'},
    templateAreas: {type: 'array'},
    autoColumnSize: {type: 'string', default: ''},
    autoRowSize: {type: 'string', default: ''},
    columnsPerRow: {type: 'number', default: DEFAULT_VALUES.columnsPerRow},
    gap: {type: 'object'},
    autoFillInHoles: {type: 'boolean', default: DEFAULT_VALUES.autoFillInHoles},
    horizontalAlignment: {type: 'string', default: DEFAULT_VALUES.horizontalAlignment},
    verticalAlignment: {type: 'string', default: DEFAULT_VALUES.verticalAlignment},
};

@customElements('i-grid-layout', {
    icon: 'th',
    group: GroupType.LAYOUT,
    className: 'GridLayout',
    props: {
        ...gridProps
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {...gridSchemaProps}
    }
})
export class GridLayout extends Container {
    private _templateColumns: string[];
    private _templateRows: string[];
    private _templateAreas: string[][];
    private _autoColumnSize: string;
    private _autoRowSize: string;
    protected _columnsPerRow: number;
    private _gap: IGap;
    private _horizontalAlignment: GridLayoutHorizontalAlignmentType;
    private _verticalAlignment: GridLayoutVerticalAlignmentType;
    private _autoFillInHoles: boolean;
    private _mediaQueries: IGridLayoutMediaQuery[];
    private _styleClassMap: {[key: string]: string} = {};
    private _justifyContent: GridLayoutJustifyContentType;

    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
        this.removeStyleClass = this.removeStyleClass.bind(this);
    }
    static async create(options?: GridLayoutElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }  
    get templateColumns(){
        return this._templateColumns;
    }
    set templateColumns(columns: string[]){
        this._templateColumns = columns;
        this.removeStyleClass('columns')
        if (columns) {
            let style = getTemplateColumnsStyleClass(columns);
            this._styleClassMap['columns'] = style;
            this.classList.add(style);
        }
    }
    get templateRows(){
        return this._templateRows;
    }
    set templateRows(rows: string[]){
        this._templateRows = rows;
        this.removeStyleClass('rows')
        if (rows) {
            let style = getTemplateRowsStyleClass(rows);
            this._styleClassMap['rows'] = style;
            this.classList.add(style);
        }
    }
    get templateAreas(){
        return this._templateAreas;
    }
    set templateAreas(value: string[][]){
        this._templateAreas = value;
        this.removeStyleClass('areas')
        if (value) {
            let style = getTemplateAreasStyleClass(value);
            this._styleClassMap['areas'] = style;
            this.classList.add(style);
        }
    }
    get autoColumnSize(){
        return this._autoColumnSize;
    }
    set autoColumnSize(value: string){
        this._autoColumnSize = value;
        if (value) {
            this.style.gridAutoColumns = value;
        }
    }
    get autoRowSize(){
        return this._autoRowSize;
    }
    set autoRowSize(value: string){
        this._autoRowSize = value;
        if (value) {
            this.style.gridAutoRows = value;
        }
    }
    get columnsPerRow(){
        return this._columnsPerRow;
    }
    set columnsPerRow(value: number){
        this._columnsPerRow = value;
        this.style.gridTemplateColumns = `repeat(${this._columnsPerRow}, 1fr)`;
    }
    get gap(){
        return this._gap;
    }
    set gap(value: IGap){
        this._gap = value;
        if (value) {
            if (value.row) {
                if (typeof value.row == 'number') {
                    this.style.rowGap = value.row + 'px';
                }
                else {
                    this.style.rowGap = value.row;
                }
            }
            if (value.column) {
                if (typeof value.column == 'number') {
                    this.style.columnGap = value.column + 'px';
                }
                else {
                    this.style.columnGap = value.column;
                }
            }
        }
    }
    get horizontalAlignment(){
        return this._horizontalAlignment;
    }
    set horizontalAlignment(value: GridLayoutHorizontalAlignmentType){
        this._horizontalAlignment = value;
        this.style.justifyItems = value;
    }
    protected removeStyle<P extends keyof GridLayout>(propertyName: P){
        let style = this.propertyClassMap[propertyName];
        if (style) this.classList.remove(style);
    }
    protected setStyle<P extends keyof GridLayout>(propertyName: P, value: string){
        this.removeStyle(propertyName);
        if (value) {
            this.propertyClassMap[propertyName] = value;
            this.classList.add(value);
        }
    }
    get justifyContent(): GridLayoutJustifyContentType {
        return this._justifyContent;
    }
    set justifyContent(value: GridLayoutJustifyContentType) {
        this._justifyContent = value || 'start';
        switch (this._justifyContent) {
            case 'start':
                this.setStyle('justifyContent', justifyContentStartStyle);
                break;    
            case 'center':
                this.setStyle('justifyContent', justifyContentCenterStyle);
                break;                   
            case 'end':
                this.setStyle('justifyContent', justifyContentEndStyle);
                break;                           
            case 'space-between':
                this.setStyle('justifyContent', justifyContentSpaceBetweenStyle);
                break;
            case 'space-around':
                this.setStyle('justifyContent', justifyContentSpaceAroundStyle);
                break;
            case 'space-evenly':
                this.setStyle('justifyContent', justifyContentSpaceEvenlyStyle);
                break;
        }
    }
    get verticalAlignment(){
        return this._verticalAlignment;
    }
    set verticalAlignment(value: GridLayoutVerticalAlignmentType){
        this._verticalAlignment = value;
        this.style.alignItems = value;
    }
    get autoFillInHoles(){
        return this._autoFillInHoles;
    }
    set autoFillInHoles(value: boolean){
        this._autoFillInHoles = value;
        this.style.gridAutoFlow = this._autoFillInHoles ? 'dense' : 'row';
    }    
    get mediaQueries(){
        return this._mediaQueries;
    }
    set mediaQueries(value: IGridLayoutMediaQuery[]){
        this._mediaQueries = value;
        let style = getGridLayoutMediaQueriesStyleClass(this._mediaQueries);
        this._mediaStyle && this.classList.remove(this._mediaStyle);
        this._mediaStyle = style;
        this.classList.add(style);
    }      
    protected setAttributeToProperty<P extends keyof GridLayout>(propertyName: P){
        const prop = this.getAttribute(propertyName, true);
        // if (this.id=='thisPnl') {console.log(propertyName, prop)}
        if (prop) this[propertyName] = prop;
    }  
    protected removeStyleClass(name: string){
        if (this._styleClassMap && this._styleClassMap[name]) {
            this.classList.remove(this._styleClassMap[name]);
            delete this._styleClassMap[name];
        }
    }
    protected init() {
        super.init();
        this._styleClassMap = {};
        this.classList.add(gridStyle);
        this.setAttributeToProperty('templateColumns');
        this.setAttributeToProperty('templateRows');
        this.setAttributeToProperty('templateAreas');
        this.setAttributeToProperty('gap');
        this.setAttributeToProperty('horizontalAlignment');
        this.setAttributeToProperty('verticalAlignment');
        this.setAttributeToProperty('columnsPerRow');
        this.setAttributeToProperty('autoFillInHoles');
        this.setAttributeToProperty('autoColumnSize');
        this.setAttributeToProperty('autoRowSize');
        this.setAttributeToProperty('mediaQueries');
        this.setAttributeToProperty('justifyContent');
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-grid-layout']: GridLayoutElement;
        }
    }
}
