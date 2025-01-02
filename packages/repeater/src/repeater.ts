import { Control, customElements, ControlElement, Container, observable } from '@ijstech/base';
import { Panel } from '@ijstech/layout';
import './style/repeater.css'
import { GroupType } from '@ijstech/types';

type onRenderCallback = (parent: Control, index: number) => void;
type LayoutType = 'horizontal' | 'vertical';

export interface RepeaterElement extends ControlElement {
  onRender?: onRenderCallback;
  data?: any[];
  count?: number;
  layout?: LayoutType;
  gap?: number | string;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-repeater']: RepeaterElement
    }
  }
}

const DEFAULT_VALUES = {
  layout: 'vertical',
  count: 0,
  gap: 0
}
const layoutOptions = ['horizontal', 'vertical'];

@customElements("i-repeater", {
  icon: 'clone',
  group: GroupType.BASIC,
  className: 'Repeater',
  props: {
    count: {
      type: 'number',
      default: DEFAULT_VALUES.count
    },
    layout: {
      type: 'string',
      default: DEFAULT_VALUES.layout,
      values: layoutOptions
    },
    gap: {
      type: 'number'
    }
  },
  events: {
    onRender: [
      {name: 'parent', type: 'Control', isControl: true},
      {name: 'index', type: 'number'}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      count: {
        type: 'number',
        default: DEFAULT_VALUES.count
      },
      layout: {
        type: 'string',
        default: DEFAULT_VALUES.layout,
        enum: layoutOptions
      },
      gap: {
        type: 'number'
      }
    }
  }
})
export class Repeater extends Container {
  @observable('data', true)
  private _data: any[] = [];
  private _count: number;
  private _layout: LayoutType = 'vertical';
  private _gap: number|string;

  private wrapper: HTMLElement;
  private pnlPanel: Panel;
  private templateEl: HTMLTemplateElement;

  public onRender: onRenderCallback;

  constructor(parent?: Control, options?: any) {
    super(parent, options);
  }

  get count(): number {
    return this._count ?? DEFAULT_VALUES.count;
  }
  set count(value: number) {
    this._count = value ?? DEFAULT_VALUES.count;
    this.cloneItems();
  }

  set data(value: any[]) {
    this._data = value;
    this.count = value.length;
    this.cloneItems();
  }
  get data() {
    return this._data;
  }

  get layout(): LayoutType {
    return this._layout;
  }
  set layout(value: LayoutType) {
    this._layout = value;
    if (this.wrapper) {
      this.wrapper.style.flexDirection = value === 'horizontal' ? 'row' : 'column';
    }
  }

  get gap(): number|string {
    return this._gap;
  }
  set gap(value: number|string) {
    if (!this.wrapper) return;
    this._gap = value || 'initial';
    const num = +this._gap;
    if (!isNaN(num)) {
      this.wrapper.style.gap = this._gap + 'px';
    }
    else {
      this.wrapper.style.gap = `${this._gap}`;
    }
  } 

  private foreachNode(node: Control, clonedNode?: Control) {
    if (!node) return;
    if (typeof node?._getCustomProperties === 'function') {
      const props = node._getCustomProperties().props || {};
      const keys = Object.keys(props);
      for (let key of keys) {
        const value = node._getDesignPropValue(key) ?? node.getAttribute(key);
        if (!this.isEmpty(key, value)) {
          if (clonedNode) {
            (clonedNode as any)[key] = value;
          }
        }
      }
    }
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const clonedChild = clonedNode?.children[i];
      if (child.hasChildNodes()) {
        this.foreachNode(child as Control, clonedChild as Control);
      }
    }
  }

  private isEmpty(key: string, value: any) {
    return value === undefined ||
      value === null ||
      (typeof value === 'object' && !Object.keys(value).length) ||
      ((key === 'link' || key === 'image') && !value?.url) ||
      ((key === 'icon' || key === 'rightIcon') && (!value?.name || !value?.image?.url)) ||
      key === 'caption';
  }

  private cloneItems() {
    if (this._designMode) return;
    this.wrapper.innerHTML = '';
    if (!this.templateEl.content || !this.count) return;
    for (let i = 0; i < this.count; i++) {
      const clone = document.importNode(this.templateEl.content, true);
      this.wrapper.appendChild(clone);
      const newControl = this.wrapper.lastElementChild as Control;
      this.foreachNode(this.templateEl.content.firstChild as Control, newControl);
      if (newControl && 'setData' in newControl) {
        (newControl as any).setData(this._data[i]);
      }
      if (typeof this.onRender === 'function') this.onRender(this.wrapper as Control, i);
    }
  }

  add(item: Control) {
    if (!this.pnlPanel) {
      this.pnlPanel = new Panel(undefined, {});
    }
    this.pnlPanel.appendChild(item);
    if (this._designMode) {
      this.wrapper.innerHTML = '';
      this.wrapper.append(this.pnlPanel);
    } else {
      this.templateEl.innerHTML = '';
      this.templateEl.content.append(this.pnlPanel);
    }
    this.cloneItems();
    return item;
  }

  update() {
    this.cloneItems();
  }

  clear() {
    this.wrapper.innerHTML = '';
  }

  protected init() {
    if (!this.initialized) {
      let childNodes = [];
      for (let i = 0; i < this.childNodes.length; i++) {
        const el = this.childNodes[i];
        childNodes.push(el);
      }
      this.onRender = this.getAttribute("onRender", true) || this.onRender;
      const count = this.getAttribute("count", true, DEFAULT_VALUES.count);
      const data = this.getAttribute("data", true);
      super.init();
      this.wrapper = this.createElement("div", this);
      this.wrapper.classList.add("repeater-container");
      this.layout = this.getAttribute("layout", true, DEFAULT_VALUES.layout);
      this.gap = this.getAttribute("gap", true, DEFAULT_VALUES.gap);
      this.templateEl = this.createElement("template", this) as HTMLTemplateElement;
      this.pnlPanel = new Panel(undefined, {});
      if (childNodes?.length) {
        for (let i = 0; i < childNodes.length; i++) {
          this.pnlPanel.appendChild(childNodes[i]);
        }
        if (this._designMode) {
          this.wrapper.append(this.pnlPanel);
        } else {
          this.templateEl.content.append(this.pnlPanel);
        }
      }
      this.count = data?.length || count;
    }
  }

  static async create(options?: RepeaterElement, parent?: Container){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
