import {Module, BarChart} from '@ijstech/components';

var data: any = {
    title: {
        text: 'Bar Chart demo'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
    },
    grid: {
        top: 80,
        bottom: 30
    },
    yAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
        lineStyle: {
            type: 'dashed'
        }
        }
    },
    xAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven'
        ]
    },
    series: [
        {
        type: 'bar',
        stack: 'Total',
        label: {
            show: true,
            formatter: '{b}'
        },
        data: [
            { value: -0.3 },
            { value: -0.14 },
            { value: 0.3 },
            { value: 0.44 },
            { value: -0.23 },
            { value: 0.1 },
            { value: -0.17 },
        ]
        }
    ]
};

export default class IBarchartSample extends Module{  
    private barchart1: BarChart;
    
    change() {
        this.barchart1.resize();
    }

    init() {
        super.init();
        this.barchart1.data = data;
    }

    render() {
        return <i-panel>
            <i-button caption='Click here to resize' onClick={this.change}></i-button>
            <i-bar-chart id='barchart1' width="100%" height={500}></i-bar-chart>
        </i-panel>
    }
}