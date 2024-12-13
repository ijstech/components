import { Control, customElements, ControlElement, Container, IBackground, IBorder, Background, Border, SpaceValue, IMediaQuery, IControlMediaQueryProps, ISpace, Overflow, IOverflow, OverflowType, I18n } from '@ijstech/base';
import { IdUtils } from '@ijstech/base';
import { Icon, IconElement } from '@ijstech/icon';
import * as Styles from "@ijstech/style";
import { getWrapperStyle, modalStyle, titleStyle, getNoBackdropStyle, getOverlayStyle, getModalMediaQueriesStyleClass, getAbsoluteWrapperStyle, getFixedWrapperStyle, getModalStyle, getBodyStyle } from './style/modal.css';
import { GroupType } from '@ijstech/types';
import { application } from '@ijstech/application';
const Theme = Styles.Theme.ThemeVars;

const showEvent = new Event('show');
export type ModalPopupPlacementType = 'center' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight' | 'rightTop' | 'left' | 'right';
type eventCallback = (target: Control) => void;
type ModalPositionType = "fixed" | "absolute";

export interface IModalMediaQueryProps extends IControlMediaQueryProps{
    showBackdrop?: boolean;
    popupPlacement?: 'center' | 'bottom' | 'top';
    position?: ModalPositionType;
}
export type IModalMediaQuery = IMediaQuery<IModalMediaQueryProps>;

export interface ModalElement extends ControlElement {
    title?: string;
    showBackdrop?: boolean;
    closeIcon?: IconElement;
    popupPlacement?: ModalPopupPlacementType;
    closeOnBackdropClick?: boolean;
    isChildFixed?: boolean;
    closeOnScrollChildFixed?: boolean;
    item?: Control;
    mediaQueries?: IModalMediaQuery[];
    onOpen?: eventCallback;
    onClose?: eventCallback;
    onBeforeClose?: eventCallback;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-modal']: ModalElement
        }
    }
}

const DEFAULT_VALUES = {
    showBackdrop: true,
    popupPlacement: 'center',
    closeOnBackdropClick: true,
    isChildFixed: false,
    closeOnScrollChildFixed: false
}

@customElements('i-modal', {
    icon: 'stop',
    group: GroupType.BASIC,
    className: 'Modal',
    props: {
        title: {type: 'string'},
        showBackdrop: {
            type: 'boolean',
            default: DEFAULT_VALUES.showBackdrop
        },
        closeIcon: {
            type: 'object',
            default: {}
        },
        popupPlacement: {
            type: 'string',
            default: DEFAULT_VALUES.popupPlacement
        },
        closeOnBackdropClick: {
            type: 'boolean',
            default: DEFAULT_VALUES.closeOnBackdropClick
        },
        isChildFixed: {
            type: 'boolean',
            default: DEFAULT_VALUES.isChildFixed
        },
        closeOnScrollChildFixed: {
            type: 'boolean',
            default: DEFAULT_VALUES.closeOnScrollChildFixed
        }
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            title: {
                type: 'string'
            },
            showBackdrop: {
                type: 'boolean',
                default: DEFAULT_VALUES.showBackdrop
            },
            closeIcon: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    fill: {
                        type: 'string',
                        format: 'color'
                    },
                    width: {
                        type: 'number'
                    },
                    height: {
                        type: 'number'
                    },
                    image: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string'
                            }
                        }
                    }
                }
            },
            popupPlacement: {
                type: 'string',
                enum: ['center', 'bottom', 'bottomLeft', 'bottomRight', 'top', 'topLeft', 'topRight', 'rightTop', 'left', 'right'],
                default: DEFAULT_VALUES.popupPlacement
            },
            closeOnBackdropClick: {
                type: 'boolean',
                default: DEFAULT_VALUES.closeOnBackdropClick
            },
            isChildFixed: {
                type: 'boolean',
                default: DEFAULT_VALUES.isChildFixed
            },
            closeOnScrollChildFixed: {
                type: 'boolean',
                default: DEFAULT_VALUES.closeOnScrollChildFixed
            }
        }
    }
})
export class Modal extends Container {
    protected _visible: boolean = false;
    private wrapperDiv: HTMLElement;
    private titleSpan: HTMLElement;
    private modalDiv: HTMLElement;
    private bodyDiv: HTMLElement;
    private overlayDiv: HTMLElement;
    private _closeIcon: Icon | null;

    private _placement: ModalPopupPlacementType;
    private _closeOnBackdropClick: boolean;
    private _showBackdrop: boolean;
    private _wrapperPositionAt: ModalPositionType;
    private _isChildFixed: boolean;
    private _closeOnScrollChildFixed: boolean;
    private _mediaQueries: IModalMediaQuery[];
    private _title: string = '';
    private hasInitializedChildFixed: boolean = false;
    private mapScrollTop: { [key: string]: number } = {};
    private insideClick: boolean;
    private boundHandleModalMouseDown = this.handleModalMouseDown.bind(this);
    private boundHandleModalMouseUp = this.handleModalMouseUp.bind(this);

    protected _onOpen: eventCallback;
    public onClose: eventCallback;
    public onBeforeClose: eventCallback;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {
            showBackdrop: true,
            closeOnBackdropClick: true,
            popupPlacement: 'center'
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
            this.positionAtChildFixed(true);
            this.dispatchEvent(showEvent);
            if (this.showBackdrop) {
                this.overlayDiv.classList.add('show');
                document.body.style.overflow = 'hidden'
                const parentModal = this.parentElement?.closest('i-modal') as Modal;
                if (parentModal) {
                    parentModal.wrapperDiv.style.overflow = 'hidden';
                    parentModal.wrapperDiv.scrollTop = 0;
                }
                this.wrapperDiv.style.overflow = 'hidden auto';
            }
            document.addEventListener('mousedown', this.boundHandleModalMouseDown);
            document.addEventListener('mouseup', this.boundHandleModalMouseUp);
        } else {
            this.positionAtChildFixed(false);
            this._visible = false;
            this.style.display = 'none';
            this.wrapperDiv.classList.remove('show');
            this.overlayDiv.classList.remove('show');
            if (this.showBackdrop) {
                const parentModal = this.parentElement?.closest('i-modal') as Modal;
                if (parentModal) {
                    parentModal.wrapperDiv.style.overflow = 'hidden auto'
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'hidden auto';
                }
            }
            if (this.isChildFixed) {
                this.wrapperDiv.style.display = 'none';
            }
            if (typeof this.onClose === 'function') this.onClose(this)
            document.removeEventListener('mousedown', this.boundHandleModalMouseDown);
            document.removeEventListener('mouseup', this.boundHandleModalMouseUp);
        }
    }

    get onOpen(): any {
        return this._onOpen;
    }
    set onOpen(callback: any) {
        this._onOpen = callback;
    }

    get title(): string {
        return this.getTranslatedText(this._title || '');
    }
    set title(value: string) {
        if (typeof value !== 'string') value = String(value || '');
        this._title = value;
        const titleElm = this.titleSpan.querySelector('span');
        titleElm && (titleElm.textContent = this.title);
    }

    updateLocale(i18n: I18n): void {
        super.updateLocale(i18n);
        const titleElm = this.titleSpan.querySelector('span');
        if (titleElm && this._title?.startsWith('$'))
            titleElm.textContent = i18n.get(this._title) || '';
    }

    private getTranslatedText(value: string): string {
        const parent: any = this._parent || this.linkTo || this.parentElement;
        if (!value) return '';
        if (value?.startsWith('$')) {
            const translated =
                parent?.parentModule?.i18n?.get(value) ||
                (this.body as any)?.i18n?.get(value) ||
                application.i18n?.get(value) ||
                ''
            return translated;
        }
        return value;
    }

    get popupPlacement(): ModalPopupPlacementType {
        return this._placement;
    }
    set popupPlacement(value: ModalPopupPlacementType) {
        this._placement = value;
    }

    get closeIcon(): Icon | null {
        return this._closeIcon;
    }
    set closeIcon(elm: Icon | null) {
        if (this._closeIcon && this.titleSpan.contains(this._closeIcon))
            this.titleSpan.removeChild(this._closeIcon);

        this._closeIcon = elm;
        if (this._closeIcon) {
            this._closeIcon.classList.add('i-modal-close');
            this._closeIcon.onClick = () => this.visible = false;
            this.titleSpan.appendChild(this._closeIcon);
        }
    }

    get closeOnBackdropClick(): boolean {
        return this._closeOnBackdropClick;
    }
    set closeOnBackdropClick(value: boolean) {
        this._closeOnBackdropClick = typeof value === 'boolean' ? value : true;
    }

    get showBackdrop(): boolean {
        return this._showBackdrop;
    }
    set showBackdrop(value: boolean) {
        this._showBackdrop = typeof value === 'boolean' ? value : true;
        if (this._showBackdrop) {
            const wrapperStyle = getWrapperStyle();
            this.setTargetStyle(this.wrapperDiv, 'showBackdrop', wrapperStyle);
            this.style.position = 'unset';
        }
        else {
            this.updateNoBackdropMd();
            const noBackdropStyle = getNoBackdropStyle();
            this.setTargetStyle(this.wrapperDiv, 'showBackdrop', noBackdropStyle);
        }
    }

    private updateNoBackdropMd() {
        if (!this.showBackdrop) {
            this.style.position = 'absolute';
            let left = '0px';
            let parent = this._parent || this.linkTo || this.parentElement || document.body;
            const isOutside = !(parent instanceof Range) && !parent?.contains(this);
            let top = `${isOutside ? window.scrollY : 0}px`;
            this.setTargetStyle(this, 'modal', getModalStyle(left, top));
        }
    }

    get item(): Control {
        return this.modalDiv.children[0] as Control;
    }
    set item(value: Control) {
        if (value instanceof Control) {
            this.modalDiv.innerHTML = '';
            value && this.modalDiv.appendChild(value);
        }
    }

    get body(): Control {
        return this.bodyDiv?.children?.[0] as Control;
    }
    set body(value: Control) {
        if (value instanceof Control) {
            this.bodyDiv.innerHTML = '';
            value && this.bodyDiv.appendChild(value);
        }
    }

    get position(): ModalPositionType {
        return this._wrapperPositionAt;
    }
    set position(value: ModalPositionType) {
        this._wrapperPositionAt = value;
    }

    get isChildFixed(): boolean {
        return this._isChildFixed;
    }
    set isChildFixed(value: boolean) {
        this._isChildFixed = value;
        if (value) {
            this.setChildFixed();
        } else {
            this.style.position = 'unset';
        }
    }

    get closeOnScrollChildFixed(): boolean {
        return this._closeOnScrollChildFixed;
    }
    set closeOnScrollChildFixed(value: boolean) {
        this._closeOnScrollChildFixed = value;
    }

    get mediaQueries(): IModalMediaQuery[] {
        return this._mediaQueries;
    }
    set mediaQueries(value: IModalMediaQuery[]) {
        this._mediaQueries = value;
        let style = getModalMediaQueriesStyleClass(this._mediaQueries);
        this._mediaStyle && this.classList.remove(this._mediaStyle);
        this._mediaStyle = style;
        this.classList.add(style);
    }

    private setChildFixed() {
        this.style.position = 'fixed';
        this.zIndex = 9999;
        this.mapScrollTop = {};
        const getScrollY = (elm: HTMLElement) => {
            let scrollID = elm.getAttribute('scroll-id');
            if (!scrollID) {
                scrollID = IdUtils.generateUUID();
                elm.setAttribute('scroll-id', scrollID);
            }
            this.mapScrollTop[scrollID] = elm.scrollTop;
        }
        const onParentScroll = (e: any) => {
            if (this.visible && this.closeOnScrollChildFixed) {
                this.visible = false;
            }
            if (e && !e.target.offsetParent && e.target.getAttribute) {
                getScrollY(e.target);
            }
            if (this.visible && !this.closeOnScrollChildFixed) {
                this.positionAtChildFixed(true);
            }
        }
        let parentElement = this.parentNode as HTMLElement;
        while (parentElement) {
            this.hasInitializedChildFixed = true;
            parentElement.addEventListener('scroll', (e) => onParentScroll(e));
            parentElement = parentElement.parentNode as HTMLElement;
            if (parentElement === document.body) {
                document.addEventListener('scroll', (e) => onParentScroll(e));
                break;
            } else if (parentElement && !parentElement.offsetParent && parentElement.scrollTop && typeof parentElement.getAttribute === 'function') {
                getScrollY(parentElement);
            }
        }
    }

    private positionAtChildFixed(value: boolean) {
        if (this.isChildFixed) {
            if (!this.hasInitializedChildFixed) {
                this.setChildFixed();
            }
            if (this.wrapperDiv) {
                this.wrapperDiv.style.position = !value ? 'unset' : 'relative';
                this.wrapperDiv.style.display = !value ? 'none' : 'block';
            }
            if (value && this.parentElement) {
                const { x, y, height } = this.parentElement.getBoundingClientRect();
                const mdClientRect = this.getBoundingClientRect();
                const { innerHeight, innerWidth } = window;
                const elmHeight = mdClientRect.height + (height || 20);
                const elmWidth = mdClientRect.width;
                let totalScrollY = 0;
                for (const key in this.mapScrollTop) {
                    totalScrollY += this.mapScrollTop[key];
                }
                const parent = this.getWrapperParent(this.parentElement);
                const newY = parent ? 0 : y;
                let left = '';
                let top = '';
                if ((y + elmHeight) > innerHeight) {
                    const elmTop = newY - elmHeight + totalScrollY;
                    top = `${elmTop < 0 ? 0 : elmTop}px`;
                } else {
                    top = `${newY + totalScrollY}px`;
                }
                if ((x + elmWidth) > innerWidth) {
                    left = `${innerWidth - elmWidth}px`;
                } else {
                    left = `${x}px`;
                }

                this.setTargetStyle(this, 'modal', getModalStyle(left, top));
            }
        }
    }

    private getWrapperParent(rootParent: HTMLElement) {
        if (!this.linkTo) return null;
        let parent = null;
        for (let child of rootParent.children) {
            if (child.contains(this.linkTo)) {
                parent = child as HTMLElement;
                break;
            }
        }
        return parent;
    }

    private positionAt(placement: ModalPopupPlacementType) {
        if (this.showBackdrop) {
            this.positionAtFix(placement);
        } else {
            this.updateNoBackdropMd();
            this.positionAtAbsolute(placement);
        }
    }

    private positionAtFix(placement: ModalPopupPlacementType) {
        let parent = document.body;
        let coords = this.getWrapperFixCoords(parent, placement);

        const wrapperPositionStyle = getFixedWrapperStyle(coords.left + "px", coords.top + "px");
        this.setTargetStyle(this.wrapperDiv, 'wrapperPosition', wrapperPositionStyle);
        // const innerModal = this.querySelector('i-modal') as Modal;
        // if (innerModal) {
        //     innerModal.wrapperDiv.style.width = '0px';
        //     innerModal.wrapperDiv.style.height = '0px';
        // }
    }

    private positionAtAbsolute(placement: ModalPopupPlacementType) {
        let parent = this._parent || this.linkTo || this.parentElement || document.body;
        let coords;
        if (this.position === 'fixed') {
            coords = this.getWrapperFixCoords(parent, placement);
        } else {
            coords = this.getWrapperAbsoluteCoords(parent, placement);
        }

        const wrapperPositionStyle = getAbsoluteWrapperStyle(coords.left + "px", coords.top + "px");
        this.setTargetStyle(this.wrapperDiv, 'wrapperPosition', wrapperPositionStyle);
    }

    private getWrapperFixCoords(parent: Control | Container | HTMLElement, placement: ModalPopupPlacementType) {
        const parentCoords = parent.getBoundingClientRect();
        let left = 0;
        let top = 0;

        const parentHeight = this.showBackdrop ? (parentCoords.height || window.innerHeight) - 1 : (parent.offsetHeight || parentCoords.height);
        const { wrapperLeft, wrapperTop } = this.getWrapperOffsets(parent);
        let parentTop = Math.max(parent.offsetTop || 0, parentCoords.top) + wrapperTop;
        let parentLeft = parentCoords.left + wrapperLeft;
        let parentWidth = parent.offsetWidth || parentCoords.width;
        let parentRight = parentLeft + parentWidth;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        switch (placement) {
            case "center":
                top = parentHeight / 2 - this.modalDiv.offsetHeight / 2;
                left = parentCoords.width / 2 - this.modalDiv.offsetWidth / 2 - 1;
                break;
            case "top":
                top = this.showBackdrop ? 0 : parentTop - parentHeight - this.modalDiv.offsetHeight / 2;
                left = parentLeft + (parentWidth - this.modalDiv.offsetWidth) / 2 - 1;
                break;
            case "topLeft":
                top = this.showBackdrop ? 0 : parentTop - parentHeight - this.modalDiv.offsetHeight / 2;
                left = parentLeft;
                break;
            case "topRight":
                top = this.showBackdrop ? 0 : parentTop - parentHeight - this.modalDiv.offsetHeight / 2;
                left = parentLeft + parentWidth - this.modalDiv.offsetWidth - 1;
                break;
            case "bottom":
                top = parentTop + parentHeight;
                if (this.showBackdrop) top = top - this.modalDiv.offsetHeight - 1;
                left = parentLeft + (parentWidth - this.modalDiv.offsetWidth) / 2 - 1;
                break;
            case "bottomLeft":
                top = parentTop + parentHeight;
                if (this.showBackdrop) top = top - this.modalDiv.offsetHeight;
                left = parentLeft;
                break;
            case "bottomRight":
                top = parentTop + parentHeight;
                if (this.showBackdrop) top = top - this.modalDiv.offsetHeight;
                left = parentLeft + parentWidth - this.modalDiv.offsetWidth - 1;
                break;
            case "rightTop":
                top = parentTop;
                left = this.showBackdrop ?  parentCoords.right : parentRight;
                if (left + this.modalDiv.offsetWidth > viewportWidth) {
                    left = viewportWidth - this.modalDiv.offsetWidth;
                }
                if (top + this.modalDiv.offsetHeight > viewportHeight) {
                    top = viewportHeight - this.modalDiv.offsetHeight;
                }
                break;
            case "left":
                left = this.showBackdrop ? 0 : parentLeft - this.modalDiv.offsetWidth;
                top = this.showBackdrop ? 0 : parentTop - parentHeight - this.modalDiv.offsetHeight / 2;
                break;
            case "right":
                top = (this.showBackdrop ? 0 : parentTop) +parentHeight / 2 - this.modalDiv.offsetHeight / 2;
                left = this.showBackdrop ?
                    parentLeft + parentWidth - this.modalDiv.offsetWidth :
                    parentLeft + parentWidth + this.modalDiv.offsetWidth / 2;
                if (left + this.modalDiv.offsetWidth > viewportWidth) {
                    left = viewportWidth - this.modalDiv.offsetWidth;
                }
                if (top + this.modalDiv.offsetHeight > viewportHeight) {
                    top = viewportHeight - this.modalDiv.offsetHeight;
                }
                break;
        }

        left = left < 0 ? parentLeft : left;
        top = top < 0 ? parentTop : top;

        return { top, left }
    }

    private getWrapperOffsets(parent: Control | Container | HTMLElement) {
        let wrapperTop = 0;
        let wrapperLeft = 0;
        if (this.isChildFixed) {
            if (parent.nodeName === 'I-MODAL') {
                const wrapper = parent.querySelector('.modal-wrapper') as HTMLElement;
                if (wrapper) {
                    wrapperTop = wrapper.offsetTop;
                    wrapperLeft = wrapper.offsetLeft;
                }
            }
        }
        return { wrapperTop, wrapperLeft };
    }

    // private getWrapperAbsoluteCoords(parent: Control | Container | HTMLElement, placement: modalPopupPlacementType) {
    //     const parentCoords = parent.getBoundingClientRect();
    //     let left = 0;
    //     let top = 0;
    //     let max;
    //     const isOutside = !parent?.contains(this);
    //     const viewportWidth = document.documentElement.clientWidth;
    //     const viewportHeight = document.documentElement.clientHeight;
    //     switch (placement) {
    //         case "center":
    //             left = (parentCoords.width - this.wrapperDiv.offsetWidth) / 2;
    //             top = (parentCoords.height - this.modalDiv.offsetHeight) / 2;
    //             break;
    //         case "top":
    //         case "topLeft":
    //             if (this.isChildFixed) {
    //                 top = this.getParentOccupiedTop();
    //                 left = this.getParentOccupiedLeft();
    //                 break;
    //             }
    //         case "topRight":
    //             if (this.isChildFixed) {
    //                 top = this.getParentOccupiedTop();
    //                 left = parentCoords.width - this.getParentOccupiedRight() - this.wrapperDiv.offsetWidth;
    //                 break;
    //             }
    //             if (parentCoords.top - this.modalDiv.offsetHeight >= 0) {
    //                 top = -this.modalDiv.offsetHeight;
    //             } else {
    //                 if (window.innerHeight < this.modalDiv.offsetHeight + parentCoords.bottom) {
    //                     max = window.innerHeight - this.modalDiv.offsetHeight - parentCoords.y;
    //                     top = (parentCoords.height - this.modalDiv.offsetHeight) / 2;
    //                     top = top < -parentCoords.y ? -parentCoords.y : top > max ? max : top;
    //                 } else {
    //                     top = parentCoords.height;
    //                 }
    //             }
    //             break;
    //         case "bottom":
    //         case "bottomLeft":
    //             if (this.isChildFixed) {
    //                 left = 0;
    //                 top = parentCoords.height;
    //                 break;
    //             }
    //         case "bottomRight":
    //             if (this.isChildFixed) {
    //                 top = parentCoords.height;
    //                 left = parentCoords.width - this.wrapperDiv.offsetWidth;
    //                 break;
    //             }
    //             if (window.innerHeight < this.modalDiv.offsetHeight + parentCoords.bottom) {
    //                 if (parentCoords.y - this.modalDiv.offsetHeight < 0) {
    //                     max = window.innerHeight - this.modalDiv.offsetHeight - parentCoords.y;
    //                     top = (parentCoords.height - this.modalDiv.offsetHeight) / 2;
    //                     top = top < -parentCoords.y ? -parentCoords.y : top > max ? max : top;
    //                 } else {
    //                     top = -this.modalDiv.offsetHeight;
    //                 }
    //             } else {
    //                 top = isOutside ? parentCoords.top - this.modalDiv.offsetHeight : parentCoords.height;
    //             }
    //             break;
    //         case "rightTop":
    //             top = isOutside ? parentCoords.top - this.modalDiv.offsetHeight : 0;
    //             left = isOutside ? parentCoords.left + parentCoords.width : parentCoords.width;

    //             if (left + this.modalDiv.offsetWidth > viewportWidth) {
    //                 left = viewportWidth - this.modalDiv.offsetWidth;
    //             }
    //             if (top < 0 && top + this.modalDiv.offsetHeight > 0) {
    //                 top = 0;
    //             }
    //             if (top + this.modalDiv.offsetHeight > viewportHeight) {
    //                 top = viewportHeight - this.modalDiv.offsetHeight;
    //             }
    //             break;
    //         case "left":
    //             max = window.innerHeight - this.modalDiv.offsetHeight - parentCoords.y;
    //             if (isOutside) {
    //                 top = parentCoords.top + parentCoords.height / 2 - this.modalDiv.offsetHeight / 2;
    //                 left = Math.max(parentCoords.left - this.modalDiv.offsetWidth, 0);
    //                 if (top + this.modalDiv.offsetHeight > viewportHeight) {
    //                     top = viewportHeight - this.modalDiv.offsetHeight;
    //                 }
    //             } else {
    //                 top = (parentCoords.height - this.modalDiv.offsetHeight) / 2;
    //                 top = top < -parentCoords.y ? -parentCoords.y : top > max ? max : top;
    //                 left = -this.wrapperDiv.offsetWidth - 8
    //             }
    //             break;

    //     }
    //     if (this.isChildFixed) {
    //         if (placement !== 'bottomRight' && placement !== 'left') left = left < 0 ? parentCoords.left : left;
    //         if (placement !== 'left') top = top < 0 ? parentCoords.top : top;
    //         return { top, left };
    //     }

    //     if (placement === 'topRight' || placement === 'bottomRight') {
    //         if (isOutside) {
    //             left = parentCoords.left + parentCoords.width - this.wrapperDiv.offsetWidth;
    //             if (left + this.modalDiv.offsetWidth > viewportWidth) {
    //                 left = viewportWidth - this.modalDiv.offsetWidth;
    //             }
    //         } else {
    //             if (parentCoords.right - this.wrapperDiv.offsetWidth >= 0) {
    //                 left = parentCoords.width - this.wrapperDiv.offsetWidth;
    //             } else {
    //                 left = -parentCoords.left;
    //             }
    //         }
    //     } else if (['top', 'topLeft', 'bottom', 'bottomLeft'].includes(placement)) {
    //         if (isOutside) {
    //             left = parentCoords.left;
    //             if (left + this.modalDiv.offsetWidth > viewportWidth) {
    //                 left = viewportWidth - this.modalDiv.offsetWidth;
    //             }
    //         } else {
    //             if (window.innerWidth >= parentCoords.left + this.wrapperDiv.offsetWidth) {
    //                 left = 0;
    //             } else {
    //                 if (parentCoords.right - this.wrapperDiv.offsetWidth >= 0) {
    //                     left = Math.min(parentCoords.width - this.wrapperDiv.offsetWidth, window.innerWidth - parentCoords.left - this.wrapperDiv.offsetWidth);
    //                 } else {
    //                     left = Math.max(parentCoords.width - this.wrapperDiv.offsetWidth, window.innerWidth - parentCoords.left - this.wrapperDiv.offsetWidth);
    //                 }
    //             }
    //         }
    //     }
    //     return { top, left }
    // }

    private getWrapperAbsoluteCoords(parent: Control | Container | HTMLElement, placement: ModalPopupPlacementType): { top: number, left: number } {
        const parentCoords = parent.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const isOutside = !parent?.contains(this);

        let left: number = 0;
        let top: number = 0;

        const constrainToViewport = (value: number, dimension: 'width' | 'height') => {
            const lowercasePlacement = placement.toLowerCase();
            if (dimension === 'width') {
                if (isOutside) {
                    if (value + this.modalDiv.offsetWidth > viewportWidth) {
                        value = viewportWidth - this.modalDiv.offsetWidth;
                    } else if (value < 0) {
                        value = 0;
                    }
                } else {
                    if (lowercasePlacement.includes('right')) {
                        if (lowercasePlacement === 'righttop' || lowercasePlacement === 'right') {
                            if (parentCoords.right + this.wrapperDiv.offsetWidth > viewportWidth) {
                                value = viewportWidth - parentCoords.left - this.wrapperDiv.offsetWidth;
                            }
                        } else {
                            if (parentCoords.right - this.wrapperDiv.offsetWidth < 0) {
                                value = -parentCoords.left;
                            }
                        }
                    } else {
                        if (lowercasePlacement === 'left') {
                            if (parentCoords.left - this.wrapperDiv.offsetWidth < 0) {
                                value = 0;
                            }
                        } else {
                            if (value + parentCoords.left < 0) {
                                value = -parentCoords.left
                            }
                        }
                    }
                    if (value + parentCoords.left + this.modalDiv.offsetWidth > viewportWidth) {
                        value = Math.max(parentCoords.width - this.wrapperDiv.offsetWidth, window.innerWidth - parentCoords.left - this.wrapperDiv.offsetWidth);
                    }
                }
            }
            if (dimension === 'height') {
                if (isOutside) {
                    if (value + this.modalDiv.offsetHeight > viewportHeight) {
                        value = viewportHeight - this.modalDiv.offsetHeight;
                    } else if (value < 0) {
                        value = 0;
                    }
                } else {
                    if (lowercasePlacement.includes('bottom')) {
                        if (parentCoords.bottom + this.wrapperDiv.offsetHeight > viewportHeight) {
                            value = viewportHeight - parentCoords.top - this.wrapperDiv.offsetHeight;
                        }
                    } else {
                        if (parentCoords.top - this.wrapperDiv.offsetHeight < 0) {
                            value = 0;
                        }
                    }
                }
            }
            return value;
        };

        let parentLeft = isOutside ? parentCoords.left : 0;
        let parentTop = isOutside ? parentCoords.top : 0;
        let parentRight = isOutside ? parentCoords.right : parentCoords.width;

        switch (placement) {
            case "center":
                left = (parentCoords.width - this.wrapperDiv.offsetWidth) / 2 + parentLeft;
                top = (parentCoords.height - this.modalDiv.offsetHeight) / 2 + parentTop;
                break;
            case "top":
            case "topLeft":
            case "topRight":
                top = parentTop - this.modalDiv.offsetHeight;
                left = placement === "topRight" ? parentCoords.width - this.wrapperDiv.offsetWidth : parentLeft;
                if (placement === "top") {
                    left += (parentCoords.width - this.wrapperDiv.offsetWidth) / 2;
                }
                break;
            case "bottom":
            case "bottomLeft":
            case "bottomRight":
                top = parentTop + parentCoords.height;
                left = placement === "bottomRight" ? parentRight - this.wrapperDiv.offsetWidth : parentLeft;
                if (placement === "bottom") {
                    left += (parentCoords.width - this.wrapperDiv.offsetWidth) / 2;
                }
                break;
            case "rightTop":
                top = parentTop - this.modalDiv.offsetHeight;
                left = parentRight;
                break;
            case "right":
                top = parentTop + parentCoords.height / 2 - this.modalDiv.offsetHeight / 2;
                left = parentRight;
                break;
            case "left":
                top = parentTop + parentCoords.height / 2 - this.modalDiv.offsetHeight / 2;
                left = parentLeft - this.modalDiv.offsetWidth;
                break;
        }

        left = constrainToViewport(left, 'width');
        top = constrainToViewport(top, 'height');

        // Additional adjustments if the modal is fixed
        if (this.isChildFixed) {
            if (['bottomRight', 'left'].indexOf(placement) === -1) {
                left = Math.max(left, parentCoords.left);
            }
            if (placement !== 'left') {
                top = Math.max(top, parentCoords.top);
            }
        }
        return { top, left };
    }

    protected _handleOnShow(event: Event) {
        if (this.popupPlacement && this.enabled)
            this.positionAt(this.popupPlacement)
        const parent: any = this._parent || this.linkTo || this;
        const i18nData = parent?.parentModule?.i18n || (this.body as any)?.i18n || application.i18n;
        i18nData && this.updateLocale(i18nData);
        if (i18nData && this.body) {
            this.body.updateLocale(i18nData);
        }
        if (this.enabled && this._onOpen) {
            event.preventDefault();
            this._onOpen(this)
        }
    }

    private handleModalMouseDown(event: MouseEvent) {
        this.insideClick = true;
        this.setInsideClick(event);
    }

    private handleModalMouseUp(event: MouseEvent) {
        if (!this.closeOnBackdropClick && !this.showBackdrop) {
            this.setInsideClick(event);
        }
        if (!this.insideClick) {
            if (typeof this.onBeforeClose === 'function') this.onBeforeClose(this);
            else this.visible = false;
        }
    }

    private setInsideClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (this.closeOnBackdropClick) {
            this.insideClick = this.showBackdrop ? target !== this.wrapperDiv : this.modalDiv.contains(target);
        } else if (!this.showBackdrop) {
            let parent = this._parent || this.linkTo || this.parentElement;
            if (parent instanceof Range) {
                const commonAncestor = parent.commonAncestorContainer;
                const wrapNode = commonAncestor?.nodeType === 3 ? commonAncestor.parentElement : commonAncestor;
                if (wrapNode) parent = wrapNode as Control;
            }
            this.insideClick = this.modalDiv.contains(target) || parent?.contains(target);
        }
    }

    private updateModal(name: string, value: number | string) {
        if (!isNaN(Number(value)))
            (<any>this.modalDiv.style)[name] = value + 'px';
        else
            (<any>this.modalDiv.style)[name] = value;
        (<any>this.style)[name] = '';
    }

    refresh(): void {
        super.refresh(true);
        if (this.visible && this.popupPlacement) {
            this.positionAt(this.popupPlacement)
        }
    }

    get background(): Background {
        return this._background;
    }
    set background(value: IBackground) {
        if (!this._background) {
            this._background = new Background(this.modalDiv as Control, value);
        } else {
            this._background.setBackgroundStyle(value);
        }
    }
    get width(): number | string {
        return <any>(!isNaN(<any>this._width) ? this._width : this.offsetWidth)
    }
    set width(value: number | string) {
        this._width = value;
        this.updateModal('width', value);
    }
    get height(): number | string {
        return this._height;
    }
    set height(value: number | string) {
        this._height = value;
        this.updateModal('height', value);
    }
    get border(): Border {
        return this._border;
    }
    set border(value: IBorder) {
        this._border = new Border((this.showBackdrop ? this.modalDiv : this.wrapperDiv) as Control, value);
        if (!this.showBackdrop) {
            this.modalDiv.style.borderRadius = 'inherit';
        }
    }
    get padding(): ISpace {
        return this._padding;
    }
    set padding(value: ISpace) {
        if (!this._padding)
            this._padding = new SpaceValue(this.modalDiv as Control, value, 'padding');
        else
            this._padding.update(value);
    }
    get boxShadow(): string {
        return (this.showBackdrop ? this.modalDiv : this.wrapperDiv).style.boxShadow;
    }
    set boxShadow(value: string) {
        (this.showBackdrop ? this.modalDiv : this.wrapperDiv).style.boxShadow = value;
    }
    get overflow(): Overflow {
        if (!this._overflow) {
            this._overflow = new Overflow((this.showBackdrop ? this.modalDiv : this.wrapperDiv) as Control)
        }
        return this._overflow;
    }
    set overflow(value: OverflowType | IOverflow) {
        if (!this._overflow) {
            this._overflow = new Overflow((this.showBackdrop ? this.modalDiv : this.wrapperDiv) as Control, value);
        } else {
            this._overflow.setOverflowStyle(value);
        }
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
            this.onBeforeClose = this.getAttribute('onBeforeClose', true) || this.onBeforeClose;
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
            this.onOpen = this.getAttribute('onOpen', true) || this.onOpen;
            this.popupPlacement = this.getAttribute('popupPlacement', true, DEFAULT_VALUES.popupPlacement);
            this.closeOnBackdropClick = this.getAttribute('closeOnBackdropClick', true, DEFAULT_VALUES.closeOnBackdropClick);
            this.wrapperDiv = this.createElement('div', this);
            this.wrapperDiv.classList.add('modal-wrapper');

            this.showBackdrop = this.getAttribute('showBackdrop', true, DEFAULT_VALUES.showBackdrop);
            this.modalDiv = this.createElement('div', this.wrapperDiv);
            this.titleSpan = this.createElement('div', this.modalDiv);
            this.titleSpan.classList.add(titleStyle, 'i-modal_header');
            this.createElement('span', this.titleSpan);
            this.title = this.getAttribute('title', true);

            const closeIconAttr = this.getAttribute('closeIcon', true);
            if (closeIconAttr) {
                closeIconAttr.height = closeIconAttr.height || '16px';
                closeIconAttr.width = closeIconAttr.width || '16px';
                closeIconAttr.fill = closeIconAttr.fill || Theme.colors.primary.main;
                this.closeIcon = new Icon(undefined, closeIconAttr);
            }

            this.bodyDiv = this.createElement('div', this.modalDiv);
            this.bodyDiv.classList.add('i-modal_body');
            while (this.childNodes.length > 1) {
                this.bodyDiv.appendChild(this.childNodes[0]);
            }
            this.overlayDiv = this.createElement('div', this);
            this.prepend(this.overlayDiv);
            const overlayStyle = getOverlayStyle();
            this.overlayDiv.classList.add(overlayStyle);
            this.overlayDiv.classList.add('modal-overlay');
            this.modalDiv.classList.add(modalStyle);
            this.modalDiv.classList.add('modal');
            this.addEventListener('show', this._handleOnShow.bind(this));

            window.addEventListener('keydown', event => {
                if (!this.visible) return;
                if (event.key === 'Escape') {
                    this.visible = false;
                }
            });

            // document.body.addEventListener('click', event => {
            //     if (!this.visible || this.showBackdrop || !this.closeOnBackdropClick) return
            //     const target = event.target as HTMLElement;

            //     let parent = this._parent || this.linkTo || this.parentElement;
            //     if (!this.modalDiv.contains(target) && !parent?.contains(target)) {
            //         this.visible = false
            //     }
            // });

            const isChildFixed = this.getAttribute('isChildFixed', true);
            if (isChildFixed) this.isChildFixed = isChildFixed;

            const closeOnScrollChildFixed = this.getAttribute('closeOnScrollChildFixed', true);
            this.closeOnScrollChildFixed = closeOnScrollChildFixed;

            const itemAttr = this.getAttribute('item', true);
            if (itemAttr) this.item = itemAttr;

            super.init();

            const maxWidth = this.getAttribute('maxWidth', true);
            if (maxWidth !== undefined) this.updateModal('maxWidth', this.maxWidth);
            const minHeight = this.getAttribute('minHeight', true);
            if (minHeight !== undefined) this.updateModal('minHeight', this.minHeight);
            const minWidth = this.getAttribute('minWidth', true);
            if (minWidth !== undefined) this.updateModal('minWidth', this.minWidth);
            const height = this.getAttribute('height', true);
            if (height !== undefined) this.updateModal('height', this.height);
            const maxHeight = this.getAttribute('maxHeight', true);
            if (maxHeight !== undefined) this.updateModal('maxHeight', this.maxHeight);

            let border: IBorder = this.getAttribute('border', true);
            if (border) {
                this._border = new Border((this.showBackdrop ? this.modalDiv : this.wrapperDiv) as Control, border);
                this.style.border = 'none';
                if (!this.showBackdrop) {
                    this.modalDiv.style.borderRadius = 'inherit';
                }
            }
            let padding: ISpace = this.getAttribute('padding', true);
            if (padding) {
                this._padding = new SpaceValue(this.modalDiv as Control, padding, 'padding')
            }
            let boxShadow = this.getAttribute('boxShadow', true);
            if (boxShadow) this.boxShadow = boxShadow;
            let overflow = this.getAttribute('overflow', true);
            if (overflow) {
                this._overflow = new Overflow((this.showBackdrop ? this.modalDiv : this.wrapperDiv) as Control, overflow);
                if (overflow === 'hidden') this.bodyDiv.classList.add(getBodyStyle);
            }
            this.mediaQueries = this.getAttribute('mediaQueries', true, []);
        }
    }

    static async create(options?: ModalElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
}