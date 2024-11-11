import {Module, Control, Progress} from '@ijstech/components';
export default class ProgressSample extends Module{
    private progress1: Progress
    private progress: number = 0;
    private percent: number = 0;

    addProgress() {
        let total: number = 2500;

        if (this.progress < total) {
            this.progress++;
            this.percent = (this.progress / total) * 100;
        } else {
            this.progress = 0;
            this.percent = 0
        }

        this.progress1.percent = this.percent;
        this.progress1.format = () => this.progress + '/' + total;
    }

    init(){
        super.init();
        setInterval(() => {
            this.addProgress();
        }, 500);
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-progress id="progress1" height={50} strokeWidth={10} strokeColor="white"
                    onRenderStart={(source: Control) => {
                        source.appendChild(
                            <i-label caption="Render Start" padding={{ top: '0.3rem', bottom: '0.3rem', left: '1rem', right: '1rem' }} font={{ name: 'Helvetica' }}/>
                        )
                    }}
                    onRenderEnd={(source: Control) => {
                        source.appendChild(
                            <i-label caption="Render End" padding={{ top: '0.3rem', bottom: '0.3rem', left: '1rem', right: '1rem' }} font={{ name: 'Helvetica' }}/>
                        )
                    }}
                ></i-progress>
            </i-panel>
        )
    }
}