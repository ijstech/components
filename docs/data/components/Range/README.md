# Range

Use as range slider for users to select from a range of values by moving the along a slider.

### `i-range`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name             | Description                                         | Type                      | Default |
| ---------------- | --------------------------------------------------- | ------------------------- | ------- |
| caption          | Define the name of an `<i-range>`                   | string                    |         |
| captionWidth     | Define the width of the caption                     | number \| string          | 40      |
| value            | Define the default value of an `<i-range>`          | number                    | 0       |
| min              | Define the minimum value allowed of an `<i-range>`  | number                    | 0       |
| max              | Define the maximum value allowed of an `<i-range>`  | number                    | 100     |
| step             | Define the legal number intervals of an `<i-range>` | number                    | 1       |
| stepDots         | Define that an `<i-range>` show the step dots       | boolean \| number         | false   |
| tooltipFormatter | Define the tooltip formatter of an `<i-range>`      | (value: number) => string |         |
| tooltipVisible   | Define that an `<i-range>` show the tooltip         | boolean                   | false   |
| trackColor       | Define the color of the track of an `<i-range>`     | Types.Color               |         |

## Events

| **onChanged**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when move the range          |
| Signature      | onChanged(target: Control, event: Event)       |

## Sample Code

### Property
```typescript(samples/i-range_1.tsx)
tipFormatter(value: any) {
    return `${Number(value).toFixed()}%`;
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-range
                width='100%'
                margin={{top: '2rem'}}
                min={0} max={100} value={60} 
                step={5} stepDots={5}
                tooltipFormatter={this.tipFormatter}
                tooltipVisible={true}
                height="auto"
            />
        </i-panel>
    )
}
```
**Tip**: _The properties `top`, `left`, `width` are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-range_2.tsx)
tipFormatter(value: any) {
    return `${Number(value).toFixed()}%`;
}
onChanged(){
    this.label.caption = 'Range value: ' + this.range.value.toString() + '%';
}
render() {
    return (
        <i-vstack gap="0.5rem" height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}} horizontalAlignment="center">
            <i-label id='label' caption='Range value: 0%' padding={{left: 20}}></i-label>
            <i-range
                id='range'
                width={200} height="auto"
                trackColor="pink"
                min={0} max={100} value={0} 
                step={10} stepDots={10}
                tooltipFormatter={this.tipFormatter}
                tooltipVisible={true}
                onChanged={this.onChanged}
            />
        </i-vstack>
    )
}
```
**Tip**: _The properties `id`, `top`, `left`, `width`, [`padding`](components/customdatatype/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_