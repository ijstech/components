import { Control, ControlElement, RequireJS, LibPath } from '@ijstech/base';

export interface EchartElement extends ControlElement {
    theme?: 'light' | 'dark';
}

export class Chart<T> extends Control {
    private _data: T;
    private _theme: 'light' | 'dark' = 'light';
    private _echart: any;
    private _chartDom: any;
    private _chartIns: any;

    constructor(parent?: Control, options?: any) {
        super(parent, options);
    }
    get data() {
        return this._data;
    }
    set data(value: T) {
        this._data = value;
        this.drawChart();
    }
    get theme() {
        return this._theme;
    }
    set theme(value: 'light' | 'dark') {
        this._theme = value;
        this._chartIns = null;
        if (this.hasChildNodes()) {
            this.removeChild(this._chartDom);
        }
        this.initChartDom();
        this.drawChart();
    }
    private get dataObj(): any {
        if (typeof this.data === 'object') return this.data;
        try {
            return JSON.parse(JSON.stringify(this.data))
        } catch {
            return null;
        }
    }
    showLoading() {
        this._chartIns && this._chartIns.showLoading();
    }
    drawChart() {
        if (this._chartIns) {
            this.updateChartOptions();
            return;
        }
        if (this._echart) {
            this._drawChart();
            return;
        }
        RequireJS.require([`${LibPath}lib/echarts/echarts.min.js`], (echart: any) => {
            this._echart = echart;
            this._drawChart();
        });
    }
    private _drawChart() {
        if (this._chartDom) {
            this._chartIns = this._echart.init(this._chartDom, this.theme);
            this.updateChartOptions();
        }
    }
    updateChartOptions() {
        this._chartIns.hideLoading();
        this.dataObj && this._chartIns.setOption(this.dataObj);
    }
    resize() {
        if (this.dataObj && this._chartIns) {
            this._chartIns.resize();
        }
    }
    private initChartDom() {
        const captionDiv = this.createElement('div', this);
        captionDiv.id = `main-${Date.now()}`;
        captionDiv.style.display = 'inline-block';
        captionDiv.style.height = '100%';
        captionDiv.style.width = '100%';
        this._chartDom = captionDiv;
    }
    protected init() {
        super.init();
        this.style.display = 'inline-block';
        this.initChartDom();
        this._theme = this.getAttribute('theme', true, 'light');
        this.data = this.getAttribute('data', true);
    }
}