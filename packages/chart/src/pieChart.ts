import {Control, customElements, ControlElement} from '@ijstech/base';
import { Chart, EchartElement } from './chart';

export interface IPieChartTooltip {
    trigger?: string;
    formatter?: string;
}

export interface IPieChartSeries {
    type?: string;
    radius?: string[];
    avoidLabelOverlap?: boolean;
    data?: any[];
}

export interface IPieChartData {
    tooltip?: IPieChartTooltip;
    series?: IPieChartSeries[] 
}

export interface PieEchartElement extends EchartElement {
    data?: IPieChartData;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-pie-chart']: PieEchartElement
        }
    }
};

@customElements('i-pie-chart')
export class PieChart extends Chart<IPieChartData> {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    } 
    protected init() {
        super.init();              
    }
}