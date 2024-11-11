import {Container, Control, ControlElement, customElements, ContainerElement} from "@ijstech/base";
import {GridLayout, HStack, Panel, VStack} from "@ijstech/layout";
import {Input} from "@ijstech/input";
import {Label} from "@ijstech/label";
import {Icon} from "@ijstech/icon";
import './style/navigator.css';
import { GroupType } from "@ijstech/types";

interface INavOption {
    searchPlaceholder?: string;
}

interface INavItem {
    id: number | string;
    caption: string;
    navItems: INavItem[];
    data: any;
}

export interface NavElement extends ControlElement {
    navItems?: INavItem[];
    options?: INavOption;
    onItemClick?: () => void;
}

export interface NavItemElement extends ControlElement {
    caption: string;
    navItems: INavItem[];
    data: any;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-nav"]: NavElement;
        }
    }
}

// @customElements("i-nav", {
//     icon: 'bars',
//     group: GroupType.BASIC,
//     className: 'Nav',
//     props: {
//         navItems: {type: 'object'},
//         options: {type: 'object'}
//     },
//     events: {},
//     dataSchema: {
//         type: 'object',
//         properties: {
//             navItems: {
//                 type: 'object',
//                 items: {
//                     type: 'array',
//                     properties: {
//                         id: {
//                             type: 'string'
//                         },
//                         caption: {
//                             type: 'string'
//                         },
//                         navItems: {
//                             type: 'object'
//                         },
//                         data: {
//                             type: 'object'
//                         }
//                     }
//                 }
//             },
//             options: {
//                 type: 'object'
//             }
//         }
//     }
// })
@customElements("i-nav")
export class Nav extends Control {
    private _navItems: INavItem[];
    private _flatNavItems: INavItem[];
    private _parentNavItem: INavItem | undefined;
    private _wrapper: Container;
    private txtSearch: Input;
    private _navWrapper: VStack;
    private _options: INavOption = {};
    private _onItemClick: (data: any) => void;
    private _searching: boolean = false;
    private _activeNavItem: INavItem | undefined;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {});
    }

    static async create(options?: NavElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    protected init() {
        super.init();
        const navItems = this.getAttribute('navItems', true);
        if (navItems) {
            this._navItems = navItems;
            this._flatNavItems = this.flattenNavItem(navItems);
        }
        if (!this._wrapper)
            this._wrapper = new VStack();
        const navOptions = this.getAttribute('options', true);
        const onItemClick = this.getAttribute('onItemClick', true);
        if (onItemClick)
            this._onItemClick = onItemClick;
        this._options = navOptions;
        this.appendChild(this._wrapper);
        this.render();
    }

    set navItems(navItems: INavItem[]) {
        this._navItems = navItems;
        this.renderNav(navItems);
    }

    get navItems() {
        return this._navItems;
    }

    setRootActive() {
        this._activeNavItem = undefined;
        this._parentNavItem = undefined;
        this.renderNav(this._navItems);
    }

    setSelectedItemById(id: number | string) {
        const navItem = this._flatNavItems.find(item => item.id === id);
        if (navItem) {
            if (navItem.navItems && navItem.navItems.length > 0) {
                this._parentNavItem = navItem;
                this.renderNav(navItem.navItems);
            } else {
                const parentNavItem = this.findParentNavItem(this._navItems, id);
                if (parentNavItem)
                    this._parentNavItem = parentNavItem;
                const siblings = this.findSiblingsById(this._navItems, id);
                if (siblings) {
                    this.renderNav(siblings);
                }
            }
            this.setNavItemActive(id);
        }
    }

    getSelectedItemById(id: number | string) {
        return this._flatNavItems.find(item => item.id === id);
    }

    getActiveRoute(): INavItem[] {
        let routeNavItems: INavItem[] = [];
        if(this._activeNavItem) {
            routeNavItems.push(this._activeNavItem);
            let parentNavItem = this.findParentNavItem(this._navItems, this._activeNavItem.id);
            if(parentNavItem)
                routeNavItems = [parentNavItem, ...routeNavItems]
            while(parentNavItem) {
                parentNavItem = this.findParentNavItem(this._navItems, parentNavItem.id);
                if(parentNavItem)
                    routeNavItems = [parentNavItem, ...routeNavItems];
            }
        }
        return routeNavItems;
    }

    clear() {
        this._navWrapper.clearInnerHTML();
    }

    private render() {
        const pnlSearch = new GridLayout(this._wrapper, {
            templateColumns: ['12px', '1fr', '12px']
        });
        pnlSearch.classList.add('search-container');
        new Icon(pnlSearch, {
            name: 'search',
            height: '12px',
            width: '12px'
        })
        this.txtSearch = new Input(pnlSearch, {
            width: '100%',
            height: 30,
            placeholder: this._options.searchPlaceholder
        });
        const btnClear = new Icon(pnlSearch, {
            name: 'times',
            width: '12px',
            height: '12px'
        });
        btnClear.classList.add('clear');
        btnClear.onClick = () => {
            this.txtSearch.value = '';
            this.handleSearchOnChange(this.txtSearch);
        }
        this.txtSearch.onChanged = this.handleSearchOnChange.bind(this);
        this._navWrapper = new VStack(this._wrapper);
        this._navWrapper.classList.add('nav-wrapper')
        this.renderNav(this._navItems);
    }

    private renderNav(navItems: INavItem[], searchMode?: boolean) {
        this.clear();
        if (navItems) {
            if (this._parentNavItem && !searchMode) {
                const backNavItem = new NavItem(this._navWrapper, {
                    back: true,
                    ...this._parentNavItem,
                });
                backNavItem.onClick = () => {
                    if (this._parentNavItem) {
                        const siblings = this.findSiblingsById(this._navItems, this._parentNavItem.id);
                        this._parentNavItem = this.findParentNavItem(this._navItems, this._parentNavItem.id);
                        if (siblings)
                            this.renderNav(siblings);
                    }
                }
            }
            let parentPaths: string[] = []
            for (const navItem of navItems) {
                if (searchMode && (!navItem.navItems || (navItem.navItems && navItem.navItems.length === 0))) {
                    const parentPath = this.findParentPathByNavItem(navItem);
                    if (!parentPaths.includes(parentPath) && parentPath) {
                        parentPaths.push(parentPath);
                        const parentNavSiblings = this.findSiblingsById(this._navItems, navItem.id);
                        const parentPathNavItem = new NavItem(this._navWrapper, {
                            caption: parentPath,
                            navItems: parentNavSiblings
                        });
                        parentPathNavItem.onClick = () => {
                            this._parentNavItem = this.findParentNavItem(this._navItems, navItem.id);
                            if (this._parentNavItem && this._parentNavItem.navItems) {
                                // const siblings = this.findSiblingsById(this._navItems, this._parentNavItem.id);
                                // if (siblings)
                                this.renderNav(this._parentNavItem.navItems);
                            }
                        }
                    }
                }
                const elmNavItem = new NavItem(this._navWrapper, {
                    ...navItem,
                });
                elmNavItem.onClick = () => {
                    if (navItem.navItems && navItem.navItems.length > 0)
                        this._parentNavItem = navItem;
                    else
                        this._parentNavItem = this.findParentNavItem(this._navItems, navItem.id);
                    if (navItem.navItems && navItem.navItems.length > 0) {
                        this.renderNav(navItem.navItems);
                    } else {
                        if (this._searching) {
                            const siblings = this.findSiblingsById(this._navItems, navItem.id);
                            if (siblings)
                                this.renderNav(siblings);
                        }
                        this.setNavItemActive(elmNavItem.id);
                        if (this._onItemClick) {
                            this._onItemClick(navItem);
                        }
                    }
                }
            }
        }
    }

    private setNavItemActive(id: number | string) {
        const filterNavItem = this._flatNavItems.find(item => item.id === id);
        if (filterNavItem) {
            if (filterNavItem.navItems && filterNavItem.navItems.length > 0) return;
            this._activeNavItem = filterNavItem;
            const activeItem = this.querySelector('i-nav-item.active')
            if (activeItem)
                activeItem.classList.remove('active')
            if (id) {
                const navItem = this.querySelector(`i-nav-item[nav-id="${id}"]`);
                if (navItem)
                    navItem.classList.add('active');
            }
        }
    }

    private handleSearchOnChange(control: Control) {
        const value = (control as Input).value;
        if (value.trim() === '')
            this.renderNav(this._navItems);
        else {
            this._searching = true;
            const filteredNavItems = this._flatNavItems.filter(v => v.caption.trim().toLowerCase().indexOf(value.trim().toLowerCase()) >= 0);
            this.renderNav(filteredNavItems, true);
        }
    }

    private flattenNavItem(navItems: INavItem[]): INavItem[] {
        if (!navItems || navItems.length == 0) return [];
        const flattenNavItems: INavItem[] = [];
        for (const navItem of navItems) {
            let additionalNavItems: INavItem[] = [];
            if (navItem.navItems) {
                additionalNavItems = this.flattenNavItem(navItem.navItems);
            }
            flattenNavItems.push(navItem, ...additionalNavItems);
        }
        return flattenNavItems;
    }

    private findSiblingsById(navItems: INavItem[], navItemId: number | string): INavItem[] | undefined {
        for (const navItem of navItems) {
            if (navItem.id === navItemId)
                return navItems;
            else if (navItem.navItems && navItem.navItems.length > 0) {
                const siblings = this.findSiblingsById(navItem.navItems, navItemId);
                if (siblings !== undefined)
                    return siblings;
            }
        }
    }

    private findParentNavItem(navItems: INavItem[], navItemId: number | string): INavItem | undefined {
        for (const navItem of navItems) {
            if (navItem.navItems && navItem.navItems.length > 0) {
                if (navItem.navItems.find(item => item.id === navItemId))
                    return navItem;
                else {
                    const parentNavItem = this.findParentNavItem(navItem.navItems, navItemId);
                    if (parentNavItem)
                        return parentNavItem;
                }
            }
        }
    }

    private findParentPathByNavItem(navItem: INavItem): string {
        if (!navItem) return '';
        let parentNavItem = this.findParentNavItem(this._navItems, navItem.id);
        if (!parentNavItem) return '';
        let path = parentNavItem.caption;
        while (parentNavItem) {
            parentNavItem = this.findParentNavItem(this._navItems, parentNavItem.id);
            if (parentNavItem)
                path = `${parentNavItem.caption} / ${path}`;
        }
        return path;
    }
}

@customElements("i-nav-item")
export class NavItem extends Control {
    private _navItems: INavItem[];
    private _wrapper: GridLayout;
    private _caption: string;
    private _back: boolean;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {});
    }

    static async create(options?: NavItemElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    protected init() {
        super.init();
        this._caption = this.getAttribute('caption', true);
        this._navItems = this.getAttribute('navItems', true);
        this._back = this.getAttribute('back', true);
        const id = this.getAttribute('id', true);
        if (id)
            this.setAttribute('nav-id', id);
        this.render();
        this.appendChild(this._wrapper);
    }

    private render() {
        const templateColumns = [];
        if (this._back)
            templateColumns.push('18px');
        templateColumns.push('1fr');
        if (this._navItems && this._navItems.length > 0)
            templateColumns.push('18px');
        this._wrapper = new GridLayout(undefined, {
            templateColumns,

        })
        if (this._back) {
            new Icon(this._wrapper, {
                name: 'chevron-left',
            });
        }

        new Label(this._wrapper, {
            caption: this._caption
        });

        if (!this._back && this._navItems && this._navItems.length > 0) {
            new Icon(this._wrapper, {
                name: 'chevron-right',
            })
        }
    }
}

