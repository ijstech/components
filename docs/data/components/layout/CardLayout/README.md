# CardLayout

It is a layout manager for a container. It treats each component in the container as a card. Only one card is visible at a time, and the container acts as a stack of cards. The first component added to a CardLayout object is the visible component when the container is first displayed.

### `i-card-layout`

## Class Inheritance
Inherited from [`Container`](components/container/README.md) > [GridLayout](components/layout/gridLayout/README.md)

## Properties

| Name            | Description                                             | Type             | Default |
| --------------- | -------------------------------------------------       | ----------       | ------- |
| cardMinWidth    | Define the min width of each cards in `<i-card-layout>` | number \| string |         |
| cardHeight      | Define the height of each cards in `<i-card-layout>`    | number \| string |         |

## Sample Code

### Properties
```typescript(samples/i-card-layout.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-card-layout id="cardLayout" cardMinWidth="100px" cardHeight="100px" columnsPerRow={3} gap={{column: '1rem', row: '1rem'}}>
                <i-panel background={{color: "yellow"}}><i-button width="50%" height="50%" caption="Btn1"></i-button></i-panel>
                <i-panel background={{color: "blue"}}><i-button width="50%" height="50%" caption="Btn2"></i-button></i-panel>
                <i-panel background={{color: "red"}}><i-button width="50%" height="50%" caption="Btn3"></i-button></i-panel>
                <i-panel background={{color: "red"}}><i-button width="50%" height="50%" caption="Btn4"></i-button></i-panel>
                <i-panel background={{color: "yellow"}}><i-button width="50%" height="50%" caption="Btn5"></i-button></i-panel>
                <i-panel background={{color: "blue"}}><i-button width="50%" height="50%" caption="Btn6"></i-button></i-panel>
            </i-card-layout>
        </i-panel>
    )
}
```
**Tip**: _The property `id` is inherited from [`Control`](components/Control/README.md) and the properties `gap`, `columnsPerRow` are inherited from [`GridLayout`](components/layout/gridLayout/README.md)_