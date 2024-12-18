# Checkbox 

A checkbox is used for selecting multiple values from several options. The `i-checkbox` component is used to define the checkbox and its associated values.  If only one checkbox is used, it is the same as using Switch to toggle between two states. The difference is that Switch will trigger the state change directly, but Checkbox just marks the state as changed and this needs to be submitted.

### `i-checkbox`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type            | Default |
| --------------- | ------------------------------------------------- | ----------      | ------- |
| checked         | Define that an `<i-checkbox>` is checked          | boolean         | false   |
| indeterminate   | Allow the 'check all' effect                      | boolean         | false   |
| readOnly        | Define that an `<i-checkbox>` is read only        | boolean         | false   |
| caption         | Define the name of an `<i-checkbox>`              | string          |         |
| captionWidth    | Define the width of the caption                   | number \| string|         |

## Events

| **onChanged**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when checkbox status changed |
| Signature      | onChanged(target: Control, event: Event)       |

## Sample Code 

### Property
```typescript(samples/i-checkbox-2.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-checkbox caption="Check me!" captionWidth={90} padding={{left: 20}}></i-checkbox>
        </i-panel>
    )
}
```
**Tip**: _The property [`padding`](../customDataType/README.md#ispace) is inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-checkbox-1.tsx)
btnClick() {
    this.label.caption = "";
    this.label.caption += (this.checkbox1.checked) ? "Checkbox1 checked. " : "";
    this.label.caption += (this.checkbox2.checked) ? "Checkbox2 checked. " : "";
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-checkbox id='checkbox1' caption="Checkbox1" captionWidth={90} padding={{left: 20}} onChanged={this.btnClick}></i-checkbox>
            <i-checkbox id='checkbox2' caption="Checkbox2" captionWidth={90} padding={{left: 20}} onChanged={this.btnClick}></i-checkbox>
            <i-panel>
                <i-label id='label' caption={''} padding={{left: 20}}></i-label>
            </i-panel>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_
