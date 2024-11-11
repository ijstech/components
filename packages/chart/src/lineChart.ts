import {Control, customElements} from '@ijstech/base';
import { Chart, EchartElement } from './chart';

export interface LineEchartElement extends EchartElement {
    data?: any;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-line-chart']: LineEchartElement
        }
    }
}

@customElements('i-line-chart')
export class LineChart extends Chart<any> {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    } 
    protected init() {
        super.init();              
    }
}