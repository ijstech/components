# Menu

A menu provides navigation for the website or dApp.  A menu starts with the `i-menu` tag, and **data** to define the menu content.

### `i-menu`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type                  | Default |
| --------------- | ------------------------------------------------- | ----------            | ------- |
| mode            | Define the menu display mode                      | [MenuMode](#menumode) |         |
| data            | Define the menu content                           | [IMenuItem](../customDataType/README.md#imenuitem) | | |

### MenuMode
`horizontal` \| `vertical` \| `inline`

## Event

| **onItemClick**|                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when click the menu item     |
| Signature      | onItemClick(target: Menu, item: MenuItem)      |

## Sample Code

### Property
```typescript(samples/i-menu_1.tsx)
init() {
    super.init();
    this.menu1.data = [
        { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
        {
            title: 'Test 2',
            items: [
                { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } },
                {
                    title: 'Test 2.2',
                    items: [
                        { title: 'Test 2.2.1', link: { href: '/#/test2_2_1' } }
                    ]
                }
            ]
        }
    ];
    this.menu2.data = [
        { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
        {
            title: 'Test 2',
            items: [
                { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } },
                {
                    title: 'Test 2.2',
                    items: [
                        { title: 'Test 2.2.1', link: { href: '/#/test2_2_1' } }
                    ]
                }
            ]
        }
    ];
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-label caption="horizontal" margin={{ bottom: '0.5rem' }} font={{ bold: true }}></i-label>
            <i-menu id="menu1" mode="horizontal"></i-menu>
            <i-label caption="vertical" margin={{ top: '2rem', bottom: '0.5rem' }} font={{ bold: true }}></i-label>
            <i-menu id="menu2" mode="vertical" maxWidth="500px"></i-menu>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `maxWidth` are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-menu_2.tsx)
init() {
    super.init();
    this.menu1.data = [
        { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
        {
            title: 'Test 2',
            items: [
                { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } },
                {
                    title: 'Test 2.2',
                    items: [
                        { title: 'Test 2.2.1', link: { href: '/#/test2_2_1' } }
                    ]
                }
            ]
        }
    ];
    this.menu2.data = [
        { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
        {
            title: 'Test 2',
            items: [
                { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } },
                {
                    title: 'Test 2.2',
                    items: [
                        { title: 'Test 2.2.1', link: { href: '/#/test2_2_1' } }
                    ]
                }
            ]
        }
    ];
}

btnClick(control: any) {
    this.counter++;
    this.label.caption = 'Counter: ' + this.counter.toString();
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-panel><i-label id='label' caption={'Counter: 0'}></i-label></i-panel>
            <i-label caption="horizontal" margin={{ bottom: '0.5rem' }} font={{ bold: true }}></i-label>
            <i-menu id="menu1" mode="horizontal" onItemClick={this.btnClick}></i-menu>
            <i-label caption="inline" margin={{ top: '2rem', bottom: '0.5rem' }} font={{ bold: true }}></i-label>
            <i-menu id="menu2" mode="inline" maxWidth="500px"></i-menu>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `maxWidth` are inherited from [`Control`](components/Control/README.md)_