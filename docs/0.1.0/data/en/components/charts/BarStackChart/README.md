# i-bar-stack-chart

## Usage

A stacked bar chart is a graph that uses bars to show comparisons between categories of data, but with ability to break down and compare parts of a whole. Each bar in the chart represents a whole, and segments in the bar represent different parts or categories of that whole.

## Properties

| Name | Parameters    | Default | Description |
| ---- | ------------- | ------- | ----------- |
| data | data?: string |         |             |

## i-bar-stack-chart Sample Code (Property)
```typescript(samples/i-bar-stack-chart.tsx)
    var data = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
            {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
            name: 'Mail Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
            name: 'Affiliate Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
            name: 'Video Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
            name: 'Search Engine',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
            }
        ]
    };

    var dataProp = JSON.stringify(data);

    render() {
      return <i-bar-stack-chart id="bar-stack-chart-1" data={dataProp} top={10} width={600} height={600}></i-bar-stack-chart>;
    }
```

## Functions

| Name   | Parameters | Description |
| ------ | ---------- | ----------- |
| resize | resize ()  |             |
