import {Module} from '@ijstech/components';
export default class ISwitchSample extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-switch id="switchBox"
                    checkedThumbColor="#c5c5c5" uncheckedThumbColor="#070707"
                    checkedThumbText="Off" uncheckedThumbText="On"
                    checkedTrackColor="#070707" uncheckedTrackColor="#c5c5c5"
                    checkedText="Off" uncheckedText="On"
                    checked={true}
                ></i-switch>
            </i-panel>
        )
    }
}