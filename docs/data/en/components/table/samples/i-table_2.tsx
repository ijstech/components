import {Module, Label, Table, customElements, observable, Styles} from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

@customElements('i-module1')
export default class ITableSample extends Module{
    private tableElm: Table;
    private label1: Label;
    @observable('data', true)
    private data: any[] = [];
    @observable('columns', true)
    private columns: any[] = [];
    private cellclickCounter: number = 0;

    cellclick(){
        this.cellclickCounter += 1;
        this.label1.caption = 'Number of cell clicking: ' + this.cellclickCounter.toString();
    }

    generateData() {
        this.data = [
            {name: 'Alex', age: 24, gender: 'M'},
            {name: 'Ben', age: 45, gender: 'M'},
            {name: 'Chloe', age: 28, gender: 'F'}
        ];
        
        this.columns = [
            {title: 'Name', fieldName: 'name', key: 'name', width: '30%', sortable: true, sorter: (a: any, b: any) => !!(a.name.length - b.name.length)}, 
            {title: 'Age', fieldName: 'age', key: 'age', width: '30%', sortable: true},
            {title: 'Gender', fieldName: 'gender', key: 'gender', width: '30%', sortable: true},
            {
                title: '', fieldName: '',
                onRenderCell: () => {
                    return `<i-label id="detailBtn" class="btn-primary btn-join">Detail</i-label>`
                }
            }
        ];
    }

    init() {
        super.init();
        this.generateData();
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel><i-label id='label1' caption={'Number of cell clicking: 0'}></i-label></i-panel>
                <i-table id="tableElm" heading={true} data={this.data} columns={this.columns} onCellClick={this.cellclick}
                    headingStyles={{
                        background: {color: Theme.colors.primary.main},
                        font: {color: Theme.colors.primary.contrastText, size: '14px', weight: 'bold'}
                    }}
                    expandable={{
                        onRenderExpandedRow: () => <i-panel><i-label caption="This colume is expanded" padding={{left: 70}}/></i-panel>,
                        rowExpandable: true
                    }}
                ></i-table>
            </i-panel>
        )
    }
}