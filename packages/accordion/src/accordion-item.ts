import {
  Control,
  Container,
  customElements,
  IFont,
  I18n
} from "@ijstech/base";
import { VStack, HStack, Panel } from '@ijstech/layout';
import { Label } from '@ijstech/label';
import { Icon } from '@ijstech/icon';
import { Theme } from '@ijstech/style';
import { IAccordionItem } from './interface';
import { customStyles, expandablePanelStyle } from './style/accordion.css';
import { GroupType } from "@ijstech/types";
import { application } from '@ijstech/application';

type onSelectedFn = (target: AccordionItem) => void;
export interface AccordionItemElement extends IAccordionItem {
  onSelected?: onSelectedFn;
  onRemoved?: onSelectedFn;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-accordion-item']: AccordionItemElement;
    }
  }
}

@customElements('i-accordion-item', {
  icon: 'angle-down',
  group: GroupType.BASIC,
  className: 'AccordionItem',
  props: {
    name: { type: 'string', default: '' },
    defaultExpanded: { type: 'boolean', default: false },
    showRemove: { type: 'boolean', default: false }
  },
  events: {},
  dataSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name'
      },
      defaultExpanded: {
        type: 'boolean',
        title: 'Default Expanded',
        default: false
      },
      showRemove: {
        type: 'boolean',
        title: 'Show Remove',
        default: false
      }
    }
  }
})
export class AccordionItem extends Container {
  private pnlAccordionItem: VStack;
  private lbTitle: Label;
  private pnlContent: Panel;
  private iconExpand: Icon;
  private iconRemove: Icon;

  private _name: string;
  private _defaultExpanded: boolean;
  private _expanded: boolean;
  private _showRemove: boolean;

  public onSelected: onSelectedFn;
  public onRemoved: onSelectedFn;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: AccordionItemElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    if (this.lbTitle && this._name?.startsWith('$'))
      this.lbTitle.caption = i18n.get(this._name) || '';
  }

  get name() {
    const name = this._name || '';
    if (name?.startsWith('$')) {
      const translated =
        this.parentModule?.i18n?.get(name) ||
        application.i18n?.get(name) ||
        '';
      return translated;
    }
    return name;
  }
  set name(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._name = value;
    if (this.lbTitle) {
      this.lbTitle.caption = this.name;
    }
  }

  get defaultExpanded() {
    return this._defaultExpanded ?? false;
  }
  set defaultExpanded(value: boolean) {
    this._defaultExpanded = value ?? false;
    this._expanded = this._defaultExpanded;
    this.updatePanel();
  }

  get expanded() {
    return this._expanded ?? false;
  }
  set expanded(value: boolean) {
    this._expanded = value ?? false;
    this.updatePanel();
  }

  get showRemove() {
    return this._showRemove ?? false;
  }
  set showRemove(value: boolean) {
    this._showRemove = value ?? false;
    if (this.iconRemove) {
      this.iconRemove.visible = this._showRemove;
    }
  }

  get contentControl() {
    return this.pnlContent as Control;
  }

  get font(): IFont {
    return (this.lbTitle as unknown as Control).font;
  }
  set font(value: IFont) {
    if (this.lbTitle) {
      (this.lbTitle as unknown as Control).font = value;
    }
  }

  private async renderUI() {
    this.pnlAccordionItem = new VStack(undefined, {
      padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' },
      class: `${customStyles}`
    });
    const hStack = new HStack(this.pnlAccordionItem, {
      horizontalAlignment: 'space-between',
      verticalAlignment: 'center',
      padding: { top: '0.5rem', bottom: '0.5rem' },
      cursor: 'pointer',
      class: 'accordion-header'
    });
    hStack.onClick = this.onSelectClick.bind(this);
    this.lbTitle = new Label(hStack, {
      caption: this.name,
      class: 'accordion-title',
      lineHeight: 1.3
    });
    const innerHStack = new HStack(hStack, {
      verticalAlignment: 'center',
      gap: '0.5rem'
    })
    this.iconExpand = new Icon(innerHStack, {
      name: 'angle-right',
      width: 20,
      height: 28,
      fill: Theme.ThemeVars.text.primary,
      class: 'icon-expand'
    });
    this.iconRemove = new Icon(innerHStack, {
      name: 'times',
      width: 20,
      height: 20,
      fill: Theme.ThemeVars.text.primary,
      visible: this.showRemove
    });
    this.iconRemove.onClick = this.onRemoveClick.bind(this);
    this.pnlContent = new Panel(this.pnlAccordionItem, {
      class: `accordion-body ${expandablePanelStyle}`
    });
    this.appendChild(this.pnlAccordionItem);
    this.expanded = !this._expanded && this._defaultExpanded;
  }

  private updatePanel() {
    if (this._expanded) {
      this.iconExpand.name = 'angle-down';
      this.pnlContent.visible = true;
      this.pnlAccordionItem.classList.add('expanded');
    } else {
      this.iconExpand.name = 'angle-right';
      this.pnlContent.visible = false;
      this.pnlAccordionItem.classList.remove('expanded');
    }
  }

  private onSelectClick(target: Control, event: MouseEvent) {
    event.stopPropagation();
    if (this.onSelected) this.onSelected(this)
  }

  private onRemoveClick() {
    if (this.onRemoved) this.onRemoved(this);
  }

  add(item: Control) {
    item.parent = this.pnlContent;
    this.pnlContent.appendChild(item);
    this._controls.push(item);
    return item;
  }

  protected async init() {
    if (!this.initialized) {
      let childNodes: Control[] = [];
      this.childNodes.forEach(node => {
        childNodes.push(node as Control);
      });
      this.onSelected = this.getAttribute('onSelected', true) || this.onSelected;
      this.onRemoved = this.getAttribute('onRemoved', true) || this.onRemoved;
      const name = this.getAttribute('name', true);
      const defaultExpanded = this.getAttribute('defaultExpanded', true);
      const showRemove = this.getAttribute('showRemove', true, false);
      super.init();
      this._name = name;
      this._defaultExpanded = defaultExpanded;
      this._showRemove = showRemove;
      await this.renderUI();
      const font = this.getAttribute('font', true)
      if (font) this.font = font;
      if (!this.pnlContent.isConnected) await this.pnlContent.ready();
      if (childNodes?.length) {
        for (let i = 0; i < childNodes.length; i++) {
          const item = childNodes[i];
          this.add(item);
        }
      }
    }
  }
}
