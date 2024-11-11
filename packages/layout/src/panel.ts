import {Control, customElements, Container, ContainerElement, setAttributeToProperty} from '@ijstech/base';
import {panelStyle, overflowStyle, getHoverStyleClass} from './style/panel.css';
import {IHover} from './interfaces';
import { GroupType } from '@ijstech/types';

export interface PanelElement extends ContainerElement{
    hover?: IHover;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-panel']: PanelElement
        }
    }
}

@customElements('i-panel', {
    icon: 'stop',
    group: GroupType.LAYOUT,
    className: 'Panel',
    props: {},
    events: {}
})
export class Panel extends Container {
    private _hover: IHover;

    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    }

    get hover(): IHover{
        return this._hover;
    }
    set hover(value: IHover){
        this._hover = value;
        if (this._hover) {
            const hoverStyle = getHoverStyleClass(this._hover);
            this.setStyle('hover', hoverStyle);
        }
        else {
            this.removeStyle('hover');
        }
    }
    protected removeStyle<P extends keyof Panel>(propertyName: P){
        let style = this.propertyClassMap[propertyName];
        if (style) this.classList.remove(style);
    }
    protected setStyle<P extends keyof Panel>(propertyName: P, value: string){
        this.removeStyle(propertyName);
        if (value) {
            this.propertyClassMap[propertyName] = value;
            this.classList.add(value);
        }
    }
    protected init() {
        super.init();
        setAttributeToProperty(this, 'hover');
        this.classList.add(panelStyle);
        if (this.dock) {
            // For absolute positioning
            this.classList.add(overflowStyle)
        }
    }

    connectedCallback() {
        if (this.connected) {
            return;
        }

        super.connectedCallback();
    }

    static async create(options?: PanelElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }     
}