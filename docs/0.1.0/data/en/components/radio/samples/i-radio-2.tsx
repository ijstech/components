import {Module, Label, RadioGroup} from '@ijstech/components';

export default class IRadioSample extends Module {
    private label: Label;
    private radioGroup: RadioGroup;

    init() {
        super.init();
        this.radioGroup.radioItems = [
            {caption: 'Option 1', value: '1'},
            {caption: 'Option 2', value: '2'},
            {caption: 'Option 3', value: '3'}
        ]
    }

    onChanged() {
        this.label.caption = `The radio selected value ${this.radioGroup.selectedValue}`;
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-label top={20} id='label' caption="The radio selected value"></i-label>
                <i-radio-group top={50} width="100%" id='radioGroup' selectedValue='2' onChanged={this.onChanged}></i-radio-group>
            </i-panel>
        )
    }
}