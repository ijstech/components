# TreeView 

Use to present information in a tree structure. A way to display information with hierarchical relationship such as organization hierarchies, directories. You can also expand, collapse, and select a tree node within a Tree.  
There are two comnponents [`i-tree-view`] to create a TreeView.

### `i-tree-view`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                            | Type       | Default |
| --------------- | -------------------------------------------------      | ---------- | ------- |
| activeItem      | Define the a TreeNode as active                        | [TreeNode](components/customdatatype/README.md#itreenode) | |
| data            | Define the contents of the TreeNodes                   | [ITreeNode&#91;&#93;](components/customdatatype/README.md#itreenode) | |
| editable        | Allow the TreeView to be edited                        | boolean    | false   |
| actionButtons   | Define the action buttons associated with the TreeView | [Button&#91;&#93;](components/Button/README.md) | |
| alwaysExpanded  | Define the TreeNode always expanded                    | boolean    | false   |
| deleteNodeOnEmptyCaption | Define the TreeNode delete when caption is empty | boolean    | false   |

## Events

| **onActiveChange** |                                                                  |
| -------------- | ----------------------------------------------                       |
| Description    | Callback executed when the active TreeNode changed                   |
| Signature      | onActiveChange(target: TreeView, prevNode?: TreeNode, event?: Event) | 

| **onChange**   |                                                                                |
| -------------- | ----------------------------------------------                                 | 
| Description    | Callback executed when the TreeNode caption changed                            | 
| Signature      | onChange(target: TreeView, node: TreeNode, oldValue: string, newValue: string) |

| **onBeforeChange** |                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------ |
| Description        | Callback executed before the TreeNode caption changed                                |
| Signature          | onBeforeChange(target: TreeView, node: TreeNode, oldValue: string, newValue: string) |

| **onRenderNode** |                                              |
| -------------- | ---------------------------------------------- | 
| Description    | Callback executed when render the TreeNode     | 
| Signature      | onRenderNode(target: TreeView, node: TreeNode) | 

| **onMouseEnterNode** |                                             |
| -------------- | ----------------------------------------------    | 
| Description    | Callback executed when mouse enter the TreeNode   | 
| Signature      | onMouseEnterNode(target: TreeView, node: TreeNode)| 

| **onMouseLeaveNode** |                                              |
| -------------- | ----------------------------------------------     | 
| Description    | Callback executed when mouse leave the TreeNode    | 
| Signature      | onMouseLeaveNode(target: TreeView, node: TreeNode) |

| **onLazyLoad** |                                                |
| -------------- | ---------------------------------------------- | 
| Description    | Callback executed when                         | 
| Signature      | onLazyLoad(target: TreeView, node: TreeNode)   |  

| **onActionButtonClick** |                                                                  |
| -------------- | ----------------------------------------------                            | 
| Description    | Callback executed when the action button clicked                          | 
| Signature      | onActionButtonClick(target: TreeView, actionButton: Button, event: Event) | 

## Functions

| **add()**      |                                                      |
| -------------- | ----------------------------------------------       | 
| Description    | Add a TreeNode to TreeView                           | 
| Signature      | add(parentNode: TreeNode, caption: string): TreeNode | 

| **clear()**    |                                                |
| -------------- | ---------------------------------------------- | 
| Description    | To clear all TreeNodes                         | 
| Signature      | clear():void                                   | 

| **delete()**   |                                                |
| -------------- | ---------------------------------------------- | 
| Description    | To remove a TreeNode from TreeView             | 
| Signature      | delete(node: TreeNode)                         |

## Sample Codes

### Sample Code for Property
```typescript(samples/i-tree-view_1.tsx)
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
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-tree-view id="treeView_1" width="250px" editable={false}
                actionButtons={[
                    {icon: {name: "plus", width: "16px", height: "16px", class: "inline-flex"}},
                    {icon: {name: "times", width: "16px", height: "16px", class: "inline-flex"}}
                    ]}
            ></i-tree-view>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `width`, [`icon`](omponents/customdatatype/README.md#icon) are inherited from [`Control`](components/Control/README.md)_

### Sample Code for onChanged Event
```typescript(samples/i-tree-view_3.tsx)
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
```
**Tip**: _The properties `id`, `width`, [`icon`](omponents/customdatatype/README.md#icon) are inherited from [`Control`](components/Control/README.md)_

### Sample Code for Functions: add and delete
```typescript(samples/i-tree-view_2.tsx)
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
```
**Tip**: _The properties `id`, `width`, [`icon`](omponents/customdatatype/README.md#icon) are inherited from [`Control`](components/Control/README.md)_