import {
    Component,
    ContentChild,
    ContentChildren,
    QueryList,
    AfterViewInit,
    Input,
    OnDestroy,
    ElementRef,
    ViewChild,
    HostListener,
    HostBinding,
    EventEmitter,
    Output,
    TemplateRef
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { DataSource } from '../datasource';
import { DataLoaderParameter } from '../dataloader-parameter';
import { FilterParameter, FilterGroup } from '../filter-define';
import { PagerComponent } from '../pager';
import { ConvertBoolean, GetType, IsBlank, DeepValueGetter } from '../func';
import { Point } from '../point';

import { DataGridColumnDirective } from './datagrid-column.directive';
import { DataGridColumnGroupDirective } from './datagrid-column-group.directive';
import { DataGridColumnGroup } from './datagrid-colunm-group';
import { DataGridResizeListenner } from './resize-listenner';
import { DataGridRow } from './datagrid-row';
import { DataGridRowDetailDirective } from './row-detial.directive';
import { SHIFT, CTRL } from '../keycodes';

/**
 * DataGrid组件
 *
 * @howToUse
 *      <datagrid [pager]="pagerForDataGrid"
 *                [data-loader]="dataLoader"
 *                striped
 *                selectable
 *                row-index-column
 *                multi-selectable
 *                toggle-select-click
 *                server-paging
 *                server-filting
 *                server-sorting
 *                default-sort-prop="prop"
 *                default-sort-dir="desc"
 *                [filter]="filter()"
 *                key-props="id"
 *                page-size="20"
 *                (rowExStatus)="onRowExpandStatusChange($event)"
 *                (select)="onSelect()">
 *          ...
 *          <ng-template datagrid-row-detail let-row="row" let-data="data">
 *              {{row.$$index}}
 *              {{data.prop}}
 *          </ng-template>
 *      </datagrid>
 *      <pager #pagerForDataGrid="pager"></pager
 *
 * @say 星宿老仙，法驾中原；神通广大，法力无边。
 * @author alfadb
 * @created 2017-02-16
 */
@Component({
    selector: 'datagrid',
    templateUrl: 'datagrid.component.html',
    styleUrls: ['datagrid.component.scss'],
    exportAs: 'dataGrid'
})
export class DataGridComponent implements AfterViewInit, OnDestroy {
    private dataSource: DataSource<any>;
    private resizeSubscription: Subscription;
    private dataSourceChangedSubscription: Subscription;
    /** 当前显示的行集合 */
    public rows: Array<DataGridRow<any>> = [];

    /**
     * @author alfadb
     * @created 2017-02-16
     */
    constructor() {
        this.dataSource = new DataSource<any>();
        this.dataSourceChangedSubscription = this.dataSource.dataChangedEvent.asObservable().subscribe(() => {
            this.isHandlingDataSource = true;
            setTimeout(() => {
                this.handleDataSourceChangedEvent();
            });
        });
        this.resizeSubscription = DataGridResizeListenner.subscribe(() => {
            this.computWidth();
            this.computeHeaderMargin();
            this.computScroll();
        });
    }

    /** 数据总数 */
    get total() { return this.dataSource.total; }

    /** 是否正在加载数据 */
    get isDataLoading() { return this.dataSource.isDataLoading; }

    @Output('data-loaded') public onDataLoaded = new EventEmitter<any>();

    private isHandlingDataSource = false;
    private handleDataSourceChangedEvent() {
        this.isHandlingDataSource = false;
        this.clearSelected();
        const rows = [];
        let idx = this.pagable ? (this.pageIndex - 1) * this.pageSize : 0;
        this.dataSource.data.subscribe((data) => {
            rows.push(new DataGridRow<any>(this, idx++, data));
        }, null, () => {
            setTimeout(() => {
                this.computWidth();
                this.computeHeaderMargin();
                this.computScroll();
                this.onDataLoaded.emit();
            });
        });
        this.rows = rows;
    }

    public get datas() {
        return Observable.from(this.rows).map((row) => row.data);
    }

    /** 设置异步加载数据函数 */
    @Input('data-loader') set dataLoader(loader: (parameter: DataLoaderParameter) =>
        any[] | Observable<any[] | { total: number, data: any[] }>) {
        this.dataSource.setRemoteDataLoader(loader);
    }

    private _striped = false;
    /** 是否偶数行背景区分，默认false */
    @Input() set striped(value: boolean) {
        this._striped = ConvertBoolean(value);
    }
    get striped() { return this._striped; }

    private _selectable = true;
    /** 是否可选择行，默认true */
    @Input() set selectable(value: boolean) {
        this._selectable = ConvertBoolean(value);
    }
    get selectable() { return this._selectable; }

    private _rowIndexColumn = false;
    /** 是否显示行序号，默认false */
    @Input('row-index-column') set rowIndexColumn(value: boolean) {
        this._rowIndexColumn = ConvertBoolean(value);
    }
    get rowIndexColumn() { return this._rowIndexColumn; }

    private _multiSelectable = false;
    /** 是否可多选，默认false */
    @Input('multi-selectable') set multiSelectable(value: boolean) {
        this._multiSelectable = ConvertBoolean(value);
    }
    get multiSelectable() { return this._multiSelectable; }

    private _toggleSelectClick = false;
    /** 是否点击切换行选择状态，默认false */
    @Input('toggle-select-click') set toggleSelectClick(value: boolean) {
        this._toggleSelectClick = ConvertBoolean(value);
    }
    get toggleSelectClick() { return this._toggleSelectClick; }

    private _pagable = false;
    /** 是否可分页，默认false */
    @Input() set pagable(value: boolean) {
        const bv = ConvertBoolean(value);
        this._pagable = bv;
        this.dataSource.options.pagable = bv;
    }
    get pagable() { return this._pagable; }
    /** 是否由服务器分页，默认false */
    @Input('server-paging') set serverPaging(value: boolean) {
        const bv = ConvertBoolean(value);
        this.dataSource.options.serverPaging = bv;
    }
    /** 是否由服务器筛选，默认false */
    @Input('server-filting') set serverFilting(value: boolean) {
        const bv = ConvertBoolean(value);
        this.dataSource.options.serverFilting = bv;
    }
    /** 是否由服务器排序，默认false */
    @Input('server-sorting') set serverSorting(value: boolean) {
        const bv = ConvertBoolean(value);
        this.dataSource.options.serverSorting = bv;
    }

    private _sortProp: string;
    /** 默认排序属性 */
    @Input('default-sort-prop') set sortProp(value: string) {
        if (!IsBlank(value)) {
            this._sortProp = value.trim();
        }
    }
    get sortProp() { return this._sortProp; }
    private _sortDir = 'asc';
    /** 默认排序方向，默认asc */
    @Input('default-sort-dir') set sortDir(value: string) {
        if (!IsBlank(value)) {
            value = value.trim();
            if (['asc', 'desc'].indexOf(value) >= 0) {
                this._sortDir = value;
            }
        }
    }
    get sortDir() { return this._sortDir; }

    /** 行明细展开状态改变事件 */
    @Output('rowExStatus') public onRowExpandedStatusChangeEvent = new EventEmitter<DataGridRow<any>>();

    /**
     * 执行排序
     *
     * @param column 要进行排序的列
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public changeSort(column: DataGridColumnDirective) {
        const prop = column.sortProp || column.prop;
        if (!column.sortable || IsBlank(prop)) {
            return;
        }
        if (this.sortProp === prop) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortProp = prop;
            this.sortDir = 'asc';
        }
        this.dataSource.sort(this.sortProp, this.sortDir, column.comparator);
    }

    /** 设置筛选条件获取函数 */
    @Input() public filter: () => Array<{ [key: string]: any }> | FilterParameter | FilterGroup;

    private _keyProps: string[];
    /** 设置行主键，多主键用逗号隔开 */
    @Input('key-props') set keyProps(value: string | string[]) {
        if (value == null) {
            return;
        }
        const vt = GetType(value);
        const result: string[] = [];
        let av: string[];
        if (vt === 'string') {
            av = (value as string).split(',');
        } else if (vt === 'array') {
            av = value as string[];
        } else {
            return;
        }
        for (const prop of av) {
            if (!IsBlank(prop)) {
                result.push(prop.trim());
            }
        }
        this._keyProps = result;
    }
    get keyProps() { return this._keyProps; }

    private pageOnChangeSubscription: Subscription;
    private pageOnRefreshSubscription: Subscription;
    private onDataSourceTotalChangedPagerSubscription: Subscription;
    private pageIndex: number = 1;
    /** 设置每页条数，默认20 */
    @Input('page-size') public pageSize: number = 20;
    /** 设置分页组件 */
    @Input() set pager(pager: PagerComponent) {
        this.unsubscriptionPager();
        if (pager == null) {
            return;
        }
        this.pageOnChangeSubscription = pager.onChange.subscribe((e) => {
            this.pageIndex = e.index;
            this.pageSize = e.size;
            this.dataSource.page(e.index, e.size);
            setTimeout(() => {
                this.computeHeaderMargin();
            });
        });
        this.pageOnRefreshSubscription = pager.onRefresh.subscribe(() => {
            this.loadData();
            setTimeout(() => {
                this.computeHeaderMargin();
            });
        });
        this.onDataSourceTotalChangedPagerSubscription =
            this.dataSource.totalChangedEvent.subscribe((e) => {
                console.log('===== zss -------' + e);
                pager.total = e;
            });
    }
    private unsubscriptionPager() {
        if (this.pageOnChangeSubscription != null) {
            this.pageOnChangeSubscription.unsubscribe();
        }
        if (this.pageOnRefreshSubscription != null) {
            this.pageOnRefreshSubscription.unsubscribe();
        }
        if (this.onDataSourceTotalChangedPagerSubscription != null) {
            this.onDataSourceTotalChangedPagerSubscription.unsubscribe();
        }
    }

    /** 行明细模板 */
    @Input() @ContentChild(DataGridRowDetailDirective, { read: TemplateRef })
    public rowDetailTemplate: TemplateRef<any>;

    /** 列分组集合 */
    @ContentChildren(DataGridColumnGroupDirective) public _columnGroups: QueryList<DataGridColumnGroupDirective>;

    /** 左停靠总宽度 */
    public leftWidth = 0;
    /** 右停靠总宽度 */
    public rightWidth = 0;
    /** 行最小宽度 */
    public minFullWidth = 0;

    private computWidth() {
        let leftWidth = 0;
        if (this.rowIndexColumn) {
            leftWidth += this.total < 10000 ? 45 : 60;
        }
        for (const group of this.columnGroups.left) {
            for (const col of group.columns) {
                leftWidth += col.width;
            }
        }
        if (this.rowDetailTemplate != null) {
            leftWidth += 20;
        }
        this.leftWidth = leftWidth;

        let rightWidth = 0;
        for (const group of this.columnGroups.right) {
            for (const col of group.columns) {
                rightWidth += col.width;
            }
        }
        this.rightWidth = rightWidth;

        let minFullWidth = 0;
        for (const group of this.columnGroups.center) {
            for (const col of group.columns) {
                minFullWidth += col.width;
            }
        }
        minFullWidth += this.leftWidth + this.rightWidth;
        this.minFullWidth = minFullWidth;
    }
    /** 处理后的列分组集合 */
    public columnGroups: {
        left: DataGridColumnGroup[],
        center: DataGridColumnGroup[],
        right: DataGridColumnGroup[]
    } = { left: [], center: [], right: [] };
    /**
     * 视图初始化后执行
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public ngAfterViewInit() {
        if (this._columnGroups == null || this._columnGroups.length === 0) {
            return;
        }
        const colGroups = this._columnGroups.toArray();
        for (const group of colGroups) {
            if (group.columns == null || group.columns.length === 0) {
                continue;
            }
            const colLeftGroup = { $$id: this.generateId(), fill: false, name: group.name, columns: [] };
            const colCenterGroup = { $$id: this.generateId(), fill: false, name: group.name, columns: [] };
            const colRightGroup = { $$id: this.generateId(), fill: false, name: group.name, columns: [] };
            const innerCols = group.columns.toArray();
            for (const col of innerCols) {
                col.$$id = this.generateId();
                if (col.freeze === 'left') {
                    colLeftGroup.columns.push(col);
                } else if (col.freeze === 'right') {
                    colRightGroup.columns.push(col);
                } else {
                    colCenterGroup.fill = colCenterGroup.fill || col.fill;
                    colCenterGroup.columns.push(col);
                }
            }
            if (colLeftGroup.columns.length > 0) {
                this.columnGroups.left.push(colLeftGroup);
            }
            if (colCenterGroup.columns.length > 0) {
                this.columnGroups.center.push(colCenterGroup);
            }
            if (colRightGroup.columns.length > 0) {
                this.columnGroups.right.push(colRightGroup);
            }
        }
        setTimeout(() => {
            this.computWidth();
        });
    }
    /**
     * 组件销毁时执行
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public ngOnDestroy() {
        this.unsubscriptionPager();
        if (this.resizeSubscription != null) {
            this.resizeSubscription.unsubscribe();
        }
        if (this.dataSourceChangedSubscription != null) {
            this.dataSourceChangedSubscription.unsubscribe();
        }
        this.dataSource.destroy();
    }

    /**
     * 设定数据集
     *
     * @param data 数据集
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public setData(data: any[] | Observable<any[] | { total: number, data: any[] }>) {
        const parameter: DataLoaderParameter = {
            pager: this.pagable ? { index: this.pageIndex, size: this.pageSize } : null,
            sortor: { prop: this.sortProp, dir: this.sortDir },
            filter: this.filter == null ? null : this.filter()
        };
        this.dataSource.setData(data, parameter);
    }

    /**
     * 执行异步加载数据
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public loadData() {
        const parameter: DataLoaderParameter = {
            pager: this.pagable ? { index: this.pageIndex, size: this.pageSize } : null,
            sortor: { prop: this.sortProp, dir: this.sortDir },
            filter: this.filter == null ? null : this.filter()
        };
        this.dataSource.refreshByNewPatameter(parameter);
    }

    /**
     * 列跟踪函数
     *
     * @param index 列序号
     * @param col 列
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public columnTrackingFn(index: number, col: DataGridColumnDirective) {
        return col.$$id;
    }

    /**
     * 列分组跟踪函数
     *
     * @param index 列分组序号
     * @param colGroup 列分组
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public columnGroupTrackingFn(index: number, colGroup: DataGridColumnGroup) {
        return colGroup.$$id;
    }

    /**
     * 行跟踪函数
     *
     * @param index 行序号
     * @param row 行
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public rowTrackingFn(index: number, row: any) {
        if (this.keyProps == null) {
            return index.toString();
        }
        let key = '';
        const keyProps = this.keyProps as string[];
        for (const prop of keyProps) {
            key += DeepValueGetter(row, prop) + '-';
        }
        key = key.substr(0, key.length - 1);
        return key;
    }

    /** 表头视图节点 */
    @ViewChild('header') public headerRef: ElementRef;
    /** 表体视图节点 */
    @ViewChild('body') public bodyRef: ElementRef;
    /** 表滚动视图节点 */
    @ViewChild('scroller') public scrollerRef: ElementRef;
    /** 当前滚动左位置 */
    public scrollLeft = 0;
    /** 当前滚动右位置 */
    public scrollRight = 0;
    /**
     * 处理表体滚动事件
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public onBodyScroll() {
        this.computScroll();
    }

    private computScroll() {
        const headerEl = this.headerRef.nativeElement as HTMLDivElement;
        const scrollerEl = this.scrollerRef.nativeElement as HTMLDivElement;
        headerEl.scrollLeft = scrollerEl.scrollLeft;
        this.scrollLeft = scrollerEl.scrollLeft;
        this.scrollRight = scrollerEl.scrollWidth - scrollerEl.clientWidth - this.scrollLeft;
    }

    /** 表头边距 */
    public headerMargin = 0;
    /**
     * 计算表头边距
     *
     * @author alfadb
     * @created 2017-02-16
     */
    private computeHeaderMargin() {
        const bodyEl = this.bodyRef.nativeElement as HTMLDivElement;
        const scrollerEl = this.scrollerRef.nativeElement as HTMLDivElement;
        this.headerMargin = bodyEl.clientWidth - scrollerEl.clientWidth;
    }

    private generateId() {
        return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
    }

    /** 是否已按下shift键 */
    public isShiftKeydown = false;
    private isCtrlKeydown = false;
    /** 监听全局按键按下事件 */
    @HostListener('window:keydown', ['$event']) public onGlobalKeydown(e: KeyboardEvent) {
        if (e.keyCode === SHIFT) {
            this.isShiftKeydown = true;
        }
        if (e.keyCode === CTRL) {
            this.isCtrlKeydown = true;
        }
    }
    /** 监听全局按键弹起事件 */
    @HostListener('window:keyup', ['$event']) public onGlobalKeyup(e: KeyboardEvent) {
        if (e.keyCode === SHIFT) {
            this.isShiftKeydown = false;
            this._shiftStack = [];
            this._lastClickIndex = this._shiftLastClick;
            this._shiftLastClick = null;
        }
        if (e.keyCode === CTRL) {
            this.isCtrlKeydown = false;
        }
    }

    private clearSelected() {
        this._lastClickIndex = null;
        this.selectedRow = null;
        this._selectedRowsMap = { length: 0 };
        this._selectedRows = null;
        this._selectedItems = null;
        this._shiftStack = [];
        this._shiftLastClick = null;
    }

    private _shiftLastClick: number;
    private _shiftStack: number[] = [];
    private _lastClickIndex: number;
    private _selectedRows: Array<DataGridRow<any>>;
    private _selectedItems: any[];
    private _selectedRowsMap: { [key: number]: DataGridRow<any>, length: number } = { length: 0 };
    /** 已选中行(单选) */
    public selectedRow: DataGridRow<any>;
    /** 行选中事件 */
    @Output('select') public selectedChangedEvent = new EventEmitter<any>();
    /** 已选中行序号(单选) */
    get selectedIndex() { return this.selectedRow == null ? null : this.selectedRow.$$index; }
    /** 已选中行数据(单选) */
    get selectedItem() { return this.selectedRow == null ? null : this.selectedRow.data; }
    /** 已选中行(多选) */
    get selectedRows() {
        if (this._selectedRows == null) {
            this._selectedRows = [];
            for (const key in this._selectedRowsMap) {
                if (this._selectedRowsMap.hasOwnProperty(key) && key !== 'length') {
                    const element = this._selectedRowsMap[key];
                    this._selectedRows.push(element);
                }
            }
        }
        return this._selectedRows;
    }
    /** 已选中行数据(多选) */
    get selectedItems() {
        if (this._selectedItems == null) {
            this._selectedItems = [];
            this.selectedRows.forEach((item) => {
                this._selectedItems.push(item.data);
            });
        }
        return this._selectedItems;
    }
    private selectedEventEmitTimer: any;
    private select(row: DataGridRow<any>) {
        let needEmit = false;
        if (this.multiSelectable) {
            if (!row.$$selected) {
                row.$$selected = true;
                this._selectedRowsMap[row.$$index] = row;
                this._selectedRowsMap.length++;
                this._selectedRows = null;
                this._selectedItems = null;
                needEmit = true;
            }
        } else {
            if (this.selectedIndex !== row.$$index) {
                if (this.selectedIndex != null) {
                    this.selectedRow.$$selected = false;
                }
                row.$$selected = true;
                this.selectedRow = row;
                needEmit = true;
            }
        }
        if (needEmit) {
            clearTimeout(this.selectedEventEmitTimer);
            this.selectedEventEmitTimer = setTimeout(() => {
                this.selectedChangedEvent.emit();
            });
        }
    }
    private unselect(row: DataGridRow<any>) {
        let needEmit = false;
        if (this.multiSelectable) {
            if (row.$$selected) {
                row.$$selected = false;
                delete this._selectedRowsMap[row.$$index];
                this._selectedRowsMap.length--;
                this._selectedRows = null;
                this._selectedItems = null;
                needEmit = true;
            }
        } else {
            if (this.selectedIndex !== row.$$index) {
                row.$$selected = false;
                this.selectedRow = null;
                needEmit = true;
            }
        }
        if (needEmit) {
            clearTimeout(this.selectedEventEmitTimer);
            this.selectedEventEmitTimer = setTimeout(() => {
                this.selectedChangedEvent.emit();
            });
        }
    }
    /**
     * 处理行点击事件
     *
     * @param e 鼠标事件
     * @param row 行
     *
     * @say 被此处逻辑坑了两个小时，论实现前写伪代码的重要性
     * @author alfadb
     * @created 2017-02-16
     */
    public onRowClick(e: MouseEvent, row: DataGridRow<any>) {
        let el = e.srcElement;
        while (true) {
            if (el == null) {
                return;
            }
            if (el.tagName.toLowerCase() === 'datagrid-row') {
                break;
            }
            if (['button', 'a'].indexOf(el.tagName.toLowerCase()) >= 0) {
                return;
            }
            if (el.classList.contains('datagrid-row-detail-cell')) {
                return;
            }
            el = el.parentElement;
        }
        if (!this.selectable) {
            return;
        }
        if (!this.multiSelectable) {
            if (!this.toggleSelectClick) {
                this.select(row);
            } else {
                if (this.selectedIndex === row.$$index) {
                    this.unselect(row);
                } else {
                    this.select(row);
                }
            }
        } else {
            if (!this.isShiftKeydown) {
                if (this.isCtrlKeydown || this.toggleSelectClick) {
                    if (row.$$selected) {
                        this.unselect(row);
                    } else {
                        this.select(row);
                    }
                } else {
                    const selectedRows = this.selectedRows;
                    for (const irow of selectedRows) {
                        if (irow.$$index !== row.$$index) {
                            this.unselect(irow);
                        }
                    }
                    this.select(row);
                }
                this._lastClickIndex = row.$$index;
            } else {
                if (this._lastClickIndex == null) {
                    if (row.$$selected) {
                        this.unselect(row);
                    } else {
                        this.select(row);
                    }
                    this._lastClickIndex = row.$$index;
                } else {
                    const isSelect = this.rows[this._lastClickIndex].$$selected;
                    while (this._shiftStack.length > 0) {
                        const idx = this._shiftStack.pop();
                        if (isSelect) {
                            this.unselect(this.rows[idx]);
                        } else {
                            this.select(this.rows[idx]);
                        }
                    }
                    if (row.$$index === this._lastClickIndex) {
                        if (row.$$selected) {
                            this.unselect(row);
                        } else {
                            this.select(row);
                        }
                    } else {
                        const min = Math.min(this._lastClickIndex, row.$$index);
                        const max = Math.max(this._lastClickIndex, row.$$index);
                        this._shiftLastClick = row.$$index;
                        for (let i = min; i <= max; i++) {
                            const irow = this.rows[i];
                            if (isSelect) {
                                if (!irow.$$selected) {
                                    this.select(irow);
                                    this._shiftStack.push(i);
                                }
                            } else {
                                if (irow.$$selected) {
                                    this.unselect(irow);
                                    this._shiftStack.push(i);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /** 是否正在调整列宽度 */
    @HostBinding('style.userSelect') public get isResizing() { return this.resizing == null ? 'text' : 'none'; }
    private resizing: {
        dir?: string;
        origin?: Point;
        column?: DataGridColumnDirective
    };
    /**
     * 鼠标按下，开始调整列宽度
     *
     * @param e 鼠标事件
     * @param column 目标列
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public resizeStart(e: MouseEvent, column: DataGridColumnDirective) {
        if (e.which !== 1) {
            return;
        }
        let dir = 'right';
        const rgroup = this.columnGroups.right[this.columnGroups.right.length - 1];
        if (rgroup.columns[rgroup.columns.length - 1] === column) {
            dir = 'left';
        }
        const point: Point = { x: e.x, y: e.y };
        this.resizing = { dir, origin: point, column };
    }
    @HostListener('mousemove', ['$event'])
    /**
     * 鼠标移动，计算列宽度
     *
     * @param e 鼠标事件
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public resize(e: MouseEvent) {
        if (this.resizing == null) {
            return;
        }
        const point = { x: e.x, y: e.y };
        const size = point.x - this.resizing.origin.x;
        let newSize = this.resizing.column.width + (this.resizing.dir === 'right' ? size : -size);
        if (this.resizing.column.minWidth != null) {
            if (newSize < this.resizing.column.minWidth) {
                newSize = this.resizing.column.minWidth;
            }
        }
        if (this.resizing.column.maxWidth != null) {
            if (newSize > this.resizing.column.maxWidth) {
                newSize = this.resizing.column.maxWidth;
            }
        }
        this.resizing.origin = point;
        this.resizing.column.width = newSize;
        this.computWidth();
        setTimeout(() => {
            this.computScroll();
            this.computeHeaderMargin();
        });
    }
    @HostListener('mouseup', ['$event'])
    /**
     * 鼠标弹起，结束调整列宽度
     *
     * @param e 鼠标事件
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public resizeEnd(e: MouseEvent) {
        this.resizing = null;
    }

    public rowDblClick(e: MouseEvent, row: DataGridRow<any>) {
        row.$$expanded = !row.$$expanded;
        window.getSelection().removeAllRanges();
    }
}
