import {Container, Control, ControlElement, customElements} from "@ijstech/base";
import './style/breadcrumb.css';
import {HStack} from "@ijstech/layout";
import {Label} from "@ijstech/label";
import {Icon} from "@ijstech/icon";
import * as Styles from '@ijstech/style';

const Theme = Styles.Theme.ThemeVars;

export interface IBreadcrumbItem {
    caption: string;
    data?: any;
}

export interface BreadcrumbElement extends ControlElement {
    onItemClick: (breadcrumbItem?: IBreadcrumbItem) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-breadcrumb"]: BreadcrumbElement;
        }
    }
}

@customElements("i-breadcrumb")
export class Breadcrumb extends Control {
    private _wrapper: HStack;
    private _breadcrumbItems: IBreadcrumbItem[];
    private _onItemClick: (breadcrumbItem?: IBreadcrumbItem) => void;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {});
    }

    static async create(options?: BreadcrumbElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    protected init() {
        super.init();
        this._breadcrumbItems = this.getAttribute('breadcrumbItems', true);
        this._onItemClick = this.getAttribute('onItemClick', true);
        this.render();
    }

    set breadcrumbItems(breadcrumbItems: IBreadcrumbItem[]) {
        this._breadcrumbItems = breadcrumbItems;
        this.render();
    }

    get breadcrumbItems() {
        return this._breadcrumbItems;
    }

    private clear() {
        this._wrapper.clearInnerHTML();
    }

    private render() {
        if(!this._wrapper) {
            const { gap = '5px' } = this.tag;
            this._wrapper = new HStack(undefined, {
                justifyContent: 'start',
                alignItems: 'center',
                gap
            })
        }
        this.clear();
        if(this._breadcrumbItems) {
            for(let i = 0; i < this._breadcrumbItems.length; i++) {
                const breadcrumbItem = this._breadcrumbItems[i];
                const color = i === this._breadcrumbItems.length - 1 ? Theme.colors.primary.main : Theme.text.primary;
                const lbBreadcrumb = new Label(this._wrapper, {
                    caption: breadcrumbItem.caption,
                    font: {size: Theme.typography.fontSize, color}
                });

                if(this._onItemClick !== undefined)
                    this.classList.add('pointer')
                lbBreadcrumb.onClick = () => {
                    if(this._onItemClick)
                        this._onItemClick(breadcrumbItem);
                }
                if(i + 1 < this._breadcrumbItems.length) {
                    new Icon(this._wrapper, {
                        name: 'chevron-right',
                        width: Theme.typography.fontSize,
                        height: Theme.typography.fontSize,
                        fill: Theme.text.primary
                    })
                }
            }
        }
        this.appendChild(this._wrapper);
    }
}


