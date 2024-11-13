# Combobox 

A combo box is a text box with a list box attached that a user can select from. This type of control enables users to select a predefined value in a list in the text box portion of the control. Used `i-combo-box` to define the combo box.

### `i-combo-box`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type                  | Default |
| --------------- | ------------------------------------------------- | ----------            | ------- |
| selectedItem    | Define the selected item of an `<i-combo-box>`    | [IComboItem \| IComboItem&#91;&#93;](components/customdatatype/README.md#icomboitem) | |
| items           | Define the items of the `<i-combo-box>`           | [IComboItem&#91;&#93;](components/customdatatype/README.md#icomboitem)| |
| icon            | Define the icon of the `<i-combo-box>`            | [Icon](components/customdatatype/README.md#icon)| |
| mode            | Define the select mode of the `<i-combo-box>`     | [ModeType](#modetype) |    `single`    |
| placeholder     | Define a short hint that describes the expected value of an `<i-combo-box>` before selection | string | |
| readOnly        | Define whether the `<i-combo-box>` is read-only | boolean | false |

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
init() {
    super.init();
    this.comboBox.items = [
        {label: 'item 1', value: '1'}, 
        {label: 'item 2', value: '2'}, 
        {label: 'item 3', value: '3'}, 
        {label: 'item 4', value: '4'}
    ]
    this.comboBox.selectedItem = {label: 'item 2', value: '2'}
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-combo-box id="comboBox" icon={{ name: "address-card" }} placeholder="Selection" padding={{left: 10, top: 10}}></i-combo-box>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`padding`](components/customdatatype/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_

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
    this.comboBox.selectedItem = {label: 'item 2', value: '2'}
}

select(){
    this.selectCounter += 1;
    this.label.caption = 'Selection counter: ' + this.selectCounter.toString();
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-label id='label' caption='Selection counter: 0' padding={{left: 10}}></i-label>
            <i-combo-box id="comboBox" icon={{ name: "address-card" }} placeholder="Selection"
                padding={{left: 10, top: 10}} onChanged={this.select}
            ></i-combo-box>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`padding`](components/customdatatype/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_