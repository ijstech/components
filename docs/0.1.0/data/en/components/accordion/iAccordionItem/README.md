# i-accordion-item

## Class Inheritance

Inherited from [`Control`](../../Control/README.md)

## Properties

| Name            | Description                                                                         | Type    | Default |
| --------------- | ----------------------------------------------------------------------------------- | ------- | ------- |
| name            | Define the name of an `<i-accordion-item>`                                          | string  |         |
| defaultExpanded | Define the default expanded of an `<i-accordion-item>`                              | boolean | false   |
| expanded        | Use to toggle the expanded of an `<i-accordion-item>` when click the accordion item | boolean | false   |
| showRemove      | Define whether to show the remove icon                                              | boolean | false   |

## Events

| **onSelected** |                                                    |
| -------------- | -------------------------------------------------- |
| Description    | Callback executed when selected the accordion item |
| Signature      | onSelected(target: AccordionItem)                  |

| **onRemoved** |                                                  |
| ------------- | ------------------------------------------------ |
| Description   | Callback executed when remove the accordion item |
| Signature     | onRemoved(target: AccordionItem)                 |

## Function

| **add**     |                       |
| ----------- | --------------------- |
| Description | to add accordion item |
| Signature   | add(item: Control)    |
