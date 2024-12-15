# i-line-chart

## Usage

A line chart provides a way of showing data values represented as a line. It is sometimes used to show trend data, and the comparison of multiple data sets side by side.

## Properties

| Name | Parameters    | Default | Description |
| ---- | ------------- | ------- | ----------- |
| data | data?: string |         |             |

## i-line-chart Sample Code (Property)
```typescript(samples/i-line-chart.tsx)
    render(){
        var data = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [22, 150, 175, 67, 52, 56, 220],
                    type: 'line'
                }
            ]
        };
        var dataProp = JSON.stringify(data);
        return <i-line-chart id="LineChart1" data={dataProp} top={40} width={1000} height={600}><i-line-chart>;
    }
```

## Functions

| Name   | Parameters | Description |
| ------ | ---------- | ----------- |
| resize | resize ()  |             |
