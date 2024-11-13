# i-tabs

## Class Inheritance
Inherited from [`Container`](components/container/README.md)

## Properties

| Name            | Description                                                     | Type        | Default |
| --------------- | -------------------------------------------------               | ----------  | ------- |
| activeTab       | read-only, to get actived tab                                   | [Tab](components/Tabs/iTab/README.md) | |
| activeTabIndex  | allow user to active `<i-tab>` in the `<i-tab>` by Tab's index  | number      | 0       |
| closable        | show close icon which allows user to close the active `<i-tab>` | boolean     | false   |
| draggable       | allow user to drag and drop the `<i-tab>` in the `<i-tab>`      | boolean     | false   |
| mode            | used to define the display mode of the `<i-tab>`                | [TabModeType](#tabmodetype) | `horizontal` |
| mediaQueries    | Define tailored style to different devices                      | [ITabMediaQuery&#91;&#93;](components/customdatatype/README.md#itabmediaquery) | |

### TabModeType
`horizontal` \| `vertical`

## Event

| **onChanged** |                                                             |
| ------------- | ----------------------------------------------------------- |
| Description   | Callback executed when active tab changed                   |
| Signature     | onChanged(target: Tabs, activeTab: Tab, oldActiveTab?: Tab) |

| **onCloseTab** |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when the tab closed          |
| Signature      | onCloseTab(target: Tabs, tab: Tab)             |

| **onBeforeClose** |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| Description       | Callback executed before the tab closed                         |
| Signature         | onBeforeClose(target: Tabs, activeTab: Tab, oldActiveTab?: Tab) |

## Function

| **add**        |                                                |
| -------------- | ---------------------------------------------- |
| Description    | to add tab                                     |
| Signature      | add(options?: ITab)                            |

| **delete**     |                                                |
| -------------- | ---------------------------------------------- |
| Description    | to remove a tab                                |
| Signature      | delete(tab: Tab)                               |