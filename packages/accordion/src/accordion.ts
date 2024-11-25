import {
  Control,
  Container,
  customElements,
  ControlElement,
  I18n,
} from "@ijstech/base";
import { VStack } from '@ijstech/layout';
import { Label } from '@ijstech/label';
import { AccordionItem, AccordionItemElement } from "./accordion-item";
import { GroupType } from "@ijstech/types";
import { IAccordionItem } from './interface';

export { AccordionItem, AccordionItemElement }

type onCustomItemRemovedCallback = (item: Control) => Promise<void>;

export interface AccordionElement extends ControlElement {
  items?: IAccordionItem[];
  isFlush?: boolean;
  onCustomItemRemoved?: onCustomItemRemovedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-accordion"]: AccordionElement;
    }
  }
}

export interface IAccordionMessage {
}

@customElements('i-accordion', {
  icon: 'angle-down',
  group: GroupType.BASIC,
  className: 'Accordion',
  props: {
    items: {type: 'array'},
    isFlush: {type: 'boolean', default: false}
  },
  events: {
    onCustomItemRemoved: [
      {name: 'item', type: 'Control', isControl: true}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      isFlush: {
        type: 'boolean',
        title: 'Flush',
        default: false
      },
    }
  }
})
export class Accordion extends Control {
  private wrapper: VStack;

  private _items: IAccordionItem[] = [];
  private _isFlush: boolean = false;
  private accordionItemMapper: Map<string, AccordionItem> = new Map();

  onCustomItemRemoved: onCustomItemRemovedCallback;

  static async create(options?: AccordionElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onItemClick = this.onItemClick.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    const items = Array.from(this.accordionItemMapper).map(item => item[1]);
    items.forEach(item => item.updateLocale(i18n));
  }

  get isFlush() {
    return this._isFlush ?? false;
  }
  set isFlush(value: boolean) {
    this._isFlush = value ?? false;
  }

  get items() {
    return this._items ?? [];
  }
  set items(value: IAccordionItem[]) {
    this._items = value ?? [];
    this.wrapper.clearInnerHTML();
    this.accordionItemMapper = new Map();
    for (let i = 0; i < this.items.length; i++) {
      const item = {...this.items[i]};
      this.createAccordionItem(item);
    }
  }

  private createAccordionItem(item: IAccordionItem) {
    const itemElm = new AccordionItem(this.wrapper, {
      ...item,
      class: 'accordion-item',
      onSelected: this.onItemClick,
      onRemoved: this.onRemoveClick
    });
    itemElm.id = item.id ?? itemElm.uuid;
    this.accordionItemMapper.set(itemElm.id, itemElm);
    return itemElm;
  }

  private onItemClick(target: AccordionItem) {
    if (this._designMode) return;
    const id = target.id;
    const currentActive = this.accordionItemMapper.get(id);
    if (this.isFlush) {
      Array.from(this.accordionItemMapper).forEach((item) => {
        if (item[0] !== id) item[1].expanded = false;
      })
    }
    if (currentActive) currentActive.expanded = !currentActive.expanded;
  }

  private async onRemoveClick(target: AccordionItem) {
    if (this._designMode) return;
    const id = target.id;
    this.removeItem(id);
    if (typeof this.onCustomItemRemoved === 'function')
      await this.onCustomItemRemoved(target);
  }

  private removeItem(id: string) {
    const item = this.accordionItemMapper.get(id);
    if (item) {
      item.remove();
      this.accordionItemMapper.delete(id);
      this._items = this._items.filter(item => item.id !== id);
    }
  }

  add(item: IAccordionItem) {
    const itemElm = this.createAccordionItem(item);
    this.items.push(item);
    return itemElm;
  }

  delete(item: AccordionItem) {
    this.removeItem(item.id);
  }

  updateItemName(id: string, name: string) {
    const item = this.accordionItemMapper.get(id)
    if (item) {
      const titleEl = item.querySelector('.accordion-title') as unknown as Label;
      if (titleEl) titleEl.caption = name;
    }
  }

  clear() {
    this.wrapper.clearInnerHTML();
    this.accordionItemMapper = new Map();
    this.items = [];
  }

  private appendItem(item: AccordionItem) {
    if (!item.id) {
      item.id = item.uuid;
    }
    this.accordionItemMapper.set(item.id, item);
    item.onSelected = this.onItemClick;
    item.onRemoved = this.onRemoveClick;
    this.wrapper.append(item);
  }

  protected async init() {
    if (!this.initialized) {
      let childNodes: AccordionItem[] = [];
      this.childNodes.forEach(node => {
        if (node instanceof AccordionItem) {
          childNodes.push(node);
        } else {
          node.remove();
        }
      })
      const items = this.getAttribute('items', true);
      const isFlush = this.getAttribute('isFlush', true, false);
      this.onCustomItemRemoved = this.getAttribute('onCustomItemRemoved', true) || this.onCustomItemRemoved;
      super.init();
      this.wrapper = new VStack();
      this.append(this.wrapper);
      this.isFlush = isFlush;
      if (childNodes?.length) {
        for (let i = 0; i < childNodes.length; i++) {
          const item = childNodes[i];
          this.appendItem(item);
        }
      }
      if (items) this.items = items;
    }
  }
}
