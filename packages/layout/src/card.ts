import { customElements, Container } from '@ijstech/base';
import { GridLayout, GridLayoutElement, gridSchemaProps, gridProps } from './grid';
import { GroupType } from '@ijstech/types';

export interface CardLayoutElement extends GridLayoutElement {
    cardMinWidth?: number | string;
    cardHeight?: number | string;
}

@customElements('i-card-layout', {
    icon: 'th',
    group: GroupType.LAYOUT,
    className: 'CardLayout',
    props: {
        ...gridProps,
        cardMinWidth: {type: 'number'},
        cardHeight: {type: 'number'},
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            ...gridSchemaProps,
            cardMinWidth: {
                type: 'number'
            },
            cardHeight: {
                type: 'number'
            }
        }
    }
})
export class CardLayout extends GridLayout {
    private _cardMinWidth: number | string;
    private _cardHeight: number | string;
    constructor(parent?: Container, options?: any) {        
        super(parent, options);        
    }
    static async create(options?: CardLayoutElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }  
    get cardMinWidth(){
        return this._cardMinWidth;
    }
    set cardMinWidth(value: number | string){
        this._cardMinWidth = value;
        this.updateGridTemplateColumns();
    }
    get columnsPerRow(){
        return this._columnsPerRow;
    }
    set columnsPerRow(value: number){
        this._columnsPerRow = value;
        this.updateGridTemplateColumns();
    }
    get cardHeight(){
        return this._cardHeight;
    }
    set cardHeight(value: number | string){
        this._cardHeight = typeof value == 'number' ? value + 'px' : value;
        this.style.gridAutoRows = this._cardHeight;
    }
    updateGridTemplateColumns(){
        if (this.cardMinWidth && this.columnsPerRow) {
            let minmaxFirstParam = (this.gap && this.gap.column) ? `max(${this.cardMinWidth}, calc(100%/${this.columnsPerRow} - ${this.gap.column}))` : `max(${this.cardMinWidth}, 100%/${this.columnsPerRow})`;
            this.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minmaxFirstParam}, 1fr))`;
        }
        else if (this.cardMinWidth) {
            this.style.gridTemplateColumns = `repeat(auto-fill, minmax(min(${this.cardMinWidth}, 100%), 1fr))`;
        }
        else if (this.columnsPerRow) {
            this.style.gridTemplateColumns = `repeat(${this.columnsPerRow}, 1fr)`;
        }
    }
    protected setAttributeToProperty<P extends keyof CardLayout>(propertyName: P){
        const prop = this.getAttribute(propertyName, true);
        if (prop) this[propertyName] = prop;
    }
    protected init() {
        super.init();
        this.autoRowSize = '1fr';
        this.setAttributeToProperty('cardMinWidth');
        this.setAttributeToProperty('cardHeight');
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-card-layout']: CardLayoutElement;
        }
    }
}
