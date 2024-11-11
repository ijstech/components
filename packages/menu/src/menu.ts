import { Control, ControlElement, customElements, FontStyle, IContextMenu, IFont, ISpace, SpaceValue, TextTransform } from "@ijstech/base";
import { Link, LinkElement } from '@ijstech/link';
import { Icon, IconElement } from '@ijstech/icon';
import { Modal, ModalPopupPlacementType } from '@ijstech/modal';
import { Panel } from '@ijstech/layout';
import { menuStyle, meunItemStyle, modalStyle } from "./style/menu.css";
import { GroupType } from "@ijstech/types";
import * as Styles from '@ijstech/style';

const Theme = Styles.Theme.ThemeVars;
export type MenuMode = "horizontal" | "vertical" | "inline";
type AlignType = 'left'|'right'|'center';

export interface MenuItemElement extends IMenuItem {
  level?: number;
}
export interface IMenuItem extends ControlElement {
  title?: string;
  link?: LinkElement;
  icon?: IconElement;
  items?: IMenuItem[];
  textAlign?: AlignType;
};
export interface MenuElement extends ControlElement {
  mode?: MenuMode;
  data?: IMenuItem[];
  items?: MenuItem[];
  onItemClick?: (target: Menu, item: MenuItem) => void;
};
export interface ContextMenuElement extends ControlElement {
  data?: IMenuItem[];
  items?: MenuItem[];
  onItemClick?: (target: Menu, item: MenuItem) => void;
};
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-menu"]: MenuElement;
      ["i-menu-item"]: MenuItemElement;
      ["i-context-menu"]: ContextMenuElement;
    }
  }
};
const menuPopupTimeout = 150;

const DEFAULT_VALUES = {
  mode: 'horizontal'
}

@customElements('i-menu', {
  icon: 'bars',
  group: GroupType.BASIC,
  className: 'Menu',
  props: {
    mode: {
      type: 'string',
      default: DEFAULT_VALUES.mode
    },
    data: {type: 'array', default: []}
  },
  events: {
    onItemClick: [
      {name: 'target', type: 'Menu', isControl: true},
      {name: 'item', type: 'MenuItem', isControl: true}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['horizontal', 'vertical', 'inline'],
        default: DEFAULT_VALUES.mode
      }
    }
  }
})
export class Menu extends Control {
  private menuElm: HTMLElement;

  private _mode: MenuMode;
  private _data: IMenuItem[];
  private _items: MenuItem[];
  private moreItem: MenuItem;
  public onItemClick: (target: Menu, item: MenuItem) => void;
  private _oldWidth: number = 0;
  private itemsWidth: number[];
  private resizeTimeout: any;
  private _selectedItem: MenuItem | undefined;

  add(options?: IMenuItem): MenuItem{
    const newItem = new MenuItem(this, {...(options || {}), linkTo: this, level: 0});
    this.menuElm.appendChild(newItem);
    this._items.push(newItem);
    this._data.push(options || {});
    if (this._mode === 'horizontal') this.handleResize();
    return newItem;
  };
  delete(item: MenuItem): void {
    const index = this.items.findIndex(menu => menu.isEqualNode(item));
    if (index !== -1) {
      this.menuElm.removeChild(item);
      this._items.splice(index, 1);
      this._data.splice(index, 1);
      item.remove();
      if (this._mode === 'horizontal') this.handleResize();
    }
  }
  get mode(): MenuMode {
    return this._mode;
  }
  set mode(value: MenuMode) {
    if (this._mode === value) return;
    if (this._mode) {
      this.menuElm.classList.remove(`menu-${this._mode}`)
    }
    this._mode = value;
    this.menuElm.classList.add(`menu-${this._mode}`);
    this.handleUpdateMode(value);
  }

  get data(): IMenuItem[] {
    return this._data;
  }
  set data(value: IMenuItem[]) {
    this.clear();
    this._data = value;
    this.renderItem(value);
  }

  get items(): MenuItem[] {
    return this._items;
  }
  set items(items: MenuItem[]) {
    this.clear();
    this._items = items;
    this.menuElm.innerHTML = "";
    if (items && items.length) {
      this.updateItemOptions(items);
      this.menuElm.append(...items);
      if (this._mode === 'horizontal') this.handleResize();
    }
  }

  get selectedItem(): MenuItem | undefined {
    return this._selectedItem;
  }

  set selectedItem(item: MenuItem | undefined) {
    if (item == null) {
      if (this._selectedItem) {
        this._selectedItem.selected = false;
      }
      this._selectedItem = undefined;
    } else {
      this._selectedItem = item;
      this._selectedItem.selected = true;
    }
  }

  private updateItemOptions(items: MenuItem[], level = 0) {
    if (!items || !items?.length) return;
    for (let item of items) {
      item.linkTo = this;
      item.level = level;
      if (item.children?.length) {
        let items: MenuItem[] = [];
        for(let child of item.children) {
          if (child instanceof MenuItem) {
            items.push(child);
          }
        }
        this.updateItemOptions(items, level + 1);
        item.items = items;
      }
    }
  }

  get menuItems(): MenuItem[] {
    if (this.moreItem) {
      return [...this.items, ...(this.moreItem?.items || [])];
    }
    return this.items;
  }

  private clear() {
    this._items = [];
    this.itemsWidth = [];
    this.menuElm.innerHTML = "";
    if (this.moreItem) this.moreItem.items = [];
  }

  private async renderItem(items: IMenuItem[]) {
    const _items: MenuItem[] = [];
    const menuItemElm: Node[] = [];
    for (const item of items) {
      const menuItem = await MenuItem.create({ ...item, linkTo: this, level: 0 }, this);
      menuItemElm.push(menuItem);
      _items.push(menuItem);
    }
    this.menuElm.innerHTML = "";``
    this.menuElm.append(...menuItemElm);
    this._items = _items;
    if (this._mode === 'horizontal') this.handleResize();
  }

  private async handleUpdateMode(mode: MenuMode) {
    if (this._mode === 'horizontal') {
      if (!this.moreItem) {
        this.moreItem = await MenuItem.create({ title: '⋯', linkTo: this, level: 0 });
        this.moreItem.classList.add('more-menu-item', 'hide-arrow-icon')
      }
      window.addEventListener('resize', this.handleResize);
    } else {
      window.removeEventListener('resize', this.handleResize);
      if (this.moreItem && this.menuElm.contains(this.moreItem)) this.menuElm.removeChild(this.moreItem);
    }
    this.rerenderItems(this._items);
  }

  private rerenderItems(items: MenuItem[]) {
    if (items?.length) {
      for (let item of items) {
        if (item.items?.length) {
          item.items = [...item.items];
          this.rerenderItems(item.items);
        }
      }
    }
  }

  private onResize() {
    const newWidth = Math.ceil(window.innerWidth);
    let offsetWidth = Math.ceil(this.menuElm.offsetWidth);
    let scrollWidth = Math.ceil(this.menuElm.scrollWidth);
    if (this._oldWidth >= newWidth) {
      let i: number = this._items.length - 1;
      const tmpItems: MenuItem[] = [];
      while (scrollWidth > offsetWidth && i >= 0) {
        if (!this.menuElm.contains(this.moreItem)) {
          this.menuElm.appendChild(this.moreItem);
        }
        this.itemsWidth.push(this._items[i].offsetWidth);
        tmpItems.push(this._items[i]);
        this._items[i].level = 1;
        this.menuElm.removeChild(this._items[i]);
        this._items.splice(i, 1);
        offsetWidth = Math.ceil(this.menuElm.offsetWidth);
        scrollWidth = Math.ceil(this.menuElm.scrollWidth);
        i--;
      }
      if (tmpItems.length) {
        const moreItems = this.moreItem?.items || [];
        this.moreItem.items = [ ...moreItems, ...tmpItems ];
      }
    } else if (this._oldWidth <= newWidth && this.moreItem?.items?.length) {
      let i: number = this.moreItem.items.length - 1 || 0 ;
      let totalItemsWidth = this._items.reduce((prev, curr) => prev + Math.ceil(curr.offsetWidth), 0) + this.moreItem.offsetWidth + this.itemsWidth[0];
      let index = -1;
      while (totalItemsWidth <= offsetWidth && i >= 0) {
        index = i;
        const menuItem = this.moreItem.items[i];
        this.menuElm.insertBefore(menuItem, this.moreItem);
        this._items.push(menuItem);
        menuItem.level = 0;
        offsetWidth = Math.ceil(this.menuElm.offsetWidth);
        totalItemsWidth += this.itemsWidth.shift() || 0;
        i--;
      }
      if (index != -1) {
        this.moreItem.items = this.moreItem.items.slice(0, index);
      }
      if (!this.moreItem.items.length && this.menuElm.contains(this.moreItem)) {
        this.menuElm.removeChild(this.moreItem);
      }
    }
    this._oldWidth = newWidth;
  }

  private handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.onResize();
    }, 200);
  }

  protected init() {
    if (!this.initialized) {
      let menuItems: MenuItem[] = [];
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        if (child instanceof MenuItem) {
          menuItems.push(child);
        } else {
          child.remove();
        }
      }
      super.init();
      this.classList.add(menuStyle);
      this.itemsWidth = [];
      this.handleResize = this.handleResize.bind(this);
      this.onResize = this.onResize.bind(this);
      this.menuElm = this.createElement("ul", this);
      this.menuElm.classList.add("menu");
      this.mode = this.getAttribute('mode', true, DEFAULT_VALUES.mode);
      this.data = this.getAttribute('data', true, []);
      const items = this.getAttribute('items', true, []);
      if (menuItems?.length) this.items = menuItems;
      else if (items?.length) this.items = items;
    }
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
    super.disconnectedCallback();
  }


  static async create(options?: MenuElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
@customElements('i-context-menu')
export class ContextMenu extends Menu implements IContextMenu {
  private modal: Modal;
  private openTimeout: any;
  private itemPanel: Panel;

  show(pos: {x: number, y: number}): void{
    const { x, y } = pos;
    this.handleModalOpen(x, y);
  }

  hide() {
    clearTimeout(this.openTimeout);
    if (this.modal) {
      this.modal.visible = false;
    }
  }

  private async renderItemModal(x: number, y: number) {
    const background = this.getAttribute('background', true);
    const font = this.getAttribute('font', true);
    const minWidth = this.getAttribute('minWidth', true);
    if (!this.modal) {
      this.modal = await Modal.create({
        showBackdrop: false,
        height: 'auto',
        width: 'auto',
        popupPlacement: 'right',
        font: font || {color: Theme.text.primary},
        minWidth: minWidth || 'auto'
      });
      this.modal.classList.add(modalStyle);
      this.modal.visible = false;
      this.getModalContainer().appendChild(this.modal);
      this.getModalContainer().style.position = 'fixed';
    }
    if (background?.color) {
      this.modal.background = background;
    }
    if (font) {
      this.modal.font = font;
    }

    this.getModalContainer().style.left = `${x}px`;
    this.getModalContainer().style.top = `${y}px`;
    this.getModalContainer().style.zIndex = `9999`;
    if (!this.itemPanel)
      this.itemPanel = await Panel.create();
    this.itemPanel.innerHTML = "";
    if (this.items && this.items.length) {
      if (font) {
        for (let item of this.items) {
          item.font = font;
        }
      }
      this.itemPanel.append(...this.items);
    }
    this.modal.item = this.itemPanel;
  }

  private getModalContainer() {
    let span = document.getElementById("modal-context");
    if (!span) {
      span = this.createElement("span", document.body);
      span.id = "modal-context";
    }
    return span;
  }

  private async handleModalOpen(x: number, y: number) {
    await this.renderItemModal(x, y);
    clearTimeout(this.openTimeout);
    this.openTimeout = setTimeout(() => {
      if (this.items && this.items.length) this.modal.visible = true;
    }, menuPopupTimeout);
  }
};

const DEFAULT_ITEM = {
  target: '_blank',
  textAlign: 'left'
}

@customElements('i-menu-item', {
  icon: 'bars',
  className: 'MenuItem',
  props: {
    title: { type: 'string', default: '' },
    link: {
      type: 'object',
      default: { target: DEFAULT_ITEM.target }
    },
    items: { type: 'array', default: [] },
    icon: { type: 'object', default: {}},
    textAlign: { type: 'string', default: DEFAULT_ITEM.textAlign }
  },
  events: {},
  dataSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string'
      },
      icon: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          width: {
            type: 'number'
          },
          height: {
            type: 'number'
          },
          fill: {
            type: 'string',
            format: 'color'
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
      link: {
        type: 'object',
        properties: {
          href: {
            type: 'string'
          },
          target: {
            type: 'string',
            enum: ['_blank', '_self', '_parent', '_top'],
            default: DEFAULT_ITEM.target
          }
        }
      },
      textAlign: {
        type: 'string',
        enum: ['left', 'right', 'center'],
        default: DEFAULT_ITEM.textAlign
      }
    }
  }
})
export class MenuItem extends Control {
  private itemElm: HTMLElement;
  private itemWrapperElm: HTMLElement;
  private captionElm: HTMLElement;
  private subMenu: HTMLElement;
  private arrowIcon: Icon;
  private modal: Modal;
  private itemPanel: Panel;
  protected _linkTo: Menu;

  private _link: Link;
  private _icon: Icon;
  private _items: MenuItem[];
  private openTimeout: any;
  private closeTimeout: any;
  private _level: number = 0;
  private _textAlign: AlignType = DEFAULT_ITEM.textAlign as AlignType;

  constructor(parent?: Control, options?: MenuItemElement) {
    super(parent, options);
  }
  add(options?: IMenuItem): MenuItem{
    const newItem = new MenuItem(this, options);
    if (!this._items) this._items = [];
    this._items.push(newItem);
    newItem.level = this._level + 1;
    newItem.linkTo = this._linkTo;
    this.items = this._items;
    return newItem;
  };
  delete(item: MenuItem): void{
    const index = this.items.findIndex(menu => menu.isEqualNode(item));
    if (index !== -1) {
      let mode: MenuMode = this.menuMode();
      if (mode === 'inline') {
        this.subMenu.removeChild(item);
      }
      this._items.splice(index, 1);
      item.remove();
    }
  };
  get title(): string {
    return this.captionElm.innerHTML;
  }
  set title(value: string) {
    this.captionElm.innerHTML = value || "";
  }

  set font(value: IFont) {
    if (!this.itemWrapperElm) return;
    this.itemWrapperElm.style.color = value.color || '';
    this.itemWrapperElm.style.fontSize = value.size || '';
    this.itemWrapperElm.style.fontFamily = value.name || '';
    this.itemWrapperElm.style.fontStyle = value.style || '';
    this.itemWrapperElm.style.textTransform = value.transform || 'none';
    this.itemWrapperElm.style.fontWeight = value.bold ? 'bold' : `${value.weight || ''}`;
    this.itemWrapperElm.style.textShadow = value.shadow || 'none';
  }
  get font(): IFont{
    if (!this.itemWrapperElm) return {};
    return {
      color: this.itemWrapperElm.style.color,
      name: this.itemWrapperElm.style.fontFamily,
      size: this.itemWrapperElm.style.fontSize,
      bold: this.itemWrapperElm.style.fontStyle.indexOf('bold') >= 0,
      style: this.itemWrapperElm.style.fontStyle as FontStyle,
      transform: this.itemWrapperElm.style.textTransform as TextTransform,
      weight: this.itemWrapperElm.style.fontWeight,
      shadow: this.itemWrapperElm.style.textShadow
    }
  }

  get link(): Link {
    if (!this._link) {
      this._link = <any>Link.create({
        href: '#',
        target: '_self',
        font: this.font,
        designMode: this.linkTo?.designMode
      }, this);
    }
    return this._link;
  }
  set link(value: Link) {
    if (this._link) {
      this._link.prepend(this.itemWrapperElm);
      this._link.remove();
    }
    this._link = value;
    if (this._link) {
      this._link.designMode = this.linkTo?.designMode;
      this._link.append(this.itemWrapperElm);
      this.itemElm.appendChild(this._link);
    } else {
      this.itemElm.appendChild(this.itemWrapperElm);
    }
  }

  get icon(): Icon {
    if (!this._icon) {
      this._icon = <any>Icon.create({
        width: 16,
        height: 16
      }, this);
    };
    return this._icon;
  }
  set icon(elm: Icon) {
    if (this._icon)
      this.itemWrapperElm.removeChild(this._icon);
    this._icon = elm;
    if (this._icon) {
      this.icon.classList.add("menu-item-icon");
      this.itemWrapperElm.prepend(this._icon);
    }
  }

  get items(): MenuItem[] {
    return this._items;
  }
  set items(items: MenuItem[]) {
    this._items = items;
    for (let item of this._items) {
      item.remove();
      if (!item.linkTo) item.linkTo = this._linkTo;
      if (item._level == 0) item.level = (this._level || 0) + 1;
    }
    this.renderArrowIcon();
    this.renderSubMenuItem();
  }

  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value: AlignType) {
    this._textAlign = value;
    this.style.setProperty('--custom-text-align', value);
  }

  set level(value: number) {
    this.updateLevel(value);
  }

  get padding(): ISpace {
    return this._padding;
  }
  set padding(value: ISpace) {
    if (!this.itemWrapperElm) return;
    if (!this._padding)
      this._padding = new SpaceValue(this.itemWrapperElm as Control, value, 'padding');
    else
      this._padding.update(value);
  }

  set selected(value: boolean) {
    if (value) {
      this.setSelectedItem();
    } else {
      this.isSelected = false;
      if (this.subMenu) {
        this.subMenu.style.display = 'none';
      }
    }
  }

  private get isSelected(): boolean {
    return this.itemWrapperElm.classList.contains("menu-selected");
  }
  private set isSelected(value: boolean) {
    if (!this.itemWrapperElm) return;
    const isInline = this.menuMode() === 'inline';
    if (value) {
      this.itemWrapperElm.classList.add("menu-selected");
      if (this.arrowIcon && isInline) {
        this.arrowIcon.classList.add("menu-item-arrow-active");
      }
    } else {
      this.itemWrapperElm.classList.remove("menu-selected");
      if (this.arrowIcon && isInline) {
        this.arrowIcon.classList.remove("menu-item-arrow-active");
      }
    }
  }

  private updateLevel(level: number) {
    if (this._linkTo) {
      this._level = level;
      if (this.modal) {
        this.modal.popupPlacement = this.getModalPlacement();
        if (this._level > 0) {
          this.modal.position = "absolute";
          this.appendChild(this.modal);
        } else {
          this.modal.position = "fixed";
          this.getModalContainer().appendChild(this.modal);
        }
      }
    }
  }

  private menuMode() {
    let mode: MenuMode = DEFAULT_VALUES.mode as MenuMode;
    if (this._linkTo) {
      mode = this._linkTo.mode;
    }
    return mode;
  }

  private async renderArrowIcon() {
    const isInline = this.menuMode() === 'inline';
    if (!this.arrowIcon) {
      this.arrowIcon = await Icon.create({
        name: "chevron-down",
        fill: 'currentColor'
      });
      this.arrowIcon.classList.add("menu-item-arrow");
    }
    this.arrowIcon.width = isInline ? 30 : 12;
    this.arrowIcon.height = isInline ? 30 : 12;
    if (this._items && this._items.length) {
      if (!isInline && !this.itemWrapperElm.contains(this.arrowIcon)) {
        this.itemWrapperElm.appendChild(this.arrowIcon);
      } else if (isInline && !this.itemElm.contains(this.arrowIcon)) {
        this.itemElm.appendChild(this.arrowIcon);
      }
      this.itemWrapperElm.classList.add("has-children");
    } else {
      if (!isInline && this.itemWrapperElm.contains(this.arrowIcon)) {
        this.itemWrapperElm.removeChild(this.arrowIcon);
      } else if (isInline && this.itemElm.contains(this.arrowIcon)) {
        this.itemElm.removeChild(this.arrowIcon);
      }
      this.itemWrapperElm.classList.remove("has-children");
    }
  }

  private renderSubMenuItem() {
    let mode: MenuMode = this.menuMode();
    if (mode === 'inline') {
      this.itemWrapperElm.style.setProperty('--menu-item-level', this._level.toString());
      if (!this._items.length && !this.subMenu) return;
      this.itemElm.removeEventListener('mouseenter', this.handleModalOpen);
      this.itemElm.removeEventListener('mouseleave', this.handleModalClose);
      if (this.modal) {
        this.modal.removeEventListener('mouseenter', this.handleModalOpen);
        this.modal.removeEventListener('mouseleave', this.handleModalClose);
        this.modal.remove();
      }
      if (!this.subMenu) {
        this.subMenu = this.createElement('div', this);
        this.subMenu.classList.add("sub-menu");
        this.subMenu.style.display = 'none';
      }
      this.subMenu.append(...this.items);
    } else {
      if (this.items && this.items.length) {
        this.itemElm.addEventListener('mouseenter', this.handleModalOpen);
        this.itemElm.addEventListener('mouseleave', this.handleModalClose);
      } else {
        this.itemElm.removeEventListener('mouseenter', this.handleModalOpen);
        this.itemElm.removeEventListener('mouseleave', this.handleModalClose);
      }
      if (this.subMenu) {
        this.subMenu.remove();
      }
      this.itemWrapperElm.style.removeProperty('--menu-item-level');
    }
  }

  private async renderItemModal() {
    if (!this.modal) {
      const placement = this.getModalPlacement();
      this.modal = await Modal.create({
        showBackdrop: false,
        height: 'auto',
        width: 'auto',
        popupPlacement: placement
      });
      this.modal.linkTo = this;
      this.modal.visible = false;
      this.modal.classList.add("menu-item-modal", modalStyle);
      this.modal.addEventListener('mouseenter', this.handleModalOpen)
      this.modal.addEventListener('mouseleave', this.handleModalClose)
      if (this._level > 0) {
        this.appendChild(this.modal);
      } else {
        this.modal.position = "fixed";
        this.getModalContainer().appendChild(this.modal);
      }
    }
    if (!this.itemPanel) {
      this.itemPanel = await Panel.create();
      if (this.className.includes('more-menu-item')) {
        this.itemPanel.classList.add('reverse-menu')
      }
    }
    this.itemPanel.innerHTML = "";
    if (this._items?.length) {
      this.itemPanel.append(...this._items);
    }
    this.modal.item = this.itemPanel;
  }

  private getModalPlacement() {
    let mode: MenuMode = this.menuMode();
    let placement: ModalPopupPlacementType = "bottomLeft";
    switch (mode) {
      case "vertical":
        placement = "right";
        break;
      case "horizontal":
        placement = this._level > 0 ? 'right' : 'bottomLeft';
    }
    return placement;
  }

  private getModalContainer() {
    let span = document.getElementById("modal-container");
    if (!span) {
      span = this.createElement("span", document.body);
      span.id = "modal-container";
    }
    return span;
  }

  private setSelectedItem() {
    if (this._linkTo) {
      let mode = this._linkTo.mode;
      this.isSelected = this.items && this.items.length ? !this.isSelected : true;
      if (this.subMenu) {
        this.subMenu.style.display = this.isSelected ? 'block' : 'none';
      }
      this.handleSelectItem(this._linkTo.menuItems, mode);
    } else {
      this.isSelected = true;
    }
  }

  private handleSelectItem(items: MenuItem[], mode: MenuMode) {
    items.forEach(item => {
      const isCurrItem = item.isSameNode(this);
      if (isCurrItem) return;
      const containsItem = item.contains(this);
      if (!isCurrItem) item.isSelected = containsItem ? this.isSelected : false;
      if (mode === 'inline' && item.subMenu && !containsItem) {
        item.subMenu.style.display = 'none';
      }
      if (item.items) this.handleSelectItem(item.items, mode);
    });
  }

  _handleClick(event: MouseEvent): boolean {
    if (this._designMode) return false;
    if (this._linkTo) {
      this._linkTo.selectedItem = this;
    } else {
      this.setSelectedItem();
    }
    if (this._linkTo?.onItemClick && typeof this._linkTo.onItemClick === 'function')
      this._linkTo.onItemClick(this._linkTo, this);
    return super._handleClick(event, true);
  }

  private async handleModalOpen(event: MouseEvent) {
    if (this._designMode) return false;
    await this.renderItemModal();
    clearTimeout(this.closeTimeout);
    this.itemWrapperElm.classList.add("menu-active");
    this.openTimeout = setTimeout(() => {
      if (this._items && this._items.length) this.modal.visible = true;
    }, menuPopupTimeout);
  }

  private handleModalClose(event: MouseEvent) {
    if (this._designMode) return false;
    clearTimeout(this.openTimeout);
    this.itemWrapperElm.classList.remove("menu-active");
    this.closeTimeout = setTimeout(() => {
      if (this.modal) this.modal.visible = false;
    }, menuPopupTimeout);
  }

  protected init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(meunItemStyle);
      this.handleModalOpen = this.handleModalOpen.bind(this);
      this.handleModalClose = this.handleModalClose.bind(this);
      this.itemElm = this.createElement("li", this);
      this.itemWrapperElm = this.createElement("div", this.itemElm)
      this.itemWrapperElm.classList.add("menu-item")
      if (this._linkTo?.padding) {
        const padding = this._linkTo.padding;
        this._padding = new SpaceValue(this.itemWrapperElm as Control, padding, 'padding');
        this._linkTo.style.padding = '';
      }
      this.captionElm = this.createElement("span", this.itemWrapperElm);

      this.level = this.getAttribute('level', true, 0);
      this.title = this.getAttribute('title', true);
      const textAlign = this.getAttribute('textAlign', true);
      if (textAlign) this.textAlign = textAlign;
      const link: LinkElement = this.getAttribute('link', true);
      if (link?.href) {
        link.target = link.target || "_self";
        this.link = new Link(this, {...link, designMode: this.linkTo?.designMode});
      }
      const icon: IconElement = this.getAttribute('icon', true);
      if (icon?.name || icon?.image?.url) {
        icon.height = icon.height || '16px';
        icon.width = icon.width || '16px';
        this.icon = new Icon(this, icon);
      };
      const _items: IMenuItem[] = this.getAttribute('items', true, []);
      if (_items?.length) {
        let menuItems = [];
        for (const item of _items) {
          const menuItem = new MenuItem(undefined, { ...item, linkTo: this._linkTo, level: this._level + 1 });
          menuItems.push(menuItem);
        }
        this.items = menuItems;
      }
      const font = this.getAttribute('font', true)
      if (font) this.font = font;
    }
  }

  static async create(options?: MenuItemElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
