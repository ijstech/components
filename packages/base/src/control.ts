import { Component} from './component';
import { Observe } from './observable';
import {FontStyle, IStack, IFont, ISpace, IOverflow, OverflowType, TextTransform, ComponentProperty, notifyEventParams, CursorType} from './types';
import {ICustomProperties, IAnchor, IBackground, IBorderCornerStyles, IBorderSideStyles, BorderStyleType, IBorder, BorderStylesSideType} from './types';
// import {notifyEventCallback, notifyMouseEventCallback, notifyKeyboardEventCallback, notifyGestureEventCallback} from './types';
import {IGrid, LineHeightType, DockStyle, DisplayType, IControlMediaQuery, PositionType} from './types';
import { getCustomElementProperties} from './utils';
import { disabledStyle, containerStyle, getBorderSideStyleClass, getBorderStyleClass, getOverflowStyleClass, getBackgroundStyleClass, getControlMediaQueriesStyleClass, getOpacityStyleClass } from './style/base.css';
import { I18n } from './i18n';
import { IModule, isModule, ITooltipImpl} from '@ijstech/types';

declare var DOMPurify: any;
function getParentControl(elm: HTMLElement): Control | null {
    if (elm.parentElement instanceof Control) {
        return elm.parentElement
    }
    else if (elm.parentElement)
        return getParentControl(elm.parentElement)
    return null;
};
function getParentModule(elm: HTMLElement): IModule | null {
    let parentElement: any = elm.parentElement;
    if (parentElement && isModule(parentElement as any)) {
        return parentElement
    }
    else if (parentElement)
        return getParentModule(parentElement)
    return null;
};
function getParentControlById(elm: HTMLElement, id: string): Control | null {
    if (elm.parentElement instanceof Control) {
        if ((elm.parentElement as any)[id] instanceof Control)
            return (elm.parentElement as any)[id]
        else
            return getParentControlById(elm.parentElement, id);
    };
    return null;
};
const toNumberValue = (value: string) => {
    return parseFloat(value.replace('px', ''));
}
let _refreshTimeout: any;
function refresh() {
    if (!document.body.style.opacity)
        document.body.style.opacity = '0';
    clearTimeout(_refreshTimeout);
    _refreshTimeout = setTimeout(() => {
        try {
            clearTimeout(_refreshTimeout);
            _refreshTimeout = undefined;
            // let width = window.innerWidth - 1;//document.body.offsetWidth -1;
            // let height = window.innerHeight - 1;//document.body.offsetHeight -1;
            for (let i = 0; i < document.body.childNodes.length; i++) {
                let node = document.body.childNodes[i];
                if (node instanceof Container && node.nodeName !== 'I-MODAL') {
                    node.style.position = 'absolute';
                    // node.style.width = width + 'px';
                    // node.style.height = height + 'px';
                    node.style.width = '100%';
                    node.style.height = '100%';
                    // node.style.overflowX = 'hidden'; moved to body
                    // node.parent = null;
                    node.refresh();
                }
            }
        }
        finally {
            document.body.style.opacity = '1';
        }
    }, 10)
};
window.addEventListener('resize', () => {
    refresh();
});
export type SpaceProps = 'margin' | 'padding';
export class SpaceValue implements ISpace {
    private _value: ISpace;
    private _prop: SpaceProps;
    private _owner: Control;
    constructor(owner: Control, value: ISpace, prop: SpaceProps) {
        this._owner = owner;
        this._value = value;
        this._prop = prop;
        this.update();
    };
    get left() {
        return this._value.left;
    };
    set left(value) {
        this._value.left = value;
        this.update();
    };
    get top() {
        return this._value.top;
    };
    set top(value) {
        this._value.top = value;
        this.update();
    };
    get right() {
        return this._value.right;
    };
    set right(value) {
        this._value.right = value;
        this.update();
    };
    get bottom() {
        return this._value.bottom;
    };
    set bottom(value) {
        this._value.bottom = value;
        this.update();
    };
    getSpacingValue(value: string | number) {
        if (value === '') return '0px';
        const isNumber = !Number.isNaN(Number(value));
        if (typeof value === 'number' || isNumber) return value + 'px';
        if (value === 'auto') return value;
        const unit = value.replace(/^-?\d+(\.\d+)?/g, '');
        const number = value.replace(unit, '');
        const isValidUnit = ['px', 'em', 'rem', '%'].includes(unit);
        return isValidUnit ? value : `${number}px`;
    };
    update(value?: ISpace) {
        if (value) this._value = value
        const { top = 0, right = 0, bottom = 0, left = 0 } = this._value;
        switch (this._prop) {
            case 'margin':
                // this._owner.margin = this._value;
                this._owner.style.margin = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
                break;
            case 'padding':
                // if (this._owner instanceof Container)
                //     this._owner.padding = this._value;
                this._owner.style.padding = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
                break;
        };
    };
};

// const DefaultBorderCornerStyles: IBorderCornerStyles = {
//     radius: undefined
// }
const DefaultBorderSideStyles: IBorderSideStyles = {
    width: undefined,
    style: undefined,
    color: undefined
}
const DefaultAnchor: IAnchor = { top: true, left: true, right: false, bottom: false };
export class Border {
    private _target: Control;
    private _styleClassMap: {[key: string]: string} = {};
    private _radius: string;
    private _width: string;
    private _style: BorderStyleType;
    private _color: string;
    private _top: IBorderSideStyles;
    private _right: IBorderSideStyles;
    private _bottom: IBorderSideStyles;
    private _left: IBorderSideStyles;
    // private _topLeft: IBorderCornerStyles;
    // private _topRight: IBorderCornerStyles;
    // private _bottomLeft: IBorderCornerStyles;
    // private _bottomRight: IBorderCornerStyles;

    constructor(target: Control, options?: IBorder) {
        this._target = target;
        if (options) this.updateValue(options);
    }

    updateValue(options: IBorder) {
        if (options && Object.keys(options).length) {
            this.updateAllSidesProps(options);
        } else {
            this.removeStyles();
        }
    }

    private isNumber(value: number|string|undefined) {
        if (value === undefined || value === '') return false;
        return !Number.isNaN(Number(value));
    }

    protected updateAllSidesProps(options: IBorder){
        this._width = this.isNumber(options.width) ? options.width + 'px' : (options.width as string) || '';
        this._style = options.style || 'solid';
        this._color = options.color || '';
        this._radius = this.isNumber(options.radius) ? options.radius + 'px' : (options.radius as string) || '';
        this._top = options.top || {};
        this._right = options.right || {};
        this._bottom = options.bottom || {};
        this._left = options.left || {};

        this.setBorderStyles({
            width: this._width,
            style: this._style,
            color: this._color,
            radius: this._radius,
            top: this._top,
            right: this._right,
            bottom: this._bottom,
            left: this._left
        });
    }
    private removeStyles() {
        this.removeStyleClass('left');
        this.removeStyleClass('bottom');
        this.removeStyleClass('right');
        this.removeStyleClass('top');
        this.removeStyleClass('style');
        this.removeStyleClass('color');
        this.removeStyleClass('radius');
        this.removeStyleClass('width');
    }

    get radius(): string {
        return this._radius;
    }    
    set radius(value: string | number) {
        if (this.isNumber(value)) {
            this._radius = value + 'px';
            this._target.style.borderRadius = value + 'px';
        } else if (typeof value === 'string') {
            this._radius = value;
            this._target.style.borderRadius = value;
        }
    }
    get width(): string {
        return this._width;
    }    
    set width(value: string | number) {
        if (this.isNumber(value)) {
            this._width = value + 'px';
        }
        else if (typeof value === 'string') {
            this._width = value;
        }
        this.setBorderProp('width', this._width);
    }  
    get style(): BorderStyleType {
        return this._style;
    }    
    set style(value: BorderStyleType) {
        this._style = value;
       this.setBorderProp( 'style', this._style);
    } 
    get color(): string {
        return this._color;
    }    
    set color(value: string) {
        this._color = value;
        this.setBorderProp('color', this._color);
    } 
    get top(): Readonly<IBorderSideStyles> {
        if (!this._top) {
            this._top = {...DefaultBorderSideStyles};
        }
        return this._top;
    }    
    set top(value: IBorderSideStyles) {
        this._top = value;
        this.setSideBorderStyles('top', value);
    } 
    get right(): Readonly<IBorderSideStyles> {
        if (!this._right) {
            this._right = {...DefaultBorderSideStyles};
        }
        return this._right;
    }    
    set right(value: IBorderSideStyles) {
        this._right = value;
        this.setSideBorderStyles('right', value);
    } 
    get bottom(): Readonly<IBorderSideStyles> {
        if (!this._bottom) {
            this._bottom = {...DefaultBorderSideStyles};
        }
        return this._bottom;
    }    
    set bottom(value: IBorderSideStyles) {
        this._bottom = value;
        this.setSideBorderStyles('bottom', value);
    }    
    get left(): Readonly<IBorderSideStyles> {
        if (!this._left) {
            this._left = {...DefaultBorderSideStyles};
        }
        return this._left;
    }    
    set left(value: IBorderSideStyles) {
        this._left = value;
        this.setSideBorderStyles('left', value);
    }     
    protected removeStyleClass(name: string){
        const style = this._styleClassMap[name];
        if (style) {
            this._target.classList.remove(style);
            delete this._styleClassMap[name];
        }
    }
    protected setSideBorderStyles(side: BorderStylesSideType, value?: IBorderSideStyles) {
        if (value && (value.width !== undefined || value.style || value.color !== undefined)) {
            let style = getBorderSideStyleClass(side, value);
            this.removeStyleClass(side);
            this._styleClassMap[side] = style;
            this._target.classList.add(style);
        }
    }
    protected setBorderStyles(value: IBorder) {
        let style = getBorderStyleClass(value);
        this.removeStyles();
        this._styleClassMap['width'] = style;
        this._styleClassMap['style'] = style;
        this._styleClassMap['color'] = style;
        this._styleClassMap['radius'] = style;
        this._target.classList.add(style);
    }

    private setBorderProp(prop: string, value: any) {
        let style = getBorderStyleClass({ [prop]: value });
        this.removeStyleClass('left');
        this.removeStyleClass('bottom');
        this.removeStyleClass('right');
        this.removeStyleClass('top');
        this.removeStyleClass(prop);
        this._styleClassMap[prop] = style;
        this._target.classList.add(style);
    }
}
export class Overflow implements IOverflow {
    private _target: Control;
    private _value: IOverflow;
    private _style: string;
    constructor(target: Control, value?: IOverflow | OverflowType) {
        this._target = target;
        if (value) {
            this.updateValue(value);
            this.setOverflowStyle();
        }
    };
    get x(): OverflowType {
        return this._value?.x??"visible";
    }
    set x(value: OverflowType) {
        if (!this._value) {
            this._value = { x: value };
        } else {
            this._value.x = value;
        }
        this.setOverflowStyle();
    }
    get y(): OverflowType {
        return this._value?.y??"visible";
    }
    set y(value: OverflowType) {
        if (!this._value) {
            this._value = { x: value };
        } else {
            this._value.y = value;
        }
        this.setOverflowStyle();
    }
    private updateValue (value: IOverflow | OverflowType) {
        if (typeof value === 'string') {
            this._value = { x: value, y: value };
        } else {
            this._value = value;
        }
    }
    setOverflowStyle(value?: IOverflow | OverflowType) {
        if (value) {
            this.updateValue(value);
        }
        let style = getOverflowStyleClass(this._value);
        if (this._style) {
            this._target.classList.remove(this._style)
        }
        this._style = style;
        this._target.classList.add(style);
    }
}
export class Background implements IBackground {
    private _target: Control;
    private _value: IBackground;
    private _style: string;
    constructor(target: Control, value?: IBackground) {
        this._target = target;
        value && this.setBackgroundStyle(value);
    };
    get color(): string {
        return this._value?.color || '';
    }
    set color(value: string) {
        if (!this._value) {
            this._value = { color: value };
        } else {
            this._value.color = value;
        }
        this.setBackgroundStyle();
    }
    get image(): string {
        return this._value?.image || '';
    }
    set image(value: string) {
        if (!this._value) {
            this._value = { image: value };
        } else {
            this._value.image = value;
        }
        this.setBackgroundStyle();
    }
    private updateValue (value: IBackground) {
        this._value = value;
    }
    setBackgroundStyle(value?: IBackground) {
        value && this.updateValue(value);
        let style = getBackgroundStyleClass(this._value);
        this._style && this._target.classList.remove(this._style);
        this._style = style;
        this._target.classList.add(style);
    }
}

function removeFirstAndLastCharacter(value: string): string {
    return value.substring(1, value.length - 1);
};
export const ControlProperties: ICustomProperties = {
    props: {
        dock: {type: 'string', default: 'none', values: ['none', 'fill', 'left', 'top', 'right', 'bottom']},
        top: {type: 'number', default: 'auto'},
        left: {type: 'number', default: 'auto'},
        right: {type: 'number', default: 'auto'},
        bottom: {type: 'number', default: 'auto'},
        width: {type: 'number', default: 'auto'},
        height: {type: 'number', default: 'auto'},
        minWidth: {type: 'number', default: 'auto'},
        minHeight: {type: 'number', default: 'auto'},
        maxWidth: {type: 'number', default: 'auto'},
        maxHeight: {type: 'number', default: 'auto'},
        visible: {type: 'boolean', default: true},
        enabled: {type: 'boolean', default: true},
        background: {type: 'object', default: {color: '', image: ''}},
        margin: {type: 'object', default: {}},
        padding: {type: 'object', default: {}},
        opacity: {type: 'string', default: '1'},
        position: {type: 'string', default: ''},
        overflow: {type: 'object', default: {x: '', y: ''}},
        zIndex: {type: 'string', default: ''},
        border: {type: 'object', default: {}},
        display: {type: 'string', default: ''},
        mediaQueries: { type: 'array', default: [] },
        font: {type: 'object', default: {style: 'normal', transform: 'unset'}},
        stack: {type: 'object', default: {basis: '', grow: '', shrink: ''}},
        class: {type: 'string'},
        cursor: {type: 'string', default: 'auto'},
        boxShadow: {type: 'string', default: ''},
    },
    events: {
        onClick: notifyEventParams,
        onContextMenu: notifyEventParams,
        onDblClick: notifyEventParams,
        onFocus: notifyEventParams,
        onKeyDown: notifyEventParams,
        onKeyUp: notifyEventParams,
        onMouseDown: notifyEventParams,
        onMouseMove: notifyEventParams,
        onMouseUp: notifyEventParams
    }
};
export interface IContextMenu {
    show(pos: {x: number, y: number}): void;
};
export type notifyEventCallback = (target: Control, event: Event)=>void;
export type notifyMouseEventCallback = (target: Control, event: MouseEvent)=>void;
export type notifyKeyboardEventCallback = (target: Control, event: KeyboardEvent)=>void;
export type notifyGestureEventCallback = (target: Control, event: PointerEvent|MouseEvent|TouchEvent)=>void;
export class Control extends Component {
    protected _controls: Control[] = [];
    protected _parentModule: IModule | null;
    protected _enabled: boolean = true;
    protected _onClick: notifyMouseEventCallback;
    protected _onContextMenu: notifyMouseEventCallback;
    protected _onDblClick: notifyMouseEventCallback;
    protected _onFocus: notifyEventCallback;
    protected _onKeyDown: notifyKeyboardEventCallback;
    protected _onKeyUp: notifyKeyboardEventCallback;
    protected _onMouseDown: notifyGestureEventCallback;
    protected _onMouseMove: notifyGestureEventCallback;
    protected _onMouseUp: notifyGestureEventCallback;
    protected _onObserverChanged: (target: Control, event?: Event)=>void;
    
    // protected _paddingLeft = 0;
    // protected _paddingTop = 0;
    // protected _paddingRight = 0;
    // protected _paddingBottom = 0;
    // protected _marginLeft = 0;
    // protected _marginTop = 0;
    // protected _marginRight = 0;
    // protected _marginBottom = 0;
    // protected _anchorLeft = true;
    // protected _anchorTop = true;
    // protected _anchorRight = false;
    // protected _anchorBottom = false;
    protected _visible = true;
    protected _margin: SpaceValue;
    protected _padding: SpaceValue;
    protected _stack: IStack;
    protected _grid: IGrid;
    protected _lineHeight: LineHeightType;
    protected _parent: Control | undefined;
    protected _dock: DockStyle;
    protected _linkTo: Control;
    protected _border: Border;
    protected _overflow: Overflow;
    protected _anchor: IAnchor;
    protected _background: Background;
    protected _resizer: ContainerResizer;        
    private _tooltip: ITooltipImpl;
    protected _font: IFont;
    protected _display: DisplayType;
    protected _cursor: CursorType;
    protected _letterSpacing: string|number;
    protected _boxShadow: string;
    private _cmediaQueries: IControlMediaQuery[];
    protected _mediaStyle: string;
    protected _contextMenuId: string | null; //context menu id
    protected _contextMenuControl: Control | null; //context menu object
    private _opacity: string;
    protected _zIndex: string;
    protected _designMode: boolean = false;
    protected propertyClassMap: Record<string, string> = {};

    public _container?: HTMLElement;
    public tag: any;
    // public data: any;

    protected static async create(options?: any, parent?: Container, defaults?: any) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    };
    constructor(parent?: Control, options?: any, defaults?: any) {
        super(parent, options, defaults);
        // if (parent instanceof Container)
        // if (parent)
        this.parent = parent
    };
    get parentModule(): IModule | null {
        if (!this._parentModule){
            this._parentModule = getParentModule(this);
        };
        return this._parentModule;
    };
    _setDesignPropValue(prop: string, value: string|number|boolean|object, breakpointProp?: any){
        super._setDesignPropValue(prop, value, breakpointProp);
        if (ControlProperties.props[prop] && prop !== 'mediaQueries'){
            if (typeof breakpointProp === 'object' && typeof value === 'object') {
                (this as any)[prop] = {...value, ...breakpointProp};
            }
            else (this as any)[prop] = breakpointProp ?? value;
        };
    };
    _getCustomProperties(): ICustomProperties{
        let result: ICustomProperties = {
            props: {},
            events: {}
        };
        for (let n in ComponentProperty.props)
            result.props[n] = ComponentProperty.props[n];
        for (let n in ComponentProperty.events)
            result.events[n] = ComponentProperty.events[n];

        for (let n in ControlProperties.props)
            result.props[n] = ControlProperties.props[n];
        for (let n in ControlProperties.events)
            result.events[n] = ControlProperties.events[n];

        let propInfo = getCustomElementProperties(this.tagName);
        if (propInfo){
            result.tagName = propInfo.tagName;
            result.className = propInfo.className;
            result.icon = propInfo.icon;
            for (let n in propInfo.props)
                result.props[n] = propInfo.props[n]
            for (let n in propInfo.events)
                result.events[n] = propInfo.events[n]
        };
        result.dataSchema = JSON.parse(JSON.stringify(propInfo?.dataSchema || {}));
        return result;
    };
    private getMarginStyle() {
        const computedStyle = window.getComputedStyle(this);
        const left = toNumberValue(computedStyle.marginLeft);
        const right = toNumberValue(computedStyle.marginRight);
        const bottom = toNumberValue(computedStyle.marginBottom);
        const top = toNumberValue(computedStyle.marginTop);
        return { top, right, bottom, left };
    }
    private getPaddingStyle() {
        const computedStyle = window.getComputedStyle(this);
        const left = toNumberValue(computedStyle.paddingLeft);
        const right = toNumberValue(computedStyle.paddingRight);
        const bottom = toNumberValue(computedStyle.paddingBottom);
        const top = toNumberValue(computedStyle.paddingTop);
        return { top, right, bottom, left };
    }
    protected xssSanitize(value: string): string{
        //TODO: sanitize untrusted script to prevent XSS attacks
        //https://github.com/cure53/DOMPurify
        return DOMPurify.sanitize(value);
    };
    get contextMenu(): Control | null {
        if (this._contextMenuId && !this._contextMenuControl)
            this._contextMenuControl = getParentControlById(this, this._contextMenuId);
        return this._contextMenuControl
    };
    set contextMenu(value: string | Control | null) {
        if (typeof value === 'string'){
            this._contextMenuId = value;
            this._contextMenuControl = null;
        } else if (value instanceof Control){
            this._contextMenuId = value.id;
            this._contextMenuControl = value;
        }
        else{
            this._contextMenuId = null;
            this._contextMenuControl = null;
        };
    };
    get margin(): ISpace {
        return this._margin;
    }
    set margin(value: ISpace) {
        if (!this._margin)
            this._margin = new SpaceValue(this, value, 'margin')
        else
            this._margin.update(value);
        // const { top = 0, right = 0, bottom = 0, left = 0 } = value;
        // this.style.margin = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
        // const margin = this.getMarginStyle();
        // this._marginLeft = margin.left;
        // this._marginTop = margin.top;
        // this._marginRight = margin.right;
        // this._marginBottom = margin.bottom;
    }
    protected get marginStyle() {
        return (side: BorderStylesSideType) => this.getMarginStyle()[side]
    }
    get padding(): ISpace {
        return this._padding;
    }
    set padding(value: ISpace) {
        if (!this._padding)
            this._padding = new SpaceValue(this, value, 'padding')
        else
            this._padding.update(value);
        // const { top = 0, right = 0, bottom = 0, left = 0 } = value;
        // this.style.padding = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
        // const padding = this.getPaddingStyle();
        // this._paddingLeft = padding.left;
        // this._paddingTop = padding.top;
        // this._paddingRight = padding.right;
        // this._paddingBottom = padding.bottom;
    }
    protected get paddingStyle() {
        return (side: BorderStylesSideType) => this.getPaddingStyle()[side]
    }
    protected addChildControl(control: Control){
        if (!control.parentNode)
            this.appendChild(control);
    }
    protected removeChildControl(control: Control){
        if (this.contains(control)) 
            this.removeChild(control);
    }
    get parent(): Control | undefined {
        return this._parent;
    }
    set parent(value: Control | undefined) {
        if (value && value._controls.indexOf(this) < 0)
            value._controls.push(this);

        if (this._parent != value) {
            if (this._parent) {
                if (this._parent._controls.indexOf(this) > -1) 
                    this._parent._controls.splice(this._parent._controls.indexOf(this), 1);
                // if (this._parent.contains(this)) 
                //     this._parent.removeChild(this);
                this._parent.removeChildControl(this);
                if (!_refreshTimeout)
                    this._parent.refresh();
            };
            this._parent = value;
            if (this._parent) {
                this._parent.addChildControl(this)
                // this._parent.controls.push(this);
                // if (this.parentNode != value) {
                //     this._parent.appendChild(this);
                    if (!_refreshTimeout)
                        this._parent.refresh()
                // }
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        refresh();
        if (!this.mediaQueries)
            this.setAttributeToProperty('mediaQueries');
    };
    disconnectedCallback(){
        if (this._tooltip) {
            this._tooltip.close();
        }
        // this.parent = undefined;
        super.disconnectedCallback();
    }
    protected getParentHeight(): number {
        if (!this._parent)
            return window.innerHeight
        else if (this._parent._container)
            return this._parent._container.offsetHeight
        else
            return this._parent.offsetHeight;
    };
    protected getParentWidth(): number {
        if (!this._parent)
            return window.innerWidth
        else if (this._parent._container)
            return this._parent._container.offsetWidth
        else {
            return this._parent.offsetWidth;
        }
    };
    protected getParentOccupiedLeft(): number {
        if (!this._parent)
            return 0
        else {
            let result = this._parent.paddingStyle('left');
            for (let i = 0; i < this._parent._controls.length; i++) {
                let control = this._parent._controls[i];
                if (control === this) {
                    if (this.dock == 'left')
                        return result;
                }
                else if (control.visible && control.dock == 'left') {
                    result += control.offsetWidth + control.marginStyle('left');
                }
            };
            return result;
        };
    };
    protected getParentOccupiedRight(): number {
        if (!this._parent)
            return 0
        else {
            let result = this._parent.paddingStyle('right');
            for (let i = 0; i < this._parent._controls.length; i++) {
                let control = this._parent._controls[i];
                if (control === this) {
                    if (this.dock == 'right')
                        return result;
                }
                else if (control.dock == 'right') {
                    result += control.offsetWidth + control.marginStyle('right');
                }
            };
            return result;
        };
    };
    protected getParentOccupiedBottom(): number {
        if (!this._parent)
            return 0
        else {
            let result = this._parent.paddingStyle('bottom');
            for (let i = 0; i < this._parent._controls.length; i++) {
                let control = this._parent._controls[i];
                if (control === this) {
                    if (this.dock == 'bottom')
                        return result;
                }
                else if (control.visible && control.dock == 'bottom') {
                    result += control.offsetHeight + control.marginStyle('bottom');
                }
            };
            return result;
        };
    };
    protected getParentOccupiedTop(): number {
        if (!this._parent)
            return 0
        else {
            let result = this._parent.paddingStyle('top');
            for (let i = 0; i < this._parent._controls.length; i++) {
                let control = this._parent._controls[i];
                if (control === this) {
                    if (this.dock == 'top')
                        return result;
                }
                else if (control.visible && control.dock == 'top') {
                    result += control.offsetHeight + control.marginStyle('top');
                }
            };
            return result;
        };
    };
    get dock(): DockStyle {
        return this._dock || ''
    }
    set dock(value: DockStyle) {
        this._dock = value;
        if (this._resizer)
            this._resizer.reset();
    }
    get enabled(): boolean {
        return this._enabled;
    }
    set enabled(value: boolean) {
        if (this._enabled != value) {
            this._enabled = value;
            if (value) {
                this.classList.remove('disabled');
                this.classList.remove(disabledStyle);
            }
            else {
                this.classList.add('disabled');
                this.classList.add(disabledStyle);
            }
        }
    }
    protected _handleClick(event: MouseEvent, stopPropagation?: boolean): boolean{
        if (this._onClick && typeof this._onClick === 'function') {                        
            this._onClick(this, event)
            return true;
        }
        else if (!stopPropagation){
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleClick = parent._handleClick.bind(parent);
            return parent._handleClick(event);
        }
        else
            return true;
    }
    protected _handleContextMenu(event: MouseEvent, stopPropagation?: boolean): boolean {
        let contextMenu = this.contextMenu;
        if (contextMenu) {
            (contextMenu as any).show({x: event.clientX, y: event.clientY});
        };

        if (this._onContextMenu) {
            this._onContextMenu(this, event)
            return true;
        }
        else if (!stopPropagation && !contextMenu) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleContextMenu = parent._handleContextMenu.bind(parent);
            return parent._handleContextMenu(event);
        }
        else
            return true;
    };
    protected _handleDblClick(event: MouseEvent, stopPropagation?: boolean): boolean {
        if (this._onDblClick) {                        
            this._onDblClick(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleDblClick = parent._handleDblClick.bind(parent);
            return parent._handleDblClick(event);
        }
        else
            return true;
    }
    protected _handleFocus(event: Event, stopPropagation?: boolean): boolean{
        if (this._onFocus) {                        
            this._onFocus(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleFocus = parent._handleFocus.bind(parent);
            return parent._handleFocus(event);
        }
        else
            return true;
    };
    protected _handleKeyDown(event: KeyboardEvent, stopPropagation?: boolean): boolean | undefined {
        if (this._onKeyDown) {                        
            this._onKeyDown(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleKeyDown = parent._handleKeyDown.bind(parent);
            return parent._handleKeyDown(event);
        }
        else
            return true;
    };
    protected _handleKeyUp(event: KeyboardEvent, stopPropagation?: boolean): boolean | undefined {
        if (this._onKeyUp) {                        
            this._onKeyUp(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleKeyUp = parent._handleKeyUp.bind(parent);
            return parent._handleKeyUp(event);
        }
        else
            return true;
    };
    protected _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
        if (this._onMouseDown) {                        
            this._onMouseDown(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleMouseDown = parent._handleMouseDown.bind(parent);
            return parent._handleMouseDown(event);
        }
        else
            return true;
    };
    protected _handleMouseMove(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
        if (this._onMouseMove) {                        
            this._onMouseMove(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleMouseMove = parent._handleMouseMove.bind(parent);
            return parent._handleMouseMove(event);
        }
        else
            return true;
    };
    protected _handleMouseUp(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean | undefined {
        if (this._onMouseUp) {                        
            this._onMouseUp(this, event)
            return true;
        }
        else if (!stopPropagation) {
            let parent = getParentControl(this);
            if(!parent) return false;
            parent._handleMouseUp = parent._handleMouseUp.bind(parent);
            return parent._handleMouseUp(event);
        }
        else
            return true;
    }
    get maxWidth(): number|string {
        return this.style.maxWidth
    }
    set maxWidth(value: number|string) {
        if (!isNaN(Number(value))) {
            this.style.maxWidth = value + 'px';
        }
        else {
            this.style.maxWidth = value + "";
        }
    }
    get minWidth(): string | number {
        return this.style.minWidth;
    }
    set minWidth(value: string | number) {
        if (!isNaN(Number(value))) {
            this.style.minWidth = value + 'px';
        }
        else {
            this.style.minWidth = value + "";
        }
    }
    get designMode(): boolean {
        return this._designMode ?? false;
    }
    set designMode(value: boolean) {
        this._designMode = value ?? false;
        if (this._tooltip) this._tooltip.designMode = value;
    }
    observables(propName: string): any {
        let self = <any>this;
        if (self['$observables'] && self['$observables'][propName])
            return self['$observables'][propName]
    }
    get onClick(): notifyMouseEventCallback {
        return this._onClick;
    }
    set onClick(callback: notifyMouseEventCallback) {
        this._onClick = callback;
    }
    get onContextMenu(): notifyMouseEventCallback {
        return this._onContextMenu;
    }
    set onContextMenu(callback: notifyMouseEventCallback) {
        this._onContextMenu = callback;
    }
    get onDblClick(): notifyMouseEventCallback {
        return this._onDblClick;
    }
    set onDblClick(callback: notifyMouseEventCallback) {
        this._onDblClick = callback;
    }
    get onMouseDown(): notifyGestureEventCallback {
        return this._onMouseDown;
    };
    set onMouseDown(callback: notifyGestureEventCallback) {
        this._onMouseDown = callback;
    };
    get onMouseUp(): notifyGestureEventCallback {
        return this._onMouseUp;
    };
    set onMouseUp(callback: notifyGestureEventCallback) {
        this._onMouseUp = callback;
    };
    set onObserverChanged(callback: (target: Control, event?: Event)=>void) {
        if (!this._onObserverChanged) this._onObserverChanged = callback;
    }
    get onObserverChanged(): (target: Control, event?: Event)=>void {
        return this._onObserverChanged;
    };
    clearInnerHTML() {
        this.innerHTML = '';
    };
    refresh() {
        if (this._dock != null) {
            // this.style.position = 'absolute';
            if (!this.position) this.style.position = 'absolute';
            switch (this.dock) {
                case 'none': {
                    if (this.anchor.top === false)
                        this.top = (this.getParentHeight() - this.offsetHeight) / 2;
                    if (this.anchor.left === false)
                        this.left = (this.getParentWidth() - this.offsetWidth) / 2;
                    break;
                }
                case 'left': {
                    let top = this.getParentOccupiedTop();
                    this.top = top;// + this.marginStyle('top');
                    this.left = this.getParentOccupiedLeft();
                    this.height = this.getParentHeight() - top - this.getParentOccupiedBottom() - this.marginStyle('top') - this.marginStyle('bottom');
                    break;
                }
                case 'top': {
                    this.top = this.getParentOccupiedTop();
                    this.width = this.getParentWidth();
                    if (this.anchor.left)
                        this.left = 0
                    else
                        this.left = (this.getParentWidth() - this.offsetWidth) / 2
                    break;
                }
                case 'right': {
                    let top = this.getParentOccupiedTop();
                    this.top = top;
                    this.left = this.getParentWidth() - this.getParentOccupiedRight() - this.offsetWidth
                    this.height = this.getParentHeight() - top - this.getParentOccupiedBottom();
                    break;
                }
                case 'bottom':
                    this.top = this.getParentHeight() - this.getParentOccupiedBottom() - this.offsetHeight;
                    this.left = 0;
                    this.width = this.getParentWidth();
                    break;
                case 'fill':
                    this.width = this.getParentWidth() - this.getParentOccupiedLeft() - this.getParentOccupiedRight();
                    this.height = this.getParentHeight() - this.getParentOccupiedTop() - this.getParentOccupiedBottom();
                    this.left = this.getParentOccupiedLeft();
                    this.top = this.getParentOccupiedTop();
                    break;
                case 'center':
                    this.left = (this.getParentWidth() - this.offsetWidth) / 2;
                    this.top = (this.getParentHeight() - this.offsetHeight) / 2;
                    break;
            }
        };
    }
    get resizable(): boolean {
        return this.attrs['resizer'] == true && ['left', 'top', 'right', 'bottom'].indexOf(this.dock) >= 0;
    }
    protected setProperty(propName: string, value: any) {
        if (value?.__target) {
            let target = value.__target;
            let path = value.__path;
            (<any>this)[propName] = target[path[0]];
            Observe(target.observables(path[0]), (changes) => {
                let change = changes[0];
                (<any>this)[propName] = change.value;
            })
        }
        else {
            this.setAttribute(propName, value)
        }
    }
    protected setAttributeToProperty<P extends keyof Control>(propertyName: P){
        const prop = this.getAttribute(propertyName, true);
        if (prop !== null && prop !== undefined) 
            this[propertyName] = prop;
    }
    protected init() {        
        super.init();
        this.setAttributeToProperty('height');
        this.setAttributeToProperty('left');
        this.setAttributeToProperty('top');  
        this.setAttributeToProperty('right');
        this.setAttributeToProperty('bottom');
        this.setAttributeToProperty('width');
        this.setAttributeToProperty('dock');
        this.setAttributeToProperty('margin');
        this.setAttributeToProperty('padding');
        this.setAttributeToProperty('tag');
        this.setAttributeToProperty('anchor');
        this.setAttributeToProperty('contextMenu')

        // this._marginLeft = this.getPositionAttribute('marginLeft', true, 0);
        // this._marginTop = this.getPositionAttribute('marginTop', true, 0);
        // this._marginRight = this.getPositionAttribute('marginRight', true, 0);
        // this._marginBottom = this.getPositionAttribute('marginBottom', true, 0);
        // this._paddingLeft = this.getPositionAttribute('paddingLeft', true, 0);
        // this._paddingTop = this.getPositionAttribute('paddingTop', true, 0);
        // this._paddingRight = this.getPositionAttribute('paddingRight', true, 0);
        // this._paddingBottom = this.getPositionAttribute('paddingBottom', true, 0);

        // this._anchorLeft = this.getAttribute('anchorLeft', true, true);
        // this._anchorTop = this.getAttribute('anchorTop', true, true);
        // this._anchorRight = this.getAttribute('anchorRight', true, false);
        // this._anchorBottom = this.getAttribute('anchorBottom', true, false);

        this.setAttributeToProperty('maxWidth');
        this.setAttributeToProperty('minWidth');
        this.setAttributeToProperty('stack');
        this.setAttributeToProperty('grid');
        this.setAttributeToProperty('display');
        this.setAttributeToProperty('position');

        if ((this._left != null || this._top != null) && !this.position)
            this.style.position = 'absolute';

        if (this.getAttribute('enabled') !== false)
            this.classList.add('enabled')
        else
            this.enabled = false;

        if (this.getAttribute('visible') == false)
            this.visible = false;

        this.setAttributeToProperty('background');
        this.setAttributeToProperty('zIndex');
        this.setAttributeToProperty('lineHeight');
        this.setAttributeToProperty('linkTo');
        this.setAttributeToProperty('maxHeight');
        this.setAttributeToProperty('minHeight');
        this.setAttributeToProperty('opacity');

        const tooltip = this.getAttribute('tooltip', true);
        if (tooltip && !this._tooltip){
            let constructor = window.customElements.get('i-tooltip');
            if (constructor){
                let t: any = new constructor(this);
                this._tooltip = t;
            }
        };        
        // tooltip && (this._tooltip = new Tooltip(this))

        const font = this.getAttribute('font', true);
        font && (this.font = font);

        let border: IBorder = this.getAttribute('border', true);
        if (border) {
            this.border = new Border(this, border);
        }

        this.setAttributeToProperty('overflow');
        this.setAttributeToProperty('cursor');
        this.setAttributeToProperty('letterSpacing');
        this.setAttributeToProperty('boxShadow');
        this.setAttributeToProperty('designMode');
        // this.setAttributeToProperty('mediaQueries');
        // this.addEventListener('click', this._handleClick.bind(this));
        // this.addEventListener('dblclick', this._handleDblClick.bind(this));
        // this.addEventListener('oncontextmenu', this._handleContextMenu.bind(this));
    }
    protected setElementPosition(elm: HTMLElement, prop: any, value: any) {
        if (value != null && !isNaN(value)) {
            (<any>this)['_' + prop] = parseFloat(value);
            elm.style[prop] = parseFloat(value) + 'px'
        }
        else if (value != null) {
            (<any>this)['_' + prop] = value;
            elm.style[prop] = value
        }
    }
    protected setPosition(prop: any, value: any) {
        if (value != null && !isNaN(value)) {
            (<any>this)['_' + prop] = parseFloat(value);
            this.style[prop] = parseFloat(value) + 'px'
        }
        else if (value != null) {
            (<any>this)['_' + prop] = value;
            this.style[prop] = value
        };
    };
    get height(): number | string {
        return <any>(!isNaN(<any>this._height) ? this._height : this.offsetHeight)
    };
    set height(value: number | string) {
        this.setPosition('height', value);
    };
    get heightValue(): number{
        if (typeof(this._height) == 'string')
            return parseInt(this._height, 10)
        else
            return this._height;
    };
    get left(): number | string {
        return <string>(!isNaN(<any>this._left) ? this._left : this.offsetLeft)
    }
    set left(value: number | string) {
        if (!this.dock)
            this.dock = 'none';
        this.setPosition('left', value);
    }
    set right(value: number | string) {
        if (!this.dock)
            this.dock = 'none';
        this.setPosition('right', value);
    }
    set bottom(value: number | string) {
        if (!this.dock)
            this.dock = 'none';
        this.setPosition('bottom', value);
    }
    get top(): number | string {
        return <any>(!isNaN(<any>this._top) ? this._top : this.offsetTop)
    }
    set top(value: number | string) {
        if (!this.dock)
            this.dock = 'none';
        this.setPosition('top', value);
    }
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this._visible = value;
        if (!this._visible)
            this.style.display = 'none'
        else if (this._left != null || this._top != null)
            this.style.display = ''
        else if (this.style.display === 'none')
            this.style.display = ''
        if (this._parent && !_refreshTimeout)
            this._parent.refresh();
    }
    get width(): number | string {
        return <any>(!isNaN(<any>this._width) ? this._width : this.offsetWidth)
    }
    set width(value: number | string) {
        this.setPosition('width', value);
    }
    get widthValue(): number{
        if (typeof(this._width) == 'string')
            return parseInt(this._width, 10)
        else
            return this._width;
    };
    get stack(): IStack {
        return this._stack
    }
    set stack(value: IStack) {
        this._stack = value;
        this.style.flexBasis = value.basis || '';
        this.style.flexGrow = value.grow || '';
        this.style.flexShrink = value.shrink || '';
    }
    get grid(): IGrid {
        return this._grid;
    }
    set grid(value: IGrid) {
        this._grid = value;
        if (value.column && value.columnSpan) this.style.gridColumn = value.column + ' / span ' + value.columnSpan;
        else if (value.column) this.style.gridColumnStart = value.column.toString();
        else if (value.columnSpan) this.style.gridColumn = 'span ' + value.columnSpan;
        if (value.row && value.rowSpan) this.style.gridRow = value.row + ' / span ' + value.rowSpan;
        else if (value.row) this.style.gridRowStart = value.row.toString();
        else if (value.rowSpan) this.style.gridRow = 'span ' + value.rowSpan;
        if (value.area) this.style.gridArea = value.area;
        if (value.horizontalAlignment) this.style.justifyContent = value.horizontalAlignment;
        if (value.verticalAlignment) this.style.alignItems = value.verticalAlignment;
    }
    get background(): Background {
        if (!this._background) {
            this._background = new Background(this);
        }
        return this._background;
    }
    set background(value: IBackground) {
        if (!this._background) {
            this._background = new Background(this, value);
        } else {
            this._background.setBackgroundStyle(value);
        }
    }
    get zIndex(): string {
        return this._zIndex;
    }
    set zIndex(value: string | number) {
        this.style.zIndex = value + "";
        this._zIndex = value + "";
    }
    get lineHeight(): LineHeightType {
        return this._lineHeight
    }
    set lineHeight(value: LineHeightType) {
        this._lineHeight = value;
        this.style.lineHeight = "" + value;
    }
    get linkTo(): Control {
        return this._linkTo;
    }
    set linkTo(value: Control) {
        this._linkTo = value;
    }
    get position(): PositionType {
        return this.style.position as PositionType;
    }
    set position(value: PositionType) {
        this.style.position = value;
    }
    get maxHeight(): string | number {
        return this.style.maxHeight;
    }
    set maxHeight(value: string | number) {
        if (!isNaN(Number(value))) {
            this.style.maxHeight = value + 'px';
        }
        else {
            this.style.maxHeight = value + "";
        }
    }
    get minHeight(): string | number {
        return this.style.minHeight;
    }
    set minHeight(value: string | number) {
        if (!isNaN(Number(value))) {
            this.style.minHeight = value + 'px';
        }
        else {
            this.style.minHeight = value + "";
        }
    }// TODO: fix
    get border(): Border {
        if (!this._border) {
            this._border = new Border(this)
        }
        return this._border;
    }
    set border(value: IBorder) {
        if (!this.border) {
            this._border = new Border(this, value);
        } else {
            this._border.updateValue(value);
        }
    }
    get overflow(): Overflow {
        if (!this._overflow) {
            this._overflow = new Overflow(this)
        }
        return this._overflow;
    }
    set overflow(value: OverflowType | IOverflow) {
        if (!this._overflow) {
            this._overflow = new Overflow(this, value);
        } else {
            this._overflow.setOverflowStyle(value);
        }
    }
    get tooltip(): any {
        if (!this._tooltip) {
            let constructor = window.customElements.get('i-tooltip');
            if (constructor){
                let t: any = new constructor(this);
                this._tooltip = t;
            };
            // this._tooltip = new Tooltip(this);
            this._tooltip.designMode = this.designMode;
        }
        return this._tooltip;
    }
    get font(): IFont{
        return {
            color: this.style.color,
            name: this.style.fontFamily,
            size: this.style.fontSize,
            bold: this.style.fontStyle.indexOf('bold') >= 0,
            style: this.style.fontStyle as FontStyle,
            transform: this.style.textTransform as TextTransform,
            weight: this.style.fontWeight,
            shadow: this.style.textShadow
        }
    }
    set font(value: IFont){
        this.style.color = value.color || '';
        this.style.fontSize = value.size || '';
        this.style.fontFamily = value.name || '';
        this.style.fontStyle = value.style || '';
        this.style.textTransform = value.transform || 'none';
        this.style.fontWeight = value.bold ? 'bold' : `${value.weight || ''}`;
        this.style.textShadow = value.shadow || 'none';
    }
    get display(): DisplayType {
        return this._display;
    }
    set display(value: DisplayType) {
        this._display = value;
        this.style.display = this.visible === false ? 'none' : value;
    }
    get anchor(): IAnchor {
        return this._anchor || DefaultAnchor;
    }
    set anchor(value: IAnchor) {
        const data = { ...DefaultAnchor, ...value }
        this._anchor = data;
    }
    get opacity(): string {
        return this._opacity;
    }
    set opacity(value: number | string) {
        this._opacity = typeof value === 'string' ? value : `${value}`;
        if (this._opacity) {
            const style = getOpacityStyleClass(value);
            this.setStyle('opacity', style);
        }
        else {
            this.removeStyle('opacity');
        }
    }
    get cursor(): CursorType {
        return this.style.cursor as CursorType;
    }
    set cursor(value: CursorType) {
        this.style.cursor = value;
    }
    get letterSpacing(): string|number {
        return this.style.letterSpacing;
    }
    set letterSpacing(value: string|number) {
        if (!isNaN(Number(value))) {
            this.style.letterSpacing = value + 'px';
        }
        else {
            this.style.letterSpacing = value + "";
        }
    }
    get boxShadow(): string {
        return this.style.boxShadow;
    }
    set boxShadow(value: string) {
        this.style.boxShadow = value;
    }
    get mediaQueries(){
        return this._cmediaQueries;
    }
    set mediaQueries(value: IControlMediaQuery[]){
        this._cmediaQueries = value;
        let style = getControlMediaQueriesStyleClass(this._cmediaQueries, {display: this.display});
        this._mediaStyle && this.classList.remove(this._mediaStyle);
        this._mediaStyle = style;
        this.classList.add(style);
    }
    protected removeStyle<P extends keyof Control>(propertyName: P){
        let style = this.propertyClassMap[propertyName];
        if (style) this.classList.remove(style);
    }
    protected setStyle<P extends keyof Control>(propertyName: P, value: string){
        this.removeStyle(propertyName);
        if (value) {
            this.propertyClassMap[propertyName] = value;
            this.classList.add(value);
        }
    }
    updateLocale(i18n: I18n): void{
    };
};
export class ContainerResizer {
    private target: Container;
    private _resizer: HTMLSpanElement | undefined;
    private _mouseDownPos: { x: number, y: number };
    private _origWidth: number;
    private _origHeight: number;
    private _mouseDownHandler: any;
    private _mouseUpHandler: any;
    private _mouseMoveHandler: any;
    constructor(target: Container) {
        this.target = target;
        this._mouseDownHandler = this.handleMouseDown.bind(this);
        this._mouseUpHandler = this.handleMouseUp.bind(this);
        this._mouseMoveHandler = this.handleMouseMove.bind(this);
    };
    reset() {
        if (!this.target.resizable && this._resizer) {
            this._resizer.removeEventListener('mousedown', this._mouseDownHandler);
            this.target.removeChild(this._resizer);
            this._resizer = undefined;
        }
        else if (this.target.resizable) {
            switch (this.target.dock) {
                case 'left':
                    this.resizer.classList.value = 'resizer e-resize'
                    break;
                case 'top':
                    this.resizer.classList.value = 'resizer s-resize'
                    break;
                case 'right':
                    this.resizer.classList.value = 'resizer w-resize'
                    break;
                case 'bottom':
                    this.resizer.classList.value = 'resizer n-resize'
                    break;
            };
        };
    };
    private handleMouseDown(e: MouseEvent) {
        // e.preventDefault();
        // e.stopPropagation();
        this.target.classList.add('resizing');
        this._origHeight = this.target.offsetHeight;
        this._origWidth = this.target.offsetWidth;
        if (this._resizer) {            
            this._resizer.classList.add('highlight');
            this._mouseDownPos = {
                x: e.clientX,
                y: e.clientY
            };
            document.addEventListener('mousemove', this._mouseMoveHandler);
            document.addEventListener('mouseup', this._mouseUpHandler);
        }
    };
    private handleMouseMove(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        let offsetX = e.clientX - this._mouseDownPos.x;
        let offsetY = e.clientY - this._mouseDownPos.y;
        switch (this.target.dock) {
            case 'left':
                this.target.style.width = (this._origWidth + offsetX) + 'px'
                this.target.parent?.refresh();
                break;
            case 'top':
                this.target.style.height = (this._origHeight + offsetY) + 'px'
                this.target.parent?.refresh();
                break;
            case 'right':
                this.target.style.width = (this._origWidth - offsetX) + 'px'
                this.target.parent?.refresh();
                break;
            case 'bottom':
                this.target.style.height = (this._origHeight - offsetY) + 'px'
                this.target.parent?.refresh();
                break;
        }
    };
    private handleMouseUp(e: MouseEvent) {
        document.removeEventListener('mousemove', this._mouseMoveHandler);
        document.removeEventListener('mouseup', this._mouseUpHandler);
        // e.preventDefault();
        // e.stopPropagation();
        this.target.classList.remove('resizing');
        if (this._resizer)
            this._resizer.classList.remove('highlight');
    };
    private get resizer(): HTMLSpanElement {
        if (!this._resizer) {
            this._resizer = document.createElement('span');
            this.target.appendChild(this._resizer);
            this._resizer.addEventListener('mousedown', this._mouseDownHandler);
        };
        return this._resizer;
    };
};
export class Container extends Control {
    get controls(): Control[]{
        return this._controls;
    }
    get resizer(): boolean {
        return this.attrs['resizer'] == true
    };
    set resizer(value: boolean) {
        this.attrs['resizer'] = value;
        if (this.resizable && !this._resizer)
            this._resizer = new ContainerResizer(this);
        if (this._resizer)
            this._resizer.reset();
    }
    protected init(): void {
        super.init();
        this.classList.add(containerStyle);

        if (this.resizable && !this._resizer) {
            this._resizer = new ContainerResizer(this);
            this._resizer.reset();
        };
    };
    protected refreshControls() {
        for (let i = 0; i < this._controls.length; i++)
            this._controls[i].refresh();
    };
    refresh(skipRefreshControls?: boolean): void {
        super.refresh();
        for (let i = 0; i < this.childNodes.length; i++) {
            let node = this.childNodes[i];
            if (node instanceof Control) {
                node.parent = this;
            };
        };
        if (!skipRefreshControls)
            this.refreshControls();
    };
    updateLocale(i18n: I18n): void{
        for (let i = 0; i < this._controls.length; i++)
            this._controls[i].updateLocale(i18n);
    };
};
