# Scatter Line Chart

## Usage
A scatter line chart is a special type of scatter chart that displays the data points along with a fitted line for a simple regression model. This graph allows you to evaluate how well the model fits the data.

## i-scatter-line-chart Sample Code (Property)
```typescript(samples/i-scatter-line-chart.tsx)
    render(){
      var data = [
          [96.24, 11.35],
          [33.09, 85.11],
          [57.6, 36.61],
          [36.77, 27.26],
          [20.1, 6.72],
          [45.53, 36.37],
          [110.07, 80.13],
          [72.05, 20.88],
          [39.82, 37.15],
          [48.05, 70.5],
          [0.85, 2.57],
          [51.66, 63.7],
          [61.07, 127.13],
          [64.54, 33.59],
          [35.5, 25.01],
          [226.55, 664.02],
          [188.6, 175.31],
          [81.31, 108.68]
        ];
      var  option = {
          dataset: [
            {
              source: data
            },
            {
              transform: {
                type: 'ecStat:regression',
                config: { method: 'polynomial', order: 3 }
              }
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            splitNumber: 20
          },
          yAxis: {
            min: -40,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          series: [
            {
              name: 'scatter',
              type: 'scatter'
            },
            {
              name: 'line',
              type: 'line',
              smooth: true,
              datasetIndex: 1,
              symbolSize: 0.1,
              encode: { label: 2, tooltip: 1 },
              data: [[20, 60], [32, 300], [91, 50], [105,300], [130, 250], [180,500], [220, 600]],
            }
          ]
        };
      var dataProp = JSON.stringify(option);
      return <i-scatter-line-chart id="sactterLineChart1" data={dataProp} top={10} width={1000} height={600}></i-scatter-line-chart>;
  }
```
