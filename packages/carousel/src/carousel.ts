import { Control, customElements, ControlElement, Container, ContainerElement, IMediaQuery, IControlMediaQueryProps } from '@ijstech/base';
import { Icon } from '@ijstech/icon';
import { getCarouselMediaQueriesStyleClass, sliderStyle } from './style/carousel.css';
import { GroupType } from '@ijstech/types';

type SwipeStartEventCallback = () => void;
type SwipeEndEventCallback = (isSwiping: boolean) => void;
type SlideChangeCallback = (index: number) => void;

interface IPos { x: number; y: number };

export interface ICarouselMediaQueryProps extends IControlMediaQueryProps {
  indicators?: boolean;
}
export type ICarouselMediaQuery = IMediaQuery<ICarouselMediaQueryProps>;

export interface CarouselItemElement extends ContainerElement {
  name?: string;
}

type CarouselType = 'dot' | 'arrow';

export interface CarouselSliderElement extends ControlElement {
  slidesToShow?: number;
  transitionSpeed?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  items?: CarouselItemElement[];
  activeSlide?: number;
  type?: CarouselType;
  indicators?: boolean;
  swipe?: boolean;
  mediaQueries?: ICarouselMediaQuery[];
  onSwipeStart?: SwipeStartEventCallback;
  onSwipeEnd?: SwipeEndEventCallback;
  onSlideChange?: SlideChangeCallback;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-carousel-slider']: CarouselSliderElement;
    }
  }
}

const DEFAULT_VALUES = {
  slidesToShow: 1,
  transitionSpeed: 500,
  autoplay: false,
  autoplaySpeed: 3000,
  activeSlide: 0,
  type: 'dot',
  indicators: true,
  swipe: false
}

@customElements('i-carousel-slider', {
  icon: 'sliders-h',
  group: GroupType.BASIC,
  className: 'CarouselSlider',
  props: {
    slidesToShow: {type: 'number', default: DEFAULT_VALUES.slidesToShow},
    transitionSpeed: {type: 'number', default: DEFAULT_VALUES.transitionSpeed},
    autoplay: {type: 'boolean', default: DEFAULT_VALUES.autoplay},
    autoplaySpeed: {type: 'number', default: DEFAULT_VALUES.autoplaySpeed},
    activeSlide: {type: 'number', default: DEFAULT_VALUES.activeSlide},
    type: {type: 'string', default: DEFAULT_VALUES.type},
    indicators: {type: 'boolean', default: DEFAULT_VALUES.indicators},
    swipe: {type: 'boolean', default: DEFAULT_VALUES.swipe},
    items: {type: 'array', default: []},
  },
  events: {
    onSwipeStart: [],
    onSwipeEnd: [
      {name: 'isSwiping', type: 'boolean'}
    ],
    onSlideChange: [
      {name: 'index', type: 'number'}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['dot', 'arrow'],
        default: DEFAULT_VALUES.type
      },
      slidesToShow: {
        type: 'number',
        default: DEFAULT_VALUES.slidesToShow
      },
      transitionSpeed: {
        type: 'number',
        default: DEFAULT_VALUES.transitionSpeed
      },
      autoplay: {
        type: 'boolean',
        default: DEFAULT_VALUES.autoplay
      },
      autoplaySpeed: {
        type: 'number',
        default: DEFAULT_VALUES.autoplaySpeed
      },
      activeSlide: {
        type: 'number',
        default: DEFAULT_VALUES.activeSlide
      },
      indicators: {
        type: 'boolean',
        default: DEFAULT_VALUES.indicators
      },
      swipe: {
        type: 'boolean',
        default: DEFAULT_VALUES.swipe
      }
    }
  }
})
export class CarouselSlider extends Control {
  private _slidesToShow: number;
  private _transitionSpeed: number;
  private _type: CarouselType = DEFAULT_VALUES.type as CarouselType;
  private _autoplay: boolean;
  private _autoplaySpeed: number;
  private _activeSlide: number;
  private _items: CarouselItemElement[] = [];
  private _slider: CarouselItem[] = [];

  private timer: any;
  
  private sliderListElm: HTMLElement;
  private dotPagination: HTMLElement;
  private dotsElm: HTMLElement[];
  private wrapperSliderElm: HTMLElement;
  private arrowPrev: Icon;
  private arrowNext: Icon;
  private pos1: IPos = { x: 0, y: 0 };
  private pos2: IPos = { x: 0, y: 0 };
  private threshold: number = 30;
  private _swipe: boolean;
  private _indicators: boolean;
  private _mediaQueries: ICarouselMediaQuery[];
  public onSwipeStart: SwipeStartEventCallback;
  public onSwipeEnd: SwipeEndEventCallback;
  public onSlideChange: SlideChangeCallback;
  private isSwiping: boolean;
  private isHorizontalSwiping: boolean = false;

  constructor(parent?: Control, options?: any) {
    super(parent, options, { activeSlide: DEFAULT_VALUES.activeSlide });
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragHandler = this.dragHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
  }

  get slidesToShow(): number {
    return this._slidesToShow;
  }
  set slidesToShow(value: number) {
    this._slidesToShow = value;
    this.renderItems(this.items);
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
  }

  get transitionSpeed(): number {
    return this._transitionSpeed;
  }
  set transitionSpeed(value: number) {
    this._transitionSpeed = value;
    this.sliderListElm.style.transitionDuration = value + "ms"
  }

  get autoplay(): boolean {
    return this._autoplay;
  }
  set autoplay(value: boolean) {
    this._autoplay = value;
    this.setAutoplay();
  }

  get autoplaySpeed(): number {
    return this._autoplaySpeed;
  }
  set autoplaySpeed(value: number) {
    this._autoplaySpeed = value;
    this.setAutoplay();
  }

  get activeSlide(): number {
    return this._activeSlide || DEFAULT_VALUES.activeSlide;
  }
  set activeSlide(value: number) {
    if (this.isArrow) {
      this.updateSliderByArrows(value);
      return;
    }
    const validValue = value >= 0 && value < this.dotsElm.length ? value : 0;
    this._activeSlide = validValue;
    const currentActive = this.dotPagination.querySelector('li.--active');
    const dot = this.dotsElm[this._activeSlide];
    currentActive && currentActive.classList.remove('--active');
    dot && dot.classList.add('--active');

    if (this._slider && this._slider.length) {
      const min = this.slidesToShow * validValue;
      const max = this.slidesToShow * (validValue + 1);
      for (let i = 0; i < this._slider.length; i++) {
        if (i >= min && i < max)
          this._slider[i].classList.add('is-actived');
        else
          this._slider[i].classList.remove('is-actived');
      }
    }

    const fixedWidth = this.slidesToShow === 1 && this._slider && this._slider[0]?.offsetWidth && this._slider[0].offsetWidth !== this.offsetWidth;
    const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -this.offsetWidth * this._activeSlide;
    this.sliderListElm.style.transform = `translateX(${tx}px)`;
  }

  get items(): CarouselItemElement[] {
    return this._items;
  }
  set items(nodes: CarouselItemElement[]) {
    this.renderItems(nodes);
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
    this.setAutoplay();
  }

  add(control: Control) {
    const options = {name: '', controls: [control]};
    this.items.push(options);
    const carouselItem = new CarouselItem(this, options);
    carouselItem.width = (100 / this.slidesToShow) + "%";
    this._slider.push(carouselItem);
    this.sliderListElm.appendChild(carouselItem);
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
    return control;
  }

  get type(): CarouselType {
    return this._type;
  }
  set type(value: CarouselType) {
    this._type = value;
    this.updateWrapperClass();
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
    if (this.arrowPrev) this.arrowPrev.visible = this.isArrow;
    if (this.arrowNext) this.arrowNext.visible = this.isArrow;
  }

  get swipe(): boolean {
    return this._swipe
  }

  set swipe(value: boolean) {
    this._swipe = value;
    // if (this._swipe) {
    //   this.sliderListElm.onmousedown = this.dragStartHandler;
    //   this.sliderListElm.addEventListener('touchstart', this.dragStartHandler);
    //   this.sliderListElm.addEventListener('touchend', this.dragEndHandler);
    //   this.sliderListElm.addEventListener('touchmove', this.dragHandler);
    // } else {
    //   this.sliderListElm.onmousedown = null;
    //   this.sliderListElm.removeEventListener('touchstart', this.dragStartHandler);
    //   this.sliderListElm.removeEventListener('touchend', this.dragEndHandler);
    //   this.sliderListElm.removeEventListener('touchmove', this.dragHandler);
    // }
  }

  get mediaQueries(){
    return this._mediaQueries;
  }
  set mediaQueries(value: ICarouselMediaQuery[]){
    this._mediaQueries = value;
    let style = getCarouselMediaQueriesStyleClass(this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style;
    this.classList.add(style);
  }

  _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseDown(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('.slider-list');
      if (sliderList && this.swipe) {
        this.dragStartHandler(event);
        return true;
      }
    }
    return false;
  }

  _handleMouseMove(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseMove(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('.slider-list');
      if (sliderList && this.swipe) {
        this.dragHandler(event);
        return this.isHorizontalSwiping;
      }
    }
    return false;
  }

  _handleMouseUp(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseUp(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('.slider-list');
      if (sliderList && this.swipe) {
        this.dragEndHandler(event);
        return true;
      }
    }
    return false;
  }

  get indicators(): boolean {
    return this._indicators;
  }

  set indicators(value: boolean) {
    this._indicators = value;
    if (this.dotPagination) {
      value ? this.dotPagination.classList.remove('hidden') : this.dotPagination.classList.add('hidden');
    }
  }

  private get isArrow() {
    return this.type === 'arrow';
  }

  // disconnectedCallback(): void {
  //   this.sliderListElm.onmousedown = null;
  //   this.sliderListElm.removeEventListener('touchstart', this.dragStartHandler);
  //   this.sliderListElm.removeEventListener('touchend', this.dragEndHandler);
  //   this.sliderListElm.removeEventListener('touchmove', this.dragHandler);
  //   super.disconnectedCallback();
  // }

  private updateArrows(prev: boolean, next: boolean) {
    if (this.arrowPrev && this.arrowNext) {
      if (prev) {
        this.arrowPrev.classList.remove('slider-arrow-hidden');
      } else {
        this.arrowPrev.classList.add('slider-arrow-hidden');
      }
      if (next) {
        this.arrowNext.classList.remove('slider-arrow-hidden');
      } else {
        this.arrowNext.classList.add('slider-arrow-hidden');
      }
    }
  }

  private updateSliderByArrows(value: number) {
    if (!this._slider) return;
    const lastIdx = value + this.slidesToShow;
    const validValue = value >= 0 && lastIdx <= this._slider.length ? value : 0;
    this.updateArrows(validValue > 0, lastIdx < this._slider.length);
    this._activeSlide = validValue;
    const fixedWidth = this.slidesToShow === 1 && this._slider && this._slider[0]?.offsetWidth && this._slider[0].offsetWidth !== (this.offsetWidth - 50);
    const itemWidth = this._slider && this._slider[0] ? this._slider[0].offsetWidth : (this.offsetWidth - 50) / this.slidesToShow;
    const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -itemWidth * this._activeSlide;
    this.sliderListElm.style.transform = `translateX(${tx}px)`;
    if (this._slider && this._slider.length) {
      const min = validValue;
      const max = this.slidesToShow + validValue;
      for (let i = 0; i < this._slider.length; i++) {
        if (i >= min && i < max)
          this._slider[i].classList.add('is-actived');
        else
          this._slider[i].classList.remove('is-actived');
      }  
    }
  }

  private updateWrapperClass() {
    if (!this.wrapperSliderElm) return;
    if (this.isArrow) {
      this.wrapperSliderElm.classList.add('wrapper-slider');
    } else {
      this.wrapperSliderElm.classList.remove('wrapper-slider');
    }
  }

  private renderItems(items: CarouselItemElement[]) {
    if (!this.sliderListElm) return;
    this._items = items;
    this.sliderListElm.innerHTML = '';
    if (!items) return;
    let list: CarouselItem[] = [];
    const min = this.slidesToShow * this.activeSlide;
    const max = this.slidesToShow * (this.activeSlide + 1);
    for (let index = 0; index < items.length; index++) {
      const itemData = items[index];
      const carouselItem = new CarouselItem(this, itemData);
      if (itemData.width) carouselItem.width = itemData.width;
      else carouselItem.width = (100 / this.slidesToShow) + "%";
      if (index >= min && index < max) carouselItem.classList.add('is-actived');
      list.push(carouselItem);
      this._slider = list;
      this.sliderListElm.appendChild(carouselItem);
    }
  }

  private renderDotPagination() {
    if (!this.dotPagination) return;
    this.dotPagination.innerHTML = '';
    this.dotsElm = [];
    if (this.isArrow) {
      this.dotPagination.classList.add('hidden');
      return;
    }
    const isShownIndicators = this.indicators && this.items?.length > 1;
    isShownIndicators ? this.dotPagination.classList.remove('hidden') : this.dotPagination.classList.add('hidden');
    if (this.items?.length) {
      const childLength = this.items.length;
      const totalDots = this.slidesToShow > 0 ? Math.ceil(childLength / this.slidesToShow) : childLength;
      for(let i = 0; i < totalDots; i++) {
        const dotElm = this.createElement('li', this.dotPagination);
        dotElm.classList.add('--dot');
        if (this.activeSlide === i)
          dotElm.classList.add('--active');
        this.createElement('span', dotElm);
        dotElm.addEventListener('click', () => {
          if (this._designMode) return;
          this.onDotClick(i);
          this.setAutoplay();
        });
        this.dotsElm.push(dotElm);
      }
    }
  }

  private renderArrows() {
    if (!this.arrowPrev || !this.arrowNext) return;
    if (this.dotPagination) {
      this.dotPagination.innerHTML = '';
      this.dotPagination.classList.add('hidden');
      this.dotsElm = [];
    }
    if (this.hasChildNodes() && this.sliderListElm.childNodes.length) {
      const childLength = this.sliderListElm.childNodes.length;
      const isArrowShown = childLength > this.slidesToShow && this.isArrow;
      this.updateArrows(isArrowShown, isArrowShown);
    } else {
      this.updateArrows(false, false);
    }
  }

  private onDotClick(index: number) {
    this.activeSlide = index;
    if (typeof this.onSlideChange === 'function') this.onSlideChange(index);
  }

  private setAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.autoplay) {
      if (!this.isArrow && this.dotsElm.length > 1) {
        this.timer = setInterval(() => {
          const index = this.activeSlide + 1 >= this.dotsElm.length ? 0 : this.activeSlide + 1;
          this.onDotClick(index);
        }, this.autoplaySpeed);
      } else if (this.isArrow) {
        this.timer = setInterval(() => {
          if (this._slider && this._slider.length > this.slidesToShow) {
            let idx = 0;
            if (this._slider) {
              idx = this.activeSlide + this.slidesToShow >= this._slider.length ? 0 : this.activeSlide + 1;
            }
            this.updateSliderByArrows(idx);
          }
        }, this.autoplaySpeed);
      }
    }
  }

  prev() {
    const index = this.activeSlide - 1 < 0 ? this.activeSlide : this.activeSlide - 1;
    this.activeSlide = index;
    this.setAutoplay();
    if (typeof this.onSlideChange === 'function') this.onSlideChange(index);
  }

  next() {
    let index: number;
    if (!this.isArrow) {
      const total = this.slidesToShow > 0 ? Math.ceil(this._slider.length / this.slidesToShow) : this._slider.length;
      index = this.activeSlide + 1 >= total ? this.activeSlide : this.activeSlide + 1;
    } else {
      index = this.activeSlide + this.slidesToShow >= this._slider.length ? this.activeSlide : this.activeSlide + 1;
    }
    this.activeSlide = index;
    this.setAutoplay();
    if (typeof this.onSlideChange === 'function') this.onSlideChange(index);
  }

  refresh(): void {
      super.refresh();
      if (this._slider && this._slider.length) {
        if (this.isArrow) {
          this.updateSliderByArrows(this.activeSlide);
          return;
        }
        const fixedWidth = this.slidesToShow === 1 && this._slider[0] && this._slider[0].offsetWidth && this._slider[0].offsetWidth !== this.offsetWidth;
        const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -this.offsetWidth * this._activeSlide;
        this.sliderListElm.style.transform = `translateX(${tx}px)`;
      }
  }
  
  private dragStartHandler(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      this.pos1 = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
      this.pos2 = {
        x: 0,
        y: 0
      }
    } else {
      event.preventDefault();
      this.pos1 = {
        x: event.clientX,
        y: event.clientY
      };
      this.pos2 = {
        x: 0,
        y: 0
      }
    }
    this.isSwiping = false;
    this.isHorizontalSwiping = false;
    if (typeof this.onSwipeStart === 'function') this.onSwipeStart();
  }

  private dragHandler(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      this.pos2.x = this.pos1.x - event.touches[0].clientX;
      this.pos2.y = this.pos1.y - event.touches[0].clientY;
    } else {
      this.pos2.x = this.pos1.x - event.clientX;
      this.pos2.y = this.pos1.y - event.clientY;
    }
    this.isSwiping = Math.abs(this.pos2.x) > this.threshold;
    this.isHorizontalSwiping = this.isSwiping && Math.abs(this.pos2.x) > Math.abs(this.pos2.y);
  }

  private dragEndHandler(event: MouseEvent | TouchEvent) {
    if (this.isHorizontalSwiping) {
      if (this.pos2.x < -this.threshold) {
        this.prev();
      } else if (this.pos2.x > this.threshold) {
        this.next();
      } else {
        this.refresh();
      }
    }
    if (typeof this.onSwipeEnd === 'function') this.onSwipeEnd(this.isSwiping);
  }

  protected init() {
    const children: Control[] = [];
    this.childNodes.forEach(node => {
      if (node instanceof Control) {
        children.push(node);
      } else {
        node.remove();
      }
    })
    super.init();
    this.classList.add(sliderStyle);
    this.type = this.getAttribute('type', true, DEFAULT_VALUES.type);
    this.indicators = this.getAttribute('indicators', true, DEFAULT_VALUES.indicators);
    this.wrapperSliderElm = this.createElement('div', this);
    this.updateWrapperClass();
    const wrapper = this.createElement('div', this.wrapperSliderElm);
    wrapper.classList.add('wrapper-slider-list');

    this.slidesToShow = this.getAttribute('slidesToShow', true, DEFAULT_VALUES.slidesToShow);

    this.sliderListElm = this.createElement('div', wrapper);
    this.sliderListElm.classList.add('slider-list');

    this.transitionSpeed = this.getAttribute('transitionSpeed', true, DEFAULT_VALUES.transitionSpeed);

    this.arrowPrev = new Icon(undefined, { name: 'angle-left', visible: this.isArrow });
    this.arrowNext = new Icon(undefined, { name: 'angle-right', visible: this.isArrow });
    this.arrowPrev.classList.add('slider-arrow');
    this.arrowNext.classList.add('slider-arrow');
    this.arrowPrev.onClick = () => {
      if (this._designMode) return;
      this.prev();
    }
    this.arrowNext.onClick = () => {
      if (this._designMode) return;
      this.next();
    }
    this.wrapperSliderElm.prepend(this.arrowPrev);
    this.wrapperSliderElm.append(this.arrowNext);
    this.renderArrows();
    
    this.dotPagination = this.createElement('ul', this);
    this.dotPagination.classList.add('dots-pagination');
    this.renderDotPagination();

    this.autoplaySpeed = this.getAttribute('autoplaySpeed', true, DEFAULT_VALUES.autoplaySpeed);
    this.autoplay = this.getAttribute('autoplay', true);

    if (children?.length) {
      children.forEach(child => {
        this.add(child);
      })
    } else {
      this.items = this.getAttribute('items', true, []);
    }

    this.activeSlide = this.getAttribute('activeSlide', true, DEFAULT_VALUES.activeSlide);
    
    this.swipe = this.getAttribute('swipe', true, DEFAULT_VALUES.swipe);
  }

  static async create(options?: CarouselSliderElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}

@customElements('i-carousel-item')
class CarouselItem extends Container {
  private _name: string;

  constructor(parent?: Control, options?: any) {
    super(parent, options);
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  protected addChildControl(control: Control) {
    this.appendChild(control)
  }

  protected removeChildControl(control: Control) {
    if (this.contains(control))
      this.removeChild(control)
  }

  protected init() {
    this.name = this.options.name;
    this._controls = this.options.controls || [];
    super.init();
    this._controls.forEach(child => {
      this.addChildControl(child)
    })
  }

  static async create(options?: CarouselItemElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}