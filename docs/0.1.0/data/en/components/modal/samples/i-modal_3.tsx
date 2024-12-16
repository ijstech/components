import {Module, Modal, Label} from '@ijstech/components';
export default class IModalSample extends Module {
    private mdAlert: Modal;
    private label1: Label;

    click() {
        this.mdAlert.visible = true;
    }

    openHandle() {
        this.label1.caption = "Event called: onOpen Event";
    }

    closeHandle() {
        this.label1.caption = "Event called: onClose Event";
    }
    
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel><i-label id='label1' caption='Event called: '></i-label></i-panel>
                <i-button caption="Show Modal" padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }} onClick={this.click}></i-button>
                <i-modal id="mdAlert" height='300px' maxWidth="200px" title="Error" closeIcon={{ name: 'times' }} 
                    closeOnBackdropClick={false} popupPlacement='center'
                    onOpen={this.openHandle} onClose={this.closeHandle}
                    >
                    <i-panel id="commonTokenPanel" class="common-token">
                        <i-label caption="Common Token" />
                    </i-panel>
                </i-modal>
            </i-panel>
        )
    }
}