import { Module} from '@ijstech/components';
export default class IGridLayoutExample extends Module {
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
}
