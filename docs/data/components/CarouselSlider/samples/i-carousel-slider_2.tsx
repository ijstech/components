import {Module, CarouselSlider} from '@ijstech/components';
export default class ICarouselSliderSample extends Module {
    private carouselSlider: CarouselSlider;
    private sliderItems: any[] = [];

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
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-carousel-slider id="carouselSlider" width="100%" minHeight='100px'
                    slidesToShow={3} transitionSpeed={600} 
                    autoplay autoplaySpeed={5000}
                ></i-carousel-slider>
                <i-panel>
                    <i-button height={30} width={80} left={10} icon={{name: "angle-left"}} background={{color: "red"}} onClick={() => this.prev()} />
                    <i-button height={30} width={80} left={100} icon={{name: "angle-right"}} background={{color: "blue"}} onClick={() => this.next()} />
                </i-panel>
            </i-panel>
        )
    }
}