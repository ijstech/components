import {Module, Table, Pagination} from '@ijstech/components';
export default class ITableSample extends Module{
    private tableElm: Table;
    private data: any[] = [];
    private columns: any[] = [];

    init() {
        super.init();
        this.generateData();

        this.tableElm.pagination = new Pagination(this, {
            marginTop: 20,
            totalPage: 3,
            currentPage: 1,
            pageSize: 5,
        })
        this.tableElm.data = this.data;
        this.tableElm.columns = this.columns;
    }

    generateData() {
        this.data = [
            { name: 'John Brown', age: 40, tags: 'loser' },
            { name: 'Ken Lam', age: 18, tags: 'developer' },
            { name: 'Ken Lam', age: 18, tags: 'loser' },
            { name: 'Ning', age: 33, tags: 'developer' },
            { name: 'Kelvin', age: 32, tags: 'loser' },
            { name: 'Ojo', age: 18, tags: 'developer' },
            { name: 'May', age: 18, tags: 'loser' },
            { name: 'Lok', age: 23, tags: 'developer' },
            { name: 'Peter', age: 50, tags: 'loser' },
            { name: 'Wing', age: 22, tags: 'developer' },
            { name: 'John Brown', age: 40, tags: 'loser' }
        ];
        
        this.columns = [
            {title: 'Name', fieldName: 'name', sortable: true, sortOrder: 'desc'},
            {title: 'Age', fieldName: 'age', sortable: true},
            {title: 'Tag', fieldName: 'tags', textAlign: "center"}
        ];
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-table id="tableElm" width="100%" margin={{top: 50, bottom: 50}} heading={true}
                    expandable={{
                        onRenderExpandedRow: (record: any) => <i-label caption="Expand value" />,
                        rowExpandable: true,
                    }}
                    mediaQueries={[
                        {
                            maxWidth: '100px',
                            properties: {
                                fieldNames: ['age', 'address']
                            }
                        }
                    ]}
                ></i-table>
            </i-panel>
        )
    }
}