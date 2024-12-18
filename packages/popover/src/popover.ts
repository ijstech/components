import { Control, customElements, ControlElement, Container, IBackground, IBorder, Background, Border, SpaceValue, ISpace } from '@ijstech/base';
import * as Styles from "@ijstech/style";
import { popoverMainContentStyle, getNoBackdropStyle, getOverlayStyle, getAbsoluteWrapperStyle } from './style/popover.css';
import { GroupType } from '@ijstech/types';

const showEvent = new Event('show');
export type popoverPlacementType = 'center' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight' | 'rightTop' | 'left' | 'right';
type eventCallback = (target: Control) => void;
type PopoverPositionType = "fixed" | "absolute";

export interface PopoverElement extends ControlElement {
    placement?: popoverPlacementType;
    closeOnScrollChildFixed?: boolean;
    item?: Control;
    onOpen?: eventCallback;
    onClose?: eventCallback;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-popover']: PopoverElement
        }
    }
}

const DEFAULT_VALUES = {
    placement: 'center',
    closeOnScrollChildFixed: false,
}

@customElements('i-popover', {
    icon: 'window-restore',
    group: GroupType.BASIC,
    className: 'Popover',
    props: {
        placement: {
            type: 'string',
            default: DEFAULT_VALUES.placement
        },
        closeOnScrollChildFixed: {
            type: 'boolean',
            default: DEFAULT_VALUES.closeOnScrollChildFixed
        }
    },
    events: {
        onOpen: [
            {name: 'target', type: 'Control', isControl: true}
        ],
        onClose: [
            {name: 'target', type: 'Control', isControl: true}
        ]
    },
    dataSchema: {
        type: 'object',
        properties: {
            placement: {
                type: 'string',
                enum: [ 'center', 'bottom', 'bottomLeft', 'bottomRight', 'top', 'topLeft', 'topRight', 'rightTop', 'left', 'right' ],
                default: DEFAULT_VALUES.placement,
            },
            closeOnScrollChildFixed: {
                type: 'boolean',
                default: DEFAULT_VALUES.closeOnScrollChildFixed
            }
        }
    }
})
export class Popover extends Container {
    protected _visible: boolean = false;
    private wrapperDiv: HTMLElement;
    private popoverDiv: HTMLElement;
    private bodyDiv: HTMLElement;
    private overlayDiv: HTMLElement;

    private _placement: popoverPlacementType;
    private _wrapperPositionAt: PopoverPositionType;
    private insideClick: boolean;
    private boundHandlePopoverMouseDown = this.handlePopoverMouseDown.bind(this);
    private boundHandlePopoverMouseUp = this.handlePopoverMouseUp.bind(this);

    protected _onOpen: eventCallback;
    public onClose: eventCallback;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {
            placement: 'center'
        });
    }

    get visible() {
        return this._visible;
    }
    set visible(value) {
        if (value) {
            this._visible = true;
            this.style.display = 'block';
            this.wrapperDiv.classList.add('show');
            this.dispatchEvent(showEvent);
            document.addEventListener('mousedown', this.boundHandlePopoverMouseDown);
            document.addEventListener('mouseup', this.boundHandlePopoverMouseUp);
        } else {
            this._visible = false;
            this.style.display = 'none';
            this.wrapperDiv.classList.remove('show');
            this.overlayDiv.classList.remove('show');
            this.onClose && this.onClose(this)
            document.removeEventListener('mousedown', this.boundHandlePopoverMouseDown);
            document.removeEventListener('mouseup', this.boundHandlePopoverMouseUp);
        }
    }

    get onOpen(): any {
        return this._onOpen;
    }
    set onOpen(callback: any) {
        this._onOpen = callback;
    }

    get placement(): popoverPlacementType {
        return this._placement;
    }
    set placement(value: popoverPlacementType) {
        this._placement = value;
    }

    get item(): Control {
        return this.popoverDiv.children[0] as Control;
    }
    set item(value: Control) {
        if (value instanceof Control) {
            this.popoverDiv.innerHTML = '';
            value && this.popoverDiv.appendChild(value);
        }
    }

    get position(): PopoverPositionType {
        return this._wrapperPositionAt;
    }
    set position(value: PopoverPositionType) {
        this._wrapperPositionAt = value;
    }

    _handleClick(event: MouseEvent) {
        return true;
    }

    private positionPopoverRelativeToParent(placement: popoverPlacementType) {
        let parent = this._parent || this.linkTo || this.parentElement || document.body;
        let coords = this.calculatePopoverWrapperCoordinates(parent, placement);

        const wrapperPositionStyle = getAbsoluteWrapperStyle(coords.left + "px", coords.top + "px");
        this.setTargetStyle(this.wrapperDiv, 'wrapperPosition', wrapperPositionStyle);
    }

    private calculatePopoverWrapperCoordinates(parent: Control | Container | HTMLElement, placement: popoverPlacementType) {
        const parentCoords = parent.getBoundingClientRect();
        let left = 0;
        let top = 0;
        let max;
        const isOutside = parent.style.position === 'absolute' && !this.parent?.contains(this);
        switch (placement) {
            case "center":
                left = (parentCoords.width - this.wrapperDiv.offsetWidth) / 2;
                top = (parentCoords.height - this.popoverDiv.offsetHeight) / 2;
                break;
            case "top":
            case "topLeft":
            case "topRight":
                if (parentCoords.top - this.popoverDiv.offsetHeight >= 0) {
                    top = -this.popoverDiv.offsetHeight;
                } else {
                    if (window.innerHeight < this.popoverDiv.offsetHeight + parentCoords.bottom) {
                        max = window.innerHeight - this.popoverDiv.offsetHeight - parentCoords.y;
                        top = (parentCoords.height - this.popoverDiv.offsetHeight) / 2;
                        top = top < -parentCoords.y ? -parentCoords.y : top > max ? max : top;
                    } else {
                        top = parentCoords.height;
                    }
                }
                break;
            case "bottom":
            case "bottomLeft":
            case "bottomRight":
                if (window.innerHeight < this.popoverDiv.offsetHeight + parentCoords.bottom) {
                    if (parentCoords.y - this.popoverDiv.offsetHeight < 0) {
                        max = window.innerHeight - this.popoverDiv.offsetHeight - parentCoords.y;
                        top = (parentCoords.height - this.popoverDiv.offsetHeight) / 2;
                        top = top < -parentCoords.y ? -parentCoords.y : top > max ? max : top;
                    } else {
                        top = -this.popoverDiv.offsetHeight;
                    }
                } else {
                    top = isOutside ? parentCoords.top - this.popoverDiv.offsetHeight : parentCoords.height;
                }
                break;
            case "rightTop":
                top = isOutside ? parentCoords.top - this.popoverDiv.offsetHeight : 0;
                left = isOutside ? parentCoords.left + parentCoords.width : parentCoords.width;
                if (left + this.popoverDiv.offsetWidth > document.documentElement.clientWidth) {
                    left = document.documentElement.clientWidth - this.popoverDiv.offsetWidth;
                }
                if (top + this.popoverDiv.offsetHeight > document.documentElement.clientHeight) {
                    top = document.documentElement.clientHeight - this.popoverDiv.offsetHeight;
                }
                break;
            case "left":
                max = window.innerHeight - this.popoverDiv.offsetHeight - parentCoords.y;
                if (isOutside) {
                    top = parentCoords.top + parentCoords.height / 2 - this.popoverDiv.offsetHeight / 2;
                    left = Math.max(parentCoords.left - this.popoverDiv.offsetWidth, 0);
                } else {
                    top = (parentCoords.height - this.popoverDiv.offsetHeight) / 2;
                    top = top < -parentCoords.y ? -parentCoords.y : top > max ? max : top;
                    left = -this.wrapperDiv.offsetWidth - 8
                }
                break;

        }
        if (placement === 'topRight' || placement === 'bottomRight') {
            if (parentCoords.right - this.wrapperDiv.offsetWidth >= 0) {
                left = parentCoords.width - this.wrapperDiv.offsetWidth;
            } else {
                left = -parentCoords.left;
            }
        } else if (['top', 'topLeft', 'bottom', 'bottomLeft'].includes(placement)) {
            if (window.innerWidth >= parentCoords.left + this.wrapperDiv.offsetWidth) {
                left = 0;
            } else {
                if (parentCoords.right - this.wrapperDiv.offsetWidth >= 0) {
                    left = Math.min(parentCoords.width - this.wrapperDiv.offsetWidth, window.innerWidth - parentCoords.left - this.wrapperDiv.offsetWidth);
                } else {
                    left = Math.max(parentCoords.width - this.wrapperDiv.offsetWidth, window.innerWidth - parentCoords.left - this.wrapperDiv.offsetWidth);
                }
            }
        }

        return { top, left }
    }

    protected _handleOnShow(event: Event) {
        if (this.placement && this.enabled)
            this.positionPopoverRelativeToParent(this.placement)
        if (this.enabled && this._onOpen) {
            event.preventDefault();
            this._onOpen(this)
        }
    }

    private handlePopoverMouseDown(event: MouseEvent) {
        this.insideClick = true;
        this.setInsideClick(event);
    }

    private handlePopoverMouseUp(event: MouseEvent) {
        if (!this.insideClick) this.visible = false;
    }

    private setInsideClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        this.insideClick = this.popoverDiv.contains(target);
    }

    private setPropertyValue(name: string, value: number | string) {
        if (!isNaN(Number(value)))
            (<any>this.popoverDiv.style)[name] = value + 'px';
        else
            (<any>this.popoverDiv.style)[name] = value;
        (<any>this.style)[name] = '';
    }

    refresh(): void {
        super.refresh(true);
        if (this.visible && this.placement) {
            this.positionPopoverRelativeToParent(this.placement)
        }
    }

    get background(): Background {
        return this._background;
    }
    set background(value: IBackground) {
        if (!this._background) {
            this._background = new Background(this.popoverDiv as Control, value);
        } else {
            this._background.setBackgroundStyle(value);
        }
    }
    get width(): number | string {
        return <any>(!isNaN(<any>this._width) ? this._width : this.offsetWidth)
    }
    set width(value: number | string) {
        this._width = value;
        this.setPropertyValue('width', value);
    }
    get height(): number | string {
        return this._height;
    }
    set height(value: number | string) {
        this._height = value;
        this.setPropertyValue('height', value);
    }
    get border(): Border {
        return this._border;
    }
    set border(value: IBorder) {
        this._border = new Border(this.wrapperDiv as Control, value);
    }
    get padding(): ISpace {
        return this._padding;
    }
    set padding(value: ISpace) {
        if (!this._padding)
            this._padding = new SpaceValue(this.popoverDiv as Control, value, 'padding');
        else
            this._padding.update(value);
    }
    protected removeTargetStyle(target: HTMLElement, propertyName: string){
        let style = this.propertyClassMap[propertyName];
        if (style) target.classList.remove(style);
    }
    protected setTargetStyle(target: HTMLElement, propertyName: string, value: string){
        this.removeTargetStyle(target, propertyName);
        if (value) {
            this.propertyClassMap[propertyName] = value;
            target.classList.add(value);
        }
    }

    protected init() {
        if (!this.wrapperDiv) {
            if (this.options?.onClose)
                this.onClose = this.options.onClose;
            this.placement = this.getAttribute('placement', true);
            this.wrapperDiv = this.createElement('div', this);

            this.popoverDiv = this.createElement('div', this.wrapperDiv);      
            this.bodyDiv = this.createElement('div', this.popoverDiv);
            while (this.childNodes.length > 1) {
                this.bodyDiv.appendChild(this.childNodes[0]);
            }
            this.overlayDiv = this.createElement('div', this);
            this.prepend(this.overlayDiv);
            const overlayStyle = getOverlayStyle();
            this.overlayDiv.classList.add(overlayStyle);
            this.popoverDiv.classList.add(popoverMainContentStyle);
            this.popoverDiv.classList.add('popover');
            this.addEventListener('show', this._handleOnShow.bind(this));

            window.addEventListener('keydown', event => {
                if (!this.visible) return;
                if (event.key === 'Escape') {
                    this.visible = false;
                }
            });

            const itemAttr = this.getAttribute('item', true);
            if (itemAttr) this.item = itemAttr;

            super.init();

            const maxWidth = this.getAttribute('maxWidth', true);
            if (maxWidth !== undefined) this.setPropertyValue('maxWidth', this.maxWidth);
            const minHeight = this.getAttribute('minHeight', true);
            if (minHeight !== undefined) this.setPropertyValue('minHeight', this.minHeight);
            const minWidth = this.getAttribute('minWidth', true);
            if (minWidth !== undefined) this.setPropertyValue('minWidth', this.minWidth);
            const height = this.getAttribute('height', true);
            if (height !== undefined) this.setPropertyValue('height', this.height);
            const maxHeight = this.getAttribute('maxHeight', true);
            if (maxHeight !== undefined) this.setPropertyValue('maxHeight', this.maxHeight);

            let border: IBorder = this.getAttribute('border', true);
            if (border) {
                this._border = new Border(this.wrapperDiv as Control, border);
                this.style.border = 'none';
            }
            let padding: ISpace = this.getAttribute('padding', true);
            if (padding) {
                this._padding = new SpaceValue(this.popoverDiv as Control, padding, 'padding')
            }
            const noBackdropStyle = getNoBackdropStyle();
            this.setTargetStyle(this.wrapperDiv, 'showBackdrop', noBackdropStyle);
        }
    }

    static async create(options?: PopoverElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
}