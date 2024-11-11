import {Control, customElements } from '@ijstech/base';
import { Chart, EchartElement } from './chart';

export interface IBarChartAxisTick {
    show?: boolean;
}

export interface IBarChartAxisLineStyle {
    type?: string;
}

export interface IBarChartAxisLine {
    show?: boolean;
    lineStyle?: IBarChartAxisLineStyle;
}

export interface IBarChartAxisSplitLine {
    show?: boolean;
    lineStyle?: IBarChartAxisLineStyle;
}

export interface IBarChartAxisLabel {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
}

export interface IBarChartAxisNameTextStyle {
    fontSize?: number;
    color?: string;
}

export interface IBarChartAxis {
    type?: string;
    name?: string;
    nameGap?: number;
    nameTextStyle?: IBarChartAxisNameTextStyle;
    boundaryGap?: boolean;
    data?: string[];
    min?: number;
    max?: number;
    axisTick?: IBarChartAxisTick;
    axisLabel?: IBarChartAxisLabel;
    axisLine?: IBarChartAxisLine;
    splitLine?: IBarChartAxisSplitLine;
}

export interface IBarChartSeriesLabel {
    show: boolean;
    position: string;
}

export interface IBarChartSeries {
    type?: string;
    name?: string;
    data?: any[];
    label?: IBarChartSeriesLabel;
}

export interface IBarChartData {
    xAxis?: IBarChartAxis;
    yAxis?: IBarChartAxis;
    color?: string[];
    series?: IBarChartSeries[];
}

export interface BarEchartElement extends EchartElement {
    data?: IBarChartData,
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-bar-chart']: BarEchartElement
        }
    }
}

@customElements('i-bar-chart')
export class BarChart extends Chart<IBarChartData> {
    constructor(parent?: Control, options?: any) {        
        super(parent, options);        
    } 
    protected init() {
        super.init();              
    }
}