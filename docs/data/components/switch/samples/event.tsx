import {Label, Module, Switch} from '@ijstech/components';
export default class ISwitchSample extends Module {
    private switchBox: Switch
    private label: Label;
    get switchBoxStatus(): string {
        return `The switch is ${(this.switchBox.checked) ? 'On' : 'Off'}`;
    }
    handleChanged(){
        this.label.caption = this.switchBoxStatus;
    }
    render() {
        return (
            <i-panel>
                <i-switch id="switchBox"
                    onChanged={this.handleChanged}
                ></i-switch>
                <i-label id="label" caption={this.switchBoxStatus}></i-label>
            </i-panel>
        )
    }
}