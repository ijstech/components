import { customElements, ControlElement, Control, notifyEventCallback, I18n } from '@ijstech/base';
import { Modal } from '@ijstech/modal';
import { GridLayout, HStack, Panel, VStack } from '@ijstech/layout';
import { Range } from '@ijstech/range';
import { Icon } from '@ijstech/icon';
import { stringToArr, getUnitValues, hslaToHex, convertColor, isRgbValid, rgbaToHsla, isHValid, isPercentValid, hslaToRgba, customRound, hsvToHsl, hslToHsv } from './utils';
import './style/color.css';
import * as Styles from "@ijstech/style";
import { GroupType } from '@ijstech/types';
import { application } from '@ijstech/application';
let Theme = Styles.Theme.ThemeVars;

export interface ColorPickerElement extends ControlElement {
  value?: string;
  caption?: string;
  captionWidth?: number | string;
  onChanged?: notifyEventCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-color']: ColorPickerElement
    }
  }
}
declare const window: any;

const rgb = ['r', 'g', 'b', 'a'];
const hsl = ['h', 's', 'l', 'a'];
const hex = ['hex'];
const formatList = ['hex', 'rgb', 'hsl'];
const formatMap: {[key: string]: string[]} = { hex, rgb, hsl };
// type FormatType = 'hex' | 'rgb' | 'hsl';
const DEFAULT_COLOR = '#000';
const DEFAULT_BG_COLOR = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=) #fff';

@customElements('i-color', {
  icon: 'palette',
  group: GroupType.FIELDS,
  className: 'ColorPicker',
  props: {
    value: {
      type: 'string',
      default: ''
    },
    caption: {
      type: 'string',
      default: ''
    },
    captionWidth: {
      type: 'number',
      default: 0
    },
  },
  events: {
    onChanged: [
      {name: 'target', type: 'Control', isControl: true},
      {name: 'event', type: 'Event'}
    ],
    onClosed: []
  },
  dataSchema: {
    type: 'object',
    properties: {
      value: {
        type: 'string'
      },
      caption: {
        type: 'string'
      }
    }
  }
})
export class ColorPicker extends Control {
  private wrapperElm: HTMLElement;
  private inputSpanElm: HTMLElement;
  private captionSpanElm: HTMLElement;

  private mdColorPicker: Modal;
  private colorPalette: Range;
  private colorSlider: Range;
  private pnlShown: Panel;
  private pnlWrap: Panel;
  private pnlInput: HStack;
  private colorSelected: Panel;

  private _caption: string;
  private _captionWidth: number | string;
  private _format: number = 0;
  private inputMap = new Map();
  private currentH: number = 0;
  private currentColor: {[key: string]: any} = {
    h: 0, s: 0, l: 0,
    r: 0, g: 0, b: 0,
    a: 1,
    hex: DEFAULT_COLOR
  };
  private currentPalette: string = 'rgb(255, 0, 0)';
  private isMousePressed: boolean;
  private isValueChanged: boolean;

  public onChanged: notifyEventCallback;
  public onClosed: () => void;

  constructor(parent?: Control, options?: any) {
    super(parent, options);
  }

  get value(): string {
    return this.currentColor?.hex || '';
  }
  set value(color: string) {
    const data = convertColor(color);
    if (data.isValid)
      this.currentColor = {...data}
    this.updateUI(true);
    this.updateIconPointer();
  }

  updateLocale(i18n: I18n): void {
    if (this.captionSpanElm && this._caption?.startsWith('$'))
      this.captionSpanElm.innerHTML = i18n.get(this._caption) || '';
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
    this.captionSpanElm.style.display = !value ? 'none' : '';
    if (!this.captionSpanElm) return;
    this.captionSpanElm.innerHTML = this.caption;
  }

  get captionWidth(): number | string {
    return this._captionWidth;
  }
  set captionWidth(value: number | string) {
    if (!value) return
    this._captionWidth = value;
    this.setElementPosition(this.captionSpanElm, 'width', value);
  }

  get height(): number {
    return this.offsetHeight;
  }
  set height(value: number | string) {
    this.setPosition('height', value);
  }

  protected async init() {
    if (!this.wrapperElm) {
      super.init();
      this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
      this.onClosed = this.getAttribute('onClosed', true) || this.onClosed;
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.wrapperElm = this.createElement('div', this);
      this.wrapperElm.classList.add('i-color');

      this.captionSpanElm = <HTMLElement>this.createElement('span', this.wrapperElm);
      this.captionWidth = this.getAttribute('captionWidth', true);
      this.caption = this.getAttribute('caption', true);

      this.mdColorPicker = await Modal.create({
        popupPlacement: 'bottomLeft',
        closeOnBackdropClick: true,
        width: 'auto',
        minWidth: 230,
        showBackdrop: false,
        // isChildFixed: true,
        onClose: this.onClosePicker.bind(this)
      });
      this.mdColorPicker.onOpen = this.onOpenPicker.bind(this);
      this.mdColorPicker.classList.add('color-picker-modal');
      this.wrapperElm.appendChild(this.mdColorPicker);

      const item = await Panel.create();
      item.classList.add('pnl-select');
      await this.createPreview();
      item.appendChild(this.pnlShown);

      this.pnlWrap = await Panel.create({
        padding: {top: '1rem', left: '1rem', right: '1rem', bottom: '0.75rem'},
        width: '100%',
        background: {color: '#fff'}
      });
      item.appendChild(this.pnlWrap);
      this.mdColorPicker.item = item;
      await this.createPicker();

      const valueElm = <HTMLElement>this.createElement('span', this.wrapperElm);
      valueElm.classList.add('input-span');
      valueElm.addEventListener('click', () => {
        if (!this.enabled || this._designMode) return;
        const isVisible = this.mdColorPicker.visible;
        if (!isVisible) {
          this.updateIconPointer();
        }
        this.mdColorPicker.visible = !this.mdColorPicker.visible;
      });
      this.inputSpanElm = <HTMLElement>this.createElement('span',  valueElm);
      this.inputSpanElm.style.background = this.value || DEFAULT_BG_COLOR;

      const value = this.getAttribute('value', true);
      if (value !== undefined) this.value = value;
    }
  }

  private onOpenPicker() {
    this.isValueChanged = false;
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  private onClosePicker() {
    if (typeof this.onClosed === 'function' && this.isValueChanged) {
      this.onClosed();
    }
    if (this.inputSpanElm)
      this.inputSpanElm.style.background = this.value || DEFAULT_BG_COLOR;
    this.isMousePressed = false;
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  private createInputGroup() {
    let wrapElm = this.pnlInput.querySelector('.color-input-group') as HTMLElement;
    if (!wrapElm) {
      wrapElm = this.createElement('div', this.pnlInput);
      wrapElm.classList.add('color-input-group');
    }
    wrapElm.innerHTML = '';
    const formatType = formatList[this._format] || '';
    const list = formatMap[formatType];
    for (let item of list) {
      const inputWrap = this.createElement('div', wrapElm);
      inputWrap.classList.add('color-input');
      const input = <HTMLInputElement>this.createElement('input', inputWrap);
      let value = this.currentColor[item];
      if (item === 's' || item === 'l') value = (value ?? '') + '%';
      input.value = value !== undefined ? value : (item === 'a' ? '1' : '');
      input.addEventListener('input', (event) => this.onInputChanged(event, item));
      this.inputMap.set(item, input);
      const span = this.createElement('span', inputWrap);
      span.style.textTransform = 'uppercase';
      span.style.color = '#222';
      span.innerHTML = item;
    }
  }

  private async createPreview() {
    this.pnlShown = await Panel.create({
      height: 136,
      width: '100%',
      minWidth: 232,
      overflow: 'hidden',
      background: {color: this.currentPalette || ''}
    });
    this.pnlShown.innerHTML = `
      <i-panel>
        <i-panel>
          <i-panel id="iconPointer"></i-panel>
        </i-panel>
      </i-panel>
    `;
    this.pnlShown.classList.add('color-preview');
    this.pnlShown.onClick = this.onColorSelected.bind(this);
  }

  protected _handleMouseDown(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    this.isMousePressed = this.pnlShown.contains(target);
    return false;
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.isMousePressed) {
      this.onColorSelected(this.pnlShown, event);
    }
	}

  private handleMouseUp(event: MouseEvent) {
    this.isMousePressed = false;
  }

  private async createPicker() {
    const picker = await GridLayout.create({
      gap: {column: '0.5rem', row: '0.5rem'},
      templateAreas: [['picker', 'selected', 'palette'], ['picker', 'selected', 'slider']],
      templateColumns: ['14px','30px', '120px'],
      margin: {bottom: '1rem'}
    });
    picker.classList.add('color-picker');

    const pickerIcon = await Icon.create({
      name: 'eye-dropper',
      width: 13,
      height: 13,
      fill: '#222'
    })
    pickerIcon.style.gridArea = 'picker';
    pickerIcon.onClick = () => this.activeEyeDropper(pickerIcon);
    const colorSelectedWrapper = await Panel.create();
    colorSelectedWrapper.classList.add('selected-color');
    colorSelectedWrapper.style.gridArea = 'selected';
    this.colorSelected = await Panel.create({
      position: 'absolute',
      width: '100%',
      height: '100%'
    });
    const { h, s, l, a, r = 0, g = 0, b = 0 } = this.currentColor;
    let paletteValue = h || 0;
    paletteValue = paletteValue > 360 ? 360 : paletteValue;
    colorSelectedWrapper.appendChild(this.colorSelected);
    this.colorPalette = await Range.create({
      width: '100%',
      height: 10,
      min: 0,
      max: 360,
      step: 1,
      value: paletteValue
    })
    this.colorPalette.onChanged = this.onPaletteChanged.bind(this);
    this.colorPalette.classList.add('custom-range', 'color-palette');
    this.colorPalette.style.gridArea = 'palette';
    this.mdColorPicker.style.setProperty(
      '--opacity-color',
      `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgb(${r}, ${g}, ${b}) 100%)`
    );
    if (h !== undefined) {
      this.mdColorPicker.style.setProperty('--selected-color', `hsla(${h}, ${s}%, ${l}%, ${a})`);
    }
    this.colorSlider = await Range.create({
      width: '100%',
      height: 10,
      min: 0,
      max: 1,
      value: a ?? 1,
      step: 0.01
    });
    this.colorSlider.onChanged = this.onSliderChanged.bind(this);
    this.colorSlider.classList.add('custom-range', 'color-slider');
    this.colorSlider.style.gridArea = 'slider';
    picker.append(pickerIcon, colorSelectedWrapper, this.colorPalette, this.colorSlider);
    this.pnlInput = await HStack.create({
      alignItems: 'center',
      gap: '0.5rem'
    });
    this.createInputGroup();
    const icons = await VStack.create({
      justifyContent: 'center',
      alignItems: 'center',
      maxHeight: 50
    })
    const topIcon = await Icon.create({
      name: 'angle-up',
      fill: '#000',
      width: 16,
      height: 16
    });
    topIcon.classList.add('pointer');
    topIcon.onClick = () => this.onToggleFormat(-1);
    const bottomIcon = await Icon.create({
      name: 'angle-down',
      fill: '#000',
      width: 16,
      height: 16
    });
    bottomIcon.classList.add('pointer');
    bottomIcon.onClick = () => this.onToggleFormat(1);
    icons.append(topIcon, bottomIcon);
    this.pnlInput.appendChild(icons);
    this.pnlWrap.append(picker, this.pnlInput);
  }

  private activeEyeDropper(pickerIcon: Icon) {
    pickerIcon.fill = Theme.colors.primary.main;
    const hasSupport = (): boolean => Boolean('EyeDropper' in window);
    if(hasSupport()) {
      const eyeDropper = new window.EyeDropper();
      eyeDropper
        .open()
        .then((result: { sRGBHex: string }) => {
          this.value = result.sRGBHex;
          pickerIcon.fill = '#222';
        })
        .catch((e: any) => {
          pickerIcon.fill = '#222';
        });
    } else {
      console.warn('No Support: This browser does not support the EyeDropper API yet!');
    }
  }

  private onPaletteChanged() {
    const value = this.colorPalette.value;
    this.setPalette(value);
    if (this.currentPalette) {
      this.pnlShown.background = {color: this.currentPalette};
      const rgbArr = stringToArr(this.currentPalette, true);
      if (this.mdColorPicker)
        this.mdColorPicker.style.setProperty(
          '--opacity-color',
          `linear-gradient(to right, rgba(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]}, 0) 0%, ${this.currentPalette} 100%)`
        );
        const { s, l } = this.currentColor;
        this.updateColor(this.currentH, s, l);
      // this.onColorSelected(this.pnlShown);
    }
  }

  private onSliderChanged() {
    this.currentColor.a = this.colorSlider.value;
    this.updateHex();
    this.updateUI();
  }

  private onToggleFormat(value: number) {
    const maxLength = formatList.length;
    this._format = (((this._format + value) % maxLength) + maxLength) % maxLength;
    this.createInputGroup();
  }

  private updateIconPointer() {
    if (this.pnlShown) {
      const iconPointer = this.pnlShown.querySelector('#iconPointer') as HTMLElement;
      if (iconPointer) {
        const { h, s, l } = this.currentColor;
        const hsv = hslToHsv(h, s, l);
        const paletteWidth = this.pnlShown.offsetWidth;
        const paletteHeight = this.pnlShown.offsetHeight;

        const x = (hsv.s * paletteWidth / 100) | 0;
        const y = paletteHeight - (hsv.v * paletteHeight / 100) | 0;

        // const x = Math.round((s / 100) * paletteWidth);
        // const y = Math.round(paletteHeight * (1 - (2 * l - ((1 - x / paletteWidth) * 100)) / 100 ));
        // const y = Math.round((1 - l / 100) * paletteHeight);
        iconPointer.style.left = `${x}px`;
        iconPointer.style.top = `${y}px`;
      }
    }
  }

  private onColorSelected(target: Control, event?: any) {
    const rect = target.getBoundingClientRect();
    let x = 160;
    let y = 60;
    if (event) {
      x = event.clientX < rect.left ? 0 : event.clientX > rect.right ? rect.width : event.clientX - rect.left;
      y = event.clientY < rect.top ? 0 : event.clientY > rect.bottom ? rect.height : event.clientY - rect.top;
    }
    const iconPointer = target.querySelector('#iconPointer') as HTMLElement;
    if (iconPointer) {
      iconPointer.style.top = `${y}px`;
      iconPointer.style.left = `${x}px`;
    }
    const paletteWidth = target.offsetWidth;
    const paletteHeight = target.offsetHeight;
    // const hue = Math.round((this.currentH / 100) * 360);
    // const saturation = Math.round((x / paletteWidth) * 100);
    // const lightness = Math.round(((1 - y / paletteHeight) + (1 - x / paletteWidth)) * 50);
    const hue = this.currentH;
    const saturation = x * 100 / paletteWidth | 0;
    const value = 100 - (y * 100 / paletteHeight) | 0;
    const hsl = hsvToHsl(hue, saturation, value);
    this.updateColor(hsl.h, hsl.s, hsl.l);
  }

  private updateColor(h: number, s: number, l: number) {
    const a = this.colorSlider.value;
    const data = getUnitValues(h, s, l, a);
    if (data.isValid)
      this.updateCurrentColor(data);
  }

  private updateCurrentColor(data?: any, init = false) {
    if (data) this.currentColor = {...data};
    this.updateUI(init);
    if (typeof this.onObserverChanged === 'function')
      this.onObserverChanged(this, this.value as any);
    if (typeof this.onChanged === 'function')
      this.onChanged(this, this.value as any);
  }

  private updateHex() {
    const { h = 0, s = 0, l = 0, a } = this.currentColor;
    this.currentColor.hex = hslaToHex(h, s, l, a);
  }

  private updateUI(init?: boolean) {
    if (init) this.initUI();
    for (let unit in this.currentColor) {
      const input = this.inputMap.get(unit);
      if (!input) continue;
      const hasSuffix = (unit === 's' || unit === 'l');
      input.value = `${this.currentColor[unit]}${hasSuffix ? '%' : ''}` ;
    }
    const { h = 0, s = 0, l = 0, a = 1, r = 0, g = 0, b = 0, hex = '' } = this.currentColor;
    if (this.mdColorPicker) {
      this.mdColorPicker.style.setProperty('--selected-color', `hsla(${h}, ${s}%, ${l}%, ${a})`);
      this.mdColorPicker.style.setProperty(
        '--opacity-color',
        `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgb(${r}, ${g}, ${b}) 100%)`
      );
    }
    const hexInput = this.inputMap.get('hex');
    if (hexInput) hexInput.value = hex || '';
    if (this.inputSpanElm)
      this.inputSpanElm.style.background = this.value || DEFAULT_BG_COLOR;
    this.isValueChanged = true;
  }

  private initUI() {
    const { h, a } = this.currentColor || {};
    let paletteValue = h || 0;
    paletteValue = paletteValue > 360 ? 360 : paletteValue;
    this.setPalette(paletteValue);
    if (this.colorPalette) this.colorPalette.value = paletteValue;
    if (this.colorSlider) this.colorSlider.value = a ?? 1;
    if (this.pnlShown) {
      this.pnlShown.background = {color: this.currentPalette || ''};
    }
  }

  private setPalette(paletteValue: number) {
    this.currentH = paletteValue;
    const { r, g, b } = hslaToRgba(paletteValue, 100, 50);
    this.currentPalette = `rgb(${r}, ${g}, ${b})`;
  }

  private onInputChanged(event: any, item: string) {
    const value = event.target.value;
    let currentColor = {...this.currentColor};
    let isRgbChanged = false;
    let isHslChanged = false;
    let isAChanged = false;

    switch(item) {
      case 'hex':
        const data = convertColor(value);
        if (data.isValid) {
          this.updateCurrentColor(data, true);
          this.updateIconPointer();
        }
        break;
      case 'r':
      case 'g':
      case 'b':
        const isValid = isRgbValid(value);
        currentColor[item] = isValid ? value : 255;
        isRgbChanged = true;
        break;
      case 'h':
        const hValid = isHValid(value);
        currentColor[item] = hValid ? value : 0;
        isHslChanged = true;
        break;
      case 's':
      case 'l':
        if (!value.includes('%')) return;
        const sValid = isPercentValid(value);
        if (sValid) {
          currentColor[item] = value.replace('%', '');
          isHslChanged = true;
        }
        break;
      case 'a':
        if (value === '0.') return;
        let numValue = +value;
        const aValid = !isNaN(numValue);
        if (!aValid) numValue = 0;
        currentColor[item] = numValue < 0 ? 0 : (numValue > 1 ? 1 : numValue);
        isAChanged = true;
        break;
    }
    if (item === 'hex') return;
    const { r, g, b, h, s, l } = currentColor;
    if (isRgbChanged) {
      const { h, s, l } = rgbaToHsla(r, g, b);
      currentColor = {...currentColor, h, s, l};
    } else if (isHslChanged) {
      const { r, g, b } = hslaToRgba(h, s, l);
      currentColor = {...currentColor, r, g, b};
    }
    this.currentColor = {...currentColor};
    this.updateHex();
    this.updateCurrentColor(undefined, true);
    this.updateIconPointer();
  }

  static async create(options?: ColorPickerElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}