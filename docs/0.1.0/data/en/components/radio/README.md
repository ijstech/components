# Radio

Use as grouping radio buttons for users to select at most one radio button from a set. Checking one radio button that belongs to a radio group unchecks any previous checked radio button within the same group. A radio group starts with the `i-radio-group` tag, and use **radioItems** to define the items.

### `i-radio-group`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| layout          | Define the layout of the radio group              | [RadioGroupLayout](#radiogrouplayout) | `vertical` |
| selectedValue   | Define the selected value of an `<i-radio-group>` | string     |         |
| radioItems      | Define the items of an `<i-radio-group>`          | [Radio&#91;&#93;](../customDataType/README.md#radio) | |

### RadioGroupLayout
`vertical` \| `horizontal`

## Event

| **onChanged**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when radio status changed    |
| Signature      | onChanged(target: Control, event: Event)       |

### Function

| **add**        |                                                |
| -------------- | ---------------------------------------------- |
| Description    | to add radio                                   |
| Signature      | add(options: [Radio](../customDataType/README.md#radio)) |

| **delete**     |                                                |
| -------------- | ---------------------------------------------- |
| Description    | to delete radio                                |
| Signature      | delete(index: number)                          |

## Sample Code 

### Property
```typescript(samples/i-radio-1.tsx)
 private _items = [
    {caption: 'Option 1', value: '1'},
    {caption: 'Option 2', value: '2'},
    {caption: 'Option 3', value: '3'}
];

init() {
    super.init();
    this.radioGroup.radioItems = this._items;
    this.radioGroup1.radioItems = this._items;
}

render() {
    return (
        <i-vstack gap="1rem" height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-radio-group width="100%" id='radioGroup' selectedValue="3"></i-radio-group>
            <i-radio-group width="100%" id="radioGroup1" layout="horizontal"></i-radio-group>
        </i-vstack>
    )
}
```
**Tip**: _The properties `id`, `width` are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-radio-2.tsx)
init() {
    super.init();
    this.radioGroup.radioItems = [
        {caption: 'Option 1', value: '1'},
        {caption: 'Option 2', value: '2'},
        {caption: 'Option 3', value: '3'}
    ]
}
onChanged() {
    this.label.caption = `The radio selected value ${this.radioGroup.selectedValue}`;
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-label top={20} id='label' caption="The radio selected value"></i-label>
            <i-radio-group top={50} width="100%" id='radioGroup' selectedValue='2' onChanged={this.onChanged}></i-radio-group>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `width` are inherited from [`Control`](components/Control/README.md)_

### Function
```typescript(samples/i-radio-3.tsx)
init() {
    super.init();
    this.radioGroup.radioItems = [
        {caption: 'Option 1', value: '1'},
        {caption: 'Option 2', value: '2'},
        {caption: 'Option 3', value: '3'}
    ]
    this.radioGroup.selectedValue = "2";
}
addItem() {
    let itemLength = this.radioGroup.radioItems.length;
    console.log(this.radioGroup.selectedValue);
    this.radioGroup.add({caption: 'Option ' + (itemLength+1), value: (itemLength+1).toString()});
}
deleteItem() {
    let itemLength = this.radioGroup.radioItems.length;
    if (itemLength > 0)
        this.radioGroup.delete(itemLength-1);
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-panel>
                <i-label id='label' caption="The radio selected value"></i-label>
            </i-panel>
            <i-panel>
                <i-radio-group width="100%" id='radioGroup' selectedValue='2'></i-radio-group>
            </i-panel>
            <i-panel>
                <i-hstack width="100%" height="100%" margin={{bottom: 20}} gap="10px">
                    <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Add radio item' onClick={() => this.addItem}></i-button>
                    <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Delete last radio item' onClick={() => this.deleteItem}></i-button>
                </i-hstack>
            </i-panel>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `width` are inherited from [`Control`](components/Control/README.md)_