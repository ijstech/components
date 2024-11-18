import { Module, Label, ComboBox, observable } from '@ijstech/components';
export default class IComboboxExample extends Module{
    private selectCounter: number = 0;
    private label: Label;
    private comboBox: ComboBox;

    @observable()
    private selected: string = '1';

    init() {
        super.init();
        this.comboBox.items = [
            {label: 'item 1', value: '1'}, 
            {label: 'item 2', value: '2'}, 
            {label: 'item 3', value: '3'}, 
            {label: 'item 4', value: '4'}
        ]
        // this.comboBox.selectedItem = {label: 'item 2', value: '2'}
    }
    
    select(){
        this.selectCounter += 1;
        this.label.caption = 'Selection counter: ' + this.selectCounter.toString();
    }
  
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-label id='label' caption='Selection counter: 0' padding={{left: 10}}></i-label>
                <i-combo-box
                    id="comboBox"
                    icon={{ name: "address-card" }}
                    placeholder="Selection"
                    value={this.selected}
                    margin={{ left: 10, top: 10 }}
                    onChanged={this.select}
                ></i-combo-box>
            </i-panel>
        )
    }
}
