import {Module, TreeView, Label, Button, TreeNode} from '@ijstech/components';

export default class ITreeviewExample extends Module {
    private treeData: any[] = [];
    private treeView_1: TreeView;
    private label1: Label;
    private label2: Label;
    private label3: Label;
    private label4: Label;
    private label5: Label;
    private label6: Label;
    private label7: Label;
    private nodeRenderCounter: number = 0;
    private lazyLoadCounter: number = 0;

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

    activechange(target: TreeView, prevNode?: TreeNode, event?: Event) {
        this.label1.caption = '# onActiveChange: Previous selected node: ' + ((prevNode) ? prevNode.caption.toString() : "");
    }
    change(target: TreeView, node: TreeNode, oldValue: string, newValue: string) {
        this.label2.caption = '# onChange: Node caption is changed, old value: ' + oldValue + ', new value: ' + newValue
    }
    renderNode(target: TreeView, node: TreeNode) {
        this.nodeRenderCounter += 1;
        this.label3.caption = '# onRenderNode: Number of node rendered: ' + this.nodeRenderCounter.toString();
    }
    enternode(target: TreeView, node: TreeNode) {
        this.label4.caption = '# onMouseEnterNode: Enter node: ' + node.caption.toString()
    }
    leftnode(terget: TreeView, node: TreeNode) {
      this.label5.caption = '# onMouseLeaveNode: Leave node: ' + node.caption.toString()
    }
    lazyload(target: TreeView, node: TreeNode) {
      this.lazyLoadCounter += 1;
      this.label6.caption = '# onLazyLoad: Number of lazy load: ' + this.lazyLoadCounter.toString();
    }
    actionButtonClick(target: TreeView, actionButton: Button, event: Event) {
      this.label7.caption = '# onActionButtonClick: This button clicked: ' + actionButton.caption.toString();
    }
    
    render() {
        return (
            <i-vstack height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}} gap="1rem">
                <i-label id='label1' caption={'# onActiveChange: Previous selected node: none'} padding={{left: 15}}></i-label>
                <i-label id='label2' caption={'# onChange: Node caption is changed, old value: --, new value: --'} padding={{left: 15}}></i-label>
                <i-label id='label3' caption={'# onRenderNode: Number of node rendering: 0'} padding={{left: 15}}></i-label>
                <i-label id='label4' caption={'# onMouseEnterNode: Enter node:'} padding={{left: 15}}></i-label>
                <i-label id='label5' caption={'# onMouseLeaveNode: Leave node:'} padding={{left: 15}}></i-label>
                <i-label id='label6' caption={'# onLazyLoad: Number of lazy load: 0'} padding={{left: 15}}></i-label>
                <i-label id='label7' caption={'# onActionButtonClick: This button clicked: '} padding={{left: 15}}></i-label>
                <i-panel>
                    <i-tree-view id="treeView_1" width="250px" editable={true}
                        onActiveChange={this.activechange} onChange={this.change} onRenderNode={this.renderNode}
                        onMouseEnterNode={this.enternode} onMouseLeaveNode={this.leftnode} onLazyLoad={this.lazyload} onActionButtonClick={this.actionButtonClick}
                        actionButtons={[
                            {caption: "plus", icon: {name: "plus", width: "16px", height: "16px", class: "inline-flex"}},
                            {caption: "times", icon: {name: "times", width: "16px", height: "16px", class: "inline-flex"}}
                        ]}
                    ></i-tree-view>
                </i-panel>
            </i-vstack>
        )
    }
}