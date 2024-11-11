import {Control, customElements } from '@ijstech/base';
import { Chart, EchartElement } from './chart';

export interface BarEchartElement extends EchartElement {
    data?: any,
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-bar-stack-chart']: BarEchartElement
        }
    }
}

@customElements('i-bar-stack-chart')
export class BarStackChart extends Chart<any> {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    } 
    protected init() {
        super.init();              
    }
}