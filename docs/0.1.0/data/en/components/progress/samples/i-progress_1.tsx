import {Module, Progress} from '@ijstech/components';
export default class ProgressSample extends Module{
    private progress1: Progress;
    private progress2: Progress;
    private progress3: Progress;
    private progress: number = 0;
    private percent: number = 0;

    addProgress() {
        let total: number = 100;

        if (this.progress < total) {
            this.progress++;
            this.percent = (this.progress / total) * 100;
        } else {
            this.progress = 0;
            this.percent = 0
        }

        this.progress1.percent = this.percent;
        this.progress1.format = () => this.percent + '%';
        this.progress2.percent = this.percent;
        this.progress3.percent = this.percent;
        this.progress3.format = () => this.percent + '%';
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
                <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                    <i-progress id="progress1" strokeWidth={5} strokeColor="white" loading={true}></i-progress>
                </i-panel>
        
                <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                    <i-progress id="progress2" percent={78.6} steps={5}></i-progress>
                </i-panel>
        
                <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                    <i-progress id="progress3" type="circle" width={126} height={126} strokeColor="red"></i-progress>
                </i-panel>
            </i-panel>
        )
    }
}