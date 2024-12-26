import { Control, customElements, ControlElement, IBorder, Border, setAttributeToProperty } from '@ijstech/base';
import * as Styles from '@ijstech/style';
import './style/image.css';
import { GroupType } from '@ijstech/types';

type ObjectFitType = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface ImageElement extends ControlElement {
    rotate?: number;
    url?: string;
    fallbackUrl?: string;
    objectFit?: ObjectFitType;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-image']: ImageElement;
        }
    }
}

@customElements('i-image', {
    icon: 'image',
    group: GroupType.BASIC,
    className: 'Image',
    props: {
        rotate: {
            type: 'number'
        },
        url: {
            type: 'string',
            default: ''
        },
        fallbackUrl: {
            type: 'string',
            default: ''
        },
        objectFit: {
            type: 'string',
            default: 'contain'
        },
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            rotate: {
                type: 'number'
            },
            url: {
                type: 'string'
            },
            fallbackUrl: {
                type: 'string'
            },
            objectFit: {
                type: 'string',
                enum: ['contain', 'cover', 'fill', 'none', 'scale-down'],
                default: 'contain'
            } 
        }
    }
})
export class Image extends Control {
    private imageElm: HTMLImageElement;

    private _url: string;
    // private _dataUrl: string;
    private _rotate: number = 0;
    private _fallbackUrl: string;
    private _objectFit: ObjectFitType;
    private _borderValue: IBorder;
    private _usedFallback: boolean = false;

    constructor(parent?: Control, options?: any) {
        super(parent, options);
    }

    get fallbackUrl(): string {
        return this._fallbackUrl;
    }
    set fallbackUrl(value: string) {
        this._fallbackUrl = value;
    }

    get rotate(): number {
        return this._rotate;
    }

    set rotate(value: any) {
        if (value == undefined) return;
        value = parseInt(value);
        if (value != this._rotate) {
            if (this.imageElm) {
                if (this._rotate != 0) this.imageElm.classList.remove(Styles.rotate(this._rotate));
                this.imageElm.classList.add(Styles.rotate(value));
            }
            this._rotate = value;
        }
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        if (value?.startsWith('this.')) return;
        this._url = value;
        if (!this.imageElm)
            this.imageElm = <HTMLImageElement>this.createElement('img', this);

        this.imageElm.src = value ?? '';
        this.imageElm.style.display = 'none';
        const self = this;
        this.imageElm.onerror = function () {
            if (self._fallbackUrl && !self._usedFallback) {
                this.src = self._fallbackUrl;
                self._usedFallback = true;
            }
        }
        this.imageElm.onload = function () {
            self.imageElm.style.display = '';
        }
        if (this._borderValue) {
            this._border = new Border((this.imageElm as HTMLElement) as Control, this._borderValue);
        }
        if (this._objectFit) this.imageElm.style.objectFit = this._objectFit;
    }

    get objectFit(): ObjectFitType {
        return this._objectFit;
    }

    set objectFit(value: ObjectFitType) {
        this._objectFit = value;
        if (this.imageElm) {
            this.imageElm.style.objectFit = value;
        }
    }

    get border(): Border {
        return this._border;
    }

    set border(value: IBorder) {
        this._borderValue = value;
        if (this.imageElm) {
            this._border = new Border((this.imageElm as HTMLElement) as Control, value);
        }
    }

    // get dataUrl(): string {
    //     return this._dataUrl;
    // }

    // set dataUrl(value: string) {
    //     this._dataUrl = value;
    //     if (value) {
    //         if (!this.imageElm) this.imageElm = <HTMLImageElement>this.createElement('img', this);
    //     }
    //     if (this.imageElm) this.imageElm.src = value;
    // }

    // private async fetchData(url: string) {
    //     if (!url) return;
    //     await fetch(url)
    //         .then((response) => response.blob())
    //         .then((imageBlob) => {
    //             const imageObjectURL = URL.createObjectURL(imageBlob);
    //             this.dataUrl = imageObjectURL;
    //         });
    // }

    protected init() {
        super.init();
        setAttributeToProperty(this, 'fallbackUrl');
        setAttributeToProperty(this, 'url');
        setAttributeToProperty(this, 'objectFit', 'contain');

        this.rotate = this.getAttribute('rotate', true);

        const border: IBorder = this.getAttribute('border', true);
        if (border) {
            this._borderValue = border;
            if (this.imageElm) {
                this._border = new Border((this.imageElm as HTMLElement) as Control, border);
                this.style.border = 'none';
            }
        }
    }

    static async create(options?: ImageElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }      
}
