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
}