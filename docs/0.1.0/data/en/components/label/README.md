# Label

It is used to create text labels to display.

### `i-label`

## Class Inheritance

Inherited from [`Control`](components/Control/README.md)

## Properties

| Name           | Description                                   | Type                                             | Default |
| -------------- | --------------------------------------------- | ------------------------------------------------ | ------- |
| caption        | Define the header of the `<i-label>`          | string                                           |         |
| link           | Define the hyperlink of the `<i-label>`       | [Link](../customDataType/README.md#link) |         |
| textDecoration | Define the text decoration of the `<i-label>` | [TextDecorationType](#textdecorationtype)        | `none`  |

### TextDecorationType

`none` \| `underline` \| `overline` \| `line-through`;

## Sample Code

### Properties

```typescript(samples/i-label.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-label caption={"This is the i-label component of Secure Compute!"} link={{ href: "/#/test2_1", target: "_blank"}}></i-label>
            <i-label caption={"This is the i-label component of Secure Compute!"} textDecoration="line-through"></i-label>
        </i-panel>
    )
}
```