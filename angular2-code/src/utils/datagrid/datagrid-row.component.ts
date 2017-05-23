import { Component, Input, Host, HostBinding } from '@angular/core';
import { DataGridComponent } from './datagrid.component';
import { DataGridColumnDirective } from './datagrid-column.directive';
import { DeepValueGetter } from '../func';
import { DataGridRow } from './datagrid-row';

/**
 * DataGrid行组件
 *
 * @description DataGrid内部组件，不在外部使用
 *
 * @say 洛阳亲友如相问，就说我在写代码
 * @author alfadb
 * @created 2017-02-16
 */
@Component({
    selector: 'datagrid-row',
    templateUrl: 'datagrid-row.component.html',
    styleUrls: ['datagrid-row.component.scss']
})
export class DatagridRowComponent {
    /**
     * @param dataGrid {DataGridComponent}
     */
    constructor( @Host() public dataGrid: DataGridComponent) { }
    /** 列分组集合 */
    public get columnGroups() { return this.dataGrid.columnGroups; }
    /** 当前行数据 */
    @Input() public row: DataGridRow<any>;

    /** 获取列数据 */
    public value(column: DataGridColumnDirective) {
        return DeepValueGetter(this.row.data, column.propPath);
    }

    /** 绑定左停靠列宽度 */
    @HostBinding('style.paddingLeft.px') get paddingLeft() { return this.dataGrid.leftWidth; }
    /** 绑定右停靠列宽度 */
    @HostBinding('style.paddingRight.px') get paddingRight() { return this.dataGrid.rightWidth; }
}
