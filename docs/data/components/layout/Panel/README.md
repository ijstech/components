# Panel

Use to define panel to display contents.

### `i-panel`

## Class Inheritance
Inherited from [`Container`](components/container/README.md)

## Properties

| Name      | Description                        | Type                                  | Default |
| --------- | ----------------------             | ----------------------                | ------- |
| hover     | Define custom styles when hovering in `<i-panel>` | [IHover](components/customdatatype/README.md#ihover) | |

## Sample Code
```typescript(samples/i-panel.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}} background={{color: 'yellow'}}>
            <i-label caption='This yellow area is the i-panel' font={{color: "red"}}></i-label>
            <i-panel background={{color: 'blue'}} width='100px' height='100px' top={50} left={100} hover={{backgroundColor: 'red'}}>
                <i-label caption='This blue area is the i-panel'></i-label>
            </i-panel>
            <i-panel background={{color: 'red'}} width='100px' height='100px' top={200} left={10}>
                <i-label caption='This red area is the i-panel'></i-label>
            </i-panel>
        </i-panel>
    )
}
```
**Tip**: _The properties `width`, `height`, `background`, [`padding`](components/customdatatype/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_