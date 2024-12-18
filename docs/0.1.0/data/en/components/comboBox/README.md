# Combobox 

A combo box is a text box with a list box attached that a user can select from. This type of control enables users to select a predefined value in a list in the text box portion of the control. Used `i-combo-box` to define the combo box.

### `i-combo-box`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type                  | Default |
| --------------- | ------------------------------------------------- | ----------            | ------- |
| selectedItem    | Define the selected item of an `<i-combo-box>`    | [IComboItem](../customDataType/README.md#icomboitem) | |
| selectedItems    | Define the selected items of an `<i-combo-box>`    | [IComboItem&#91;&#93;](../customDataType/README.md#icomboitem) | |
| items           | Define the items of the `<i-combo-box>`           | [IComboItem&#91;&#93;](../customDataType/README.md#icomboitem)| |
| icon            | Define the icon of the `<i-combo-box>`            | [Icon](../customDataType/README.md#icon)| |
| mode            | Define the select mode of the `<i-combo-box>`     | [ModeType](#modetype) |    `single`    |
| placeholder     | Define a short hint that describes the expected value of an `<i-combo-box>` before selection | string | |
| readOnly        | Define whether the `<i-combo-box>` is read-only   | boolean               | false          |
| value           | Define a value of an `<i-combo-box>`              | string                |                |

### ModeType
`single` \| `multiple` \| `tags`

## Events

| **onChanged**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when ComboBox value changed  |
| Signature      | onChanged(target: Control, event: Event)       |

## Sample Code 

### Property
```typescript(samples/i-combo-box_1.tsx)
@observable()
private _value: string = '4';

init() {
    super.init();
    this.comboBox2.selectedItems = [{ label: 'item 2', value: '2' }, { label: 'item 3', value: '3' }]
    this.comboBox3.selectedItems = [{ label: 'item 2', value: '2' }, { label: 'item 3', value: '3' }]
}

render() {
    return (
        <i-vstack height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }} gap={'1rem'}>
            <i-combo-box
                id="comboBox"
                icon={{ name: "address-card" }}
                placeholder="Selection"
                margin={{ left: 10, top: 10 }}
                items={items}
                value={this._value}
            ></i-combo-box>
            <i-combo-box
                id="comboBox2"
                icon={{ name: "address-card" }}
                placeholder="Selection"
                margin={{ left: 10, top: 10 }}
                mode="multiple"
                items={items}
            ></i-combo-box>
            <i-combo-box
                id="comboBox3"
                icon={{ name: "address-card" }}
                placeholder="Selection"
                margin={{ left: 10, top: 10 }}
                mode="tags"
                items={items}
            ></i-combo-box>
        </i-vstack>
    )
}
```
**Tip**: _The properties `id`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-combo-box_2.tsx)
init() {
    super.init();
    this.comboBox.items = [
        {label: 'item 1', value: '1'}, 
        {label: 'item 2', value: '2'}, 
        {label: 'item 3', value: '3'}, 
        {label: 'item 4', value: '4'}
    ]
}

select(){
    this.selectCounter += 1;
    this.label.caption = 'Selection counter: ' + this.selectCounter.toString();
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-label id='label' caption='Selection counter: 0' padding={{left: 10}}></i-label>
            <i-combo-box
                id="comboBox"
                icon={{ name: "address-card" }}
                placeholder="Selection"
                value={this.selected}
                margin={{ left: 10, top: 10 }}
                onChanged={this.select}
            ></i-combo-box>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_