import { DataGridComponent } from './datagrid.component';
import { ConvertBoolean } from '../func';

/**
 * DataGrid行模型
 *
 * @param T 数据类型
 *
 * @author alfadb
 * @created 2017-02-16
 */
export class DataGridRow<T> {
    /** 行序号 */
    public $$index?: number;
    /** 是否选中 */
    public $$selected?: boolean;
    /** 是否勾选 */
    public $$checked?: boolean;
    /** 行数据 */
    public data?: T;

    constructor(private dataGrid: DataGridComponent, index: number, data: T) {
        this.$$index = index;
        this.data = data;
    }

    private _$$expanded?: boolean;
    /** 是否展开 */
    set $$expanded(value: boolean) {
        const nv = ConvertBoolean(value);
        if (nv !== this._$$expanded) {
            this._$$expanded = nv;
            this.dataGrid.onRowExpandedStatusChangeEvent.emit(this);
        }
    }
    get $$expanded() { return this._$$expanded; }
}
