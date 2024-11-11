# i-markdown

## Usage

Use to render markdown text.

## Properties

| Name  | Description                  | Type              | Default |
| ----- | ---------------------------- | ----------------- | ------- |
| theme | define the theme of markdown | `light` \| `dark` | `light` |

## Functions

| Name         | Params                          | Description                         |
| ------------ | ------------------------------- | ----------------------------------- |
| load         | async load(text: string)        |                                     |
| getTokens    | async getTokens(text: string)   | convert markdown text to tokens     |
| toPlainText  | async toPlainText(text: string) | convert markdown text to plain text |
| beforeRender | beforeRender(text: string)      | render markdown text before render  |
| processText  | processText(text: string)       | process markdown text               |

## Sample Code
