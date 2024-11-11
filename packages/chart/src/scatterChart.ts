import {Control, customElements, ControlElement} from '@ijstech/base';
import { Chart, EchartElement } from './chart';

export interface ScatterChartElement extends EchartElement {
    data?: any;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-scatter-chart']: ScatterChartElement
        }
    }
}

@customElements('i-scatter-chart')
export class ScatterChart extends Chart<any> {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    } 
    protected init() {
        super.init();              
    }
}