export {Observe, Unobserve, ClearObservers, Observables, isObservable, observable} from './observable';
export { Component} from './component';
export {IFont,  BorderSides, ISpace, IStack, FontStyle, IOverflow, OverflowType, IBackground, TextTransform} from './types';
export {Background, Border, SpaceValue, IContextMenu, Overflow} from './control';
export {IBorder, BorderStylesSideType, IBorderSideStyles, IMediaQuery, DisplayType, PositionType, IControlMediaQueryProps, IControlMediaQuery} from './types';
import {IFont, IStack, ISpace, IOverflow, OverflowType, IAnchor, IBackground, CursorType } from './types';
import {Control, Container, notifyMouseEventCallback} from './control';
import {DockStyle, LineHeightType, IBorder, IGrid, DisplayType, PositionType, IControlMediaQuery} from './types';
import { ITooltip } from '@ijstech/types';
export {notifyEventCallback, notifyMouseEventCallback, notifyKeyboardEventCallback, notifyGestureEventCallback} from './control';
export {I18n} from './i18n';
export {Control, Container};
export * as Types from './types';
export {getControlMediaQueriesStyle, getBackground, getSpacingValue, getMediaQueryRule} from './style/base.css';
export {IdUtils, customElements, getCustomElements} from './utils';
declare var _currentDefineModule: any;
let scripts = document.getElementsByTagName("script");
// let LibUrl = new URL(scripts[scripts.length - 1].src);
// let pathname = LibUrl.pathname;
let pathname = scripts[scripts.length - 1].src;
let lastIndex = pathname.lastIndexOf('/');
let LibPath = pathname.slice(0,lastIndex+1);
export {LibPath};

export const RequireJS = {    
    config(config:any):void {        
        ((window as any).require).config(config);
    },
    require(reqs:string[], callback:any):void {
        ((window as any).require)(reqs, callback);
    },
    defined(module: string): boolean{
        return ((window as any).require).defined(module);
    }
}

export interface ControlElement{    
    // anchorLeft?: boolean;
    // anchorBottom?: boolean;
    // anchorRight?: boolean;
    // anchorTop?: boolean;
    class?: string;
    contextMenu?: string;
    bottom?: number |string;
    dock?: DockStyle;
    enabled?: boolean;
    height?: number|string;
    id?: string;
    left?: number |string;
    maxWidth?: number|string;
    minWidth?: number|string;
    maxHeight?: number|string;
    minHeight?: number|string;
    // marginBottom?: number;    
    // marginLeft?: number;
    // marginRight?: number;
    // marginTop?: number;
    // paddingBottom?: number;    
    // paddingLeft?: number;
    // paddingRight?: number;
    // paddingTop?: number;
    right?: number |string;
    top?: number|string;
    visible?: boolean;
    width?: number|string;
    margin?: ISpace;
    padding?: ISpace;
    stack?: IStack;
    grid?: IGrid;
    background?: IBackground;
    lineHeight?: LineHeightType;
    zIndex?: string|number;
    position?: PositionType;
    linkTo?: Control;
    border?: IBorder;
    overflow?: IOverflow|OverflowType;
    font?: IFont;
    display?: DisplayType;
    tooltip?: ITooltip|string;
    anchor?: IAnchor;
    opacity?: number|string;
    tag?: any;
    cursor?: CursorType;
    letterSpacing?: string|number;
    boxShadow?: string;
    designMode?: boolean;
    mediaQueries?: IControlMediaQuery[];
    onClick?: notifyMouseEventCallback;
    onDblClick?: notifyMouseEventCallback;
    onContextMenu?: notifyMouseEventCallback;
};
export interface ContainerElement extends ControlElement{
    resizer?: boolean
};

export function customModule(target: any): void {
    _currentDefineModule = target;
};
export function setAttributeToProperty<T extends Control>(element: T, propertyName: keyof T, defaultValue?: any): void {
    const prop = element.getAttribute(propertyName as string, true, defaultValue);
    if (prop) element[propertyName] = prop;
}