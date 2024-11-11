import {Module, Label, Checkbox} from '@ijstech/components';
export default class ICheckboxSample extends Module{
    private label: Label;
    private checkbox1: Checkbox;
    private checkbox2: Checkbox;

    btnClick() {
        this.label.caption = "";
        this.label.caption += (this.checkbox1.checked) ? "Checkbox1 checked. " : "";
        this.label.caption += (this.checkbox2.checked) ? "Checkbox2 checked. " : "";
    }
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-checkbox id='checkbox1' caption="Checkbox1" captionWidth={90} padding={{left: 20}} onChanged={this.btnClick}></i-checkbox>
                <i-checkbox id='checkbox2' caption="Checkbox2" captionWidth={90} padding={{left: 20}} onChanged={this.btnClick}></i-checkbox>
                <i-panel>
                    <i-label id='label' caption={''} padding={{left: 20}}></i-label>
                </i-panel>
            </i-panel>
        )
    }
}