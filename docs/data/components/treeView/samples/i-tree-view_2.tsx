import {Module, TreeView} from '@ijstech/components';

export default class ITreeviewExample extends Module {
    private treeData: any[] = [];
    private treeView_1: TreeView;

    async init() {
        this.renderTreeData();
        super.init();
        this.treeView_1.data = this.treeData;
    }
    renderTreeData() {
        this.treeData = [
            {
                caption: 'Level one 1',
                children: [
                    {
                        caption: 'Level two 1-1', 
                        icon: {name: "sun", fill: "white"},
                        children: [
                            {caption: 'Level three 1-1-1'}, 
                            {caption: 'Level three 1-1-2'}
                        ]
                    }
                ]
            },
            {
                caption: 'Level one 2', 
                rightIcon: {name: "sun", fill: "white"},
                children: [{caption: 'Level two 2-1', active: true}, {caption: 'Level two 2-2'}]
            },
            {
                caption: 'Level one 3',
                isLazyLoad: true,
                children: [
                    {caption: 'Level two 3-1'},
                    {
                        caption: 'Level two 3-2',
                        children: [{caption: 'Level three 3-2-1'}, {caption: 'Level three 3-2-2'}]
                    }
                ]
            }
        ]
    }
    addNode() {
        this.treeView_1.add(this.treeView_1.activeItem!, 'New tree node');
    }
    deleteNode() {
        this.treeView_1.delete(this.treeView_1.activeItem!);
    }
    clearNode() {
        this.treeView_1.clear();
    }
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel>
                    <i-hstack width="100%" height="100%" margin={{bottom: 20}} gap="10px">
                        <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Select and add a tree node' onClick={this.addNode}></i-button>
                        <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Delete the selected tree node' onClick={this.deleteNode}></i-button>
                        <i-button width="auto" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Clear all tree node' onClick={this.clearNode}></i-button>
                    </i-hstack>
                </i-panel>
                <i-panel>
                    <i-tree-view id="treeView_1" width="250px" editable={false}
                        actionButtons={[
                            {icon: {name: "plus", width: "16px", height: "16px", class: "inline-flex"}},
                            {icon: {name: "times", width: "16px", height: "16px", class: "inline-flex"}}
                            ]}
                    ></i-tree-view>
                </i-panel>
            </i-panel>
        )
    }
}