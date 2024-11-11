# i-accordion

## Class Inheritance

Inherited from [`Control`](components/Control/README.md)

## Properties

| Name    | Description                            | Type                                                                      | Default |
| ------- | -------------------------------------- | ------------------------------------------------------------------------- | ------- |
| items   | Define the items of an `<i-accordion>` | [IAccordionItem&#91;&#93;](components/Accordion/iAccordionItem/README.md) |         |
| isFlush | Define the accordion to be flush       | boolean                                                                   | false   |

## Events

| **onCustomItemRemoved** |                                                  |
| ----------------------- | ------------------------------------------------ |
| Description             | Callback executed when remove the accordion item |
| Signature               | onCustomItemRemoved(target: Control)             |

## Functions

| **add**     |                               |
| ----------- | ----------------------------- |
| Description | to add accordion item         |
| Signature   | add(options?: IAccordionItem) |

| **delete**  |                             |
| ----------- | --------------------------- |
| Description | to remove a accordion item  |
| Signature   | delete(item: AccordionItem) |

| **updateItemName** |                                          |
| ------------------ | ---------------------------------------- |
| Description        | to update the name of an accordion item  |
| Signature          | updateItemName(id: string, name: string) |

| **clear**   |                              |
| ----------- | ---------------------------- |
| Description | to clear all accordion items |
| Signature   | clear()                      |
