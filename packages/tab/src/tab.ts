import { Control, Container, customElements, ContainerElement, IFont, FontStyle, TextTransform, IMediaQuery, IControlMediaQueryProps, I18n } from '@ijstech/base';
import { Icon, IconElement } from "@ijstech/icon";
import './style/tab.css';
import { getTabMediaQueriesStyleClass } from './style/tab.css';
import { GroupType } from '@ijstech/types';
import { application } from '@ijstech/application';

type TabModeType = "horizontal" | "vertical";
type TabsEventCallback = (target: Tabs, activeTab: Tab, oldActiveTab?: Tab) => void;
type TabCloseEventCallback = (target: Tabs, tab: Tab) => void;

export interface TabsElement extends ContainerElement {
  // activeTab?: Tab;
  activeTabIndex?: number;
  closable?: boolean;
  draggable?: boolean;
  mode?: TabModeType;
  mediaQueries?: ITabMediaQuery[];
  onChanged?: TabsEventCallback;
  onCloseTab?: TabCloseEventCallback;
  onBeforeClose?: TabsEventCallback;
}

export interface TabElement extends ContainerElement {
  caption?: string;
  icon?: IconElement;
  rightIcon?: IconElement;
  font?: IFont;
}

export interface ITab extends TabElement {
  children?: Control | Container
}

export interface ITabMediaQueryProps extends IControlMediaQueryProps{
  mode?: TabModeType;
}
export type ITabMediaQuery = IMediaQuery<ITabMediaQueryProps>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-tabs']: TabsElement;
      ['i-tab']: TabElement;
    }
  }
}

const DEFAULT_VALUES = {
  activeTabIndex: 0,
  closable: false,
  draggable: false,
  mode: 'horizontal'
}

@customElements("i-tabs", {
  icon: 'window-minimize',
  className: 'Tabs',
  group: GroupType.BASIC,
  props: {
    activeTabIndex: {type: 'number'},
    closable: {type: 'boolean', default: DEFAULT_VALUES.closable},
    draggable: {type: 'boolean', default: DEFAULT_VALUES.draggable},
    mode: {type: 'string', default: DEFAULT_VALUES.mode},
  },
  events: {
    onChanged: [
      {name: 'target', type: 'Tabs', isControl: true},
      {name: 'tab', type: 'Tab', isControl: true}
    ],
    onCloseTab: [
      {name: 'target', type: 'Tabs', isControl: true},
      {name: 'activeTab', type: 'Tab', isControl: true}
    ],
    onBeforeClose: [
      {name: 'target', type: 'Tabs', isControl: true},
      {name: 'activeTab', type: 'Tab', isControl: true}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      activeTabIndex: {
        type: 'number'
      },
      closable: {
        type: 'boolean',
        default: DEFAULT_VALUES.closable
      },
      draggable: {
        type: 'boolean',
        default: DEFAULT_VALUES.draggable
      },
      mode: {
        type: 'string',
        enum: ['horizontal', 'vertical'],
        default: DEFAULT_VALUES.mode
      }
    }
  }
})
export class Tabs extends Container {
  private tabsNavElm: HTMLElement;
  private tabsContentElm: HTMLElement;
  private contentPanes: HTMLElement[];
  private _tabs: Tab[];
  private _activeTabIndex: number;
  private _closable: boolean;
  private _draggable: boolean;
  private _mediaQueries: ITabMediaQuery[];
  private accumTabIndex = 0;
  private curDragTab: Tab | null;
  public onChanged: TabsEventCallback;
  public onCloseTab: TabCloseEventCallback;
  public onBeforeClose: TabCloseEventCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
  }

  updateLocale(i18n: I18n): void {
    for (const tab of this._tabs) {
      tab.updateLocale(i18n);
    }
  }

  get activeTab(): Tab {
    return this._tabs[this.activeTabIndex];
  }
  // set activeTab(item: Tab) {
  //   const index = item.index;
  //   if (index < 0 || this.activeTabIndex === index) return;
  //   this.activeTabIndex = item.index;
  // }

  get activeTabIndex(): number {
    return this._activeTabIndex;
  }
  set activeTabIndex(index: number) {
    if (index < 0 || this._activeTabIndex === index) return;
    const prevTab = this._tabs[this._activeTabIndex];
    if (prevTab) {
      prevTab.classList.remove("active");
      this.contentPanes[this._activeTabIndex].style.display = "none";
    }
    this._activeTabIndex = index;
    this.activeTab?.classList.add("active");
    if (this.contentPanes[index]){
      this.contentPanes[index].style.display = "";
      this.refreshControls();
    }
  }

  get items(): Tab[] {
    return this._tabs;
  }

  get closable(): boolean {
    return this._closable;
  }
  set closable(value: boolean) {
    this._closable = value;
    if (value) {
      this.tabsNavElm.classList.add('is-closable');
    } else {
      this.tabsNavElm.classList.remove('is-closable');
    }
  }

  get draggable(): boolean {
    return this._draggable;
  }
  set draggable(value: boolean) {
    if (this._draggable === value) return;
    this._draggable = value;
    if (this.draggable) {
      this.tabsNavElm.ondragover = this.dragOverHandler;
      this.tabsNavElm.ondrop = this.dropHandler;
    } else {
      this.tabsNavElm.ondragover = null;
      this.tabsNavElm.ondrop = null;
    }
    this.handleTagDrag(this._tabs);
  }

  get mode(): TabModeType {
    const isVertical = this.classList.contains("vertical");
    return isVertical ? "vertical" : "horizontal";
  }
  set mode(type: TabModeType) {
    if (type === 'vertical') {
      this.classList.add("vertical");
    } else {
      this.classList.remove("vertical");
    }
  }

  get mediaQueries(): ITabMediaQuery[] {
    return this._mediaQueries;
  }
  set mediaQueries(value: ITabMediaQuery[]) {
    this._mediaQueries = value;
    let style = getTabMediaQueriesStyleClass(this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style;
    this.classList.add(style);
  }

  add(options?: ITab): Tab {
    const tab = new Tab(this, options);
    if (options?.children) {
      tab.append(options?.children);
    }
    if (this.draggable) {
      this.handleTagDrag([tab]);
    }
    this.appendTab(tab);
    this.activeTabIndex = tab.index;
    return tab;
  }

  delete(tab: Tab) {
    const index = this._tabs.findIndex(t => t.id === tab.id);
    const activeIndex = this.activeTabIndex;
    if (index >= 0) {
      this._tabs.splice(index, 1);
      const pane = this.contentPanes[index];
      this.contentPanes.splice(index, 1);
      pane.remove();
      if (activeIndex >= index) {
        let newActiveIndex = activeIndex > index ? activeIndex - 1 : this._tabs[activeIndex] ? activeIndex : this._tabs.length - 1;
        this._activeTabIndex = newActiveIndex;
        if (this.activeTab) {
          this.activeTab.classList.add("active");
          this.contentPanes[newActiveIndex].style.display = "";
        }
      }
    }
    tab.ondragstart = null;
    tab.controls.forEach(c => {
      c.parent = undefined
      c.remove();
    });
    tab.remove();
  }

  private appendTab(tab: Tab) {
    this.initTabsNav();
    tab._container = this.tabsContentElm;
    tab.parent = this;
    this._tabs.push(tab);
    if (!tab.id) tab.id = `tab-${this.accumTabIndex++}`;
    this.tabsNavElm.appendChild(tab);
    const contentPane = this.createElement('div', this.tabsContentElm);    
    (<any>tab)._contentElm = contentPane;
    contentPane.classList.add("content-pane");
    contentPane.style.display = 'none';
    this.contentPanes.push(contentPane);
    const children = tab.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].classList.contains('tab-item')) 
        continue;
      if (children[i] instanceof Control) {        
        (<Control>children[i]).parent = tab;
      }
      // contentPane.appendChild(children[i]);
    };
  }

  private handleTagDrag(tabs: Tab[]) {
    tabs.forEach((tab: Tab) => {
      if (this.draggable) {
        tab.setAttribute('draggable', "true");
        tab.ondragstart = this.dragStartHandler;
      } else {
        tab.removeAttribute('draggable');
        tab.ondragstart = null;
      }
    });
  }
  _handleClick(event: MouseEvent): boolean{
    if (this._designMode) return false;
    return super._handleClick(event, true)
  }
  private dragStartHandler(event: DragEvent) {
    if (!(event.target instanceof Tab) || this._designMode) return;
    this.curDragTab = event.target;
  }

  private dragOverHandler(event: DragEvent) {
    event.preventDefault();
  }

  private dropHandler(event: DragEvent) {
    event.preventDefault();
    if (!this.curDragTab || this._designMode) return;
    const target = event.target as HTMLElement;
    const dropTab = target instanceof Tab ? target : target.closest('i-tab') as Tab;
    if (dropTab && !this.curDragTab.isSameNode(dropTab)) {
      const curActiveTab = this.activeTab;
      const dragIndex = this.curDragTab.index;
      const dropIndex = dropTab.index;
      const [dragTab] = this._tabs.splice(dragIndex, 1);
      this._tabs.splice(dropIndex, 0, dragTab);
      const [dragContent] = this.contentPanes.splice(dragIndex, 1);
      this.contentPanes.splice(dropIndex, 0, dragContent);
      if (dragIndex > dropIndex) {
        this.tabsNavElm.insertBefore(this.curDragTab, dropTab);
      } else {
        dropTab.after(this.curDragTab);
      }
      this.activeTabIndex = curActiveTab.index
      if (typeof this.onChanged === 'function') this.onChanged(this, this.activeTab);
    }
    this.curDragTab = null;
  };
  refresh(): void {
    if (this.dock) {
      super.refresh(true);
      const height = this.mode === 'horizontal' ? (this.clientHeight - this.tabsNavElm.clientHeight) : this.clientHeight;
      this.tabsContentElm.style.height = height + 'px';
      this.refreshControls();
    }
  };
  protected init() {
    super.init();
    this.initTabsNav();
  }

  private initTabsNav() {
    if (!this.tabsNavElm) {
      this.contentPanes = [];
      this._tabs = [];      

      const _tabs: Tab[] = [];
      this.childNodes.forEach(node => {
        if (node instanceof Tab) {
          _tabs.push(node);
        } else {
          node.remove();
        }
      })
      const tabsNavWrapElm = this.createElement('div', this);
      tabsNavWrapElm.classList.add('tabs-nav-wrap');
      tabsNavWrapElm.addEventListener("wheel", (event: WheelEvent) => {
        if (tabsNavWrapElm.scrollWidth > tabsNavWrapElm.clientWidth) {
          event.preventDefault();
          tabsNavWrapElm.scrollLeft += event.deltaY;
        }
      });
      this.tabsNavElm = this.createElement('div', tabsNavWrapElm);
      this.tabsNavElm.classList.add("tabs-nav");

      this.tabsContentElm = this.createElement('div', this);
      this.tabsContentElm.classList.add("tabs-content");

      this.closable = this.getAttribute("closable", true) || false;
      this.mode = this.getAttribute('mode', true) || "horizontal";

      for (const tab of _tabs) {
        this.appendTab(tab);
      }

      // const activeTab = this.getAttribute("activeTab", true);
      // if (activeTab) this.activeTab = activeTab;

      this.draggable = this.getAttribute("draggable", true) || false;
      const activeTabIndex = this.getAttribute("activeTabIndex", true);
      if (this._tabs.length) this.activeTabIndex = activeTabIndex || 0;
      this.mediaQueries = this.getAttribute('mediaQueries', true, []);
    }
  }

  static async create(options?: TabsElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}

@customElements('i-tab', {
  icon: 'window-minimize',
  group: GroupType.BASIC,
  className: 'Tab',
  props: {
    caption: {
      type: 'string'
    },
    icon: {
      type: 'object',
      default: {}
    },
  },
  events: {},
  dataSchema: {
    type: 'object',
    properties: {
      caption: {type: 'string'},
      icon: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
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
      }
    }
  }
})
export class Tab extends Container {
  private tabContainer: HTMLElement;
  private captionElm: HTMLElement;
  private _contentElm: HTMLElement;
  private _icon: Icon;
  private rightElm: HTMLElement;
  private _rightIcon: Icon;
  private _closeBtn: HTMLSpanElement;
  protected _parent: Tabs;

  private _caption: string;

  active(){
    this._parent.activeTabIndex = this.index;
  }

  protected addChildControl(control: Control) {
    if (this._contentElm)
      this._contentElm.appendChild(control)
  }

  protected removeChildControl(control: Control) {
    if (this._contentElm && this._contentElm.contains(control))
      this._contentElm.removeChild(control)
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    if (this.captionElm && this._caption?.startsWith('$'))
      this.captionElm.textContent = i18n.get(this._caption) || '';
  }

  get caption(): string {
    let value = this._caption || '';
    if (value?.startsWith('$')) {
      const translated =
        this.parent?.parentModule?.i18n?.get(value) ||
        application.i18n?.get(value) ||
        ''
      return translated;
    }
    return value;
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value;
    if (!this.captionElm) return;
    this.captionElm.textContent = this.caption;
  }
  close(){
    this.handleDefaultClose();
  }
  get index(): number {
    return this._parent.items.findIndex(t => t.id === this.id);
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
      this.tabContainer.removeChild(this._icon);
    this._icon = elm;
    if (this._icon)
      this.tabContainer.prepend(this._icon);
  }
  get rightIcon(): Icon {
    if (!this._rightIcon) {
      this._rightIcon = <any>Icon.create({
        width: 16,
        height: 16
      }, this);
      this.rightElm.classList.add("has-icon");
    };
    return this._rightIcon;
  }
  set rightIcon(elm: Icon) {
    if (this._rightIcon && this.rightElm.contains(this._rightIcon))
      this.rightElm.removeChild(this._rightIcon);
    this._rightIcon = elm;
    if (this._rightIcon) {
      this.rightElm.prepend(this._rightIcon);
      this.rightElm.classList.add("has-icon");
    } else {
      this.rightElm.classList.remove("has-icon");
    }
  }
  // get innerHTML(): string{
  //   return this._contentElm.innerHTML;
  // }
  // set innerHTML(value: string){
  //   this._contentElm.innerHTML = value;
  // }
  get font(): IFont {
    return {
      color: this.captionElm.style.color,
      name: this.captionElm.style.fontFamily,
      size: this.captionElm.style.fontSize,
      bold: this.captionElm.style.fontStyle.indexOf('bold') >= 0,
      style: this.captionElm.style.fontStyle as FontStyle,
      transform: this.captionElm.style.textTransform as TextTransform,
      weight: this.captionElm.style.fontWeight,
      shadow: this.captionElm.style.textShadow
    }
  }
  set font(value: IFont) {
    if (this.captionElm) {
      this.captionElm.style.color = value.color || '';
      this.captionElm.style.fontSize = value.size || '';
      this.captionElm.style.fontFamily = value.name || '';
      this.captionElm.style.fontStyle = value.style || '';
      this.captionElm.style.textTransform = value.transform || 'none';
      this.captionElm.style.fontWeight = value.bold ? 'bold' : (`${value.weight}` || '');
      this.captionElm.style.textShadow = value.shadow || 'none';
    }
  }

  _handleClick(event: MouseEvent): boolean {    
    if (!this._parent || !this.enabled || this._parent.activeTab.isSameNode(this) || this._designMode) 
      return false;
    if (this._parent){
      const oldActiveTab = this._parent.activeTab;
      if (this._parent.activeTab != this)
        this._parent.activeTabIndex = this.index;
      if (typeof this._parent.onChanged === 'function')
        this._parent.onChanged(this._parent, this._parent.activeTab, oldActiveTab);
    }
    return super._handleClick(event);
  }

  private handleCloseTab(event?: Event) {
    if (this._designMode) return;
    if (event){
      event.stopPropagation();
      event.preventDefault();
    }
    if (
      !this._parent ||
      !this.enabled ||
      (event && !this._parent.closable)
    ) return;
    if (typeof this._parent.onBeforeClose === 'function'){
      this._parent.onBeforeClose(this._parent, this);
    } else {
      this.handleDefaultClose();
    }
  }

  private handleDefaultClose() {
    const isActiveChange = this._parent.activeTab.isSameNode(this);
    if (typeof this._parent.onCloseTab === 'function')
      this._parent.onCloseTab(this._parent, this);
      
    this._parent.delete(this);
    if (isActiveChange && typeof this._parent.onChanged === 'function')
      this._parent.onChanged(this._parent, this._parent.activeTab);
  }

  init() {
    if (!this.captionElm) {
      super.init();
      this.tabContainer = this.createElement('div', this);
      this.tabContainer.classList.add('tab-item');

      this.captionElm = this.createElement('div', this.tabContainer);
      this.caption = this.getAttribute('caption', true) || '';
      const font = this.getAttribute('font', true)
      if (font) this.font = font;

      const icon: IconElement = this.getAttribute('icon', true);
      if (icon?.name || icon?.image?.url) {
        icon.height = icon.height || '1rem';
        icon.width = icon.width || '1rem';
        this.icon = new Icon(undefined, icon);
      };
      this.rightElm = this.createElement('span', this.tabContainer);
      this.rightElm.classList.add("pnl-right");
      const rightIcon = this.getAttribute('rightIcon', true);
      if (rightIcon?.name || rightIcon?.image?.url) {
        rightIcon.height = rightIcon.height || '1rem';
        rightIcon.width = rightIcon.width || '1rem';
        this.rightIcon = new Icon(undefined, rightIcon);
        this.rightElm.classList.add("has-icon");
      };
      this._closeBtn = this.createElement('span', this.rightElm);
      this._closeBtn.classList.add("close");
      this._closeBtn.innerHTML = "&times;"
      this._closeBtn.onclick = this.handleCloseTab.bind(this);
    }
  };

  static async create(options?: TabElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}