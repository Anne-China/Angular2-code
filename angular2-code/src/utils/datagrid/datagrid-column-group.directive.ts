import { Directive, ContentChildren, QueryList, Input } from '@angular/core';
import { DataGridColumnDirective } from './datagrid-column.directive';
import { IsBlank } from '../func';

/**
 * DataGrid列分组指令
 *
 * @howToUse
 *     <datagrid-column-group name="分组名称">
 *       <datagrid-column ...>
 *       </datagrid-column>
 *       <datagrid-column ...>
 *       </datagrid-column>
 *       ...
 *     </datagrid-column-group>
 *
 * @say 我是一只小鸭子呀，咿呀咿呀哟～～～
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({ selector: 'datagrid-column-group' })
export class DataGridColumnGroupDirective {
    /** 列集合 */
    @ContentChildren(DataGridColumnDirective) public columns: QueryList<DataGridColumnDirective>;

    private _name: string;
    /** 分组名称 */
    @Input() set name(value: string) {
        if (!IsBlank(value)) {
            this._name = value;
        }
    }
    get name() { return this._name; }
}
