## StackLayout

A Layout that positions child elements in a single line which can be oriented vertically or horizontally.

### `i-stack`

## Class Inheritance
Inherited from [`Container`](components/container/README.md)

## Properties

| Name            | Description                                          | Type                                                | Default |
| --------------- | -------------------------------------------------    | ----------                                          | ------- |
| gap             | Define the gap of the `StackLayout`                  | number \| string                                    |         |
| wrap            | Define the wrap type of the `StackLayout`            | [StackWrapType](#stackwraptype)                     |         |
| direction       | Define the direction type of the `StackLayout`       | [StackDirectionType](#stackdirectiontype)           |         |
| justifyContent  | Define the justify content type of the `StackLayout` | [StackJustifyContentType](#stackjustifycontenttype) |         |
| alignItems      | Define the alignitems type of the `StackLayout`      | [StackAlignItemsType](#stackalignitemstype)         |         |
| mediaQueries    | Define tailored style to different devices           | [IStackMediaQuery&#91;&#93;](../../customDataType/README.md#imediaquery) | |

### StackWrapType
`nowrap` \| `wrap` \| `wrap-reverse` \| `initial` \| `inherit`

### StackDirectionType
`horizontal` \| `vertical`

### StackJustifyContentType
`start` \| `center` \| `end` \| `space-between` \| `space-around` \| `space-evenly`

### StackAlignItemsType
`stretch` \| `start` \| `center` \| `end` \ `baseline`

## Sample Code

### Properties
```typescript(samples/i-stack.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-stack id='pnlButton' padding={{left: 4}} 
                gap={10} wrap="nowrap" direction="vertical" 
                justifyContent="end" alignItems="center"
                grid={{ area: 'pnlButton' }} 
                mediaQueries={[{maxWidth: '500px', properties: {direction: 'horizontal'}}]}
            >
                <i-button width={30} height={30} icon={{ name: 'file-code' }} margin={{bottom: 6}}></i-button>
                <i-button width={30} height={30} icon={{ name: 'search' }} margin={{bottom: 6}}></i-button>
                <i-button width={30} height={30} icon={{ name: 'code-branch' }} margin={{bottom: 6}}></i-button>
            </i-stack>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`padding`](../../customDataType/README.md#ispace), [`grid`](../../customDataType/README.md#igrid) are inherited from [`Control`](components/Control/README.md)_