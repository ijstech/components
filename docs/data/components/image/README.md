# Image 

To display a previewable image.

### `i-image`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                                           | Type       | Default |
| --------------- | -------------------------------------------------                     | ---------- | ------- |
| rotate          | Define a 2D rotation, the angle is specified in the parameter         | number     |         |
| url             | Define the path of an `<i-image>`                                     | string     |         |
| fallbackUrl     | Define the default image path of an `<i-image>` for fail load url use | string     |         |
| objectFit       | Define the object fit of an `<i-image>`                               | [ObjectFitType](#objectfittype) | `contain` |

### ObjectFitType
`contain` \| `cover` \| `fill` \| `none` \| `scale-down`;

## Sample Code

### Properties
```typescript(samples/i-image.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-image width="50%" height="50%" rotate={45} url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg" 
                fallbackUrl="https://www.openswap.xyz/"
            ></i-image>
        </i-panel>
    )
}
```
**Tip**: _The properties `width`, `height` are inherited from [`Control`](components/Control/README.md)_