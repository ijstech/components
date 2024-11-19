# Custom Data Types
- [Data Type](#datatype)
    - [DockStyle](#dockstyle)
    - [LineHeightType](#lineheighttype)
    - [DisplayType](#displaytype)
    - [SpaceProps](#spaceprops)
    - [PositionType](#positiontype)
    - [BorderStylesSideType](#borderstylessidetype)
    - [BorderStyleType](#borderstyletype)
    - [Target](#target)
    - [StackDirectionType](#stackdirectiontype)
    - [GridAlignment](#gridalignment)
    - [BorderSides](#bordersides)
    - [FontStyle](#fontstyle)
    - [WrapType](#wraptype)
    - [OverflowType](#overflowtype)
    - [IOverflow](#ioverflow)
    - [PlacementType](#placementtype)
    - [TriggerType](#triggertype)
    - [SortDirection](#sortdirection)
    - [TextAlign](#textalign)
    - [Interface](#interface)
    - [IBorder](#iborder)
    - [IBorderSideStyles](#ibordersidestyles)
    - [IBorderCornerStyles](#ibordercornerstyles)
    - [IStack](#istack)
    - [IFont](#ifont)
    - [IGap](#igap)
    - [IGrid](#igrid)
    - [ISpace](#ispace)
    - [CarouselItem](#carouselitem)
    - [ITreeNode](#itreenode)
    - [IComboItem](#icomboitem)
    - [IMenuItem](#imenuitem)
    - [Link](#link)
    - [Tooltip](#tooltip)
    - [Icon](#icon)
    - [Image](#image)
    - [Radio](#radio)
    - [File](#file)
    - [TableColumn](#tablecolumn)
    - [ITableExpandable](#itableexpandable)
    - [IMediaQuery](#imediaquery)
    - [IBackground](#ibackground)
    - [IHover](#ihover)
    - [CursorType](#cursortype)
    - [TextTransform](#texttransform)

## Data Type
### DockStyle
`none` \| `bottom` \| `center` \| `fill` \| `left` \| `right` \| `top`
### LineHeightType
string \| number \| `normal` \| `initial` \| `inherit`
### DisplayType
`inline-block` \| `block` \| `inline-flex` \| `flex` \| `inline` \| `initial` \| `inherit` \| `none`
### SpaceProps
`margin` \| `padding`
### PositionType
`static` \| `relative` \| `absolute` \| `fixed` \| `sticky` \| `inherit` \| `initial`
### BorderStylesSideType
`top` \| `right` \| `bottom` \| `left`
### BorderStyleType
`none` \| `hidden` \| `dotted` \| `dashed` \| `solid` \| `double` \| `groove` \| `ridge` \| `inset` \| `outset`
### Target
`self` \| `blank` \| `parent` \| `top`
### StackDirectionType
`horizontal` \| `vertical`';`
### GridAlignment
`stretch` \| `start` \| `end` \| `center`
### BorderSides
`top` \| `right` \| `bottom` \| `left`
### FontStyle
`normal` \| `italic` \| `oblique` \| `initial` \| `inherit`
### WrapType
`nowrap` \| `wrap` \| `wrap-reverse` \| `initial` \| `inherit`
### OverflowType
`visible` \| `hidden` \| `clip` \| `scroll` \| `auto` \| `initial` \| `inherit` \| `unset`
### PlacementType
`top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom`
### TriggerType
`hover` \| `click`
### SortDirection
`asc` \| `desc` \| `none`
### TextAlign
`left` \| `right` \| `center`
### TextTransform
`capitalize` \| `uppercase` \| `lowercase` \| `full-width` \| `full-size-kana` \| `inherit` \| `initial` \| `revert` \| `revert-layer` \| `unset`
### CursorType
`auto` \| `default` \| `none` \| `context-menu` \| `help` \| `pointer` \| `progress` \| `wait` \| `cell` \| `crosshair` \| `text` \| `vertical-text` \| `alias` \| `copy` \| `move` \| `no-drop` \| `not-allowed` \| `grab` \| `grabbing` \| `e-resize` \| `n-resize` \| `ne-resize` \| `nw-resize` \| `s-resize` \| `se-resize` \| `sw-resize` \| `w-resize` \| `ew-resize` \| `ns-resize` \| `nesw-resize` \| `nwse-resize` \| `col-resize` \| `row-resize` \| `all-scroll` \| `zoom-in` \| `zoom-out`

## Interface
### IBorder
| Name            | Description                                       | Type                                        | Default |
| --------------- | ------------------------------------------------- | ----------                                  | ------- |
| top             | Define the top style of the border                | [IBorderSideStyles](#ibordersidestyles)     |         |
| right           | Define the right style of the border              | [IBorderSideStyles](#ibordersidestyles)     |         |
| bottom          | Define the bottom style of the border             | [IBorderSideStyles](#ibordersidestyles)     |         |
| left            | Define the left style of the border               | [IBorderSideStyles](#ibordersidestyles)     |         |

### IBorderSideStyles
| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| width           | Define the width of the border side               | string \| number |         |
| style           | Define the style of the border side               | [BorderStyleType](#borderstyletype) | |
| color           | Define the color of the border side               | string           |         |

### IBorderCornerStyles
| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| radius          | Define the radius of the border corner            | string \| number |         |

### IStack
| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| basis           | Define the basis of the stack                     | string     |         |
| grow            | Define the grow of the stack                      | string     |         |
| shrink          | Define the shrink of the stack                    | string     |         |

### IFont
| Name      | Description                   | Type                            | Default |
| --------- | ----------------------------- | ------------------------------- | ------- |
| name      | Define the font family        | string                          |         |
| size      | Define the size of font       | string                          |         |
| color     | Define the color of font      | string                          |         |
| bold      | Define the font is bold       | boolean                         | false   |
| style     | Define the font style of font | [FontStyle](#fontstyle)         |         |
| transform | Define the text transform     | [TextTransform](#texttransform) |         |
| weight    | Define the font weight        | number \| string                |         |
| shadow    | Define the font shadow        | string                          |         |

### IGap
| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| row             | Define the gap of row                             | string \| number |         |
| column          | Define the gap of column                          | string \| number |         |

### IGrid
| Name                | Description                                       | Type       | Default |
| ---------------     | ------------------------------------------------- | ---------- | ------- |
| column              | Define the number of column                       | number     |         |
| columnSpan          | Define the span of column                         | number     |         |
| row                 | Define the number of row                          | number     |         |
| rowSpan             | Define the span of row                            | number     |         |
| horizontalAlignment | Define the horizontal alignment                   | [GridAlignment](#gridalignment) | |
| verticalAlignment   | Define the vertical alignment                     | number     |         |
| area                | Specified the area                                | string     |         |

### ISpace
| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| top             | Define the top of the space                       | string \| number |         |
| right           | Define the right of the space                     | string \| number |         |
| bottom          | Define the bottom of the space                    | string \| number |         |
| left            | Define the left of the space                      | string \| number |         |

### CarouselItem
| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| name            | Define the name of the carousel item              | string     |         |

### ITreeNode
| Name            | Description                                       | Type          | Default |
| --------------- | ------------------------------------------------- | ----------    | ------- |
| caption         | Define the name of TreeNode                       | string        |         |
| icon            | Define the icon on the left of the caption        | [Icon](#icon) |         |
| rightIcon       | Define the icon on the right of the caption       | [Icon](#icon) |         |
| collapsible     | Define the TreeNode collapsible                   | boolean       | true    |
| expanded        | Define the TreeNode expanded                      | boolean       | false   |
| isLazyLoad      | Define the TreeNode is LazyLoad                   | boolean       | false   |
| active          | Define the TreeNode active                        | boolean       |         |
| alwaysExpanded  | Define the TreeNode always expanded               | boolean       | false   |
| children        | Define the children TreeNode of TreeNode          | [ITreeNode](#itreenode) | |

### IComboItem
| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| value           | Define the header of the combo item               | string     |         |
| label           | Define the display of the combo item              | string     |         | 
```
comboItems = [
    {label: 'item 1', value: '1'}, 
    {label: 'item 2', value: '2'}
]
```

### IMenuItem
| Name            | Description                                       | Type          | Default |
| --------------- | ------------------------------------------------- | ----------    | ------- |
| title           | Define the header of the menu item                | string        |         |
| link            | Define the hyperlink of the menu item             | [Link](#link) |         |
| icon            | Define the icon of the menu item                  | [Icon](#icon) |         |
| items           | Define the menu items                             | [IMenuItem&#91;&#93;](#imenuitem) | |
| textAlign       | Define the text align of the menu item            | [TextAlign](#textalign) |         |
```
menuItems = [
    { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
    {
        title: 'Test 2',
        items: [
            { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } }
        ]
    }
]
```

### Link
| Name            | Description                                       | Type              | Default |
| --------------- | ------------------------------------------------- | ----------        | ------- |
| href            | Define the URL of the page the link goes to       | string            |         |
| target          | Define where to open the linked document          | [Target](#target) |         |
```
link={{ href: "/#/test2_1", target: "_blank"}}
```

### Tooltip
| Name            | Description                                       | Type                            | Default |
| --------------- | ------------------------------------------------- | ----------                      | ------- |
| content         | Define the content of the `tooltip`               | string                          |         |
| popperClass     | Define the css class to use in `tooltip`          | string                          |         |
| color           | Define the background color of the `tooltip`      | string                          |         |
| placement       | Define the display location of the `tooltip`      | [PlacementType](#placementtype) |         |
| trigger         | Define a trigger to show the `tooltip`            | [TriggerType](#triggertype)     |         |
| maxWidth        | Define the max width of the `tooltip`             | string                          |         |
| duration        | Define the duration of the `tooltip`              | number                          | 2000    |
```
tooltip={{
    content: 'Tooltip test', popperClass: '',
    color: 'red', placement: 'right', trigger: 'click', maxWidth: '200px'
}}
```

### Icon
| Name            | Description                                       | Type                 | Default |
| --------------- | ------------------------------------------------- | ----------           | ------- |
| name            | Define which icon to display, for reference: https://fontawesome.com/v5/search?s=solid | IconName | |
| image           | Define an image to display    | [Image](components/customdatatype/README.md#image) |         |
| fill            | Define the color of the icon                      | string \| color code |         |
| spin            | set the icon spin                                 | boolean              | false   |
```
icon={{ name: "address-card" }}
```

### Image
| Name        | Description                                                     | Type                            | Default |
| ----------- | --------------------------------------------------------------- | ------------------------------- | ------- |
| rotate      | Define a 2D rotation, the angle is specified in the parameter   | number                          |         |
| url         | Define the path of an image                                     | string                          |         |
| fallbackUrl | Define the default image path of an image for fail load url use | string                          |         |
| objectFit   | Define the object fit of an image                               | [ObjectFitType](../image/README.md#objectfittype) | contain |

```
image={{ url: "https://via.placeholder.com/50", width: 24, height: 24 }}
```

### Radio
| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| caption         | Define the name of item                           | string           |         |
| captionWidth    | Define the width of caption                       | number \| string | 40      |
| value           | Define the value of an item                       | string           |         |
```
radioItems = [
    { caption: 'Option 1', value: '1' },
    { caption: 'Option 2', value: '2' }
]
```

### Button
| Name      | Description                                 | Type          | Default |
| --------- | ------------------------------------------- | ------------- | ------- |
| caption   | Define the name of an button                | string        |         |
| icon      | To align the icon on the left of an button  | [Icon](#icon) |         |
| rightIcon | To align the icon on the right of an button | [Icon](#icon) |         |

### File
| Name               | Description                                            | Type             | Default |
| ---------------    | -------------------------------------------------      | ----------       | ------- |
| lastModified       | Get the last modified timestamp of the file            | number           |         |
| name               | Get the file name                                      | string           |         |
| webkitRelativePath | Get the relative path of the file within the hierarchy | string           |         |

### TableColumn
| Name            | Description                                                 | Type                    | Default |
| --------------- | -------------------------------------------------           | ----------              | ------- |
| title           | Define the column title in the table                        | string                  |         |
| fieldName       | Define the field name to mapping the table data             | string                  |         |
| key             | Define the key of the column                                | string \| number        |         |
| sortable        | Define the column can sorting in the table                  | boolean                 |         |
| sortOrder       | Define the sort order when the table onload                 | [SortDirection](#sortdirection) | |
| textAlign       | Define the column horizontal alignment of text in the table | [TextAlign](#textalign) |         |
| sorter          |                                                             | (a: any, b: any)        |         |
| onRenderCell    | Callback executed when render the cell                      | (target: TableColumn, columnData: any, rowData: any, rowIndex?: number, cell?: TableCell) | |

### ITableExpandable
```
interface ITableExpandable {
  onRenderExpandedRow: (record: any) => any;
  rowExpandable: boolean;
  onRenderExpandIcon?: (target: Table, expand: boolean) => Icon
}
```

### IMediaQuery
| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| minWidth        | Define the min width                              | string \| number |         |
| maxWidth        | Define the max width                              | string \| number |         |
| properties      | Define the addon properties                       | T                |         |

### IControlMediaQuery
| Name       | Description                            | Type                                                     | Default |
| ---------- | -------------------------------------- | -------------------------------------------------------- | ------- |
| display    | Define the display behavior in control | [DisplayType](#displaytype)                              |         |
| margin     |                                        | [ISpace](#ispace)                                        |         |
| padding    |                                        | [ISpace](#ispace)                                        |         |
| border     |                                        | [IBorder](#iborder)                                      |         |
| visible    |                                        | boolean                                                  |         |
| background |                                        | [IBackground](#ibackground)                              |         |
| grid       |                                        | [IGrid](#igrid)                                          |         |
| position   |                                        | [PositionType](#positiontype)                            |         |
| left       |                                        | number \| string                                         |         |
| bottom     |                                        | number \| string                                         |         |
| right      |                                        | number \| string                                         |         |
| top        |                                        | number \| string                                         |         |
| zIndex     |                                        | string \| number                                         |         |
| position   |                                        | [PositionType](#positiontype)                            |         |
| height     |                                        | number \| string                                         |         |
| width      |                                        | number \| string                                         |         |
| maxWidth   |                                        | number \| string                                         |         |
| minWidth   |                                        | number \| string                                         |         |
| maxHeight  |                                        | number \| string                                         |         |
| minHeight  |                                        | number \| string                                         |         |
| overflow   |                                        | [OverflowType](#overflowtype) \| [IOverflow](#ioverflow) |         |
| opacity    |                                        | number \| string                                         |         |
| font       |                                        | [IFont](#ifont)                                          |         |
| stack      |                                        | [IStack](#istack)                                        |         |

#### ITableMediaQuery
| Name            | Description                                       | Type                                  | Default |
| --------------- | ------------------------------------------------- | ----------                            | ------- |
| fieldNames      | Define the table field names                      | string[]                              |         |
| expandable      | Define the table expandable setting               | [ITableExpandable](#itableexpandable) |         |

#### IStackMediaQuery
| Name            | Description                                       | Type                                     | Default |
| --------------- | ------------------------------------------------- | ----------                               | ------- |
| direction       | Define the display direction of the stack         | [StackDirectionType](#stackdirectiontype)|         |
| gap             | Define the gap between the stack elements         | number \| string                         |         |
| justifyContent  | Define the justify content of the stack           | [StackJustifyContentType](../layout/stackLayout/y#stackjustifycontenttype) | |
| alignItems      | Define the align items of the stack               | [StackAlignItemsType](../layout/stackLayout/y#stackalignitemstype) | |
| alignSelf       | Define the align self of the stack                | [StackAlignSelfType](../layout/stackLayout/y#stackalignselftype) | |
| reverse         | Define whether revered stack

#### IGridLayoutMediaQuery
| Name            | Description                                                | Type       | Default |
| --------------- | -------------------------------------------------          | ---------- | ------- |
| templateColumns | Define how many columns and the column size in grid layout | string[]   |         |
| templateRows    | Define how many rows and the row size in grid layout       | string[]   |         |
| templateAreas   | Define the location of each grid in grid layout            | string[][] |         |
| display         | Define the display behavior in grid layout                 | [DisplayType](#displaytype) | |

### IModalMediaQuery
| Name           | Description                     | Type                                                                  | Default |
| -------------- | ------------------------------- | --------------------------------------------------------------------- | ------- |
| showBackdrop   | Define show backdrop in modal   | boolean                                                               |         |
| popupPlacement | Define popup placement in modal | [ModalPopupPlacementType](../modal/README.md#modalpopupplacementtype) |         |
| position       | Define a modal position type    | [ModalPositionType](../modal/README.md#modalpositiontype)             |         |

### ITabMediaQuery
| Name            | Description                                                | Type                          | Default |
| --------------- | -------------------------------------------------          | ----------                    | ------- |
| mode            | Define the `<i-tab>` display mode                          | [TabModeType](components/tab/README.md#tabmodetype) |         |

### ICarouselMediaQuery
| Name            | Description                                                | Type                          | Default |
| --------------- | -------------------------------------------------          | ----------                    | ------- |
| indicators      | Define indicators display in carousel                      | boolean                       |         |

### IOverflow
| Name            | Description                                                | Type                          | Default |
| --------------- | -------------------------------------------------          | ----------                    | ------- |
| x               | Define what to do with the left/right edges of the content | [OverflowType](#overflowtype) |         |
| y               | Define what to do with the top/bottom edges of the content | [OverflowType](#overflowtype) |         |

### IAnchor
| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| top             |                                                   | boolean    |         |
| right           |                                                   | boolean    |         |
| bottom          |                                                   | boolean    |         |
| left            |                                                   | boolean    |         |

### IBackground
| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| color           | Define the background color                       | string     |         |
| image           | Define the background image                       | string     |         |

### IHover

| Name            | Description                                      | Type   | Default |
| --------------- | ------------------------------------------------ | ------ | ------- |
| opacity         | Define the hovered opacity style of the panel    | number |         |
| backgroundColor | Define the hovered background style of the panel | string |         |
| fontColor       | Define the hovered color style of the panel      | string |         |