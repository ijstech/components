import {Module} from '@ijstech/components';
export default class IIFrameSample extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-iframe width="100%" height="300" allowFullscreen={true} url="https://www.youtube.com/embed/tgbNymZ7vqY"></i-iframe>
            </i-panel>
        )
    }
}