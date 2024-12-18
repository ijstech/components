# Vstack

Use for presenting views that arranges its children in a vertical line.

### `i-vstack`

## Class Inheritance
Inherited from [`Container`](components/container/README.md) > [`StackLayout`](components/layout/stackLayout/README.md)

## Properties

| Name                | Description                                       | Type                                          | Default |
| ---------------     | ------------------------------------------------- | ----------                                    | ------- |
| horizontalAlignment | Define the horizontal alignment of `<i-vstack>`   | [VStackHAlignmentType](#vstackhalignmenttype) |         |
| verticalAlignment   | Define the vertical alignment of `<i-vstack>`     | [VStackVAlignmentType](#vstackvalignmenttype) |         |

### VStackHAlignmentType
`stretch` \| `start` \| `center` \| `end` \| `baseline`

### VStackVAlignmentType
`start` \| `center` \| `end` \| `space-between` \| `space-around` \| `space-evenly`

## Sample Code

### Properties
```typescript(samples/i-vstack.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-vstack width="100%" height="100%" margin={{bottom: 20}} gap="10px" verticalAlignment="center" horizontalAlignment="center">
                <i-button id="withdrawBtn" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Withdraw'></i-button>
                <i-button id="stakeBtn" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Stake'></i-button>
                <i-button id="unstakeBtn" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Unstake'></i-button>
            </i-vstack>
        </i-panel>
    )
}
```
**Tip**: _The properties `width`, `height`, [`margin`](../../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md) and the property `gap` is inherited from [`StackLayout`](components/layout/stackLayout/README.md)_