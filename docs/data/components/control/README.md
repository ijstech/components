# Control

## Description

Control is the base class for all components that are visible at run time.  Controls are visual components, meaning the user can see them and possibly interact with them at run time. All controls have properties, methods, and events that describe aspects of their appearance, such as the position of the control, the cursor or hint associated with the control, methods to paint or move the control, and events that respond to user actions.

Control has many protected properties and methods that are used or published by its descendants.

## Properties

| Name            | Description                                       | Type       | Default |
| --------------- | ------------------------------------------------- | ---------- | ------- |
| contextMenu |   | string \| Control \| null |   |
| dock |   | [DockStyle](components/customdatatype/README.md#dockstyle) |   |
| enabled |    | boolean |   |
| tooltip |    | ToolTip |   |
| id |    | string |   |
| visible |  | boolean   |   |
| stack |    | [IStack](components/customdatatype/README.md#istack) |   |
| parent |    |   |   |
| tag | For storing any custom properties defined by developers | any |   |
| linkTo |    | Control |   |
| zIndex |    | string \| number  |   |
| background |    | [IBackground](components/customdatatype/README.md#ibackground) |   |
| border |    | [IBorder](components/customdatatype/README.md#iborder)  |   |
| grid |    | [IGrid](components/customdatatype/README.md#igrid) |   |
| lineHeight |    | [LineHeightType](components/customdatatype/README.md#lineheighttype)  |   |
| left |   | number \| string |   |
| bottom |   | number \| string |   |
| right |   | number \| string |   |
| top |   | number \| string |   |
| height |   | number \| string |   |
| width |   | number \| string |   |
| maxWidth |   | number \| string |   |
| minWidth |   | number \| string |   | 
| maxHeight |   | number \| string |   |
| minHeight |   | number \| string |   | 
| margin |    | [ISpace](components/customdatatype/README.md#ispace) |   |
| padding |    | [ISpace](components/customdatatype/README.md#ispace) |   |
| position |   | [PositionType](components/customdatatype/README.md#positiontype) |   |
| overflow |   | [OverflowType](components/customdatatype/README.md#overflowtype) | [IOverflow](components/customdatatype/README.md#ioverflow) |   |
| opacity |   | string |   |
| display |   | [DisplayType](components/customdatatype/README.md#displaytype) |   |
| font |   | [IFont](components/customdatatype/README.md#ifont) |   |
| cursor |   | CursorType |   |
| boxShadow |   | string |   |

## Events

| onClick |   |
| ------- | ---------- |
| Description |  |
| Signature | onClick(target: Control, event: Event) => void |

| onDblClick |   |
| ------- | ---------- |
| Description |  |
| Signature | onDblClick(target: Control, event: Event) => void |

| onContextMenu |   |
| ------- | ---------- |
| Description |  |
| Signature | onContextMenu(target: Control, event: Event) => void |

| onMouseDown |   |
| ------- | ---------- |
| Description |  |
| Signature | onMouseDown(target: Control, event: PointerEvent|MouseEvent|TouchEvent) => void |

| onMouseMove |   |
| ------- | ---------- |
| Description |  |
| Signature | onMouseMove(target: Control, event: PointerEvent|MouseEvent|TouchEvent) => void |

| onMouseUp |   |
| ------- | ---------- |
| Description |  |
| Signature | onMouseUp(target: Control, event: PointerEvent|MouseEvent|TouchEvent) => void |
