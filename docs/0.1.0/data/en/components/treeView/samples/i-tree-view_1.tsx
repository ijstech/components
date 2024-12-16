import {Module, TreeView} from '@ijstech/components';

export default class ITreeviewExample extends Module{
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
    
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-tree-view id="treeView_1" width="250px" editable={false} alwaysExpanded={true}
                    actionButtons={[
                        {icon: {name: "plus", width: "16px", height: "16px", class: "inline-flex"}},
                        {icon: {name: "times", width: "16px", height: "16px", class: "inline-flex"}}
                      ]}
                ></i-tree-view>
            </i-panel>
        )
    }
}