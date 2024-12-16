import { Module, ComboBox, observable } from '@ijstech/components';

const items = [
    { label: 'item 1', value: '1' },
    { label: 'item 2', value: '2' },
    { label: 'item 3', value: '3' },
    { label: 'item 4', value: '4' }
]
export default class IComboboxExample extends Module {
    private comboBox: ComboBox;
    private comboBox2: ComboBox;
    private comboBox3: ComboBox;

    @observable()
    private _value: string = '4';

    init() {
        super.init();
        this.comboBox2.selectedItems = [{ label: 'item 2', value: '2' }, { label: 'item 3', value: '3' }]
        this.comboBox3.selectedItems = [{ label: 'item 2', value: '2' }, { label: 'item 3', value: '3' }]
    }

    render() {
        return (
            <i-vstack height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }} gap={'1rem'}>
                <i-combo-box
                    id="comboBox"
                    icon={{ name: "address-card" }}
                    placeholder="Selection"
                    margin={{ left: 10, top: 10 }}
                    items={items}
                    value={this._value}
                ></i-combo-box>
                <i-combo-box
                    id="comboBox2"
                    icon={{ name: "address-card" }}
                    placeholder="Selection"
                    margin={{ left: 10, top: 10 }}
                    mode="multiple"
                    items={items}
                ></i-combo-box>
                <i-combo-box
                    id="comboBox3"
                    icon={{ name: "address-card" }}
                    placeholder="Selection"
                    margin={{ left: 10, top: 10 }}
                    mode="tags"
                    items={items}
                ></i-combo-box>
            </i-vstack>
        )
    }
}
