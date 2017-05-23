import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { GetType, ConvertInt, ConvertBoolean } from '../func';
import { PagerChangeEvent } from './pager.event';
import { IsBlank, ENTER } from '../../utils';

/**
 * 分页组件
 *
 * @howToUse
 *      <pager
 *          dropdown-dir="up"
 *          dropdown-max-height="150"
 *          number-btn-count="10"
 *          show-first-btn="false"
 *          show-prev-btn="false"
 *          show-next-btn="false"
 *          show-last-btn="false"
 *          show-number-btns="false"
 *          show-detail="false"
 *          show-size-selector="false"
 *          show-page-selector="false"
 *          show-refresh-btn="false"
 *          [size-candidates]="[10,20,30,40]"
 *          size="25"
 *          [total]="200"
 *          (change)="onPagerChange($event)"
 *          (refresh)="onRefresh()">
 *      </pager>
 *
 *      // 使用属性默认值时，可不写对应属性
 *
 * @say 不想出BUG？来来来，跟我念：“星宿老仙，法驾中原；神通广大，法力无边。”
 * @author alfadb
 * @created 2017-02-16
 *
 */
@Component({
    selector: 'pager',
    templateUrl: 'pager.component.html',
    styleUrls: ['pager.component.scss'],
    exportAs: 'pager'
})
export class PagerComponent {
    /**
     * 页码、每页条数菜单弹出框方向
     *
     * @description 可选值：up、down，默认down
     * @howToUse
     *      <pager dropdown-dir="up"></pager>
     */
    @Input('dropdown-dir') public dropdownDirection: string;

    private _dropdownMaxHeight = 200;
    /**
     * 页码、每页条数菜单弹出框最大高度
     *
     * @description 单位为像素，默认200
     *
     * @howToUse
     *      <pager dropdown-max-height="150"></pager>
     */
    @Input('dropdown-max-height') set dropdownMaxHeight(value: any) {
        const nv = ConvertInt(value);
        if (!isNaN(nv) && nv > 0) {
            this._dropdownMaxHeight = nv;
        }
    }
    get dropdownMaxHeight() { return this._dropdownMaxHeight; }

    private _numberBtnCount = 5;
    /**
     * 数字按钮个数
     *
     * @description 默认5个
     *
     * @howToUse
     *      <pager number-btn-count="10"></pager>
     */
    @Input('number-btn-count') set numberBtnCount(value: any) {
        const nv = ConvertInt(value);
        if (!isNaN(nv) && nv > 0) {
            this._numberBtnCount = nv;
        }
    }
    get numberBtnCount() { return this._numberBtnCount; }

    private _showFirstBtn = true;
    /**
     * 是否显示跳转第一页按钮
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-first-btn="false"></pager>
     */
    @Input('show-first-btn') set showFirstBtn(value: boolean) {
        this._showFirstBtn = ConvertBoolean(value);
    }
    get showFirstBtn() { return this._showFirstBtn; }

    private _showPrevBtn = true;
    /**
     * 是否显示跳转上一页按钮
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-prev-btn="false"></pager>
     */
    @Input('show-prev-btn') set showPrevBtn(value: boolean) {
        this._showPrevBtn = ConvertBoolean(value);
    }
    get showPrevBtn() { return this._showPrevBtn; }

    private _showNextBtn = true;
    /**
     * 是否显示跳转下一页按钮
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-next-btn="false"></pager>
     */
    @Input('show-next-btn') set showNextBtn(value: boolean) {
        this._showNextBtn = ConvertBoolean(value);
    }
    get showNextBtn() { return this._showNextBtn; }

    private _showLastBtn = true;
    /**
     * 是否显示跳转最末页按钮
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-last-btn="false"></pager>
     */
    @Input('show-last-btn') set showLastBtn(value: boolean) {
        this._showLastBtn = ConvertBoolean(value);
    }
    get showLastBtn() { return this._showLastBtn; }

    private _showNumberBtns = true;
    /**
     * 是否显示数字按钮
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-number-btns="false"></pager>
     */
    @Input('show-number-btns') set showNumberBtns(value: boolean) {
        this._showNumberBtns = ConvertBoolean(value);
    }
    get showNumberBtns() { return this._showNumberBtns; }

    private _showDetail = true;
    /**
     * 是否显示分页详情
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-detail="false"></pager>
     */
    @Input('show-detail') set showDetail(value: boolean) {
        this._showDetail = ConvertBoolean(value);
    }
    get showDetail() { return this._showDetail; }

    private _showSizeSelector = true;
    /**
     * 是否显示每页条数选择菜单
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-size-selector="false"></pager>
     */
    @Input('show-size-selector') set showSizeSelector(value: boolean) {
        this._showSizeSelector = ConvertBoolean(value);
        this.showDetail = this.showDetail || this._showSizeSelector;
    }
    get showSizeSelector() { return this._showSizeSelector; }

    private _showPageSelector = false;
    /**
     * 是否显示页码选择菜单
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-page-selector="false"></pager>
     */
    @Input('show-page-selector') set showPageSelector(value: boolean) {
        this._showPageSelector = ConvertBoolean(value);
        this.showDetail = this.showDetail || this._showPageSelector;
    }
    get showPageSelector() { return this._showPageSelector; }

    private _showRefreshBtn = true;
    /**
     * 是否显示刷新按钮
     *
     * @description true/false 默认true
     *
     * @howToUse
     *      <pager show-refresh-btn="false"></pager>
     */
    @Input('show-refresh-btn') set showRefreshBtn(value: boolean) {
        this._showRefreshBtn = ConvertBoolean(value);
    }
    get showRefreshBtn() { return this._showRefreshBtn; }

    private _sizeCandidates = [10, 15, 20, 25, 30, 40, 50];
    /**
     * 每页条数选择菜单候选项
     *
     * @description 数组，默认[10, 15, 20, 25, 30, 40, 50]
     *
     * @howToUse
     *      <pager [size-candidates]="[10,20,30,40]"></pager>
     */
    @Input('size-candidates') set sizeCandidates(value: number[]) {
        const candidates: number[] = [];
        if (value != null && GetType(value) === 'array') {
            value.forEach((item) => {
                const nitem = ConvertInt(item);
                if (!isNaN(nitem) && nitem > 0 && candidates.indexOf(nitem) < 0) {
                    candidates.push(nitem);
                }
            });
            candidates.sort();
        }
        if (candidates.length > 0) {
            this._sizeCandidates = candidates;
        }
    }
    get sizeCandidates() { return this._sizeCandidates; }
    private setSizeCandidates(size: number) {
        if (this.sizeCandidates.indexOf(size) >= 0) {
            return;
        }
        let isInserted = false;
        for (let i = 0; i < this.sizeCandidates.length; i++) {
            if (this.sizeCandidates[i] > size) {
                this.sizeCandidates.splice(i, 0, size);
                isInserted = true;
                break;
            }
        }
        if (!isInserted) {
            this.sizeCandidates.push(size);
        }
    }

    private _pageSize: number = 20;
    /**
     * 设置每页条数
     *
     * @description int, 默认20
     *
     * @howToUse
     *      <pager size="25"></pager>
     */
    @Input('size') set pageSize(value: number) {
        const nv = ConvertInt(value);
        if (isNaN(nv) || nv < 1 || nv === this._pageSize) {
            return;
        }
        this.setSizeCandidates(nv);
        this._pageSize = nv;
        if (!this.compute()) {
            this.onChange.emit({ size: this.pageSize, index: this.pageIndex });
        }
    }
    get pageSize() { return this._pageSize; }

    public totalSetted = false;
    private _total: number = 0;
    /**
     * 设置总条数
     *
     * @howToUse
     *      <pager total="200"></pager>
     */
    @Input('total') set total(value: number) {
        this.totalSetted = true;
        let nv = ConvertInt(value);
        if (isNaN(nv) || nv < 0) {
            nv = 0;
        }
        if (nv !== this._total) {
            this._total = nv;
            this.compute();
        }
    }
    get total() { return this._total; }

    private _pageIndex: number = 1;
    /** 当前页码 */
    set pageIndex(value: number) {
        const nv = ConvertInt(value);
        if (isNaN(nv) || nv < 1 || nv > this.max || nv === this._pageIndex) {
            return;
        }
        this._pageIndex = nv;
        this.compute();
        this.onChange.emit({ size: this.pageSize, index: this.pageIndex });
    }
    get pageIndex() { return this._pageIndex; }

    /** 最大页码 */
    public max: number = 1;

    /** 当前数字按钮最小值 */
    public minPageBtn: number = 1;
    /** 当前数字按钮最大值 */
    public maxPageBtn: number = 1;

    /** 页码发生变化时触发 */
    @Output('change') public onChange = new EventEmitter<PagerChangeEvent>();
    /** 刷新按钮点击时触发 */
    @Output('refresh') public onRefresh = new EventEmitter<PagerChangeEvent>();

    private compute() {
        let isChangEmited = false;
        let max = Math.ceil(this.total / this.pageSize);
        if (max === 0) {
            max = 1;
        }
        if (this.pageIndex > max) {
            this.pageIndex = max;
            isChangEmited = true;
        }
        this.max = max;

        let minBtn = this.pageIndex - Math.floor(this.numberBtnCount / 2);

        if (minBtn < 1) {
            minBtn = 1;
        }
        let maxBtn = minBtn + this.numberBtnCount - 1;
        if (maxBtn > this.max) {
            maxBtn = this.max;
        }
        if (maxBtn - minBtn <= this.numberBtnCount - 1 && maxBtn === this.max) {
            minBtn = maxBtn - this.numberBtnCount + 1;
            if (minBtn < 1) {
                minBtn = 1;
            }
        }

        this.minPageBtn = minBtn;
        this.maxPageBtn = maxBtn;

        return false;
    }

    /** 执行刷新 */
    public refresh() {
        this.onRefresh.emit({ size: this.pageSize, index: this.pageIndex });
    }

    @ViewChild('numberInput') public numberInput: ElementRef;

    public goPager(value: number, e: KeyboardEvent) {
        if (e.keyCode === ENTER) {
            if (value > this.max) {
                value = this.max;
            }
            this.numberInput.nativeElement.value = value;
            this.pageIndex = value;
        }
    }
}
