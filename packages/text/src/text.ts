import {Control, customElements, ControlElement, DisplayType} from '@ijstech/base';
import './style/text.css';

type WordBreakType = 'normal'|'break-all'|'keep-all'|'break-word'|'inherit'|'initial'|'revert'|'unset';
type OverflowWrapType = 'normal'|'break-word'|'anywhere'|'inherit'|'initial'|'revert'|'unset';
export type TextOverflowType = 'clip'|'ellipsis'|'initial'|'inherit';

export interface TextElement extends ControlElement{
    wordBreak?: WordBreakType;
    overflowWrap?: OverflowWrapType;
    textOverflow?: TextOverflowType;
    lineClamp?: number;
}
export const textDataSchema = {
    wordBreak: {
        type: 'string',
        enum: ['normal', 'break-all', 'keep-all', 'break-word'],
        default: 'normal'
    },
    overflowWrap: {
        type: 'string',
        enum: ['normal', 'break-word', 'anywhere'],
        default: 'normal'
    },
    textOverflow: {
        type: 'string',
        enum: ['clip', 'ellipsis']
    },
    lineClamp: {
        type: 'number'
    }
}
export const textPropsConfig = {
    wordBreak: {
        type: 'string',
        default: 'normal'
    },
    overflowWrap: {
        type: 'string',
        default: 'normal'
    },
    textOverflow: {
        type: 'string'
    },
    lineClamp: {
        type: 'number'
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-text']: TextElement;
        }
    }
}
@customElements('i-text')
export class Text extends Control {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);
    }

    get wordBreak(): WordBreakType {
        return this.style.wordBreak as WordBreakType;
    }
    set wordBreak(value: WordBreakType) {
        this.style.wordBreak = value;
    }
    get overflowWrap(): OverflowWrapType {
        return this.style.overflowWrap as OverflowWrapType;
    }
    set overflowWrap(value: OverflowWrapType) {
        this.style.overflowWrap = value;
    }
    get textOverflow(): TextOverflowType {
        return this.style.textOverflow as TextOverflowType;
    }
    set textOverflow(value: TextOverflowType) {
        if (!value) return;
        this.style.textOverflow = value;
        this.style.whiteSpace = 'nowrap';
        this.overflow = 'hidden';
    }
    get lineClamp(): number {
        return Number(this.style.webkitLineClamp);
    }
    set lineClamp(value: number) {
        this.style.webkitLineClamp = `${value}`;
        this.style.overflow = 'hidden';
        this.style.webkitBoxOrient = 'vertical';
        this.display = '-webkit-box';
        this.overflow = 'hidden';
        this.style.whiteSpace = '';
    }
    get display(): DisplayType {
        return this._display;
    }
    set display(value: DisplayType) {
        const isNotNone = value !== 'none';
        this._display = this.lineClamp && isNotNone ? '-webkit-box' : value;
        this.style.display = this._display;
    }

    protected init() {       
        super.init();
        const wordBreak = this.getAttribute('wordBreak', true);
        if (wordBreak) this.wordBreak = wordBreak;
        const overflowWrap = this.getAttribute('overflowWrap', true);
        if (overflowWrap) this.overflowWrap = overflowWrap;
        const textOverflow = this.getAttribute('textOverflow', true);
        if (textOverflow) this.textOverflow = textOverflow;
        const lineClamp = this.getAttribute('lineClamp', true);
        if (lineClamp) this.lineClamp = lineClamp;
    }

    static async create(options?: TextElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }     
}