import { Control, customElements, ControlElement, I18n } from '@ijstech/base'
import { Icon, IconElement } from '@ijstech/icon'
import { Button, ButtonElement } from '@ijstech/button'
import * as Styles from '@ijstech/style'
const Theme = Styles.Theme.ThemeVars
import './style/treeView.css'
import { GroupType } from '@ijstech/types'
import { application } from '@ijstech/application'

type activedChangeCallback = (target: TreeView, prevNode?: TreeNode, event?: Event) => void
type changeCallback = (target: TreeView, node: TreeNode, oldValue: string, newValue: string) => void
type beforeChangeCallback = (target: TreeView, node: TreeNode, oldValue: string, newValue: string) => boolean
type renderCallback = (target: TreeView, node: TreeNode) => void
type mouseEnterCallback = (target: TreeView, node: TreeNode) => void
type mouseLeaveCallback = (target: TreeView, node: TreeNode) => void
type actionButtonCallback = (target: TreeView, actionButton: Button, event: Event) => void
type lazyLoadCallback = (target: TreeView, node: TreeNode) => void

export interface ITreeNode {
  caption?: string
  icon?: IconElement
  rightIcon?: IconElement,
  collapsible?: boolean
  expanded?: boolean
  isLazyLoad?: boolean
  active?: boolean
  children?: ITreeNode[]
  alwaysExpanded?: boolean,
}

export interface TreeViewElement extends ControlElement {
  activeItem?: TreeNode
  data?: ITreeNode[]
  editable?: boolean
  actionButtons?: ButtonElement[],
  alwaysExpanded?: boolean
  deleteNodeOnEmptyCaption?: boolean
  onActiveChange?: activedChangeCallback
  onChange?: changeCallback
  onBeforeChange?: beforeChangeCallback
  onRenderNode?: renderCallback
  onMouseEnterNode?: mouseEnterCallback
  onMouseLeaveNode?: mouseLeaveCallback
  onLazyLoad?: lazyLoadCallback
  onActionButtonClick?: actionButtonCallback
}

export interface TreeNodeElement extends ControlElement {
  caption?: string
  icon?: IconElement
  rightIcon?: IconElement
  collapsible?: boolean
  expanded?: boolean
  isLazyLoad?: boolean
  active?: boolean
}
const beforeExpandEvent = new Event('beforeExpand')
const defaultIcon: IconElement = {
  name: 'caret-right',
  fill: Theme.text.secondary,
  width: '0.75rem',
  height: '0.75rem'
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-tree-view']: TreeViewElement
      ['i-tree-node']: TreeNodeElement
    }
  }
}

@customElements("i-tree-view", {
  icon: 'stream',
  group: GroupType.BASIC,
  className: 'TreeView',
  props: {
    activeItem: { type: 'object' },
    data: { type: 'array' },
    editable: { type: 'boolean' },
    actionButtons: { type: 'array' },
    alwaysExpanded: { type: 'boolean' },
    deleteNodeOnEmptyCaption: { type: 'boolean' }
  },
  events: {
    onActiveChange: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'prevNode', type: 'TreeNode', isControl: true },
      { name: 'event', type: 'Event' }
    ],
    onChange: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'node', type: 'TreeNode', isControl: true },
      { name: 'oldValue', type: 'string' },
      { name: 'newValue', type: 'string' }
    ],
    onRenderNode: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'node', type: 'TreeNode', isControl: true }
    ],
    onMouseEnterNode: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'node', type: 'TreeNode', isControl: true }
    ],
    onMouseLeaveNode: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'node', type: 'TreeNode', isControl: true }
    ],
    onLazyLoad: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'node', type: 'TreeNode', isControl: true }
    ],
    onActionButtonClick: [
      { name: 'target', type: 'TreeView', isControl: true },
      { name: 'actionButton', type: 'Button', isControl: true },
      { name: 'event', type: 'Event' }
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      editable: {
        type: 'boolean'
      },
      actionButtons: {
        type: 'array'
      },
      alwaysExpanded: {
        type: 'boolean'
      },
      deleteNodeOnEmptyCaption: {
        type: 'boolean'
      }
    }
  }
})
export class TreeView extends Control {
  private _activeItem: TreeNode | undefined
  private _data: ITreeNode[]
  private _editable: boolean
  private _items: TreeNode[] = []
  private _actionButtons: ButtonElement[]
  private _alwaysExpanded: boolean = false
  _deleteNodeOnEmptyCaption: boolean = false;

  public onRenderNode: renderCallback
  public onActiveChange: activedChangeCallback
  public onChange: changeCallback
  public onBeforeChange: beforeChangeCallback
  public onMouseEnterNode: mouseEnterCallback
  public onMouseLeaveNode: mouseLeaveCallback
  public onLazyLoad: lazyLoadCallback
  public onActionButtonClick: actionButtonCallback

  constructor(parent?: Control, options?: any) {
    super(parent, options, {
      editable: false
    })
  }

  get activeItem(): TreeNode | undefined {
    return this._activeItem
  }
  set activeItem(value: TreeNode | undefined) {
    this._activeItem = value
    const treeNodes = Array.from(this.querySelectorAll('i-tree-node')) as TreeNode[];
    treeNodes.forEach((treeNode) => (treeNode.active = false));
    if (value) value.active = true
  }

  get alwaysExpanded(): boolean {
    return this._alwaysExpanded
  }
  set alwaysExpanded(value: boolean) {
    this._alwaysExpanded = value
  }

  get data(): ITreeNode[] {
    return this._items.map(node => node.data)
  }
  set data(value: ITreeNode[]) {
    // this._data = value
    this.clear()
    this.renderTree(value)
  }

  get items(): TreeNode[] {
    return this._items || []
  }

  get editable(): boolean {
    return this._editable
  }
  set editable(value: boolean) {
    this._editable = value
  }

  get actionButtons() {
    return this._actionButtons ?? []
  }
  set actionButtons(value: ButtonElement[]) {
    this._actionButtons = value ?? []
    const groups = Array.from(this.querySelectorAll('.button-group'));
    if (groups && groups.length) {
      groups.forEach(group => {
        this.renderActions(group as HTMLElement)
      })
    }
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    for (let node of this._items) {
      node.updateLocale(i18n);
    }
  }

  add(parentNode?: TreeNode | null, caption?: string): TreeNode {
    const childData: ITreeNode = { caption, children: [] }
    const childNode = new TreeNode(this, { ...childData })
    this.initNode(childNode);

    childNode.editable = this.editable
    childNode.alwaysExpanded = this.alwaysExpanded
    if (typeof this.onRenderNode === 'function')
      this.onRenderNode(this, childNode)

    // const name = caption || ''
    if (parentNode) {
      parentNode.appendNode(childNode)
      const parentContent = parentNode.querySelector('.i-tree-node_content') as HTMLElement
      const childContent = childNode.querySelector('.i-tree-node_content') as HTMLElement
      if (parentContent && childContent) {
        const parentLeft = parentContent.style.paddingLeft || 0;
        childContent.style.paddingLeft = parentLeft ? `calc(${parentLeft} + 1em)` : "1em";
      }
      // const paths = parentNode.filePath?.paths || []
      // childNode.filePath = { paths: [...paths, { name }] }
    } else {
      this.appendChild(childNode)
      // childNode.filePath = {  paths: [{ name }] }
    }

    return childNode
  }

  appendNode(childNode: TreeNode) {
    this.initNode(childNode);
    childNode.editable = this.editable
    childNode.alwaysExpanded = this.alwaysExpanded
    if (typeof this.onRenderNode === 'function')
      this.onRenderNode(this, childNode)

    this.appendChild(childNode)

    if (childNode.children?.length) {
      for (let child of childNode.children) {
        if (child instanceof TreeNode) {
          childNode.appendNode(child)
        }
      }
    }
  }

  delete(node: TreeNode) {
    // Real-time data
    node.remove()
  }

  clear(): void {
    this.clearInnerHTML();
    this._items = []
  }

  _setActiveItem(node: TreeNode, event?: Event) {
    const prevNode = this.activeItem
    this.activeItem = node
    if (event && typeof this.onActiveChange === 'function') {
      this.onActiveChange(this, prevNode, event)
    };
  }

  private handleMouseEnter(node: TreeNode) {
    const fn = this.onMouseEnterNode
    if (fn && typeof fn === 'function')
      fn(this, node)
  }

  private handleMouseLeave(node: TreeNode) {
    const fn = this.onMouseLeaveNode
    if (fn && typeof fn === 'function')
      fn(this, node)
  }

  private handleLazyLoad(node: TreeNode) {
    const fn = this.onLazyLoad
    if (fn && typeof fn === 'function')
      fn(this, node)
  }

  private initNode(node: TreeNode) {
    this.registerEvents(node);
    const groupElm = node.querySelector('.button-group') as HTMLElement
    if (this.actionButtons)
      this.renderActions(groupElm)
  }

  private registerEvents(node: TreeNode) {
    node.addEventListener('mouseenter', () => this.handleMouseEnter(node))
    node.addEventListener('mouseleave', () => this.handleMouseLeave(node))
    node.addEventListener('beforeExpand', (event) => this.handleLazyLoad(node))
    if (typeof this.onRenderNode === 'function') this.onRenderNode(this, node)
  }

  private renderTreeNode(node: ITreeNode, parent: TreeView | undefined, paths: { name: string }[] = [], level: number) {
    const treeNode = new TreeNode(parent, node)
    treeNode.editable = this.editable
    treeNode.alwaysExpanded = this.alwaysExpanded
    this.initNode(treeNode)
    const treeContent = treeNode.querySelector('.i-tree-node_content') as HTMLElement
    treeContent && (treeContent.style.paddingLeft = `${level}em`)

    const name = node.caption || ''
    if (node.children) {
      paths.push({ name })
      // treeNode.filePath = { paths: [...paths] }

      if (!node.isLazyLoad) {
        for (const child of node.children) {
          const childWrapper = treeNode.querySelector('.i-tree-node_children')
          if (childWrapper) {
            const childNode = this.renderTreeNode(child, parent, paths, level + 1)
            childWrapper && childWrapper.appendChild(childNode)
          }
        }
      }
    } else {
      // treeNode.filePath = { paths: [...paths, { name }] }
    }

    return treeNode
  }

  private renderTree(value: ITreeNode[]) {
    if (!value || !value.length) return

    for (const node of value) {
      let treeNode = this.renderTreeNode(node, this, [], 0)
      this.appendChild(treeNode)
      const activedNodes = treeNode.querySelectorAll('.active')
      if (activedNodes.length) {
        const activedNode = activedNodes[activedNodes.length - 1] as TreeNode
        treeNode.expanded = true
        const treeNodes = Array.from(treeNode.querySelectorAll('i-tree-node.has-children'))
        treeNodes.forEach(treeNode => {
          if (treeNode.contains(activedNode))
            (treeNode as TreeNode).expanded = true
        })
        this.activeItem = activedNode
      }
      this._items.push(treeNode)
    }
  }

  private renderActions(group: HTMLElement) {
    if (!group) return
    group.innerHTML = ''
    this.actionButtons.forEach((button) => {
      const buttonElm = new Button(undefined, button)
      if (this.onActionButtonClick && typeof this.onActionButtonClick === 'function')
        buttonElm.onClick = (source: Control, event: any) => {
          event.preventDefault()
          event.stopImmediatePropagation()
          const node = buttonElm.closest('i-tree-node') as TreeNode
          if (node && !this.activeItem?.isSameNode(node))
            this.activeItem = node;
          this.onActionButtonClick(this, buttonElm, event)
        }
        group.appendChild(buttonElm)
    })
  }

  protected init() {
    if (!this.initialized) {
      let treeNodes: TreeNode[] = [];
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        if (child instanceof TreeNode) {
          treeNodes.push(child);
        } else {
          child.remove();
        }
      }
      super.init()
      this.classList.add('i-tree-view')
      if (typeof this.options?.onRenderNode === 'function')
        this.onRenderNode = this.options.onRenderNode

      this.alwaysExpanded = this.getAttribute('alwaysExpanded', true, false)
      this.editable = this.getAttribute('editable', true, false)
      this.actionButtons = this.getAttribute('actionButtons', true)
      this.data = this.getAttribute('data', true)
      this._deleteNodeOnEmptyCaption = this.getAttribute('deleteNodeOnEmptyCaption', true);
      console.log('_deleteNodeOnEmptyCaption', this._deleteNodeOnEmptyCaption);
      const activeAttr = this.getAttribute('activeItem', true)
      activeAttr && (this.activeItem = activeAttr)

      if (treeNodes?.length) {
        for (let node of treeNodes) {
          this.appendNode(node);
        }
      }
    }
  }

  static async create(options?: TreeViewElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}

@customElements('i-tree-node')
export class TreeNode extends Control {
  private _caption: string
  private _collapsible: boolean
  private _expanded: boolean
  private _active: boolean
  private _isLazyLoad: boolean
  private _editable: boolean = false
  private _data: ITreeNode
  private _alwaysExpanded: boolean = false

  private _wrapperElm: HTMLElement
  private _expandElm: HTMLInputElement
  private _captionElm: HTMLElement
  private _childNodeElm: HTMLElement
  private _iconElm: Icon
  private _iconRightElm: Icon

  // public filePath: { paths: any[] }

  constructor(parent?: Control, options?: any) {
    super(parent, options)
    options && (this.data = options)
    this.handleEdit = this.handleEdit.bind(this);
  }
  get data() {
    return this._data
  }
  set data(value: ITreeNode) {
    this._data = value
  }

  get caption(): string {
    let value = this._caption || '';
    if (value?.startsWith('$')) {
      const translated =
        this.rootParent?.parentModule?.i18n?.get(value) ||
        application.i18n?.get(value) ||
        ''
      return translated;
    }
    return value;
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value
    if (!this._captionElm) return;
    this._captionElm.innerHTML = this.caption;
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    if (this._captionElm && this._caption?.startsWith('$'))
      this._captionElm.innerHTML = i18n.get(this._caption) || '';
  }

  get collapsible(): boolean {
    return this._collapsible
  }
  set collapsible(value: any) {
    if (typeof value === 'boolean') {
      this._collapsible = value
    } else {
      this._collapsible = true
    }
  }

  get expanded(): boolean {
    return this._expanded
  }
  set expanded(value: any) {
    if (typeof value === 'boolean') {
      this._expanded = value;
      if (this._expandElm) this._expandElm.checked = value;
      if (this._expanded)
        this.classList.add('is-checked')
      else
        this.classList.remove('is-checked')
    } else {
      this._expanded = false
      if (this._expandElm) this._expandElm.checked = false;
      this.classList.remove('is-checked')
    }
  }

  get alwaysExpanded(): boolean {
    return this._alwaysExpanded
  }
  set alwaysExpanded(value: boolean) {
    this._alwaysExpanded = value
  }

  get active(): boolean {
    return this._active
  }
  set active(value: any) {
    if (typeof value === 'boolean') {
      this._active = value
      this.active
        ? this.classList.add('active')
        : this.classList.remove('active')
    } else {
      this._active = false
      this.classList.remove('active')
    }
  }

  get isLazyLoad(): boolean {
    return this._isLazyLoad
  }
  set isLazyLoad(value: boolean) {
    this._isLazyLoad = value
  }

  get editable(): boolean {
    return this._editable
  }
  set editable(value: boolean) {
    this._editable = value
  }

  get rootParent() {
    return this.closest('i-tree-view') as TreeView
  }

  get icon(): Icon {
    if (!this._iconElm) {
      this._iconElm = <any>Icon.create(defaultIcon);
    };
    return this._iconElm;
  }

  get rightIcon(): Icon {
    if (!this._iconRightElm)
      this._iconRightElm = <any>Icon.create(defaultIcon);
    return this._iconRightElm;
  }

  get height() {
    return <any>(!isNaN(<any>this._height) ? this._height : this.offsetHeight);
  }
  set height(value: number|string) {
    this._height = value;
    this._wrapperElm.style.height = typeof value === 'string' ? value : `${value}px`;
  }

  // Trigger when node caption is changed
  private handleChange(target: TreeNode, oldValue: string, newValue: string) {
    // const paths = target.filePath?.paths;
    // if (paths) {
    //   paths[paths.length - 1] = { name: newValue }
    //   target.filePath = { paths }
    // }
    debugger
    const fn = this.rootParent.onChange
    if (fn && typeof fn === 'function')
      fn(this.rootParent, target, oldValue, newValue)
  }


  private renderEditMode() {
    const captionInput = <HTMLInputElement>this.createElement('input')
    captionInput.value = this.caption
    captionInput.classList.add('text-input')
    this._captionElm.innerHTML = ''
    this._captionElm.appendChild(captionInput)
    captionInput.focus()
    this.click()

    let isUpdating = false;
    let isValid = true;
    const updateCaption = () => {
      const newValue = captionInput.value;
      console.log('rootparent deleteNodeOnEmptyCaption', this.rootParent._deleteNodeOnEmptyCaption);
      console.log('empty string', captionInput.value.replace(/\s+/g, '') === '')
      if(this.rootParent._deleteNodeOnEmptyCaption && captionInput.value.replace(/\s+/g, '') === '') {
        return this.remove();
      }
      if (newValue !== this.caption) {
        const fn = this.rootParent.onBeforeChange
        if (fn && typeof fn === 'function') isValid = fn(this.rootParent, this, this.caption, newValue);
        if (isValid) {
          this.handleChange(this, this.caption, newValue);
          this.caption = newValue;
        }
      } else {
        this.caption = this._caption;
      }
    }

    captionInput.addEventListener('blur', (event: Event) => {
      event.preventDefault()
      if (isUpdating) return;
      if (!isValid) {
        captionInput.value = this._caption;
      }
      updateCaption();
    })
    captionInput.addEventListener('keyup', (event: KeyboardEvent) => {
      event.preventDefault()
      if (event.key === 'Enter' || event.keyCode === 13) {
        isUpdating = true;
        updateCaption();
        isUpdating = false;
      }
    })
  }

  private handleEdit(event: Event) {
    event.stopImmediatePropagation()
    event.preventDefault()
    this.renderEditMode()
  }

  edit() {
    this.editable = true
    this.renderEditMode()
  }

  appendNode(childNode: TreeNode) {
    if (!this._childNodeElm) this.initChildNodeElm()
    this._childNodeElm.appendChild(childNode)
    if (!this.data.children) this.data.children = []
    this.data.children.push(childNode.data)
    return childNode;
  }

  private initChildNodeElm() {
    this.classList.add('has-children');
    this._expandElm = <HTMLInputElement>this.createElement('input', this._wrapperElm)
    this._expandElm.type = 'checkbox'
    if (this.expanded)
      this._expandElm.checked = true
    if (this._iconElm)
      this._wrapperElm.insertBefore(this._expandElm, this._iconElm);
    else
      this._wrapperElm.insertBefore(this._expandElm, this._captionElm);

    this._childNodeElm = this.createElement('div', this)
    this._childNodeElm.classList.add('i-tree-node_children')
  };

  _handleClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    if (this.collapsible && this._expandElm) {
      this._expandElm.checked = !this._expandElm.checked
      if (this._expandElm.checked)
        this.classList.add('is-checked')
      else if (!this.alwaysExpanded)
        this.classList.remove('is-checked')
    };
    if (target.closest('i-icon') || target.nodeName === 'I-ICON') {
      return true
    }
    const parent = this._parent || target.closest('i-tree-view');
    if (parent instanceof TreeView) {
      parent._setActiveItem(this, event);
      if (parent.onClick) parent.onClick(parent, event);  
    }

    if (this.isLazyLoad) {
      this.dispatchEvent(beforeExpandEvent)
    }
    return super._handleClick(event, true);
  }

  _handleDblClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    const parent = this._parent || target.closest('i-tree-view');
    if (this.editable) {
      this.handleEdit(event);
    } else if (parent instanceof TreeView) {
      if (parent.onDblClick) parent.onDblClick(parent, event);
    };
    return super._handleClick(event, true);
  }

  _handleContextMenu(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    const parent = this._parent || target.closest('i-tree-view');
    if (parent instanceof TreeView)
      if (parent.onContextMenu) parent.onContextMenu(parent, event);
    return super._handleClick(event, true);
  }

  protected init() {
    if (!this._captionElm) {
      this.classList.add('i-tree-node')
      this.data = this.options;
      let caption = this.getAttribute('caption', true, '')
      let icon = this.getAttribute('icon', true)
      let rightIcon = this.getAttribute('rightIcon', true)
      let collapsible = this.getAttribute('collapsible', true)
      let expanded = this.getAttribute('expanded', true)
      let active = this.getAttribute('active', true, false)
      let isLazyLoad = this.getAttribute('isLazyLoad', true, false)

      this.collapsible = collapsible
      this.expanded = expanded
      this.active = active
      this.isLazyLoad = isLazyLoad

      this._wrapperElm = this.createElement('div', this)
      this._wrapperElm.classList.add('i-tree-node_content')
  
      const iconData = {...defaultIcon, ...(icon || {})}
      iconData.height = iconData.height || '0.75rem'
      iconData.width = iconData.width || '0.75rem'
      iconData.name = iconData.name || "caret-right";
      this._iconElm = new Icon(undefined, iconData)
      this._iconElm.classList.add('i-tree-node_icon')
      icon && this._iconElm.classList.add('custom-icon')
      this._wrapperElm.appendChild(this._iconElm)


      this._captionElm = this.createElement('label', this._wrapperElm)
      this._captionElm.classList.add('i-tree-node_label')
      this.caption = caption

      const rightWrap =  this.createElement('div', this._wrapperElm)
      rightWrap.classList.add('is-right')
      const actionGroup = this.createElement('div', rightWrap)
      actionGroup.classList.add('button-group')

      const rightIconData = {...defaultIcon, ...(rightIcon || {})}
      rightIconData.height = rightIconData.height || '0.75rem'
      rightIconData.width = rightIconData.width || '0.75rem'
      rightIconData.name = rightIcon?.name || ''
      this._iconRightElm = new Icon(undefined, rightIconData)
      this._iconRightElm.classList.add('i-tree-node_icon', 'custom-icon')
      rightWrap.appendChild(this._iconRightElm)
      rightWrap.insertBefore(this._iconRightElm, actionGroup)

      if (this.data?.children?.length)
        this.initChildNodeElm()
    }
    super.init()
  }

  static async create(options?: TreeNodeElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
