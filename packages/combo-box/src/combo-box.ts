import { Control, ControlElement, customElements, notifyEventCallback, IBorder, Border, IFont, IBackground, Background, observable, I18n } from "@ijstech/base";
import { Icon, IconElement } from "@ijstech/icon";
import { Theme } from "@ijstech/style";
import "./style/combo-box.css";
import {ItemListStyle} from './style/combo-box.css'
import { GroupType } from "@ijstech/types";
import { ComboBoxItem } from "./combo-box-item";
import { application } from "@ijstech/application";

export interface IComboItem {
  value: string;
  label: string;
  isNew?: boolean;
  description?: string;
  icon?: string;
}
type ModeType = 'single' | 'multiple' | 'tags';

export interface ComboBoxElement extends ControlElement {
  value?: string;
  selectedItem?: IComboItem;
  selectedItems?: IComboItem[];
  items?: IComboItem[];
  icon?: IconElement;
  mode?: ModeType;
  readOnly?: boolean;
  placeholder?: string;
  onChanged?: notifyEventCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-combo-box"]: ComboBoxElement;
    }
  }
}

const DEFAULT_VALUES = {
  mode: 'single',
  readOnly: false,
  icon: {
    width: 16,
    height: 16,
    fill: Theme.ThemeVars.text.primary,
    name: 'angle-down'
  }
}

@customElements('i-combo-box', {
  icon: 'tasks',
  group: GroupType.FIELDS,
  className: 'ComboBox',
  props: {
    selectedItem: { type: 'object' },
    selectedItems: {
      type: 'array',
      default: []
    },
    items: {
      type: 'array',
      default: []
    },
    icon: {
      type: 'object',
      default: {name: 'angle-down'}
    },
    mode: {
      type: 'string',
      default: DEFAULT_VALUES.mode
    },
    readOnly: {
      type: 'boolean',
      default: DEFAULT_VALUES.readOnly
    },
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  events: {
    onChanged: [
      {name: 'target', type: 'Control', isControl: true},
      {name: 'event', type: 'Event'}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['value', 'label'],
          properties: {
            value: {
              type: 'string'
            },
            label: {
              type: 'string'
            }
          }
        }
      },
      placeholder: {
        type: 'string'
      },
      readOnly: {
        type: 'boolean',
        default: DEFAULT_VALUES.readOnly
      },
      mode: {
        type: 'string',
        enum: ['single', 'multiple', 'tags'],
        default: DEFAULT_VALUES.mode
      },
      icon: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            default: 'angle-down'
          },
          fill: {
            type: 'string'
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
      }
    }
  }
})
export class ComboBox extends Control {
  @observable('value')
  private _value: string | undefined;
  private _selectedItem: IComboItem | undefined;
  private _selectedItems: IComboItem[] | undefined;
  private _caption: string;
  private _captionWidth: number | string;
  private _items: IComboItem[];
  private _icon: Icon;
  private _mode: ModeType;
  private _readOnly: boolean;
  private _placeholder: string;

  private _searchStr: string;
  private newItem: IComboItem | null = null;
  private isListShown: boolean = false;

  private captionSpanElm: HTMLElement;
  private labelElm: HTMLLabelElement;
  private inputWrapElm: HTMLElement;
  private inputElm: HTMLInputElement;
  private iconElm: HTMLElement;
  private listElm: HTMLElement;

  private callback: (value: any) => void;
  public onChanged: notifyEventCallback;

  constructor(parent?: Control, options?: any) {
    super(parent, options, {
      mode: DEFAULT_VALUES.mode
    });
  }

  get value(): string | undefined {
    return this._value;
  }
  set value(value: string | undefined) {
    this._value = value;
    if (Array.isArray(this.items)) {
      const selectedItem = this.items.find(item => item.value === value);
      this.selectedItem = selectedItem;
    }
  }

  get selectedItem(): IComboItem | undefined {
    return this._selectedItem;
  }
  set selectedItem(value: IComboItem | undefined) {
    if (!value) {
      this.clear();
      return;
    }

    const isValueValid = this.isValueValid(value);
    this.updateItems(value, isValueValid);
  }

  get selectedItems(): IComboItem[] | undefined {
    return this._selectedItems;
  }
  set selectedItems(value: IComboItem[] | undefined) {
    if (!value || value.length === 0) {
      this.clear();
      return;
    }
    let isValueValid = false;
    let validValue: IComboItem[] = [];

    if (this.isMulti) {
      validValue = [...value].filter(item => this.isValueValid(item));
      isValueValid = !!validValue.length;
    } else {
      validValue = value;
      isValueValid = this.isValueValid(value[0]);
    }
  
    this.updateItems(value, isValueValid);
  }

  private renderSelectedItems() {
    if (this.inputElm) {
      this.inputElm.value = '';
      this.inputElm.style.display = "none";
    }
    const selectionItems = Array.from(this.inputWrapElm.querySelectorAll('.selection-item'));
    selectionItems.forEach(elm => this.inputWrapElm.removeChild(elm));
    if (!this._selectedItems || !this._selectedItems?.length) return;
    this._selectedItems.forEach(item => {
      const itemElm = this.createElement('div');
      itemElm.classList.add('selection-item');
      const content = this.createElement('span', itemElm);
      content.textContent = this.getTranslatedText(item.label || '');
      itemElm.appendChild(content);
      const closeButton = this.createElement('span', itemElm);
      closeButton.classList.add("close-icon");
      closeButton.innerHTML = "&times;"
      closeButton.addEventListener('click', (event: Event) => this.handleRemove(event, item));
      this.inputWrapElm.appendChild(itemElm);
      this.inputWrapElm.insertBefore(itemElm, this.inputElm);
    })
  }

  private renderInvalidItems() {
    this.inputElm.value = '';
    this.inputElm.style.display = "";
    const selectionItems = Array.from(this.inputWrapElm.querySelectorAll('.selection-item'));
    selectionItems.forEach(elm => this.inputWrapElm.removeChild(elm));
  }

  private updateItems(value: IComboItem[]|IComboItem, isValid: boolean) {
    if (isValid) {
      this._selectedItem = Array.isArray(value) ? value[0] : value;
      this._selectedItems = Array.isArray(value) ? value : [value];
      this._value = this._selectedItem?.value;

      if (this.mode === 'single') {
        this.inputElm.value = this.getTranslatedText(this._selectedItem?.label || '');
      } else {
        this.renderSelectedItems();
      }
      if (this.callback) this.callback(value);
    } else if (this.isMulti) {
      this._selectedItems = Array.isArray(value) ? value : [value];
      this.renderInvalidItems();
    }
  }

  updateLocale(i18n: I18n): void {
    if (this.labelElm && this._caption?.startsWith('$'))
      this.labelElm.innerHTML = i18n.get(this._caption) || '';
    if (this.inputElm && this._placeholder?.startsWith('$'))
      this.inputElm.placeholder = i18n.get(this._placeholder) || '';
  }

  get caption(): string{
    return this.getTranslatedText(this._caption || '');
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value;
    this.labelElm.style.display = !value ? 'none' : '';
    if (!this.labelElm) return;
    this.labelElm.innerHTML = this.caption;
  }

  get captionWidth(): number | string {
    return this._captionWidth;
  }
  set captionWidth(value: number | string) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, 'width', value);
  }

  get items(): IComboItem[] {
    return this._items;
  }
  set items(items: IComboItem[]) {
    this._items = Array.isArray(items) ? items : [];
    if (this.listElm) {
      this.listElm.innerHTML = "";
      if (this._value !== undefined) {
        this.value = this._value;
      }
      this.renderItems();
    }
  }

  get icon(): Icon {
    if (!this._icon) {
      this._icon = new Icon(undefined, DEFAULT_VALUES.icon);
      if (this.iconElm)
        this.iconElm.appendChild(this._icon);
    }
    return this._icon;
  }
  set icon(value: Icon) {
    if (this.iconElm) {
      if (this._icon && this.iconElm.contains(this._icon))
        this.iconElm.removeChild(this._icon);
      this._icon = value;
      if (this._icon)
        this.iconElm.appendChild(this._icon);
    }
  }

  get searchStr(): string {
    return this._searchStr;
  }
  set searchStr(str: string) {
    this._searchStr = str || '';
  }

  get placeholder(): string {
    return this.getTranslatedText(this._placeholder || '');
  }
  set placeholder(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._placeholder = value;
    if (this.inputElm) this.inputElm.placeholder = this.placeholder;
  }

  private getTranslatedText(value: string): string {
    if (value?.startsWith('$')) {
      const translated =
        this.parentModule?.i18n?.get(value) ||
        application.i18n?.get(value) ||
        ''
      return translated;
    }
    return value;
  }

  get mode(): ModeType {
    return this._mode;
  }
  set mode(value: ModeType) {
    this._mode = value;
    if (this.isMulti)
      this.classList.add('i-combo-box-multi');
    else
      this.classList.remove('i-combo-box-multi');
  }

  get isMulti() {
    return this.mode === 'tags' || this.mode === 'multiple';
  }

  set border(value: IBorder) {
    super.border = value;
    const hasBorderSide = this.border.bottom || this.border.top || this.border.left || this.border.right;
    if (this.border.style || hasBorderSide) {
      this.inputWrapElm && (this.inputWrapElm.style.borderStyle = 'none');
      this.iconElm && (this.iconElm.style.borderStyle = 'none');
    }
  }
  get border(): Border {
    return super.border;
  }

  get enabled(): boolean {
    return super.enabled;
  }
  set enabled(value: boolean) {
    super.enabled = value;
    if (this.inputElm) {
      this.inputElm.disabled = !value;
    }
  }

  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(value: boolean) {
    this._readOnly = value;
    if (this.inputElm) {
      this.inputElm.readOnly = value;
    }
  }

  get background(): Background {
    return this._background;
  }
  set background(value: IBackground) {
    super.background = value;
    if (value && value.color !== undefined) {
      this.style.setProperty('--combobox-background', value.color);
    } else {
      this.style.removeProperty('--combobox-background');
    }
  }

  get font(): IFont {
      return this._font;
  }
  set font(value: IFont) {
    super.font = value;
    if (value && value.color !== undefined) {
      this.style.setProperty('--combobox-font_color', value.color);
    } else {
      this.style.removeProperty('--combobox-font_color');
    }
  }

  private isValueValid(value: IComboItem) {
    if (!value) return false;
    const index = this.getItemIndex(this.items, value);
    return index >= 0;
  }

  private getItemIndex(items: IComboItem[], item: IComboItem): number {
    const value = item?.value?.toString();
    if (!value && value !== '') return -1;
    const index = items.findIndex((_item: IComboItem) => {
      return _item.value.toString().toLowerCase() === value.toLowerCase();
    });
    return index;
  }

  private openList() {
    this.isListShown = true;
    window.document.body.append(this.listElm);
    this.listElm.classList.add("show");
    this.listElm.style.display = 'block';
    this.calculatePositon();
    if (!this.searchStr) this.renderItems();
  }

  calculatePositon() {
    let parentElement = this.linkTo || this;
    let rect = parentElement.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    const scrollLeft = document.documentElement.scrollLeft || window.pageXOffset;

    const top = rect.top + scrollTop + rect.height;
    const left = rect.left + scrollLeft; // + this.captionSpanElm.offsetWidth;
    const width = rect.right - rect.left; // - this.captionSpanElm.offsetWidth;

    this.listElm.style.top = top + 'px';
    this.listElm.style.left = left + 'px';
    this.listElm.style.width = width + 'px';
  }

  private closeList() {
    this.isListShown = false;
    this.listElm.remove();
    this.listElm.style.display = 'none'
    this.listElm.classList.remove("show");
    this.searchStr = "";
    if (this.isMulti) return;
    const label = this.getTranslatedText(this.selectedItem?.label || '');
    if (label && this.inputElm)
      this.inputElm.value = label;
  }

  private toggleList() {
    this.isListShown ? this.closeList() : this.openList();
  }

  private escapeRegExp(text: string) {
    return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : text;
  }

  private renderItems() {
    if (this.mode === 'tags' && this.newItem) {
      if (this.searchStr) this.newItem.label = this.searchStr;
      const liElm = this.listElm.querySelector(`li[data-key="${this.newItem.value}"]`);
      if (liElm) {
        if (this.searchStr) {
          liElm.textContent = this.searchStr;
          liElm.classList.add("matched");
          liElm.innerHTML = `<span class="highlight">${this.searchStr}</span>`;
        } else {
          liElm.remove();
          this.newItem = null;
        }
      } else {
        const ul = this.listElm.querySelector('ul');
        ul && this.add(this.newItem, ul);
      }
    }
  
    const regExp = new RegExp(this.escapeRegExp(this.searchStr), "g");
    this.listElm.innerHTML = "";
    if (this.searchStr) this.openList();
  
    const ulElm = this.createElement("ul", this.listElm);
    let creatingNew = false;
    for (let item of this.items) {
      const label = this.getTranslatedText(item.label || '');
      const isMatchedPart = this.searchStr && label.toLowerCase().includes(this.searchStr.toLowerCase());
      const isMatchedDone = this.searchStr && label.toLowerCase() === this.searchStr.toLowerCase();
      if (item.isNew && isMatchedPart && !isMatchedDone) creatingNew = true;
      if (!this.searchStr || isMatchedDone || isMatchedPart) {
        const liElm = this.createElement("li", ulElm);
        liElm.setAttribute('data-key', item.value);
        liElm.addEventListener("click", (event: Event) => {
          event.stopPropagation();
          this.onItemClick(event, liElm, item);
        });
        if (this.selectedItems?.length && this.isMulti) {
          const index = this.getItemIndex(this.selectedItems, item);
          if (index >= 0) liElm.classList.add("matched");
        } else if (item?.value === this.selectedItem?.value) {
          liElm.classList.add("matched");
        }
        let displayItem: string = '';
        if(item.description) {
            displayItem =
                `<div class="selection-item">
                   <div class="selection-icon">
                       ${item.icon ? `<img src="${item.icon}" style="height: 18px; width: 18px;"/>` : ''}
                   </div>
                   <div>
                      <span class="selection-title">${this.searchStr ? label.replace(regExp, `<span class="highlight">${this.searchStr}</span>`) : label}</span>
                      <span class="selection-description">${this.searchStr ? item.description.replace(regExp, `<span class="highlight">${this.searchStr}</span>`) : item.description}</span>
                   </div>
               </div>`
        }
        else {
          displayItem = this.searchStr
              ? label.replace(regExp, `<span class="highlight">${this.searchStr}</span>`)
              : label;
        }
        liElm.innerHTML = displayItem;
      }
    }
    if (!ulElm.innerHTML || creatingNew) {
      if (this.mode === 'tags') {
        if (!this.newItem)
          this.newItem = {
            value: new Date().getTime().toString(),
            label: this.searchStr
          }
        const liElm = this.listElm.querySelector(`li[data-key="${this.newItem.label}"]`);
        if (!liElm) this.add(this.newItem, ulElm);
      }
      else if (!ulElm.innerHTML)
        ulElm.innerHTML = '<li style="text-align:center;">No data</li>';
    }
  }

  private add(item: IComboItem, parent: HTMLElement) {
    const liElm = this.createElement("li");
    liElm.setAttribute('data-key', item.value);
    liElm.addEventListener("click", (event: Event) => {
      event.stopPropagation();
      this.onItemClick(event,  liElm, item);
    });
    liElm.classList.add("matched");
    liElm.innerHTML = `<span class="highlight">${this.searchStr}</span>`;
    parent.prepend(liElm);
  }

  private handleRemove(event: Event, item: IComboItem) {
    event.stopPropagation();
    if (!this.enabled) return;

    const liElm = this.listElm.querySelector(`li[data-key="${item.value}"]`);
    if (liElm) {
      liElm.classList.remove('matched');
      if (this.mode === 'tags' && item.isNew) {
        liElm.remove();
        this.items = this.items.filter(data => data.value !== item.value);
      }  
    }
    const selectedItems = this.selectedItems || [];
    const selectedIndex = this.getItemIndex(selectedItems, item);
    if (selectedIndex >= 0) selectedItems.splice(selectedIndex, 1);
    this.selectedItems = selectedItems;
    
    if (typeof this.onObserverChanged === 'function')
      this.onObserverChanged(this, event);
    if (typeof this.onChanged === 'function')
      this.onChanged(this, event);
  }

  private onItemClick(event: Event, liElm: HTMLElement, item: IComboItem) {
    if (this.newItem?.value === item.value) {
      item = { ...this.newItem, value: this.newItem.label, isNew: true };
      this.items.push(item);
    }
    this.newItem = null;
  
    if (this.isMulti && this.selectedItems?.length) {
      const index = this.getItemIndex(this.selectedItems, item);
      const selectedItems = this.selectedItems || [];
      if (index >= 0) {
        selectedItems.splice(index, 1);
      } else {
        selectedItems.push(item);
      }
      this.selectedItems = selectedItems;
      liElm.classList.toggle("matched");
      this.closeList();
    } else {
      this.selectedItem = item;
      this.closeList();
    }
    
    if (typeof this.onObserverChanged === 'function')
      this.onObserverChanged(this, event);
    if (typeof this.onChanged === 'function')
      this.onChanged(this, event);
  }

  clear() {
    this._selectedItems = [];
    this._selectedItem = undefined;
    this.inputElm.style.display = "";
    this.inputElm.value = '';
    this._value = '';
    const selectionItems = Array.from(this.inputWrapElm.querySelectorAll('.selection-item'));
    selectionItems.forEach(elm => this.inputWrapElm.removeChild(elm));
  }

  protected init() {
    const _items: IComboItem[] = [];
    this.childNodes.forEach(node => {
      if (node instanceof ComboBoxItem) {
        _items.push({value: node.value, label: node.label || ''});
      }
    })
    this.clearInnerHTML();
    super.init();
    if (!this.inputElm) {
      this.calculatePositon = this.calculatePositon.bind(this);
      this.callback = this.getAttribute("parentCallback", true);
      const placeholder = this.getAttribute('placeholder', true);
      this.mode = this.getAttribute("mode", true);
      this._items = this.getAttribute("items", true, []);

      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = <HTMLLabelElement>this.createElement("label", this.captionSpanElm);

      this.inputWrapElm = this.createElement("div", this);
      this.inputWrapElm.classList.add("selection");
      this.inputElm = <HTMLInputElement>this.createElement("input", this.inputWrapElm);
      const disabled = this.getAttribute('enabled') === false;
      this.inputElm.disabled = disabled;
      this.readOnly = this.getAttribute('readOnly', true, false);
      this.inputElm.addEventListener("click", (e) => {
        if (!this._enabled || this._readOnly || this._designMode) return false;
        this.openList();
        if (this.onClick) this.onClick(this, e)
      });
      this.inputElm.addEventListener("keyup", () => {
        if (!this._enabled || this._readOnly || this._designMode) return false;
        this.searchStr = this.inputElm.value;
        this.renderItems();
      });
      this.inputWrapElm.appendChild(this.inputElm);

      placeholder && (this.placeholder = placeholder);

      this.iconElm = this.createElement("span", this);
      this.iconElm.classList.add("icon-btn");
      this.iconElm.addEventListener("click", () => {
        if (!this._enabled || this._readOnly || this._designMode) return false;
        this.toggleList();
      });
      let iconAttr = this.getAttribute('icon', true, {});
      iconAttr = { ...DEFAULT_VALUES.icon, ...iconAttr };
      if (iconAttr?.image?.url) {
        iconAttr.name = '';
      }
      const icon = new Icon(undefined, iconAttr);
      this.icon = icon;

      const value = this.getAttribute('value', true);
      const selectedItems = this.getAttribute('selectedItems', true);
      const selectedItem = this.getAttribute('selectedItem', true);
      if (selectedItem)
        this.selectedItem = selectedItem;
      if (selectedItems)
        this.selectedItems = selectedItems;

      this.listElm = this.createElement("div");
      this.listElm.classList.add(ItemListStyle);
      this.listElm.classList.add("item-list");

      if (_items.length) {
        this.items = [..._items];
      }

      this.value = value;
      this.renderItems();

      document.addEventListener("click", (e) => {
        if (!this._enabled) return false;
        // Clicked outside the box
        if (!this.contains(e.target as HTMLElement))
          this.closeList();
      });

      window.addEventListener('resize', this.calculatePositon);
    }
  }

  disconnectedCallback(): void {
    window.removeEventListener('resize', this.calculatePositon);
    super.disconnectedCallback();
  }

  static async create(options?: ComboBoxElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }   
}
