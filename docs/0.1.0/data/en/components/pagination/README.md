# Pagination

Use for dividing a long list into several pages, only one page will be loaded and displayed at a time for shortening user's load/render time.

### `i-pagination`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                                 | Type       | Default |
| --------------- | -------------------------------------------------           | ---------- | ------- |
| totalPages      | Define the total page number of the `<i-pagination>`        | number     | 0       |
| currentPage     | Define the active page of the `<i-pagination>`              | number     | 1       |
| pageSize        | Define the record show on each page of the `<i-pagination>` | number     | 10      |

## Events

| **onPageChanged** |                                                           |
| --------------    | ----------------------------------------------            |
| Description       | Callback executed when change the page                    |
| Signature         | onPageChanged(target: Pagination, lastActivePage: number) |

## Sample Code

### Properties
```typescript(samples/i-pagination_2.tsx)
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
```

### Events
```typescript(samples/i-pagination_1.tsx)
onSelectIndex = (source: Control, value: number) => {
    this.pageNumber = (source as Pagination).currentPage;
    this.itemStart = (this.pageNumber - 1) * this.pageSize;
    this.itemEnd = this.itemStart + this.pageSize;

    this.label1.caption = "pageNumber: " + this.pageNumber.toString();
    this.label2.caption = "itemStart: " + this.itemStart.toString();
    this.label3.caption = "itemEnd: " + this.itemEnd.toString();
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-panel><i-label id='label1' caption={'pageNumber: ' + this.pageNumber.toString()}></i-label></i-panel>
            <i-panel><i-label id='label2' caption={'itemStart: ' + this.itemStart.toString()}></i-label></i-panel>
            <i-panel><i-label id='label3' caption={'itemEnd: ' + this.itemEnd.toString()}></i-label></i-panel>
            <i-pagination id="listPagination" width="auto" totalPages={this.totalPage} currentPage={this.currentPage} pageSize={this.pageSize} 
                onPageChanged={this.onSelectIndex.bind(this)} ></i-pagination>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `width` are inherited from [`Control`](components/Control/README.md)_