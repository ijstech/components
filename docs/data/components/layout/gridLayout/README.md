# GridLayout

It is a layout manager that lays out a container's components in a rectangular grid. The container is divided into equal-sized rectangles, and one component is placed in each rectangle.

### `i-grid-layout`

## Class Inheritance
Inherited from [`Container`](components/container/README.md)

## Properties

| Name                | Description                                                      | Type                                    | Default |
| ---------------     | -------------------------------------------------                | ----------                              | ------- |
| templateColumns     | Define how many columns and the column size in `<i-grid-layout>` | string[]                                |         |
| templateRows        | Define how many rows and the row size in `<i-grid-layout>`       | string[]                                |         |
| templateAreas       | Define the location of each grid in `<i-grid-layout>`            | string[][]                              |         |
| autoColumnSize      | Define the columns size in `<i-grid-layout>`                     | string                                  |         |
| autoRowSize         | Define the rows size in `<i-grid-layout>`                        | string                                  |         |
| columnsPerRow       | Define how many columns in the row                               | number                                  |         |
| gap                 | Define the gap of the `<i-grid-layout>`                          | [IGap](components/customdatatype/README.md#igap)  | |
| horizontalAlignment | Define the horizontal alignment of the `<i-grid-layout>`         | [HorizontalAlignment](#horizontalalignment) | |
| verticalAlignment   | Define the vertical alignment of the `<i-grid-layout>`           | [VerticalAlignment](#verticalalignment) | |
| autoFillInHoles     | Define auto fill in the holes in `<i-grid-layout>`               | boolean                                 |         |
| mediaQueries        | Define tailored style to different devices                       | [IGridLayoutMediaQuery&#91;&#93;](components/customdatatype/README.md#imediaquery) | |

### HorizontalAlignment
`stretch` \| `start` \| `end` \| `center`

### VerticalAlignment
`stretch` \| `start` \| `end` \| `center` \| `baseline`

## Sample Code

### Properties
```typescript(samples/i-grid-layout.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-grid-layout width="100%" height="200px" background={{color: "green"}} horizontalAlignment="center" verticalAlignment="center"
                templateColumns={['repeat(3, 1fr)']} templateRows={['repeat(2, 1fr)']} templateAreas={[["Btn1", "Btn3", "Btn6"], ["Btn2", "Btn5", "Btn4"]]} 
                autoFillInHoles={false}
            >
                <i-button grid={{ area: 'Btn1' }} width="50%" height="50%" background={{color: 'yellow'}} font={{color: 'black'}} caption="Btn1"></i-button>
                <i-button grid={{ area: 'Btn2' }} width="50%" height="50%" background={{color: 'blue'}} font={{color: 'white'}} caption="Btn2"></i-button>
                <i-button grid={{ area: 'Btn3' }} width="50%" height="50%" background={{color: 'red'}} font={{color: 'white'}} caption="Btn3"></i-button>
                <i-button grid={{ area: 'Btn4' }} width="50%" height="50%" background={{color: 'red'}} font={{color: 'white'}} caption="Btn4"></i-button>
                <i-button grid={{ area: 'Btn5' }} width="50%" height="50%" background={{color: 'yellow'}} font={{color: 'black'}} caption="Btn5"></i-button>
                <i-button grid={{ area: 'Btn6' }} width="50%" height="50%" background={{color: 'blue'}} font={{color: 'white'}} caption="Btn6"></i-button>
            </i-grid-layout> 
            <i-panel margin={{ bottom: '1rem', top: '1rem'}} border={{ bottom: {style: "solid", width: '2px', color: 'purple' }}}></i-panel>
            <i-grid-layout id="gridLayout" columnsPerRow={2} autoRowSize="100px" autoColumnSize="1fr" autoFillInHoles={true} gap={{column: '1rem', row: '1rem'}}>
                    <i-panel background={{color: "green"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>      
                        <i-panel background={{color: "orange"}}>
                    <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>   
                        <i-panel background={{color: "green"}}>
                    <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>   
                    <i-panel background={{color: "orange"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel> 
                    <i-panel background={{color: "green"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel> 
                    <i-panel background={{color: "orange"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>     
                    <i-panel background={{color: "orange"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>                
            </i-grid-layout>
            <i-panel margin={{ bottom: '1rem', top: '1rem'}} border={{ bottom: {style: "solid", width: '2px', color: 'purple' }}}></i-panel>
            <i-grid-layout id="gridLayout2" templateColumns={['repeat(3, 1fr)']} autoRowSize="100px" autoColumnSize="1fr" display="none">
                    <i-panel background={{color: "green"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>      
                    <i-panel background={{color: "orange"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>   
                    <i-panel background={{color: "green"}}>
                        <i-image url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg"></i-image>
                    </i-panel>              
            </i-grid-layout>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `width`, `height`, `background`, [`grid`](components/customdatatype/README.md#igrid), [`font`](components/customdatatype/README.md#ifont) are inherited from [`Control`](components/Control/README.md)_