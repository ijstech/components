import {Module, RadioGroup} from '@ijstech/components';

export default class IRadioSample extends Module {
    private radioGroup: RadioGroup;

    init() {
        super.init();
        this.radioGroup.radioItems = [
            {caption: 'Option 1', value: '1'},
            {caption: 'Option 2', value: '2'},
            {caption: 'Option 3', value: '3'}
        ]
        this.radioGroup.selectedValue = "2";
    }
    addItem() {
        let itemLength = this.radioGroup.radioItems.length;
        console.log(this.radioGroup.selectedValue);
        this.radioGroup.add({caption: 'Option ' + (itemLength+1), value: (itemLength+1).toString()});
    }
    deleteItem() {
        let itemLength = this.radioGroup.radioItems.length;
        if (itemLength > 0)
            this.radioGroup.delete(itemLength-1);
    }
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel>
                    <i-label id='label' caption="The radio selected value"></i-label>
                </i-panel>
                <i-panel>
                    <i-radio-group width="100%" id='radioGroup' selectedValue='2'></i-radio-group>
                </i-panel>
                <i-panel>
                    <i-hstack width="100%" height="100%" margin={{bottom: 20}} gap="10px">
                        <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Add radio item' onClick={() => this.addItem}></i-button>
                        <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Delete last radio item' onClick={() => this.deleteItem}></i-button>
                    </i-hstack>
                </i-panel>
            </i-panel>
        )
    }
}