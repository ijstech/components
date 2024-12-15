import { Module, BarChart } from '@ijstech/components';

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
    private chartEl: BarChart;

    init() {
        super.init();
    }
    render() {
        return <i-bar-chart id="chartEl" data={data} width={1000} height={500}></i-bar-chart>;
    }
}