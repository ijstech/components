import { Label, Module, Switch, observable } from '@ijstech/components';

export default class ISwitchSample extends Module {
    private switchBox: Switch
    private label: Label;

    @observable()
    private _checked: boolean = false;

    get switchBoxStatus(): string {
        return `The switch is ${(this.switchBox.checked) ? 'On' : 'Off'}`;
    }
    handleChanged(){
        this.label.caption = this.switchBoxStatus;
    }

    init() {
        super.init();
        setTimeout(() => {
            this._checked = true;
        }, 1000)
    }

    render() {
        return (
            <i-panel>
                <i-switch id="switchBox"
                    checked={this._checked}
                    onChanged={this.handleChanged}
                ></i-switch>
                <i-label id="label" caption={this.switchBoxStatus}></i-label>
            </i-panel>
        )
    }
}