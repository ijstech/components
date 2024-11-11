import {Control, customElements, ControlElement} from '@ijstech/base';
import './style/pagination.css';
import { GroupType } from '@ijstech/types';

type notifyCallback = (target: Pagination, lastActivePage: number) => void
export interface PaginationElement extends ControlElement{
    totalPages?: number
    currentPage?: number
    pageSize?: number
    onPageChanged?: notifyCallback
}
const pagerCount = 7;
const pagerCountMobile = 5;
const defaultCurrentPage = 1;
const pageSize = 10;
const defaultTotalPage = 0;

declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-pagination']: PaginationElement
        }
    }
}

@customElements("i-pagination", {
    icon: 'ellipsis-h',
    group: GroupType.BASIC,
    className: 'Pagination',
    props: {
        totalPages: {type: 'number', default: defaultTotalPage},
        currentPage: {type: 'number', default: defaultCurrentPage},
        pageSize: {type: 'number', default: pageSize},
    },
    events: {
        onPageChanged: [
            {name: 'target', type: 'Pagination', isControl: true},
            {name: 'lastActivePage', type: 'number'}
        ]
    },
    dataSchema: {
        type: 'object',
        properties: {
            totalPages: {
                type: 'number',
                default: defaultTotalPage
            },
            currentPage: {
                type: 'number',
                default: defaultCurrentPage
            },
            pageSize: {
                type: 'number',
                default: pageSize
            }
        }
    }
})
export class Pagination extends Control {
    private _totalPages: number;
    private _curPage: number;
    private _pageSize: number;
    private _showPrevMore: boolean = false;
    private _showNextMore: boolean = false;
    private pagers: number[];

    private pageItems: HTMLElement[] = [];
    private activeItem: HTMLElement;
    private _paginationDiv: HTMLElement;
    private _prevElm: HTMLElement;
    private _nextElm: HTMLElement;
    private pagerCount: number = pagerCount;
    public onPageChanged: notifyCallback;

    constructor(parent?: Control, options?: any) {        
        super(parent, options, { pageSize });
    }

    get totalPages(): number {
        return this._totalPages;
    }
    set totalPages(value: number) {
        if (this._totalPages === value) return;
        this._totalPages = value;
        this.onDisablePrevNext();
        this.renderPageItem(value);
    }
    get currentPage(): number {
        return this._curPage;
    }
    set currentPage(value: number) {
        const oldData = this._curPage;
        this._curPage = value || defaultCurrentPage;
        const index = value - 1;
        this.pageItems[index] && this.onActiveItem(this.pageItems[index]);
        if (typeof this.onPageChanged === 'function' && (oldData !== this._curPage)) this.onPageChanged(this, oldData);
    }

    get pageSize(): number {
        return this._pageSize || pageSize;
    }
    set pageSize(value: number) {
        this._pageSize = value;
    }

    private onActiveItem(item: HTMLElement) {
        if (this.activeItem) {
            this.activeItem.classList.remove('active');
        }
        if (item) {
            item.classList.add('active');
            this.activeItem = item;
        }
    }
    private onDisablePrevNext() {
        if ( this._prevElm)
            this.currentPage <= 1 ?
                this._prevElm.classList.add('disabled') :
                this._prevElm.classList.remove('disabled');
        if (this._nextElm)
            this.currentPage >= this.totalPages ?
                this._nextElm.classList.add('disabled') :
                this._nextElm.classList.remove('disabled');
    }
    protected _handleOnClickIndex(value: number, event: Event) {
        if (!this.enabled) return;
        this.currentPage = value;
        this.onActiveItem(event.target as HTMLElement);
        this.onDisablePrevNext();
    }
    private _handleOnClickMore(value: number, event: Event) {
        let _curPage = this.currentPage + (value * (this.pagerCount - 2));
        if (_curPage > this.totalPages) {
            _curPage = this.totalPages;
        } else if (_curPage <= 0) {
            _curPage = 1;
        }
        this.currentPage = _curPage;
        this.onDisablePrevNext();
        this.renderPageItem(this.totalPages);
    }
    protected _handleOnNext(event: Event) {
        if (!this.enabled || this.currentPage >= this.totalPages) return;
        const nextPage = Number(this._curPage) <= 0 ? 1 : Number(this._curPage) + 1;
        this.currentPage = nextPage;
        this.renderPageItem(this.totalPages);
        this.onDisablePrevNext();
    }
    protected _handleOnPrev(event: Event) {
        if (!this.enabled || this.currentPage <= 1) return;
        const prevPage = Number(this._curPage) - 1;
        this.currentPage = prevPage;
        this.renderPageItem(this.totalPages);
        this.onDisablePrevNext();
    }
    private onMouseenter(direction: number, event: Event) {
        if (!this.enabled) return;
        const target = event.target as HTMLElement;
        target.innerHTML = direction === -1 ? '&laquo;' : '&raquo;';
    }
    private renderEllipsis(step: number) {
        let item = this.createElement('a', this._paginationDiv);
        item.id = step === -1 ? 'prevMoreElm' : 'nextMoreElm';
        item.setAttribute('href', '#');
        item.innerHTML = "...";
        item.classList.add('paginate_button');
        item.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this._designMode) return;
            this._handleOnClickMore(step, e)
        });
        item.addEventListener("mouseenter", (e) => {
            e.preventDefault();
            if (this._designMode) return;
            this.onMouseenter(step, e)
        });
        item.addEventListener("mouseout", (e) => {
            e.preventDefault();
            if (this._designMode) return;
            item.innerHTML = '...';
        });
    }
    private renderPage(index: number) {
        let item = this.createElement('a', this._paginationDiv);
        this.pageItems.push(item);
        item.setAttribute('href', '#');
        item.innerHTML = `${index}`;
        item.classList.add('paginate_button');
        item.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this._designMode) return;
            this._handleOnClickIndex(index, e);
        });
        if (index === this.currentPage) this.onActiveItem(item);
    }
    private updatePagers() {
        const halfPagerCount = (this.pagerCount - 1) / 2;

        const currentPage = Number(this.currentPage);
        const pageCount = Number(this.totalPages);

        let showPrevMore = false;
        let showNextMore = false;
        if (pageCount > this.pagerCount) {
            if (currentPage > this.pagerCount - halfPagerCount) {
                showPrevMore = true;
            }
            if (currentPage < pageCount - halfPagerCount) {
                showNextMore = true;
            }
        }

        const array = [];
        if (showPrevMore && !showNextMore) {
            const startPage = pageCount - (this.pagerCount - 2);
            for (let i = startPage; i < pageCount; i++) {
                array.push(i);
            }
        } else if (!showPrevMore && showNextMore) {
            for (let i = 2; i < this.pagerCount; i++) {
                array.push(i);
            }
        } else if (showPrevMore && showNextMore) {
            const offset = Math.floor(this.pagerCount / 2) - 1;
            for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                array.push(i);
            }
        } else {
            for (let i = 2; i < pageCount; i++) {
                array.push(i);
            }
        }
        this.pagers = array;
        this._showPrevMore = showPrevMore;
        this._showNextMore = showNextMore;
    }
    private renderPageItem(size: number) {
        if (!this._paginationDiv) return;
        this.visible = size > 0;

        this._paginationDiv.innerHTML = '';
        if (this._prevElm) {
            this._paginationDiv.appendChild(this._prevElm);
        }
        this.pageItems = [];
        if (size > 0) {
            if (size > this.pagerCount) {
                this.updatePagers();
                this.renderPage(1);
                this._showPrevMore && this.renderEllipsis(-1);
                for (let i = 0; i < this.pagers.length; i++) {
                    this.renderPage(this.pagers[i]);
                }
                this._showNextMore && this.renderEllipsis(1);
                this.renderPage(size);
            } else {
                for (let i = 1; i <= size; i++) {
                    this.renderPage(i);
                }
            }
            
        } else if (size < 0) {
            const _s = this.pageItems.length + size;
            for (let i = this.pageItems.length - 1; i >= _s; i--) {
                this._paginationDiv.removeChild(this.pageItems[i]);
                this.pageItems.pop();
            } 
        }
        if (this._nextElm) {
            this._paginationDiv.append(this._nextElm);
        }
    }

    protected init() {
        this.pagerCount = window.innerWidth > 767 ? pagerCount : pagerCountMobile; 
        if (!this._paginationDiv) {
            this.pageItems = [];
            this._paginationDiv = this.createElement('div', this);
            this._paginationDiv.classList.add('pagination', 'pagination-main');
            this._prevElm = this.createElement('a', this._paginationDiv);
            this._prevElm.setAttribute('href', '#');
            this._prevElm.innerHTML = '&laquo;';
            this._prevElm.classList.add('paginate_button', 'previous');
            this._prevElm.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this._designMode) return;
                this._handleOnPrev(e)
            });
                
            this.currentPage = +this.getAttribute("currentPage", true, defaultCurrentPage);
            this.totalPages = +this.getAttribute("totalPages", true, defaultTotalPage);
            this.pageSize = +this.getAttribute("pageSize", true, pageSize);

            this._nextElm = this.createElement('a', this._paginationDiv);
            this._nextElm.setAttribute('href', '#');
            this._nextElm.innerHTML = '&raquo;';
            this._nextElm.classList.add('paginate_button', 'next');
            this._nextElm.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this._designMode) return;
                this._handleOnNext(e)
            });
            this.onDisablePrevNext();
        }
        super.init();
    }   
    
    static async create(options?: PaginationElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }        
}