import { Control, customElements, ControlElement, observable, notifyEventCallback, Types, I18n } from '@ijstech/base';
import './style/range.css'
import { application } from '@ijstech/application';
import { GroupType } from '@ijstech/types';

type tooltipFormatterCallback = (value: number) => string;

export interface RangeElement extends ControlElement {
  caption?: string;
  captionWidth?: number | string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  stepDots?: boolean | number;
  tooltipFormatter?: tooltipFormatterCallback;
  tooltipVisible?: boolean;
  trackColor?: Types.Color;
  onChanged?: notifyEventCallback;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-range']: RangeElement
    }
  }
}

const DEFAULT_VALUES = {
  captionWidth: 40,
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  stepDots: false,
  tooltipVisible: false
}

@customElements("i-range", {
  icon: 'sliders-h',
  group: GroupType.FIELDS,
  className: 'Range',
  props: {
    caption: { type: 'string', default: '' },
    captionWidth: { type: 'number', default: DEFAULT_VALUES.captionWidth },
    value: { type: 'number', default: DEFAULT_VALUES.value },
    min: { type: 'number', default: DEFAULT_VALUES.min },
    max: { type: 'number', default: DEFAULT_VALUES.max },
    step: { type: 'number', default: DEFAULT_VALUES.step },
    stepDots: { type: 'boolean', default: DEFAULT_VALUES.stepDots },
    tooltipVisible: { type: 'boolean', default: DEFAULT_VALUES.tooltipVisible },
    trackColor: { type: 'string', default: '' }
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
      caption: { type: 'string' },
      value: { type: 'number', default: DEFAULT_VALUES.value },
      min: { type: 'number', default: DEFAULT_VALUES.min },
      max: { type: 'number', default: DEFAULT_VALUES.max },
      step: { type: 'number', default: DEFAULT_VALUES.step },
      stepDots: { type: 'boolean', default: DEFAULT_VALUES.stepDots },
      tooltipVisible: { type: 'boolean', default: DEFAULT_VALUES.tooltipVisible },
      trackColor: { type: 'string', format: 'color' }
    }
  }
})
export class Range extends Control {
  @observable('value')
  private _value: number;
  private _caption: string;
  private _captionWidth: number | string;
  // private _labels: string[];
  private _tooltipVisible: boolean;
  private _trackColor: Types.Color;

  private tooltipFormatter: tooltipFormatterCallback;

  private captionSpanElm: HTMLElement;
  private labelElm: HTMLLabelElement;
  private inputElm: HTMLInputElement;
  // private rangeLabelListElm: HTMLUListElement;
  private inputContainerElm: HTMLElement;
  private tooltipElm: HTMLElement;

  public onChanged: notifyEventCallback;
  public onKeyUp: notifyEventCallback;

  private callback: (value: any) => void;

  constructor(parent?: Control, options?: any) {
    super(parent, options, {
      height: 25,
      width: 100
    });
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    if (this.labelElm && this._caption?.startsWith('$'))
      this.labelElm.textContent = i18n.get(this._caption) || '';
  }

  get caption(): string{
    const value = this._caption || '';
    if (value?.startsWith('$')) {
      const translated =
        this.parentModule?.i18n?.get(this._caption) ||
        application.i18n?.get(this._caption) ||
        '';
      return translated;
    }
    return value;
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value;
    this.labelElm.style.display = !value ? 'none' : '';
    if (!this.labelElm) return;
    this.labelElm.textContent = this.caption;
  }
  get captionWidth(): number {
    return this.labelElm.offsetWidth;
  }
  set captionWidth(value: number | string) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, 'width', value);
    const captionWidth = this.caption ? this.captionWidth : 0;
    const width = this.width - captionWidth;
    this.inputContainerElm.style.width = `${width}px`;

    // if (this.labels) {
    //   this.rangeLabelListElm.style.paddingLeft = captionWidth;
    // }
  }

  get value(): number {
    return this._value
  }
  set value(value: number) {
    if (value === null)
      value = +this.inputElm.min;
    this._value = value;
    this.inputElm.value = value.toString();
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + '% 100%';
    this.onUpdateTooltip(false);
    if (this.callback) this.callback(value);
  }

  get width(): number {
    return this.offsetWidth;
  }
  set width(value: number | string) {
    this.setPosition('width', value);
    const width = typeof value === 'string' ? value : `${value}px`;
    let captionWidth = typeof this._captionWidth === 'string' ? this._captionWidth : `${this._captionWidth}px`;
    if (!this.caption) captionWidth = '0px';
    this.inputContainerElm.style.width = `calc(${width} - ${captionWidth})`;

    // if (this.labels) {
    //   this.rangeLabelListElm.style.paddingLeft = captionWidth;
    // }
  }

  // get _ratio(): number {
  //   var min = this.inputElm.min === '' ? 0 : parseInt(this.inputElm.min);
  //   var max = this.inputElm.max === '' ? 100 : parseInt(this.inputElm.max);
  //   return (this.value - min) / (max - min);
  // }
  // get labels(): string[] {
  //   return this._labels;
  // }
  // set labels(labels: string[]) {
  //   this._labels = labels;
  // }

  get enabled(): boolean {
    return super.enabled;
  }
  set enabled(value: boolean) {
    super.enabled = value;
    this.inputElm.disabled = !value;
  }

  set designMode(value: boolean) {
    this._designMode = value;
    if (this.inputElm) {
      this.inputElm.disabled = value || this.enabled === false;
    }
  }

  get tooltipVisible(): boolean {
    return this._tooltipVisible;
  }
  set tooltipVisible(value: boolean) {
    this._tooltipVisible = value;
    this.tooltipElm.style.display = value ? 'block' : 'none';
  }

  get trackColor() {
    return this._trackColor;
  }
  set trackColor(value: Types.Color) {
    this._trackColor = value;
    if (value)
      this.style.setProperty('--track-color', value)
    else
      this.style.removeProperty('--track-color')
  }

  get min() {
    return Number(this.inputElm.min) || 0;
  }

  set min(value: number) {
    this.inputElm.min = value.toFixed();
  }

  get max() {
    return Number(this.inputElm.max) || 0;
  }

  set max(value: number) {
    this.inputElm.max = value.toFixed();
  }

  get step() {
    return Number(this.inputElm.step) || 0;
  }

  set step(value: number) {
    this.inputElm.step = value.toFixed();
  }

  private onSliderChange(event: Event) {
    if (this._designMode) {
      event.preventDefault();
      return false;
    }
    this.value = +this.inputElm.value;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + '% 100%';
    if (typeof this.onChanged === 'function') this.onChanged(this, event)
    if (typeof this.onObserverChanged === 'function') this.onObserverChanged(this, event);
    this.onUpdateTooltip(false);
  }
  // renderLabels() {
  //   this.labels.forEach((label: string) => {
  //     const labelElm = <HTMLElement>this.createElement('li', this.rangeLabelListElm);
  //     labelElm.innerHTML = label;
  //   })
  // }
  private onUpdateTooltip(init: boolean) {
    let inputValue = this._value;
    let formattedValue = typeof this.tooltipFormatter === 'function' ? this.tooltipFormatter(inputValue) : inputValue;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);

    if (init) {
      this.tooltipElm.style.marginLeft = `-${this.tooltipElm.clientWidth / 2}px`
    }

    this.tooltipElm.textContent = `${formattedValue}`;
    this.tooltipElm.style.left = (this._value - min) * 100 / (max - min) + '%';
  }
  protected init() {
    if (!this.captionSpanElm) {
      this.callback = this.getAttribute("parentCallback", true);
      const min = this.getAttribute("min", true, DEFAULT_VALUES.min);
      const max = this.getAttribute("max", true, DEFAULT_VALUES.max);
      // const labels = this.getAttribute("labels", true) || '';
      const step = this.getAttribute("step", true, DEFAULT_VALUES.step);
      const stepDots = this.getAttribute("stepDots", true, DEFAULT_VALUES.stepDots);
      const tooltipVisible = this.getAttribute("tooltipVisible", true, DEFAULT_VALUES.tooltipVisible);
      this.tooltipFormatter = this.getAttribute("tooltipFormatter", true) || this.tooltipFormatter;

      this.captionSpanElm = this.createElement('span', this);
      this.labelElm = <HTMLLabelElement>this.createElement('label', this.captionSpanElm);

      this.inputContainerElm = this.createElement('div', this);
      this.inputContainerElm.classList.add("slider");

      this.inputElm = <HTMLInputElement>this.createElement('input', this.inputContainerElm);
      this.inputElm.setAttribute('autocomplete', 'disabled');
      this.inputElm.type = 'range';
      this.inputElm.min = min;
      this.inputElm.max = max;
      this.inputElm.disabled = this._designMode || this.enabled === false;
      if (step !== 0) {
        this.inputElm.step = step;
      }
      this.inputElm.addEventListener('input', this.onSliderChange.bind(this));
      if (this.onMouseUp)
        this.inputElm.addEventListener('mouseup', (e) => {
          if (this._designMode) {
            e.preventDefault();
            return false;
          }
          this.onMouseUp(this, e)
        })
      if (this.onKeyUp)
        this.inputElm.addEventListener('keyup', (e) => {
          if (this._designMode) {
            e.preventDefault();
            return false;
          }
          const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
          if (keys.includes(e.key))
            this.onKeyUp(this, e)
        })
      this.tooltipElm = this.createElement('span', this.inputContainerElm);
      this.tooltipElm.classList.add('tooltip');
      this.tooltipVisible = tooltipVisible || this.tooltipFormatter || false;

      this.captionWidth = this.getAttribute('captionWidth', true, DEFAULT_VALUES.captionWidth);
      this.caption = this.getAttribute('caption', true);

      if (stepDots) {
        this.classList.add('--step')
        const stepContainer = this.createElement('div', this);
        stepContainer.classList.add('slider-step');
        stepContainer.style.width = '100%';
        if (this.caption) {
          stepContainer.style.paddingLeft = this.captionWidth + "px";
        }
        const dotNums = typeof stepDots === 'boolean' ? (max - min) / (step || 1) + 1 : stepDots;
        for (let i = 0; i < dotNums; i++) {
          const dotElm = this.createElement('span', stepContainer);
          dotElm.classList.add('step-dot');
        }
      }
      this.value = this.getAttribute('value', true, DEFAULT_VALUES.value);
      if (this._value > 0) {
        this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + '% 100%';
      }
      const trackColor = this.getAttribute('trackColor', true);
      if (trackColor !== undefined) this.trackColor = trackColor;

      // if (labels) {
      //   this.rangeLabelListElm = <HTMLUListElement>this.createElement('ul', this);
      //   this.rangeLabelListElm.classList.add('range-labels');
      //   this.rangeLabelListElm.style.paddingLeft = this.captionWidth + 'px';
      //   this.labels = JSON.parse(labels);
      //   this.renderLabels();
      // }
      this.onUpdateTooltip(true);
      super.init();
    }
  }

  static async create(options?: RangeElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
