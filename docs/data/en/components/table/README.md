# Table

To display a collection of structured data where data can be sorted, searched, paginated, and filtered.

### `i-table`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                                      | Type                 | Default |
| --------------- | -------------------------------------------------                | ----------           | ------- |
| heading         | Define that `<i-table>` display the table header                 | boolean              | true    |
| data            | Define the data of the `<i-table>`                               | any[]                |         |
| columns         | Define the table columns setting of the `<i-table>`              | [TableColumn&#91;&#93;](components/customdatatype/README.md#tablecolumn) | |
| rows            | Define the table rows setting of the `<i-table>`                 | TableRow[]           |         |
| pagination      | Define the pagination to `<i-table>`                             | string \| [Pagination](components/Pagination/README.md#properties)                |         |
| expandable      | Define the expand area to show information (such as `<i-label>`) | [ITableExpandable](components/customdatatype/README.md#itableexpandable) | |
| mediaQueries    | Define tailored style to different devices                       | [ITableMediaQuery&#91;&#93;](components/customdatatype/README.md#itablemediaquery) | |
| headingStyles   | Define custom styles for header                                  | [Control](components/Control/README.md#properties) | |
| bodyStyles      | Define custom styles for body                                    | [Control](components/Control/README.md#properties) | |

## Events

| **onRenderEmptyTable** |                                                |
| --------------         | ---------------------------------------------- |
| Description            | Callback executed when render an empty table   |
| Signature              | onRenderEmptyTable(target: Table)              |

| **onCellClick** |                                                |
| --------------  | ---------------------------------------------- |
| Description     | Callback executed when click the cell          |
| Signature       | onCellClick()                                  |

| **onColumnSort** |                                                         |
| --------------   | ----------------------------------------------          |
| Description      | Callback executed when click the column sorting         |
| Signature        | onColumnSort(target: Table, key: string, value: string) |

## Function

| **filter**     |                                                |
| -------------- | ---------------------------------------------- |
| Description    | this function is used to filter data by custom condition |
| Signature      | filter(callback: (dataItem: any) => boolean) |

## Sample Code

### Properties
```typescript(samples/i-table_1.tsx)
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
    ];;
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
```

## Events
```typescript(samples/i-table_2.tsx)
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
```
