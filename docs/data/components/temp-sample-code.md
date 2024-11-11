## i-input Sample Code (Property)
```typescript(samples/i-input_1.tsx)
    render() {
        return <i-panel>
          <i-input
            caption={'Please input something here'}
            captionWidth={175}
            inputType={'textarea'}
            placeholder={'here'}
            rows={1}
            paddingLeft={20}
            clearable={false}
            paddingTop={20}
          ></i-input>
        </i-panel>
    }
```

## i-input Sample Code (Event)
```typescript(samples/i-inputs_2.tsx)
    clearcallback(){
      this.clearCounter += 1;
      this.label1.caption = 'Clear counter: ' + this.clearCounter.toString();
    }
    change(){
      this.changeCounter += 1;
      this.label2.caption = 'Change counter: ' + this.changeCounter.toString();
    }
    keydown(){
      this.keydownCounter += 1;
      this.label3.caption = 'Key down counter: ' + this.keydownCounter.toString();
    }
    keyup(){
      this.keyupCounter += 1;
      this.label4.caption = 'Key up counter: ' + this.keyupCounter.toString();
    }
    mouseup(){
      this.mouseupCounter += 1;
      this.label5.caption = 'Mouse up counter: ' + this.mouseupCounter.toString();
    }
    _onblur(){
      this.onblurCounter += 1;
      this.label6.caption = 'Blur counter: ' + this.onblurCounter.toString();
    }
    onfoucus(){
      this.focusCounter += 1;
      this.label7.caption = 'Focus counter: ' + this.focusCounter.toString();
    }

    render() {
      return <i-panel>
        <i-input
          caption={'please input something here'}
          captionWidth={175}
          inputType={'password'}
          paddingLeft={20}
          clearable={true}
          paddingTop={20}
          clearCallback={this.clearcallback}
          onChanged={this.change}
          onKeyDown={this.keydown}
          onKeyUp={this.keyup}
          onMouseUp={this.mouseup}
          onBlur={this._onblur}
          onFocus={this.onfoucus}
        ></i-input>
        <i-panel><i-label id='label1' caption='Clear counter: 0' paddingLeft={20}></i-label></i-panel>
        <i-panel><i-label id='label2' caption='Change counter: 0' paddingLeft={20}></i-label></i-panel>
        <i-panel><i-label id='label3' caption='Key down counter: 0' paddingLeft={20}></i-label></i-panel>
        <i-panel><i-label id='label4' caption='Key up counter: 0' paddingLeft={20}></i-label></i-panel>
        <i-panel><i-label id='label5' caption='Mouse up counter: 0' paddingLeft={20}></i-label></i-panel>
        <i-panel><i-label id='label6' caption='Blur counter: 0' paddingLeft={20}></i-label></i-panel>
        <i-panel><i-label id='label7' caption='Focus counter: 0' paddingLeft={20}></i-label></i-panel>
      </i-panel>
    }
```

## i-checkbox Sample Code (Property)
```typescript(samples/i-checkbox_2.tsx)
render() {
    return <i-panel>
        <i-checkbox
            caption = "Check me!" 
            captionWidth = {90}
            paddingLeft = {20}
        ></i-checkbox>
    </i-panel>
}
```

## i-checkbox Sample Code (Event: onChanged)
```typescript(samples/i-checkbox_1.tsx)
btnClick(control: any) {
    this.label1.caption = 'checked = ' + control.checked.toString();
}
render() {
    return <i-panel>
        <i-checkbox
            id = 'checkbox1'
            caption = "Check me!" 
            captionWidth = {90}
            paddingLeft = {20}
            onChanged = {this.btnClick}
        ></i-checkbox>
        <i-panel>
            <i-label id='label1' caption={'checked = false'} paddingLeft = {20}></i-label>
        </i-panel>
    </i-panel>
}
```

## i-tabs Sample Code on Properties "closable", "draggable", and "mode"
```typescript(samples/i-tabs_1.tsx)
render() {
    return <i-tabs 
            closable = {true}
            draggable = {true}
            mode = {'horizontal'}
        >
        <i-tab caption='Tab1' icon={{name: 'download'}} ></i-tab>
        <i-tab caption='Tab2' icon={{name: 'ad'}}></i-tab>
        <i-tab caption='Tab3' icon={{name: 'adjust'}}></i-tab>
    </i-tabs>
}
```

## i-tabs Sample Code (Event: onChanged)
```typescript(samples/i-tabs_3.tsx)
changeTab() {
    this.label1.caption='The tab is changed!'
}
render() {
    return <i-panel>
        <i-label id='label1' caption='Try to select another tab'></i-label>
        <i-tabs 
            closable = {true}
            draggable = {true}
            mode = {'horizontal'}
            onChanged = {this.changeTab}
        >
            <i-tab caption='Tab1'></i-tab>
            <i-tab caption='Tab2'></i-tab>
            <i-tab caption='Tab3'></i-tab>
        </i-tabs>
    </i-panel>
}
```

## i-tabs Sample Code (Function: add, delete)
```typescript(samples/i-tabs_2.tsx)
addTab() {
  this.tabs1.add({caption: 'new tab'})
}
deleteTab() {
  this.tabs1.delete(this.tabs1.activeTab)
}
render() {
    return <i-panel id='panel1'>
        <i-button caption='Click here to add a new tab' onClick={this.addTab} marginLeft= {10} marginRight= {10}></i-button>
        <i-button caption='Click here to delete the current tab' onClick={this.deleteTab} marginRight= {10}></i-button>
        <i-tabs 
            id='tabs1'
            closable = {true}
            draggable = {true}
            mode = {'horizontal'}
        >
            <i-tab caption='Tab1' ></i-tab>
            <i-tab caption='Tab2' ></i-tab>
            <i-tab caption='Tab3' ></i-tab>
        </i-tabs>
    </i-panel>
}
```

## i-button Sample Code (Property)
```typescript(samples/i-button.tsx)
btnClick(action: string) {
    if (action == "Add")
        this.counter++;
    else
        this.counter--;

    this.label.caption = 'Counter: ' + this.counter.toString();
}
render(){
    return <i-panel>
        <i-label top={10} left={10}  id='label' caption={'Counter: 0'}></i-label>
        <i-button top={50} left={10} paddingLeft={5} paddingRight={5} paddingTop={5} paddingBottom={5} 
            caption="Click me!" icon={{ name: "angle-up"}} onClick={() => this.btnClick("Add")} 
        ></i-button>
        <i-button top={90} left={10} paddingLeft={5} paddingRight={5} paddingTop={5} paddingBottom={5} 
            caption="Click me too!" rightIcon={{ name: "angle-down" }} onClick={() => this.btnClick("Reduce")} 
        ></i-button>
    </i-panel>
}
```

## i-tree-view Sample Code (Property)
```typescript(samples/i-tree-view_1.tsx)
    const treeData: any[] = [
    {
        caption: 'Level one 1',
        children: [
        {
            caption: 'Level two 1-1',
            //isLazyLoad: true,
            children: [
            {
                caption: 'Level three 1-1-1',
            },
            {
                caption: 'Level three 1-1-2',
            },
            ],
        },
        ],
    },
    {
        caption: 'Level one 2',
        children: [
        {
            caption: 'Level two 2-1',
            active: true
        },
        {
            caption: 'Level two 2-2',
        },
        ]
    },
    {
        caption: 'Level one 3',
        children: [
        {
            caption: 'Level two 3-1',
        },
        {
            caption: 'Level two 3-2',
            children: [
            {
                caption: 'Level three 3-2-1',
            },
            {
                caption: 'Level three 3-2-2',
            },
            ],
        }
        ]
    }
    ]

    render() {
        return <i-tree-view data={treeData} editable={false}></i-tree-view>
    }
```

## i-tree-view Sample Code (Function: add and delete)
```typescript(samples/i-tree-view_2.tsx)
    const treeData: any[] = [
    {
        caption: 'Level one 1',
        children: [
        {
            caption: 'Level two 1-1',
            //isLazyLoad: true,
            children: [
            {
                caption: 'Level three 1-1-1',
            },
            {
                caption: 'Level three 1-1-2',
            },
            ],
        },
        ],
    },
    {
        caption: 'Level one 2',
        children: [
        {
            caption: 'Level two 2-1',
            active: true
        },
        {
            caption: 'Level two 2-2',
        },
        ]
    },
    {
        caption: 'Level one 3',
        children: [
        {
            caption: 'Level two 3-1',
        },
        {
            caption: 'Level two 3-2',
            children: [
            {
                caption: 'Level three 3-2-1',
            },
            {
                caption: 'Level three 3-2-2',
            },
            ],
        }
        ]
    }
    ]

    addNode() {
      this.treeView1.add(this.treeView1.activeItem!, 'New tree node')
    }
    deleteNode() {
      this.treeView1.delete(this.treeView1.activeItem!)
    }

    render() {
        return <i-panel>
            <i-button caption='Select and add a tree node' onClick={this.addNode} marginLeft= {10}marginRight= {10}></i-button>
            <i-button caption='Delete the selected tree node' onClick={this.deleteNode} marginLeft= {10} marginRight= {10}></i-button>
            <i-tree-view id='treeView1' data={treeData} editable={false}></i-tree-view>
        </i-panel>
    }

```

## i-tree-view Sample Code (Event: onMouseEnterNode, onMouseLeaveNode, onActiveChange, onRenderNode, onLazyLoad)
```typescript(samples/i-tree-view_3.tsx)
    const treeData: any[] = [
    {
        caption: 'Level one 1',
        children: [
        {
            caption: 'Level two 1-1',
            children: [
            {
                caption: 'Level three 1-1-1',
            },
            {
                caption: 'Level three 1-1-2',
            },
            ],
        },
        ],
    },
    {
        caption: 'Level one 2',
        children: [
        {
            caption: 'Level two 2-1',
            active: true
        },
        {
            caption: 'Level two 2-2',
        },
        ]
    },
    {
        caption: 'Level one 3',
        isLazyLoad: true,
        children: [
        {
            caption: 'Level two 3-1',
        },
        {
            caption: 'Level two 3-2',
            children: [
            {
                caption: 'Level three 3-2-1',
            },
            {
                caption: 'Level three 3-2-2',
            },
            ],
        }
        ]
    }
    ]

        enternode(terget: TreeView, node: TreeNode) {
        this.enteredNode = node;
        this.label1.caption = 'Enter node: ' + this.enteredNode.caption.toString()
      }
      leftnode(terget: TreeView, node: TreeNode) {
        this.leftNode = node;
        this.label2.caption = 'Leave node: ' + this.leftNode.caption.toString()
      }
      activechange(target: TreeView, prevNode: TreeNode) {
        this.label3.caption = 'Previous selected node: ' + prevNode.caption.toString()
      }
      change(target: TreeView, node: TreeNode, oldValue: string, newValue: string) {
        this.label4.caption = 'Node caption is changed, old value: ' + oldValue + ', new value: ' + newValue
      }
      rendernode(target: TreeView, node: TreeNode) {
        this.nodeRenderCounter += 1;
        this.label5.caption = 'Number of node rendered: ' + this.nodeRenderCounter.toString();
      }
      lazyload(target: TreeView) {
        this.lazyLoadCounter += 1;
        this.label6.caption = 'Number of lazy load: ' + this.lazyLoadCounter.toString();
      }
      render() {
          return <i-panel>
                      <i-tree-view id='treeView1' data={treeData} editable={true} paddingLeft={15}
                        onMouseEnterNode={this.enternode} 
                        onMouseLeaveNode={this.leftnode} 
                        onActiveChange={this.activechange} 
                        onRenderNode={this.rendernode}
                        onLazyLoad={this.lazyload}>
                      </i-tree-view>
                      <i-label caption={'*****************************************'} paddingLeft={15}></i-label>
                      <i-panel><i-label id='label1' caption={'Enter node:'} paddingLeft={15}></i-label></i-panel>
                      <i-panel><i-label id='label2' caption={'Leave node:'} paddingLeft={15}></i-label></i-panel>
                      <i-panel><i-label id='label3' caption={'Previous selected node: none'} paddingLeft={15}></i-label></i-panel>
                      <i-panel><i-label id='label5' caption={'Number of node rendering: 0'} paddingLeft={15}></i-label></i-panel>
                      <i-panel><i-label id='label6' caption={'Number of lazy load: 0'} paddingLeft={15}></i-label></i-panel>
                  </i-panel>
      }
```

## i-tree-view Sample Code (Event: onContentMenu)
```typescript(samples/i-tree-view_4.tsx)
const treeData: any[] = [
    {
        caption: 'Level one 1',
        children: [
        {
            caption: 'Level two 1-1',
            children: [
            {
                caption: 'Level three 1-1-1',
            },
            {
                caption: 'Level three 1-1-2',
            },
            ],
        },
        ],
    },
    {
        caption: 'Level one 2',
        children: [
        {
            caption: 'Level two 2-1',
            active: true
        },
        {
            caption: 'Level two 2-2',
        },
        ]
    },
    {
        caption: 'Level one 3',
        isLazyLoad: true,
        children: [
        {
            caption: 'Level two 3-1',
        },
        {
            caption: 'Level two 3-2',
            children: [
            {
                caption: 'Level three 3-2-1',
            },
            {
                caption: 'Level three 3-2-2',
            },
            ],
        }
        ]
    }
    ]

    contextmenu() {
        this.contentCounter += 1;
        this.label7.caption = 'Content counter: (triggered when right click a tree node, level one +1, level two +2...): ' + this.contentCounter.toString();
    }

    render() {
        return <i-panel><i-tree-view id='treeView1' data={treeData} editable={true} paddingLeft={15}
            onContextMenu={this.contextmenu}>
            </i-tree-view>
            <i-label caption={'*****************************************'} paddingLeft={15}></i-label>
            <i-panel><i-label id='label7' caption={'Content counter: (triggered when right click a tree node, level one +1, level two +2...): 0'} paddingLeft={15}></i-label></i-panel>
        </i-panel>
    }
}
```

## i-tree-view Sample Code (Event: onChange)
```typescript(samples/i-tree-view_5.tsx)
const treeData: any[] = [
    {
        caption: 'Level one 1',
        children: [
        {
            caption: 'Level two 1-1',
            children: [
            {
                caption: 'Level three 1-1-1',
            },
            {
                caption: 'Level three 1-1-2',
            },
            ],
        },
        ],
    },
    {
        caption: 'Level one 2',
        children: [
        {
            caption: 'Level two 2-1',
            active: true
        },
        {
            caption: 'Level two 2-2',
        },
        ]
    },
    {
        caption: 'Level one 3',
        isLazyLoad: true,
        children: [
        {
            caption: 'Level two 3-1',
        },
        {
            caption: 'Level two 3-2',
            children: [
            {
                caption: 'Level three 3-2-1',
            },
            {
                caption: 'Level three 3-2-2',
            },
            ],
        }
        ]
    }
    ]

    change(oldValue: string, newValue: string) {
        this.label4.caption = 'Node caption is changed, old value: ' + oldValue + ', new value: ' + newValue
    }

    render() {
        return <i-panel><i-tree-view id='treeView1' data={treeData} editable={true} paddingLeft={15}
                    onChange={this.change}>
                </i-tree-view>
                <i-panel><i-label id='label4' caption={'This will be triggered when node caption change'} paddingLeft={15}></i-label></i-panel>
            </i-panel>
    }
}
```

## i-combo-box Sample Code (Property)
```typescript(samples/i-combo-box_1.tsx)
render() {
    return <i-panel>
        <i-combo-box
            selectedItem={{label: 'item 1', value: '1'}}
            items={[{label: 'item 1', value: '1'}, {label: 'item 2', value: '2'}, {label: 'item 3', value: '3'}, {label: 'item 4', value: '4'}]}
            icon={{ name: "address-card" }}
            placeholder="Selection"
            paddingTop={10}
            paddingLeft={10}
        ></i-combo-box>
    </i-panel>
}
```

## i-combo-box Sample Code (Event: onChanged)
```typescript(samples/i-combo-box_2.tsx)
select(){
    this.selectCounter += 1;
    this.label1.caption = 'Selection counter: ' + this.selectCounter.toString();
}
render() {
    return <i-panel>
        <i-label id='label1' caption='Selection counter: 0' paddingLeft={10}></i-label>
        <i-combo-box
            selectedItem={{label: 'item 1', value: '1'}}
            items={[{label: 'item 1', value: '1'}, {label: 'item 2', value: '2'}, {label: 'item 3', value: '3'}, {label: 'item 4', value: '4'}]}
            icon={{ name: "address-card" }}
            onChanged={this.select}
            paddingTop={10}
            paddingLeft={10}
        ></i-combo-box>
    </i-panel>
}
```

## i-table Sample Code (Property)
```typescript(components\i-table\samples\i-table_1.tsx)
    render() {
      let data: any[] = [{name: 'Alex', age: 24, gender: 'M'},
                        {name: 'Ben', age: 45, gender: 'M'},
                        {name: 'Chloe', age: 28, gender: 'F'}];
      return <i-panel>
            <i-table heading={true} dataSource={data}
              columns = {[{title: 'Name', dataIndex: 'name', key: 'name', width: '30%', sortable: true}, 
                          {title: 'Age', dataIndex: 'age', key: 'age', width: '30%', sortable: true},
                          {title: 'Gender', dataIndex: 'gender', key: 'gender', width: '30%', sortable: true}]}
              expandable={{
                expandedRowRender: () => <i-panel><i-label caption="This colume is expanded" paddingLeft={70}/></i-panel>,
                rowExpandable: true,
                showExpandColumn: true,
                expandIcon: (expanded: boolean) => {
                  return expanded ? 
                    `<i-icon name="minus" width=${12} height=${12} fill="#fff"></i-icon>` : 
                    `<i-icon name="plus" width=${12} height=${12} fill="#fff"></i-icon>`
                }
              }}
            ></i-table>
      </i-panel>
    }
```

## i-table Sample Code (Event: onCellClick)
```typescript(samples/i-table_2.tsx)
    cellclick(){
      this.cellclickCounter += 1;
      this.label1.caption = 'Number of cell clicking: ' + this.cellclickCounter.toString();
    }

    render() {
      let data: any[] = [{name: 'Alex', age: 24, gender: 'M'},
                        {name: 'Ben', age: 45, gender: 'M'},
                        {name: 'Chloe', age: 28, gender: 'F'}];
      return <i-panel>
            <i-panel><i-label id='label1' caption={'Number of cell clicking: 0'}></i-label></i-panel>
            <i-table heading={true} dataSource={data}
              columns = {[{title: 'Name', dataIndex: 'name', key: 'name', width: '30%', sortable: true}, 
                          {title: 'Age', dataIndex: 'age', key: 'age', width: '30%', sortable: true},
                          {title: 'Gender', dataIndex: 'gender', key: 'gender', width: '30%', sortable: true}]}
              expandable={{
                expandedRowRender: () => <i-panel><i-label caption="This colume is expanded" paddingLeft={70}/></i-panel>,
                rowExpandable: true,
                showExpandColumn: true,
                expandIcon: (expanded: boolean) => {
                  return expanded ? 
                    `<i-icon name="minus" width=${12} height=${12} fill="#fff"></i-icon>` : 
                    `<i-icon name="plus" width=${12} height=${12} fill="#fff"></i-icon>`
                }
              }}
              onCellClick={this.cellclick}
            ></i-table>
      </i-panel>
    }
```

## i-pagination Sample Code (Property)
```typescript(samples/i-pagination_2.tsx)
    render(){
      return <i-panel>
          <i-pagination
            totalPage={5}
            paddingLeft={20}
            paddingTop={20}
      ></i-pagination>
      </i-panel>
    }
```

## i-pagination Sample Code (Event: onChanged)
```typescript(samples/i-pagination_1.tsx)
    change(control: any){
        this.label1.caption = 'The current page is page ' + control.currentPage.toString();
    }
    render(){
      return <i-panel>
          <i-panel><i-label id='label1' caption={'The current page is page 1'} paddingLeft={20}></i-label></i-panel>
          <i-pagination
            totalPage={5}
            onChanged={this.change}
            paddingLeft={20}
            paddingTop={20}
      ></i-pagination>
      </i-panel>
    }
```

## i-bar-chart Sample Code (Property)
```typescript(samples/i-bar-chart_1.tsx)
    var data = {
    title: {
        text: 'Bar Chart demo'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
    },
    grid: {
        top: 80,
        bottom: 30
    },
    yAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
        lineStyle: {
            type: 'dashed'
        }
        }
    },
    xAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven'
        ]
    },
    series: [
        {
        type: 'bar',
        stack: 'Total',
        label: {
            show: true,
            formatter: '{b}'
        },
        data: [
            { value: -0.3 },
            { value: -0.14 },
            { value: 0.3 },
            { value: 0.44 },
            { value: -0.23 },
            { value: 0.1 },
            { value: -0.17 },
        ]
        }
    ]
    };

    var dataProp = JSON.stringify(data);

    render() {
        return <i-bar-chart data={dataProp} width={1000} height={500}></i-bar-chart>;
    }
```

## i-bar-chart Sample Code (Function: resize)
```typescript(samples/i-bar-chart_2.tsx)
    var data = {
    title: {
        text: 'Bar Chart demo'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
    },
    grid: {
        top: 80,
        bottom: 30
    },
    yAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
        lineStyle: {
            type: 'dashed'
        }
        }
    },
    xAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven'
        ]
    },
    series: [
        {
        type: 'bar',
        stack: 'Total',
        label: {
            show: true,
            formatter: '{b}'
        },
        data: [
            { value: -0.3 },
            { value: -0.14 },
            { value: 0.3 },
            { value: 0.44 },
            { value: -0.23 },
            { value: 0.1 },
            { value: -0.17 },
        ]
        }
    ]
    };

    var dataProp = JSON.stringify(data);

    change() {
      this.barchart1.resize();
    }

    render() {
      return <i-panel>
        <i-panel><i-button caption='Click here to resize' onClick={this.change} paddingLeft={5} paddingRight={5}></i-button></i-panel>
        <i-bar-chart id='barchart1' data={dataProp} width={1000} height={500}></i-bar-chart></i-panel>
    }
```

## i-bar-stack-chart Sample Code (Property)
```typescript(samples/i-bar-stack-chart.tsx)
    var data = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
            {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
            name: 'Mail Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
            name: 'Affiliate Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
            name: 'Video Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
            name: 'Search Engine',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
            }
        ]
    };

    var dataProp = JSON.stringify(data);

    render() {
      return <i-bar-stack-chart id="bar-stack-chart-1" data={dataProp} top={10} width={600} height={600}></i-bar-stack-chart>;
    }
```

## i-line-chart Sample Code (Property)
```typescript(samples/i-line-chart.tsx)
    render(){
        var data = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [22, 150, 175, 67, 52, 56, 220],
                    type: 'line'
                }
            ]
        };
        var dataProp = JSON.stringify(data);
        return <i-line-chart id="LineChart1" data={dataProp} top={40} width={1000} height={600}><i-line-chart>;
    }
```

## i-pie-chart Sample Code (Property)
```typescript(samples/i-pie-chart.tsx)
    render(){
      var data = {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
      };
      var dataProp = JSON.stringify(data);
      return <i-pie-chart id="pieChart1" data={dataProp} top={10} width={1000} height={600}></i-pie-chart>;
    }
```

## i-scatter-chart Sample Code (Property)
```typescript(samples/i-scatter-chart.tsx)
    render(){
        var data = {
            xAxis: {},
            yAxis: {},
            series: [
                {
                symbolSize: 20,
                data: [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.2],
                    [11.5, 7.2],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68]
                ],
                type: 'scatter'
                }
            ]
        };
        var dataProp = JSON.stringify(data);
        return <i-scatter-chart id="sactterChart1" data={dataProp} top={20} width={1000} height={600}></i-scatter-chart>;
    }
```

## i-scatter-line-chart Sample Code (Property)
```typescript(samples/i-scatter-line-chart.tsx)
    render(){
      var data = [
          [96.24, 11.35],
          [33.09, 85.11],
          [57.6, 36.61],
          [36.77, 27.26],
          [20.1, 6.72],
          [45.53, 36.37],
          [110.07, 80.13],
          [72.05, 20.88],
          [39.82, 37.15],
          [48.05, 70.5],
          [0.85, 2.57],
          [51.66, 63.7],
          [61.07, 127.13],
          [64.54, 33.59],
          [35.5, 25.01],
          [226.55, 664.02],
          [188.6, 175.31],
          [81.31, 108.68]
        ];
      var  option = {
          dataset: [
            {
              source: data
            },
            {
              transform: {
                type: 'ecStat:regression',
                config: { method: 'polynomial', order: 3 }
              }
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            splitNumber: 20
          },
          yAxis: {
            min: -40,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          series: [
            {
              name: 'scatter',
              type: 'scatter'
            },
            {
              name: 'line',
              type: 'line',
              smooth: true,
              datasetIndex: 1,
              symbolSize: 0.1,
              encode: { label: 2, tooltip: 1 },
              data: [[20, 60], [32, 300], [91, 50], [105,300], [130, 250], [180,500], [220, 600]],
            }
          ]
        };
      var dataProp = JSON.stringify(option);
      return <i-scatter-line-chart id="sactterLineChart1" data={dataProp} top={10} width={1000} height={600}></i-scatter-line-chart>;
  }
```

## i-code-editor (Property)
```typescript(samples/i-code-editor.tsx)
    render(){
        return <i-panel dock="fill">
                <i-code-editor language="typescript" width="100%" height="100%"></i-code-editor>
                </i-panel>
    }
```

## i-panel (Property)
```typescript(samples/i-panel.tsx)
  render() {
    return <i-panel color='yellow' width='300px' height='200px' padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <i-label caption='This yellow area is the i-panel'></i-label>
            </i-panel>
  }
```

## i-card-layout (Property)
```typescript(samples/i-card-layout.tsx)
  render() {
    return <i-panel>
        <i-card-layout cardMinWidth="100px" gap={{ column: '2rem', row: '4.5rem' }} padding={{ top: '10', bottom: '10', left: '10', right: '10' }}>
          <i-panel color="green">
            <i-label caption='card 1'></i-label>
          </i-panel>
          <i-panel color="orange">
            <i-label caption='card 2'></i-label>
          </i-panel>
          <i-panel color="green">
            <i-label caption='card 3'></i-label>
          </i-panel>
          <i-panel color="orange">
            <i-label caption='card 4'></i-label>
          </i-panel>
          <i-panel color="green">
            <i-label caption='card 5'></i-label>
          </i-panel>
          <i-panel color="orange">
            <i-label caption='card 6'></i-label>
          </i-panel>
          <i-panel color="green">
            <i-label caption='card 7'></i-label>
          </i-panel>
          <i-panel color="orange">
            <i-label caption='card 8'></i-label>
          </i-panel>
        </i-card-layout>
      </i-panel>
  }
```

## i-vstack (Property)
```typescript(samples/i-vstack.tsx)
  render() {
    return <i-vstack horizontalAlignment='start' verticalAlignment='start' gap={5}>
      <i-label caption='label 1'></i-label>
      <i-label caption='label 2'></i-label>
      <i-label caption='label 3'></i-label>
      <i-label caption='label 4'></i-label>
      <i-label caption='label 5'></i-label>
      <i-label caption='label 6'></i-label>
    </i-vstack>
  }
```

## i-hstack (Property)
```typescript(samples/i-hstack.tsx)
  render() {
    return <i-hstack horizontalAlignment='start' verticalAlignment='start' gap={5}>
      <i-label caption='label 1'></i-label>
      <i-label caption='label 2'></i-label>
      <i-label caption='label 3'></i-label>
      <i-label caption='label 4'></i-label>
      <i-label caption='label 5'></i-label>
      <i-label caption='label 6'></i-label>
    </i-hstack>
  }
```

##