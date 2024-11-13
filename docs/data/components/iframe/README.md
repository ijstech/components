# iframe

An iFrame, also known as an Inline Frame, is an HTML document that is embedded inside another document on a web page, allowing you to include content from external sources. iFrame can be used for almost anything, from articles, to website homepages, to learning modules and beyond. The iFrame component describe the external source and the size of the iFrame.

### `i-iframe`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                         | Type       | Default |
| --------------- | -------------------------------------------------   | ---------- | ------- |
| url             | Define the path of an `<i-iframe>`                  | string     |         |
| allowFullscreen | Define whether the `<i-iframe>` is full screen      | boolean    | false   |

## Sample Code

### Properties
```typescript(samples/i-iframe.tsx)
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-iframe width="100%" height="300" allowFullscreen={true} url="https://www.youtube.com/embed/tgbNymZ7vqY"></i-iframe>
            </i-panel>
        )
    }
```
**Tip**: _The properties `width`, `height` are inherited from [`Control`](components/Control/README.md)_