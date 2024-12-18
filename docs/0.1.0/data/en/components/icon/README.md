# Icon 

To display an icon which in our icon library. User can define the style.

### `i-icon`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type                 | Default |
| --------------- | ------------------------------------------------- | ----------           | ------- |
| name            | define which icon to display, for reference: https://fontawesome.com/v5/search?m=free&s=solid | IconName | |
| image           | define an image to display                        | [Image](../customDataType/README.md#image) | |
| fill            | define the color of the icon                      | string \| color code |         |
| spin            | set the icon spin                                 | boolean              | false   |

## Sample Code

### Property
```typescript(samples/i-icon.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-panel padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <i-icon width={20} height={20} name="pen" fill="blue"></i-icon>
            </i-panel>
            <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-icon class="i-loading-spinner_icon"
                    image={{ url: "https://placehold.co/50", width: 24, height: 24 }}
                    tooltip={{
                        content: 'Tooltip test', 
                        color: 'red', placement: 'right', trigger: 'click', maxWidth: '200px'
                    }}
                ></i-icon>
            </i-panel>
        </i-panel>
    )
}
```
**Tip**: _The properties `class`, [`tooltip`](../customDataType/README.md#tooltip) are inherited from [`Control`](components/Control/README.md)_