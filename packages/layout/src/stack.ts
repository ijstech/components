import {Container, ContainerElement, customElements, IMediaQuery, PositionType, IControlMediaQueryProps, setAttributeToProperty} from '@ijstech/base';
import {alignItemsCenterStyle, alignItemsEndStyle, alignItemsStartStyle, alignItemsStretchStyle, vStackStyle, hStackStyle, justifyContentCenterStyle, justifyContentEndStyle, justifyContentSpaceBetweenStyle, justifyContentStartStyle, getStackDirectionStyleClass, getStackMediaQueriesStyleClass, alignSelfStretchStyle, alignSelfStartStyle, alignSelfCenterStyle, alignSelfEndStyle, alignSelfAutoStyle, getHoverStyleClass, alignContentSpaceAroundStyle, alignContentSpaceBetweenStyle, alignContentStretchStyle, alignContentStartStyle, alignContentCenterStyle, alignContentEndStyle, justifyContentSpaceAroundStyle, justifyContentSpaceEvenlyStyle, alignItemsBaselineStyle} from './style/panel.css';
import {IHover} from './interfaces';
import { GroupType } from '@ijstech/types';

export interface IStackMediaQueryProps extends IControlMediaQueryProps {
    direction?: StackDirectionType;
    gap?: number | string;
    justifyContent?: StackJustifyContentType;
    alignItems?: StackAlignItemsType;
    alignSelf?: StackAlignSelfType;
    reverse?: boolean;
}

export type IStackMediaQuery = IMediaQuery<IStackMediaQueryProps>;
export type StackWrapType = 'nowrap'|'wrap'|'wrap-reverse'|'initial'|'inherit';
export type StackDirectionType = 'horizontal' | 'vertical';
export type StackJustifyContentType = "start"|"center"|"end"|"space-between"|"space-around"|"space-evenly";
export type StackAlignItemsType = "stretch"|"start"|"center"|"end"|"baseline";
export type StackAlignSelfType = "auto"|"stretch"|"start"|"center"|"end";
export type StackAlignContentType = "auto"|"stretch"|"start"|"center"|"end"|"space-between"|"space-around"|"space-evenly";
export interface StackLayoutElement extends ContainerElement{
    gap?: number | string;
    wrap?: StackWrapType;
    direction?: StackDirectionType;
    justifyContent?: StackJustifyContentType;
    alignItems?: StackAlignItemsType;
    alignSelf?: StackAlignSelfType;
    alignContent?: StackAlignSelfType;
    reverse?: boolean;
    mediaQueries?: IStackMediaQuery[];
    hover?: IHover;
}

export type HStackHAlignmentType = StackJustifyContentType;
export type HStackVAlignmentType = StackAlignItemsType;
export type VStackHAlignmentType = StackAlignItemsType;
export type VStackVAlignmentType = StackJustifyContentType;

export interface HStackElement extends StackLayoutElement{
    horizontalAlignment?: HStackHAlignmentType;
    verticalAlignment?: HStackVAlignmentType;
}
export interface VStackElement extends StackLayoutElement{
    horizontalAlignment?: VStackHAlignmentType;
    verticalAlignment?: VStackVAlignmentType;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-stack']: StackLayoutElement
        }
    }
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-hstack']: HStackElement
        }
    }
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-vstack']: VStackElement
        }
    }
}

export type StackLayoutAlignmentType<T extends StackDirectionType> = 
    T extends 'horizontal' ? HStackHAlignmentType : VStackHAlignmentType;
export type StackVerticalAlignmentType<T extends StackDirectionType> = 
    T extends 'horizontal' ? HStackVAlignmentType : VStackVAlignmentType;

const DEFAULT_VALUES = {
    wrap: 'nowrap',
    direction: 'horizontal',
    justifyContent: 'start',
    alignItems: 'stretch',
    alignSelf: 'start',
    alignContent: 'start',
    reverse: false
}

@customElements('i-stack', {
    icon: 'layer-group',
    group: GroupType.LAYOUT,
    className: 'StackLayout',
    props: {
        gap: {type: 'number'},
        wrap: {type: 'string', default: DEFAULT_VALUES.wrap},
        direction: {type: 'string', default: DEFAULT_VALUES.direction},
        justifyContent: {type: 'string', default: DEFAULT_VALUES.justifyContent},
        alignItems: {type: 'string', default: DEFAULT_VALUES.alignItems},
        alignSelf: {type: 'string', default: DEFAULT_VALUES.alignSelf},
        alignContent: {type: 'string', default: DEFAULT_VALUES.alignContent},
        reverse: {type: 'boolean', default: DEFAULT_VALUES.reverse}
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            gap: {
                type: 'number'
            }
        }
    }
})
export class StackLayout extends Container {
    private _gap: number | string;
    private _wrap: StackWrapType;
    private _direction: StackDirectionType;
    private _reverse: boolean = false;
    private _justifyContent: StackJustifyContentType;
    private _alignItems: StackAlignItemsType;
    private _alignSelf: StackAlignSelfType;
    private _alignContent: StackAlignContentType;
    private _mediaQueries: IStackMediaQuery[];
    private _hover: IHover;

    constructor(parent?: Container, options?: any) {        
        super(parent, options);        
    }
    static async create(options?: StackLayoutElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    } 
    get direction(): StackDirectionType {
        return this._direction;
    }
    set direction(value: StackDirectionType) {
        this._direction = value;
        if (value) {
            let style = getStackDirectionStyleClass(value, this.reverse);
            this.setStyle('direction', style);
        }
    }
    get reverse() {
        return this._reverse ?? false;
    }
    set reverse(value: boolean) {
        this._reverse = value ?? false;
        let style = getStackDirectionStyleClass(this.direction, this.reverse);
        this.setStyle('direction', style);
    }
    get justifyContent(): StackJustifyContentType {
        return this._justifyContent;
    }
    set justifyContent(value: StackJustifyContentType) {
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
    get alignItems(): StackAlignItemsType {
        return this._alignItems;
    }
    set alignItems(value: StackAlignItemsType) {
        this._alignItems = value || 'stretch';
        switch (this._alignItems) {
            case 'stretch':
                this.setStyle('alignItems', alignItemsStretchStyle);
                break;
            case 'baseline':
                this.setStyle('alignItems', alignItemsBaselineStyle);
                break;           
            case 'start':
                this.setStyle('alignItems', alignItemsStartStyle);
                break;              
            case 'center':
                this.setStyle('alignItems', alignItemsCenterStyle);
                break;
            case 'end':
                this.setStyle('alignItems', alignItemsEndStyle);
                break;         
        }
    }
    get alignSelf(): StackAlignSelfType {
        return this._alignSelf;
    }
    set alignSelf(value: StackAlignSelfType) {
        this._alignSelf = value || 'auto';
        switch (this._alignSelf) {
            case 'auto':
                this.setStyle('alignSelf', alignSelfAutoStyle);
                break; 
            case 'stretch':
                this.setStyle('alignSelf', alignSelfStretchStyle);
                break;              
            case 'start':
                this.setStyle('alignSelf', alignSelfStartStyle);
                break;              
            case 'center':
                this.setStyle('alignSelf', alignSelfCenterStyle);
                break;
            case 'end':
                this.setStyle('alignSelf', alignSelfEndStyle);
                break;                
        }
    }

    get alignContent(): StackAlignContentType {
        return this._alignContent;
    }
    set alignContent(value: StackAlignContentType) {
        this._alignContent = value || 'auto';
        switch (this._alignContent) {
            case 'space-between':
                this.setStyle('alignContent', alignContentSpaceBetweenStyle);
                break;
            case 'space-around':
                this.setStyle('alignContent', alignContentSpaceAroundStyle);
                break; 
            case 'stretch':
                this.setStyle('alignContent', alignContentStretchStyle);
                break;              
            case 'start':
                this.setStyle('alignContent', alignContentStartStyle);
                break;              
            case 'center':
                this.setStyle('alignContent', alignContentCenterStyle);
                break;
            case 'end':
                this.setStyle('alignContent', alignContentEndStyle);
                break;                
        }
    }

    get gap(): number | string {
        return this._gap;
    }
    set gap(value: number | string) {
        this._gap = value || 'initial';
        const num = +this._gap;
        if (!isNaN(num)) {
            this.style.gap = this._gap + 'px';
        }
        else {
            this.style.gap = `${this._gap}`;
        }
    }  
    get wrap(): StackWrapType {
        return this._wrap;
    }
    set wrap(value: StackWrapType) {
        if (!value) return;
        this._wrap = value;
        this.style.flexWrap = this._wrap;
    } 
    get mediaQueries(){
        return this._mediaQueries;
    }
    set mediaQueries(value: IStackMediaQuery[]){
        this._mediaQueries = value;
        let style = getStackMediaQueriesStyleClass(this._mediaQueries, this.direction);
        this._mediaStyle && this.classList.remove(this._mediaStyle);
        this._mediaStyle = style;
        this.classList.add(style);
    }   
    get hover(): IHover{
        return this._hover;
    }
    set hover(value: IHover){
        this._hover = value;
        if (this._hover) {
            const hoverStyle = getHoverStyleClass(this._hover);
            this.setStyle('hover', hoverStyle);
        }
        else {
            this.removeStyle('hover');
        }
    }
    protected removeStyle<P extends keyof StackLayout>(propertyName: P){
        let style = this.propertyClassMap[propertyName];
        if (style) this.classList.remove(style);
    }
    protected setStyle<P extends keyof StackLayout>(propertyName: P, value: string){
        this.removeStyle(propertyName);
        if (value) {
            this.propertyClassMap[propertyName] = value;
            this.classList.add(value);
        }
    }
    protected init() {
        super.init();
        setAttributeToProperty(this, 'reverse');
        setAttributeToProperty(this, 'direction', 'horizontal');
        setAttributeToProperty(this, 'justifyContent');
        setAttributeToProperty(this, 'alignItems');
        setAttributeToProperty(this, 'alignSelf');
        setAttributeToProperty(this, 'alignContent');
        setAttributeToProperty(this, 'gap');
        setAttributeToProperty(this, 'wrap');
        setAttributeToProperty(this, 'mediaQueries');
        setAttributeToProperty(this, 'hover');
    }
}

@customElements('i-hstack', {
    icon: 'square',
    group: GroupType.LAYOUT,
    className: 'HStack',
    props: {
        gap: {type: 'number'},
        wrap: {type: 'string', default: DEFAULT_VALUES.wrap},
        justifyContent: {type: 'string', default: DEFAULT_VALUES.justifyContent},
        alignItems: {type: 'string', default: DEFAULT_VALUES.alignItems},
        alignSelf: {type: 'string', default: DEFAULT_VALUES.alignSelf},
        alignContent: {type: 'string', default: DEFAULT_VALUES.alignContent},
        reverse: {type: 'boolean', default: DEFAULT_VALUES.reverse}
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            gap: {
                type: 'number'
            }
        }
    }
})
export class HStack extends StackLayout {
    private _horizontalAlignment: HStackHAlignmentType;
    private _verticalAlignment: HStackVAlignmentType;
    constructor(parent?: Container, options?: any) {        
        super(parent, options);        
    }
    get horizontalAlignment(): HStackHAlignmentType {
        return this._horizontalAlignment;
    }
    set horizontalAlignment(value: HStackHAlignmentType) {
        this._horizontalAlignment = value || 'start';
        this.justifyContent = value;
    }
    get verticalAlignment(): HStackVAlignmentType {
        return this._verticalAlignment;
    }
    set verticalAlignment(value: HStackVAlignmentType) {
        this._verticalAlignment = value || 'stretch';
        this.alignItems = value;
    }
    protected init() {
        super.init();
        this.direction = 'horizontal';
        setAttributeToProperty(this, 'horizontalAlignment');
        setAttributeToProperty(this, 'verticalAlignment');
    }

    static async create(options?: HStackElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }     
}

@customElements('i-vstack', {
    icon: 'square',
    group: GroupType.LAYOUT,
    className: 'VStack',
    props: {
        gap: {type: 'number'},
        wrap: {type: 'string', default: DEFAULT_VALUES.wrap},
        justifyContent: {type: 'string', default: DEFAULT_VALUES.justifyContent},
        alignItems: {type: 'string', default: DEFAULT_VALUES.alignItems},
        alignSelf: {type: 'string', default: DEFAULT_VALUES.alignSelf},
        alignContent: {type: 'string', default: DEFAULT_VALUES.alignContent},
        reverse: {type: 'boolean', default: DEFAULT_VALUES.reverse}
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            gap: {
                type: 'number'
            }
        }
    }
})
export class VStack extends StackLayout {
    private _horizontalAlignment: VStackHAlignmentType;
    private _verticalAlignment: VStackVAlignmentType;
    constructor(parent?: Container, options?: any) {        
        super(parent, options);        
    }
    get horizontalAlignment(): VStackHAlignmentType {
        return this._horizontalAlignment;
    }
    set horizontalAlignment(value: VStackHAlignmentType) {
        this._horizontalAlignment = value || 'stretch';
        this.alignItems = value;
    }
    get verticalAlignment(): VStackVAlignmentType {
        return this._verticalAlignment;
    }
    set verticalAlignment(value: VStackVAlignmentType) {
        this._verticalAlignment = value || 'start';
        this.justifyContent = value;
    }  
    init() {
        super.init();
        this.direction = 'vertical';
        setAttributeToProperty(this, 'horizontalAlignment');
        setAttributeToProperty(this, 'verticalAlignment');
    }

    static async create(options?: VStackElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }    
}