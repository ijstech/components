# Repeater

To display a collection of UI elements.

### `i-repeater`

## Class Inheritance

Inherited from `Control`

## Properties

| Name  | Description                           | Type   | Default |
| ----- | ------------------------------------- | ------ | ------- |
| count | Define the number of items to display | number | 0       |
| data  | Define the items to display           | any[]  | []      |

## Events

| **onRender** |                                          |
| ------------ | ---------------------------------------- |
| Description  | Callback executed when render item       |
| Signature    | onRender(parent: Control, index: number) |

## Sample Code

```typescript(samples/repeater-1.tsx)
onRender(parent: Control, index: number) {
  const item = parent.children[index]
  const label = item.querySelector('#lbItem') as Label;
  if (label) {
    label.caption = this.dataList?.[index]?.name || 'Untitled';
  }
}

init() {
  super.init();
  this.dataList.push({ name: 'New Item 1', value: '1' });
  this.dataList.push({ name: 'New Item 2', value: '2' });

  setTimeout(() => {
    this.dataList.push({ name: 'New Item 3', value: '3' });
    this.dataList.push({ name: 'New Item 4', value: '4' });
  }, 1000);

  setTimeout(() => {
    this.dataList.shift();
  }, 2000);
}

render() {
  <i-panel id={'wrapper'} padding={{ top: 10, bottom: 10, left: 10, right: 10 }}>
    <i-repeater
      id="repeater"
      data={this.dataList}
      onRender={this.onRender}
    >
      <i-hstack gap={'1rem'} verticalAlignment='center' justifyContent='space-between' padding={{ top: '0.5rem', bottom: '0.5rem' }}>
        <i-hstack gap={`0.5rem`} verticalAlignment='center'>
          <i-image url="https://picsum.photos/200/300" width="40px" height="40px" rotate={90} border={{ radius: '50%' }} objectFit='cover'></i-image>
          <i-label id="lbItem" caption='Repeater item' font={{ bold: true }}></i-label>
        </i-hstack>
        <i-icon name='edit' width='16px' height='16px' stack={{ shrink: '0' }} fill='#007bff'></i-icon>
      </i-hstack>
    </i-repeater>
  </i-panel>
}
```
```typescript(samples/repeater-2.tsx)
onRender(parent: Control, index: number) {
  const item = parent.children[index]
  const inputElm = item.querySelector('i-input') as Input;
  inputElm.value = this._data.tags[index];
}

render() {
  return <i-vstack
    width='100%' gap={16}
    padding={{ left: '1rem', right: '1rem', top: '1rem' }}
  >
    <i-vstack width='100%' gap={8}>
      <i-label caption='Title'></i-label>
      <i-input
        value={this._data.title}
        position='relative'
        width='100%'
        height='32px'
        padding={{ "left": "8px", "right": "8px" }}
        border={{ "width": "0px", "radius": "5px" }}
      >
      </i-input>
    </i-vstack>
    <i-vstack width='100%' gap={8}>
      <i-label caption='About'></i-label>
      <i-input
        value={this._data.about}
        position='relative'
        width='100%'
        height='32px'
        padding={{ "left": "8px", "right": "8px" }}
        border={{ "width": "0px", "radius": "5px" }}
      >
      </i-input>
    </i-vstack>
    <i-vstack width='100%' gap={8}>
      <i-label caption='Tags'></i-label>
      <i-repeater count={3} onRender={this.onRender}>
        <i-input
          position='relative'
          width='100%'
          height='32px'
          margin={{bottom: 10}}
          border={{ "width": "0px", "radius": "5px" }}
          padding={{ "left": "8px", "right": "8px" }}
        >
        </i-input>
      </i-repeater>
    </i-vstack>
  </i-vstack>
}
```