import {Module, ComboBox} from '@ijstech/components';
export default class IComboboxExample extends Module{
    private comboBox: ComboBox;

    init() {
        super.init();
        this.comboBox.items = [
            {label: 'item 1', value: '1'}, 
            {label: 'item 2', value: '2'}, 
            {label: 'item 3', value: '3'}, 
            {label: 'item 4', value: '4'}
        ]
        this.comboBox.selectedItem = {label: 'item 2', value: '2'}
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-combo-box id="comboBox" icon={{ name: "address-card" }} placeholder="Selection" margin={{left: 10, top: 10}}></i-combo-box>
            </i-panel>
        )
    }
}
