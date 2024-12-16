import {Module, Table, Pagination} from '@ijstech/components';

export default class IPaginationSample extends Module{
    private tableElm: Table;
    private data: any[] = [];
    private columns: any[] = [];

    generateData() {
        for (let i = 1; i <= 20; i++) {
            this.data.push({
                name: 'John Brown',
                age: Number(`${i}2`),
                address: `New York No. ${i} Lake Park`,
                description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
                tags:i === 1 ? ['loser'] : ['nice', 'developer']
            });
        }

        this.columns = [
            {title: 'Name', fieldName: 'name'},
            {title: 'Age', fieldName: 'age'},
            {
                title: 'Address',
                fieldName: 'address',
                filters: [
                    {text: 'London', value: 'London'}, {text: 'New York', value: 'New York'}
                ]
            }
        ];
    }

    init() {
        super.init();

        this.generateData();

        let currentPage: number = 1;
        let pageSize: number = 8;
        let totalPage: number = Math.ceil(this.data.length / pageSize);

        this.tableElm.data = this.data;
        this.tableElm.columns = this.columns;
        this.tableElm.pagination = new Pagination(this, {
            totalPage: totalPage,
            currentPage: currentPage,
            pageSize: pageSize,
        })
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-table id='tableElm' heading={true} background={{color: '#000000'}} font={{ size: '13px'}}></i-table>
            </i-panel>
        )
    }
}