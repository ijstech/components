import {Control, customElements} from '@ijstech/base';
import { Chart, EchartElement } from './chart';

export interface ScatterLineChartElement extends EchartElement {
    data?: any;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-scatter-line-chart']: ScatterLineChartElement
        }
    }
}

@customElements('i-scatter-line-chart')
export class ScatterLineChart extends Chart<any> {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    } 
    protected init() {
        super.init();              
    }
}