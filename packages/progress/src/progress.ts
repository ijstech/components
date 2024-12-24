import { Control, customElements, ControlElement, Types, IFont, FontStyle, TextTransform } from '@ijstech/base';
import './style/progress.css';
import * as Styles from '@ijstech/style';
import { GroupType } from '@ijstech/types';
const Theme = Styles.Theme.ThemeVars;

export type ProgressStatus = 'success' | 'exception' | 'active' | 'warning';
export type ProgressType = 'line' | 'circle';
type callbackType =  (target: Control) => void

export interface ProgressElement extends ControlElement {
    percent?: number;
    strokeWidth?: number;
    strokeColor?: Types.Color;
    loading?: boolean;
    steps?: number;
    type?: ProgressType;
    format?: (percent: number) => string;
    onRenderStart?: callbackType;
    onRenderEnd?: callbackType;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-progress']: ProgressElement
        }
    }
}

const defaultVals = {
    percent: 0,
    height: 20,
    loading: false,
    steps: 1,
    type: 'line',
    strokeWidth: 2
}

@customElements('i-progress', {
    icon: 'spinner',
    group: GroupType.BASIC,
    className: 'Progress',
    props: {
        percent: {
            type: 'number',
            default: defaultVals.percent
        },
        strokeWidth: {
            type: 'number',
            default: defaultVals.strokeWidth
        },
        strokeColor: {
            type: 'string',
            default: ''
        },
        loading: {
            type: 'boolean',
            default: defaultVals.loading
        },
        steps: {
            type: 'number',
            default: defaultVals.steps
        },
        type: {
            type: 'string',
            default: defaultVals.type
        }
    },
    events: {
        format: [
            {name: 'percent', type: 'number'}
        ],
        onRenderStart: [
            {name: 'target', type: 'Progress', isControl: true}
        ],
        onRenderEnd: [
            {name: 'target', type: 'Progress', isControl: true}
        ]
    },
    dataSchema: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                enum: ['line', 'circle'],
                default: defaultVals.type
            },
            percent: {
                type: 'number',
                default: defaultVals.percent
            },
            strokeWidth: {
                type: 'number',
                default: defaultVals.strokeWidth
            },
            strokeColor: {
                type: 'string',
                format: 'color'
            },
            loading: {
                type: 'boolean',
                default: defaultVals.loading
            },
            steps: {
                type: 'number',
                default: defaultVals.steps
            }
        }
    }
})
export class Progress extends Control {
    private _percent: number;
    private _status: ProgressStatus;
    private _loading: boolean;
    private _steps: number;
    private _type: ProgressType;
    private _strokeWidth: number;
    private _strokeColor: Types.Color;

    private _wrapperElm: HTMLElement;
    private _startElm: HTMLElement;
    private _barElm: HTMLElement;
    private _endElm: HTMLElement;
    private _textElm: HTMLElement;

    public format: (percent: number) => string;
    public onRenderStart: callbackType;
    public onRenderEnd: callbackType;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {
            ...defaultVals
        });
        if (options?.onRenderStart) this.onRenderStart = options.onRenderStart;
        if (options?.onRenderEnd) this.onRenderEnd = options.onRenderEnd;
    }

    get percent(): number {
        return this._percent;
    }
    set percent(value: number) {
        this._percent = +value < 0 ? 0 : +value > 100 ? 100 : +value;

        const overlayElm = <HTMLElement>this.querySelector('.i-progress_overlay');
        if (overlayElm) {
            overlayElm.style.width = `${this._percent}%`;
            overlayElm.style.backgroundColor = this.stroke;
        }

        if (this._percent > 0 && this._percent < 100)
            this._wrapperElm.classList.add('i-progress--active');
        else if (this._percent === 100)
            this._wrapperElm.classList.add('i-progress--success');
        
        if (typeof this.format === 'function') {
            if (!this._textElm) {
                this._textElm = this.createElement('span', this);
                this._textElm.classList.add('i-progress_text');
                this._textElm.style.fontSize = this.progressTextSize + 'px';
                this._textElm.style.color = this.strokeColor;
            }
            this._textElm.innerHTML = this.format(this._percent);
        }

        if (this.type === 'circle') {
            this.updateCircleInner();
        }
    }

    get strokeColor(): Types.Color {
        return this._strokeColor || Theme.colors.primary.main;
    }
    set strokeColor(value: Types.Color) {
        this._strokeColor = value;
        if (this.type === 'circle') {
            this.renderCircleInner();
        } else if (this.type === 'line') {
            const overlayElm = <HTMLElement>this.querySelector('.i-progress_overlay');
            if (overlayElm)
                overlayElm.style.backgroundColor = this.stroke;
        }
    }
    
    get loading(): boolean {
        return this._loading;
    }
    set loading(value: boolean) {
        this._loading = value;
        if (value)
            this.classList.add('is-loading');
        else
            this.classList.remove('is-loading');
    }

    get steps(): number {
        return this._steps;
    }
    set steps(value: number) {
        this._steps = +value;
        if (this.type === 'circle') return;
        const wrapbarElm = <HTMLElement>this.querySelector('.i-progress_bar');
        const overlayElm = <HTMLElement>this.querySelector('.i-progress_overlay');
        const wrapperElm = <HTMLElement>this.querySelector('.i-progress_wrapbar');
        if (wrapperElm) wrapperElm.classList.toggle('has-steps', this._steps > 1);
        wrapbarElm.innerHTML = '';
        if (this._steps > 1) {
            const unitStep = 100 / this._steps;
            const percentStep = Math.ceil(this.percent / unitStep);
            const remainder = this.percent % unitStep;
            const initialH = Math.max(1, Math.floor(this.strokeWidth / 2));
            for (let i = 0; i < this._steps; i++) {
                const barItem = this.createElement('div');
                barItem.style.width = unitStep + '%';
                barItem.style.height = `${i + initialH}px`;
                if (i === percentStep - 1 && remainder !== 0) {
                    const childElm = this.createElement('div');
                    childElm.classList.add('i-progress_bar-item');
                    childElm.style.width = ((remainder * 100) / unitStep) + '%';
                    childElm.style.height = `${i + initialH}px`;
                    childElm.style.backgroundColor = this.stroke;
                    barItem.appendChild(childElm);
                } else if (i < percentStep) {
                    barItem.classList.add('i-progress_bar-item');
                    barItem.style.backgroundColor = this.stroke;
                }
                wrapbarElm.appendChild(barItem);
            }
            wrapbarElm.classList.remove('has-bg');
            overlayElm && (overlayElm.style.display = 'none');
        } else {
            wrapbarElm.classList.add('has-bg');
            overlayElm && (overlayElm.style.display = 'block');
        }
    }

    get type(): ProgressType {
        return this._type;
    }
    set type(value: ProgressType) {
        this._type = value;
        if (value === 'circle') {
            this.renderCircle();
        } else {
            this.renderLine();
        }
    }

    get strokeWidth(): number {
        return this._strokeWidth || defaultVals.strokeWidth;
    }
    set strokeWidth(value: number) {
        this._strokeWidth = value || defaultVals.strokeWidth;

        const overlayElm = <HTMLElement>this.querySelector('.i-progress_wrapbar');
        if (overlayElm)
            overlayElm.style.height = `${this._strokeWidth}px`;
    }

    get font(): IFont {
        return {
            color: this._textElm.style.color,
            name: this._textElm.style.fontFamily,
            size: this._textElm.style.fontSize,
            bold: this._textElm.style.fontStyle.indexOf('bold') >= 0,
            style: this._textElm.style.fontStyle as FontStyle,
            transform: this._textElm.style.textTransform as TextTransform,
            weight: this._textElm.style.fontWeight,
            shadow: this._textElm.style.textShadow
        }
    }
    set font(value: IFont) {
        if (this._textElm) {
            this._textElm.style.color = value.color || '';
            this._textElm.style.fontSize = value.size || '';
            this._textElm.style.fontWeight = value.bold ? 'bold' : '';
            this._textElm.style.fontFamily = value.name || '';
            this._textElm.style.fontStyle = value.style || '';
            this._textElm.style.textTransform = value.transform || 'none';
            this._textElm.style.fontWeight = value.bold ? 'bold' : (`${value.weight}` || '');
            this._textElm.style.textShadow = value.shadow || 'none';
        }
    }

    private get relativeStrokeWidth() {
        return (this.strokeWidth / +this.width * 100).toFixed(1);
    }

    private get radius() {
        if (this.type === 'circle') {
            const value = 50 - (parseFloat(this.relativeStrokeWidth) / 2);
            return parseInt(value.toFixed(1), 10);
        } else {
            return 0;
        }
    }

    private get trackPath() {
        const radius = this.radius;
        return `
          M 50 50
          m 0 -${radius}
          a ${radius} ${radius} 0 1 1 0 ${radius * 2}
          a ${radius} ${radius} 0 1 1 0 -${radius * 2}
          `;
    }

    private get perimeter() {
        return 2 * Math.PI * this.radius;
    }

    private get rate() {
        return 1;
    }

    private get strokeDashoffset() {
        const offset = -1 * this.perimeter * (1 - this.rate) / 2;
        return `${offset}px`;
    }

    private get trailPathStyle() {
        const strokeDasharray = `${this.perimeter * this.rate}px, ${this.perimeter}px`;
        const strokeDashoffset = this.strokeDashoffset;
        return `stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset};`
    }

    private get circlePathStyle() {
        const strokeDasharray = `${this.perimeter * this.rate * (this.percent / 100)}px, ${this.perimeter}px`;
        const strokeDashoffset = this.strokeDashoffset;
        const transition = 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease';
        return `stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset}; transition: ${transition};`;
    }

    private get stroke() {
        let ret = this.strokeColor;
        if (this.percent === 100)
            ret = Theme.colors.success.main;
        return ret;
    }

    private get trackColor() {
        return Theme.divider;
    }

    private get progressTextSize() {
        return this.type === 'line'
            ? 12 + this.strokeWidth * 0.4
            : +this.width * 0.111111 + 2;
    }

    private renderLine() {
        this.height = 'auto';
        this._wrapperElm.innerHTML = '';
        this._wrapperElm.classList.add('i-progress--line');
        this._barElm = this.createElement('div', this._wrapperElm);
        this._barElm.classList.add('i-progress_wrapbar');
        this._barElm.style.gridArea = 'bar';
        this._barElm.innerHTML = `<div class="i-progress_bar"></div><div class="i-progress_overlay" style="background-color:${this.stroke}"></div>`;
    }

    private renderCircle() {
        this._wrapperElm.classList.add('i-progress--circle');
        if (this.width) this.height = this.width;
        this.renderCircleInner();
    }

    private renderCircleInner() {
        const templateHtml = `<svg viewBox="0 0 100 100">
            <path class="i-progress-circle__track"
            d="${this.trackPath}"
            stroke="${this.trackColor}"
            stroke-width="${this.relativeStrokeWidth}"
            fill="none"
            style="${this.trailPathStyle}"></path>
            <path
            class="i-progress-circle__path"
            d="${this.trackPath}"
            stroke="${this.stroke}"
            fill="none"
            stroke-linecap="round"
            stroke-width="${this.percent ? this.relativeStrokeWidth : 0}"
            style="${this.circlePathStyle}"></path>
        </svg>`;

        this._wrapperElm.innerHTML = '';
        this._wrapperElm.innerHTML = templateHtml;
    }

    private updateCircleInner() {
        const svgPath = this._wrapperElm.querySelector('.i-progress-circle__path') as HTMLElement;
        if (svgPath) {
            svgPath.style.strokeDasharray = `${this.perimeter * this.rate * (this.percent / 100)}px, ${this.perimeter}px`;
            svgPath.setAttribute("stroke-width", `${this.percent ? this.relativeStrokeWidth : 0}`);
        }
    }

    protected init() {
        if (!this.initialized) {
            super.init();

            if (this.options?.onRenderStart)
                this.onRenderStart = this.options.onRenderStart;
            if (this.options?.onRenderEnd)
                this.onRenderEnd = this.options.onRenderEnd;

            this.loading = this.getAttribute('loading', true);
            this._strokeColor = this.getAttribute('strokeColor', true);

            this._wrapperElm = this.createElement('div', this);
            this._wrapperElm.classList.add('i-progress');
            
            this.type = this.getAttribute('type', true);
            this.percent = this.getAttribute('percent', true);
            this.strokeWidth = this.getAttribute('strokeWidth', true);

            if (this.type === 'line') {
                this.steps = this.getAttribute('steps', true);
                if (typeof this.onRenderStart === 'function') {
                    this._wrapperElm.classList.add('i-progress--grid');
                    this._startElm = this.createElement('div', this._wrapperElm);
                    this._startElm.classList.add('i-progress_item', 'i-progress_item-start');
                    this._endElm.style.gridArea = 'start';
                    this.onRenderStart(this._startElm as Control);
                }
                if (typeof this.onRenderEnd === 'function') {
                    this._wrapperElm.classList.add('i-progress--grid');
                    this._endElm = this.createElement('div', this._wrapperElm);
                    this._endElm.classList.add('i-progress_item', 'i-progress_item-end');
                    this._endElm.style.gridArea = 'end';
                    this.onRenderEnd(this._endElm as Control);
                }
            }

            if (this.type === 'circle') this.renderCircleInner();
        }
    }

    static async create(options?: ProgressElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }     
}

