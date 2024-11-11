import {Container, Control, ControlElement, customElements} from "@ijstech/base";
import './style/breadcrumb.css';
import {GridLayout, HStack} from "@ijstech/layout";
import {Label} from "@ijstech/label";
import {Icon} from "@ijstech/icon";

interface IBreadcrumbItem {
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
            this._wrapper = new HStack(undefined, {
                justifyContent: 'start',
                alignItems: 'center'
            })
        }
        this.clear();
        if(this._breadcrumbItems) {
            for(let i = 0; i < this._breadcrumbItems.length; i++) {
                const breadcrumbItem = this._breadcrumbItems[i];
                const lbBreadcrumb = new Label(this._wrapper, {
                    caption: breadcrumbItem.caption
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
                        width: 18,
                        height: 18
                    })
                }
            }
        }
        this.appendChild(this._wrapper);
    }
}


