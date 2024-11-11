# i-bar-chart

## Usage

A bar chart provides a way of showing data values represented as vertical bars. It is sometimes used to show trend data, and the comparison of multiple data sets side by side.

## Properties

| Name | Parameters    | Default | Description |
| ---- | ------------- | ------- | ----------- |
| data | data?: string |         |             |

## i-bar-chart Sample Code (Property)
```typescript(samples/i-bar-chart_1.tsx)
    var data = {
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

    var dataProp = JSON.stringify(data);

    render() {
        return <i-bar-chart data={dataProp} width={1000} height={500}></i-bar-chart>;
    }
```

## Functions

| Name   | Parameters | Description |
| ------ | ---------- | ----------- |
| resize | resize ()  |             |

## i-bar-chart Sample Code (Function: resize)
```typescript(samples/i-bar-chart_2.tsx)
    var data = {
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

    var dataProp = JSON.stringify(data);

    change() {
      this.barchart1.resize();
    }

    render() {
      return <i-panel>
        <i-panel><i-button caption='Click here to resize' onClick={this.change} paddingLeft={5} paddingRight={5}></i-button></i-panel>
        <i-bar-chart id='barchart1' data={dataProp} width={1000} height={500}></i-bar-chart></i-panel>
    }
```
