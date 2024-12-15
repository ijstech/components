import {Module, Control, Pagination, Label} from '@ijstech/components';
export default class IPaginationSample extends Module{
    private label1: Label;
    private label2: Label;
    private label3: Label;
    private currentPage: number = 2;
    private pageSize: number = 5;
    private totalPage: number = 10;
    private pageNumber = 0;
    private itemStart = 0;
    private itemEnd = this.pageSize;
  
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
}