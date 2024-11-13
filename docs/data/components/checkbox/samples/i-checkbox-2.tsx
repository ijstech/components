import {Module} from '@ijstech/components';
export default class ICheckboxSample extends Module{
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-checkbox caption="Check me!" captionWidth={90} padding={{left: 20}}></i-checkbox>
                <i-checkbox caption="Read only" captionWidth={90} readOnly={true} padding={{left: 20}}></i-checkbox>
            </i-panel>
        )
    }
}