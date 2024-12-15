import {Module} from '@ijstech/components';
export default class IIconSample extends Module {
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
}