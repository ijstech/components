# Button

The `i-button` is a clickable element that triggers an action when clicked. It can contain an icon, caption, and a right icon.

### `i-button`

## Class Inheritance
Inherited from [`Control`](../Control/README.md)

## Properties

| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| caption         | Define the name of an `<i-button>`                | string     |         |
| icon            | To align the icon on the left of an `<i-button>`  | [Icon](../customDataType/README.md#icon) | |
| rightIcon       | To align the icon on the right of an `<i-button>` | [Icon](../customDataType/README.md#icon) | |

## Sample Code

### Properties
```typescript (samples/i-button.tsx)
btnClick(action: string) {
    if (action == "Add")
        this.counter++;
    else
        this.counter--;

    this.label.caption = 'Counter: ' + this.counter.toString();
}
render(){
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-label top={10} left={10} id='label' caption={'Counter: 0'}></i-label>
            <i-button top={50} left={10} padding={{left: 5, right: 5, top: 5, bottom: 5}} 
                caption="Click me!" icon={{ name: "angle-up"}} onClick={() => this.btnClick("Add")} 
            ></i-button>
            <i-button top={90} left={10} padding={{left: 5, right: 5, top: 5, bottom: 5}} 
                caption="Click me too!" rightIcon={{ name: "angle-down" }} onClick={() => this.btnClick("Reduce")} 
            ></i-button>
        </i-panel>
    )
}
```
**Tip**: _The properties `top`, `left`, [`padding`](../customDataType/README.md#ispace) and the event `onClick` are inherited from [`Control`](../Control/README.md)_