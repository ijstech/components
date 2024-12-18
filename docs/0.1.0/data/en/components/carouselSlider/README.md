# Carousel Slider

A carousel slider component provides a scalable container for image or text information. It can be used to save space in the form of a revolving door. A carousel slider is composed with the components [`i-carousel-item`].

### `i-carousel-slider`

## Class Inheritance

Inherited from [`Control`](../Control/README.md)

## Properties

| Name            | Description                                                         | Type                                                                                | Default |
| --------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| slidesToShow    | Define the no. of slide item in the slide for `<i-carousel-slider>` | number                                                                              | 1       |
| transitionSpeed | Define the transition speed of `<i-carousel-slider>`                | number                                                                              | 500     |
| autoplay        | Define `<i-carousel-slider>` to scroll automatically                | boolean                                                                             | false   |
| autoplaySpeed   | Define the auto scroll speed of `<i-carousel-slider>`               | number                                                                              | 3000    |
| items           | Define the slide items of `<i-carousel-slider>`                     | [CarouselItem&#91;&#93;](../customDataType/README.md#carouselitem)               |         |
| activeSlide     | Define the starting slide for `<i-carousel-slider>`                 | number                                                                              | 0       |
| type            | Define the type of `<i-carousel-slider>`                            | [CarouselType](#carouseltype)                                                       | `dot`   |
| indicators      | Define the indicators of `<i-carousel-slider>`                      | boolean                                                                             | true    |
| swipe           | Define the swipe of `<i-carousel-slider>`                           | boolean                                                                             | false   |
| mediaQueries    | Define tailored style to different devices                          | [ICarouselMediaQuery&#91;&#93;](../customDataType/README.md#icarouselmediaquery) |         |

### CarouselType

`dot` \| `arrow`

## Events

| **onSwipeStart** |                                   |
| ---------------- | --------------------------------- |
| Description      | Callback executed when drag start |
| Signature        | onSwipeStart()                    |

| **onSwipeEnd** |                                 |
| -------------- | ------------------------------- |
| Description    | Callback executed when drag end |
| Signature      | onSwipeEnd(isSwiping: boolean)  |

| **onSlideChange** |                                     |
| ----------------- | ----------------------------------- |
| Description       | Callback executed when slide change |
| Signature         | onSlideChange(index: number)        |

## Functions

| **prev**    |                             |
| ----------- | --------------------------- |
| Description | Move back to previous slide |
| Signature   | prev()                      |

| **next**    |                            |
| ----------- | -------------------------- |
| Description | Move forward to next slide |
| Signature   | next()                     |

| **add**     |                         |
| ----------- | ----------------------- |
| Description | Add a new carousel item |
| Signature   | add(item: Control)      |

## Sample Code

### Property

```typescript(samples/i-carousel-slider_1.tsx)
async init() {
    super.init();
    this.renderSliderItem();
    this.carouselSlider.items = this.sliderItems;
    this.carouselSlider.activeSlide = 1;
}
renderSliderItem() {
    for (let i = 0; i < 10; i++) {
        this.sliderItems.push({
            name: 'Name_ ' + i,
            controls: [
                <i-label caption={ 'Name ' + i }></i-label>
            ]
        })
    }
}
render() {
    return (
       <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-carousel-slider id="carouselSlider" width="100%" minHeight='200px'
                slidesToShow={3} transitionSpeed={600}
                autoplay autoplaySpeed={5000}
            ></i-carousel-slider>
        </i-panel>
    )
}
```

**Tip**: _The properties `id`, `width`, `height`, `minHeight`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](../Control/README.md)_

### Functions

```typescript(samples/i-carousel-slider_2.tsx)
async init() {
    super.init();
    this.renderSliderItem();
    this.carouselSlider.items = this.sliderItems;
    this.carouselSlider.activeSlide = 1;
}

renderSliderItem() {
    for (let i = 0; i < 10; i++) {
        this.sliderItems.push({
            name: 'Name_ ' + i,
            controls: [
                <i-label caption={ 'Name ' + i }></i-label>
            ]
        })
    }
}

prev() {
    this.carouselSlider.prev();
}

next() {
    this.carouselSlider.next();
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <i-carousel-slider
                id="carouselSlider"
                width="100%" minHeight='100px'
                slidesToShow={3} transitionSpeed={600}
                autoplay autoplaySpeed={5000}
                indicators={true}
                mediaQueries={
                    [
                        {
                            maxWidth: 767,
                            properties: {
                                indicators: false
                            }
                        }
                    ]
                }
            ></i-carousel-slider>
            <i-panel>
                <i-button height={30} width={80} left={10} icon={{ name: "angle-left" }} background={{ color: "red" }} onClick={() => this.prev()} />
                <i-button height={30} width={80} left={100} icon={{ name: "angle-right" }} background={{ color: "blue" }} onClick={() => this.next()} />
            </i-panel>
        </i-panel>
    )
}
```

### Events

```typescript(samples/i-carousel-slider_3.tsx)
onSlideChange(index: number) {
    this.lblInfo.caption = `Move to slide ${index}`;
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <i-carousel-slider
                id="carouselSlider"
                width="100%" minHeight='100px'
                slidesToShow={3} transitionSpeed={600}
                autoplay autoplaySpeed={5000}
                type="arrow"
                onSlideChange={this.onSlideChange}
            ></i-carousel-slider>
            <i-label id="lblInfo" caption=""></i-label>
        </i-panel>
    )
}
```

**Tip**: _The properties `id`, `width`, `minHeight` are inherited from [`Control`](../Control/README.md)_
