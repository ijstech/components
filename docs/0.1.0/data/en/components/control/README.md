# Control

## Description

Control is the base class for all components that are visible at run time.  Controls are visual components, meaning the user can see them and possibly interact with them at run time. All controls have properties, methods, and events that describe aspects of their appearance, such as the position of the control, the cursor or hint associated with the control, methods to paint or move the control, and events that respond to user actions.

Control has many protected properties and methods that are used or published by its descendants.

## Properties

| Name          | Description                                             | Type                                                                                                                           | Default |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| contextMenu   |                                                         | string \| Control \| null                                                                                                      |         |
| dock          |                                                         | [DockStyle](../customDataType/README.md#dockstyle)                                                                     |         |
| enabled       |                                                         | boolean                                                                                                                        |         |
| tooltip       |                                                         | [Tooltip](../customDataType/README.md#tooltip)                                                                         |         |
| id            |                                                         | string                                                                                                                         |         |
| visible       |                                                         | boolean                                                                                                                        | true        |
| stack         |                                                         | [IStack](../customDataType/README.md#istack)                                                                           |         |
| parent        |                                                         | Control \| undefined                                                                                                           |         |
| tag           | For storing any custom properties defined by developers | any                                                                                                                            |         |
| linkTo        |                                                         | Control                                                                                                                        |         |
| zIndex        |                                                         | string \| number                                                                                                               |         |
| background    |                                                         | [IBackground](../customDataType/README.md#ibackground)                                                                 |         |
| border        |                                                         | [IBorder](../customDataType/README.md#iborder)                                                                         |         |
| grid          |                                                         | [IGrid](../customDataType/README.md#igrid)                                                                             |         |
| lineHeight    |                                                         | [LineHeightType](../customDataType/README.md#lineheighttype)                                                           |         |
| left          |                                                         | number \| string                                                                                                               |         |
| bottom        |                                                         | number \| string                                                                                                               |         |
| right         |                                                         | number \| string                                                                                                               |         |
| top           |                                                         | number \| string                                                                                                               |         |
| height        |                                                         | number \| string                                                                                                               |         |
| width         |                                                         | number \| string                                                                                                               |         |
| maxWidth      |                                                         | number \| string                                                                                                               |         |
| minWidth      |                                                         | number \| string                                                                                                               |         |
| maxHeight     |                                                         | number \| string                                                                                                               |         |
| minHeight     |                                                         | number \| string                                                                                                               |         |
| margin        |                                                         | [ISpace](../customDataType/README.md#ispace)                                                                           |         |
| padding       |                                                         | [ISpace](../customDataType/README.md#ispace)                                                                           |         |
| position      |                                                         | [PositionType](../customDataType/README.md#positiontype)                                                               |         |
| overflow      |                                                         | [OverflowType](../customDataType/README.md#overflowtype) \| [IOverflow](../customDataType/README.md#ioverflow) |         |
| opacity       |                                                         | number \| string                                                                                                               |         |
| display       |                                                         | [DisplayType](../customDataType/README.md#displaytype)                                                                 |         |
| font          |                                                         | [IFont](../customDataType/README.md#ifont)                                                                             |         |
| cursor        |                                                         | [CursorType](../customDataType/README.md#cursortype)                                                                   |         |
| boxShadow     |                                                         | string                                                                                                                         |         |
| designMode    |                                                         | boolean                                                                                                                        | false   |
| letterSpacing |                                                         | string \| number                                                                                                               |         |
| anchor        |                                                         | [IAnchor](../customDataType/README.md#ianchor)                                                                         |         |
| mediaQueries  | Define tailored style to different devices              | [IControlMediaQuery](../customDataType/README.md#icontrolmediaquery)[]                                                 |         |

## Events

| onClick     |                                                |
| ----------- | ---------------------------------------------- |
| Description |                                                |
| Signature   | onClick(target: Control, event: Event) => void |

| onDblClick  |                                                   |
| ----------- | ------------------------------------------------- |
| Description |                                                   |
| Signature   | onDblClick(target: Control, event: Event) => void |

| onContextMenu |                                                      |
| ------------- | ---------------------------------------------------- |
| Description   |                                                      |
| Signature     | onContextMenu(target: Control, event: Event) => void |

| onMouseDown |                                                                                    |
| ----------- | ---------------------------------------------------------------------------------- |
| Description |                                                                                    |
| Signature   | onMouseDown(target: Control, event: PointerEvent \| MouseEvent \| TouchEvent) => void |

| onMouseMove |                                                                                       |
| ----------- | ------------------------------------------------------------------------------------- |
| Description |                                                                                       |
| Signature   | onMouseMove(target: Control, event: PointerEvent \| MouseEvent \| TouchEvent) => void |

| onMouseUp   |                                                                                   |
| ----------- | --------------------------------------------------------------------------------- |
| Description |                                                                                   |
| Signature   | onMouseUp(target: Control, event: PointerEvent \| MouseEvent \| TouchEvent) => void |
