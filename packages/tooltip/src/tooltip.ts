import { Control, customElements } from '@ijstech/base';
import "./style/tooltip.css";
import {PlacementType, TriggerType, ITooltipImpl, ITooltip} from '@ijstech/types';
export {ITooltip};

const DEFAULT_DURATION = 2000;
@customElements('i-tooltip')
export class Tooltip extends Control implements ITooltipImpl {
  private _content: string;
  private _popperClass: string;
  private _placement: PlacementType;
  private _color: string;
  private _maxWidth: string;
  private _trigger: TriggerType;
  private _duration: number;
  private timeout: any;

  private tooltipElm: HTMLElement;

  constructor(parent: Control) {
    super(parent);
    this.initData(parent);
    this.initEvents(parent);
  }

  private initData(source: Control) {
    const data = source.getAttribute('tooltip', true);
    let options = data;
    if (typeof data === 'string') {
      try {
        options = JSON.parse(data);
      } catch {
        options = null;
      }
    }
    this.content = options?.content || ''
    this.popperClass = options?.popperClass || 'tooltip-content'
    this.placement = options?.placement || 'top'
    this.trigger = options?.trigger || 'hover'
    this.color = options?.color || 'rgba(0,0,0,.75)'
    if (options?.maxWidth) this.maxWidth = options.maxWidth
  }

  private positionAt(parent: HTMLElement, tooltip: HTMLElement, placement: PlacementType) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    const dist = 10;

    switch(placement) {
      case "top":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
      case "topLeft":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left;
        break;
      case "topRight":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left + parent.offsetWidth - tooltip.offsetWidth;
        break;
      case "left":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "leftTop":
        top = parentCoords.top;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "leftBottom":
        top = parentCoords.top + parent.offsetHeight - tooltip.offsetHeight;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "right":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "rightTop":
        top = parentCoords.top;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "rightBottom":
        top = parentCoords.top + parent.offsetHeight - tooltip.offsetHeight;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "bottom":
        top = parentCoords.bottom + dist;
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
      case "bottomLeft":
        top = parentCoords.bottom + dist;
        left = parentCoords.left;
        break;
      case "bottomRight":
        top = parentCoords.bottom + dist;
        left = parentCoords.left + parent.offsetWidth - tooltip.offsetWidth;
        break;
    }

    left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.bottom + dist : top;

    tooltip.style.left = left + "px";
    tooltip.style.top = top + pageYOffset + "px";
  }

  get trigger(): TriggerType {
    return this._trigger;
  }
  set trigger(value: TriggerType) {
    this._trigger = value;
  }

  get popperClass(): string {
    return this._popperClass;
  }
  set popperClass(value: string) {
    this._popperClass = value;
    if (this.tooltipElm && value)
      this.tooltipElm.classList.add(this.popperClass);
  }

  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
    if (this.tooltipElm && value) {
      this.tooltipElm.style.backgroundColor = this.color;
      this.tooltipElm.style.setProperty("--tooltips-arrow-background", this.color);
    }
  }

  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
    if (this.tooltipElm)
      this.tooltipElm.innerHTML = this.content;
  }

  get placement(): PlacementType {
    return this._placement;
  }
  set placement(value: PlacementType) {
    this._placement = value;
    if (this.tooltipElm)
      this.tooltipElm.classList.add(`ii-tooltip-${this.placement}`);
  }

  get duration(): number {
    return this._duration;
  }
  set duration(value: number) {
    this._duration = value;
  }

  get isSmallScreen() {
    return screen.width <= 1024;
  }

  get maxWidth(): string {
    return this._maxWidth;
  }
  set maxWidth(value: string) {
    this._maxWidth = value;
    if (this.tooltipElm && value)
      this.tooltipElm.style.maxWidth = this.maxWidth;
  }

  get designMode(): boolean {
    return this._designMode;
  }
  set designMode(value: boolean) {
    this._designMode = value;
  }

  public show(elm: HTMLElement) {
    if (!this.tooltipElm) this.renderTooltip()
    document.body.appendChild(this.tooltipElm);
    this.positionAt(elm, this.tooltipElm, this.placement);
  }

  public close() {
    if (this.tooltipElm && document.body.contains(this.tooltipElm))
      document.body.removeChild(this.tooltipElm)
  }

  private onHandleClick(elm: HTMLElement) {
    if (this._designMode) return;
    this.show(elm)
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout)
      if (this.tooltipElm && document.body.contains(this.tooltipElm))
        document.body.removeChild(this.tooltipElm)
    }, this.duration || DEFAULT_DURATION);
  }

  private renderTooltip() {
    this.tooltipElm = document.createElement("div");
    this.tooltipElm.classList.add("ii-tooltip");

    this.tooltipElm.innerHTML = this.content;
    this.tooltipElm.classList.add(this.popperClass);
    this.tooltipElm.classList.add(`ii-tooltip-${this.placement}`);
    if (this.color) {
      this.tooltipElm.style.backgroundColor = this.color;
      this.tooltipElm.style.setProperty("--tooltips-arrow-background", this.color);
    }
    if (this.maxWidth)
      this.tooltipElm.style.maxWidth = this.maxWidth;
  }

  private initEvents(source: Control) {
    source.addEventListener('mouseover', e => {
      if (!this.content || this._designMode) return
      if (this.trigger === 'hover') {
        e.preventDefault()
        e.stopImmediatePropagation()
        this.show(source)
        source.addEventListener("mouseleave", (e: Event) => {
          this.close()
        });
      }
    })
    source.addEventListener("mousedown", (e: Event) => {
      if (!this.content || this._designMode) return
      if (this.trigger === 'click' || this.isSmallScreen) {
        this.onHandleClick(source);
      } else {
        this.close();
      }
    });
  }
}
