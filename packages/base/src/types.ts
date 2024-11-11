import { JSONSchema, GroupType, IModule} from '@ijstech/types';
export interface IComponent {
    connectedCallback(): void;
    createElement(tagName: string, parentElm?: HTMLElement): HTMLElement;
    disconnectedCallback(): void;
    getAttribute(name: string, removeAfter?: boolean, defaultValue?: any): any;
    getPositionAttribute(name: string, removeAfter?: boolean, defaultValue?: any): number;
    getStyleAttribute(name: string, removeAfter?: boolean, defaultValue?: any): string;
    id: string;
    initialized: boolean;
    initializing: boolean;
    ready(): Promise<void>;
    uuid: string;
};
export type PositionType = 'static'|'relative'|'absolute'|'fixed'|'sticky'|'inherit'|'initial';
export type BorderStylesSideType = 'top'|'right'|'bottom'|'left';
export type BorderStyleType = 'none'|'hidden'|'dotted'|'dashed'|'solid'|'double'|'groove'|'ridge'|'inset'|'outset'
export interface IBorderCornerStyles {
    radius?: string | number;
}
export interface IBorderSideStyles {
    width?: string | number;
    style?: BorderStyleType;
    color?: string;
}
export interface IBorder extends IBorderSideStyles, IBorderCornerStyles {
    top?: IBorderSideStyles;
    right?: IBorderSideStyles;
    bottom?: IBorderSideStyles;
    left?: IBorderSideStyles;
    topLeft?: IBorderCornerStyles;
    topRight?: IBorderCornerStyles;
    bottomLeft?: IBorderCornerStyles;
    bottomRight?: IBorderCornerStyles;
}
export interface IAnchor {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
};
export interface IBackground {
    color?: string;
    image?: string;
};
export interface IFont{
    name?: string;
    size?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    style?: FontStyle;
    transform?: TextTransform;
    underline?: boolean;
    weight?: number|string;
    shadow?: string;
};
export interface ISpace{
    top?: string|number;
    right?: string|number;
    bottom?: string|number;
    left?: string|number;
};
export type BorderSides = 'top'|'right'|'bottom'|'left';
export interface IStack {
    basis?: string;
    grow?: string;
    shrink?: string;
};
export type FontStyle = 'normal'|'italic'|'oblique'|'initial'|'inherit';
export type TextTransform = 'capitalize'|'uppercase'|'lowercase'|'full-width'|'full-size-kana'|'inherit'|'initial'|'revert'|'revert-layer'|'unset';
export type WrapType = 'nowrap'|'wrap'|'wrap-reverse'|'initial'|'inherit';
export type OverflowType = 'visible'|'hidden'|'clip'|'scroll'|'auto'|'initial'|'inherit'|'unset';
export type CursorType =  "auto"|"default"|"none"|"context-menu"|"help"|"pointer"|"progress"|"wait"|"cell"|"crosshair"|"text"|"vertical-text"|"alias"|"copy"|"move"|"no-drop"|"not-allowed"|"grab"|"grabbing"|"e-resize"|"n-resize"|"ne-resize"|"nw-resize"|"s-resize"|"se-resize"|"sw-resize"|"w-resize"|"ew-resize"|"ns-resize"|"nesw-resize"|"nwse-resize"|"col-resize"|"row-resize"|"all-scroll"|"zoom-in"|"zoom-out";
export interface IOverflow {
    x?: OverflowType;
    y?: OverflowType;
};
export const enum ComponentPropertyType {
    string = 1,
    number = 2,
    boolean = 3,
    object = 4,
    array = 5,
    event = 6
};

export const notifyEventParams: ICustomEventParam[] = [{name: 'target', type: 'Control', isControl: true}, {name: 'event', type: 'Event'}];

export const ComponentProperty: ICustomProperties = {
    props: {
        "id": {type: 'string'}
    },
    events: {
    }
};
export type DockStyle = ''|'none' | 'bottom' | 'center' | 'fill' | 'left' | 'right' | 'top';
export type LineHeightType = string | number | 'normal' | 'initial' | 'inherit';
export type DisplayType = 'inline-block'|'block'|'inline-flex'|'flex'|'inline'|'initial'|'inherit'|'none'|'-webkit-box'|'grid'|'inline-grid';

export interface IMediaQuery<T> {
    minWidth?: string | number;
    maxWidth?: string | number;
    properties: T;
};
export interface IGrid {
    column?: number;
    columnSpan?: number;
    row?: number;
    rowSpan?: number;
    horizontalAlignment?: "stretch" | "start" | "end" | "center";
    verticalAlignment?: "stretch" | "start" | "end" | "center";
    area?: string;
}
export interface IControlMediaQueryProps {
    padding?: ISpace;
    margin?: ISpace;
    border?: IBorder;
    visible?: boolean;
    display?: DisplayType;
    background?: IBackground;
    grid?: IGrid;
    position?: PositionType;
    top?: number|string;
    left?: number |string;
    right?: number |string;
    bottom?: number |string;
    zIndex?: string|number;
    maxHeight?: string|number;
    maxWidth?:string|number;
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    overflow?: IOverflow|OverflowType;
    font?: IFont;
    opacity?: string;
    stack?: IStack;
};
export type IControlMediaQuery = IMediaQuery<IControlMediaQueryProps>;
export interface IControl extends IComponent {
    _container?: HTMLElement;
    _getCustomProperties(): ICustomProperties;
    _setDesignPropValue(prop: string, value: string|number|boolean|object, breakpointProp?: any): void;
    anchor: IAnchor;
    background: IBackground;
    border: IBorder;
    boxShadow: string;
    contextMenu: IControl | null;
    cursor: CursorType;
    designMode: boolean;
    display: DisplayType;
    dock: DockStyle;
    font: IFont;
    grid: IGrid;
    letterSpacing: string|number;
    lineHeight: LineHeightType;
    linkTo: IControl;
    margin: ISpace;
    mediaQueries: IControlMediaQuery[];
    opacity: string;
    overflow: IOverflow;
    padding: ISpace;
    parent: IControl | undefined;
    parentModule: IModule | null;
    stack: IStack;
    tag: any;
    zIndex: string;
};
export interface ICustomProp {
    type: 'string'|'number'|'boolean'|'object'|'array',
    values?: any[],
    default?: string|number|boolean|object
};
export interface ICustomEventParam{
    name: string;
    type: string;
    isControl?: boolean;
};
export interface ICustomProperties {
    icon?: string;
    tagName?: string;
    className?: string;
    props: {[name: string]: ICustomProp},
    events: {[name: string]: ICustomEventParam[]},
    dataSchema?: JSONSchema.IDataSchema;
    group?: GroupType;
};
export interface INumberDictionary<TValue> {
    [id: number]: TValue;
};
export type Color = string;