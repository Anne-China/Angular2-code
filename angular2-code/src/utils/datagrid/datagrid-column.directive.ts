import { Directive, Input, ContentChild, TemplateRef, OnInit } from '@angular/core';
import { DataGridCellDirective } from './datagrid-cell.directive';
import { ConvertBoolean, GetType, IsBlank, ConvertInt } from '../func';
import { DataGridColumnHeaderDirective } from './datagrid-column-header.directive';

/**
 * DataGrid列指令
 *
 * @howToUse
 *       <datagrid-column
 *         name="列头"
 *         freeze="right"
 *         [comparator]="..."
 *         prop="prop.prop"
 *         sortable="true"
 *         fill
 *         resizable
 *         sortProp="prop.prop"
 *         freeze="left"
 *         [align]="['right','top']"
 *         [header-align]="['right','top']"
 *         width="200"
 *         min-width="100"
 *         max-width="300">
 *         <ng-template datagrid-cell let-value="value" let-row="row" let-column="column">
 *           <span>{{value}}</span>
 *         </ng-template>
 *         <ng-template datagrid-column-header let-column="column">
 *           <span>{{column.name}}</span>
 *         </ng-template>
 *       </datagrid-column>
 *
 * @say 门前大桥下，游过一群鸭，快来快来数一数，24678～～～
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({ selector: 'datagrid-column' })
export class DataGridColumnDirective implements OnInit {
    /** 列ID */
    public $$id: string;

    /**
     * 指令初始化后执行
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public ngOnInit() {
        if (this.sortProp == null) {
            this.sortProp = this.prop;
        }
    }

    /** 单元格模板 */
    @Input() @ContentChild(DataGridCellDirective, { read: TemplateRef })
    public cellTemplate: TemplateRef<any>;

    /** 列头模板 */
    @Input() @ContentChild(DataGridColumnHeaderDirective, { read: TemplateRef })
    public headerTemplate: TemplateRef<any>;

    /** 排序值对比函数 */
    @Input() public comparator: (valueA: any, valueB: any) => number;
    /** 列名 */
    @Input() public name: string;

    private _prop: string;
    /** 列属性路径 */
    public propPath: string[];
    /** 列属性 */
    @Input('prop') set prop(value: string) {
        this.propPath = this.handlePropPath(value);
        this._prop = value;
    }
    get prop() { return this._prop; }

    private _sortable = false;
    /** 是否可排序，默认false */
    @Input() set sortable(value: boolean) {
        this._sortable = ConvertBoolean(value);
    }
    get sortable() { return this._sortable; }

    private _fill = false;
    /** 是否是填充列，即：DataGrid宽度大于所有列宽度之和时，此列自动拉伸；默认false */
    @Input() set fill(value: boolean) {
        this._fill = ConvertBoolean(value);
    }
    get fill() { return this._fill; }

    private _resizable = false;
    /** 是否可调整宽度，默认false */
    @Input() set resizable(value: boolean) {
        this._resizable = ConvertBoolean(value);
    }
    get resizable() { return this._resizable; }

    private _sortProp: string;
    /** 排序属性路径 */
    public sortPropPath: string[];
    /** 排序属性，为空时，自动使用列属性 */
    @Input('sort-prop') set sortProp(value: string) {
        this.sortPropPath = this.handlePropPath(value);
        this._sortProp = value;
    }
    get sortProp() { return this._sortProp; }

    private _freeze: string;
    /** 是否是停靠列，可选值：left、right */
    @Input() set freeze(value: string) {
        if (['left', 'right'].indexOf(value) >= 0) {
            this._freeze = value;
        }
    }
    get freeze() { return this._freeze; }

    private _align = ['flex-start', 'center'];
    /** 单元格内容位置，可选值：['left|center|right','top|middle|bottom']，默认['left','middle'] */
    @Input() set align(value: string | string[]) {
        const align = this.handleAlign(value);
        if (align != null) {
            this._align = align;
        }
    }
    get align() { return this._align; }

    private _headerAlign = ['center', 'center'];
    /** 列头内容位置，可选值：['left|center|right','top|middle|bottom']，默认['left','middle'] */
    @Input('header-align') set headerAlign(value: string | string[]) {
        const align = this.handleAlign(value);
        if (align != null) {
            this._headerAlign = align;
        }
    }
    get headerAlign() { return this._headerAlign; }

    private handleAlign(value: string | string[]) {
        if (value == null) {
            return;
        }
        const vt = GetType(value);
        let iav: string[];
        if (vt === 'string') {
            iav = `${value}`.trim().split(/\s+|,/);
        } else if (vt === 'array') {
            iav = value as string[];
        } else {
            return;
        }
        const av: string[] = [];
        iav.forEach((v) => {
            if (!IsBlank(v)) {
                av.push(v.trim());
            }
        });
        const align = ['flex-start', 'center'];
        if (av.length > 0) {
            if (!IsBlank(av[0])) {
                const hor = `${av[0]}`.trim();
                if (['left', 'center', 'right'].indexOf(hor) >= 0) {
                    align[0] = hor === 'left' ? 'flex-start' : (hor === 'right' ? 'flex-end' : 'center');
                }
            }
            if (av.length > 1) {
                if (!IsBlank(av[1])) {
                    const ver = `${av[1]}`.trim();
                    if (['top', 'middle', 'bottom'].indexOf(ver) >= 0) {
                        align[1] = ver === 'top' ? 'flex-start' : (ver === 'bottom' ? 'flex-end' : 'center');
                    }
                }
            }
        }
        return align;
    }

    private _width = 150;
    /** 列宽度 */
    @Input() set width(value: number) {
        const width = ConvertInt(value);
        if (!isNaN(width) && width > 0) {
            this._width = width;
        }
    }
    get width() { return this._width; }

    private _minWidth: number;
    /** 列最小宽度 */
    @Input('min-width') set minWidth(value: number) {
        const width = ConvertInt(value);
        if (!isNaN(width) && width > 0) {
            this._minWidth = width;
        }
    }
    get minWidth() { return this._minWidth; }

    private _maxWidth: number;
    /** 列最大宽度 */
    @Input('max-width') set maxWidth(value: number) {
        const width = ConvertInt(value);
        if (!isNaN(width) && width > 0) {
            this._maxWidth = width;
        }
    }
    get maxWidth() { return this._maxWidth; }

    private handlePropPath(value: string) {
        if (value == null) {
            return null;
        } else {
            if (GetType(value) !== 'string') {
                throw new Error('prop path must a string.');
            }
            const aprop = value.split('.');
            const result: string[] = [];
            aprop.forEach((prop) => {
                if (IsBlank(prop)) {
                    throw new Error('prop error, it can not empty');
                }
                result.push(prop.trim());
            });
            return result;
        }
    }
}
