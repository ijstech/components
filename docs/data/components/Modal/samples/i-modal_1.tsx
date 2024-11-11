import {Module, Modal} from '@ijstech/components';
export default class IModalSample extends Module {
    private mdAlert: Modal;

    click() {
        this.mdAlert.visible = true;
    }
    
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-button caption="Show Modal" padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }} onClick={this.click}></i-button>
                <i-modal id="mdAlert" height='300px' maxWidth="200px" title="Error" closeIcon={{ name: 'times' }} 
                    closeOnBackdropClick={false} popupPlacement='center'
                >
                    <i-panel id="commonTokenPanel" class="common-token">
                        <i-label caption="Common Token" />
                    </i-panel>
                </i-modal>
            </i-panel>
        )
    }
}