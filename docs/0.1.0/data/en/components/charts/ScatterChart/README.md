# Scatter Chart

## Usage
A scatter chart pairs of numerical data, with one variable on each axis, to look for a relationship between them. If the variables are correlated, the points will fall along a line or curve. The better the correlation, the tighter the points will hug the line. 

## i-scatter-chart Sample Code (Property)
```typescript(samples/i-scatter-chart.tsx)
    render(){
        var data = {
            xAxis: {},
            yAxis: {},
            series: [
                {
                symbolSize: 20,
                data: [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.2],
                    [11.5, 7.2],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68]
                ],
                type: 'scatter'
                }
            ]
        };
        var dataProp = JSON.stringify(data);
        return <i-scatter-chart id="sactterChart1" data={dataProp} top={20} width={1000} height={600}></i-scatter-chart>;
    }
```
