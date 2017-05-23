import { Directive, TemplateRef } from '@angular/core';

/**
 * DataGrid行明细指令
 *
 * @howToUse
 *      <ng-template datagrid-row-detail let-row="row">
 *          <span>{{value}}</span>
 *      </ng-template>
 *
 * @say 小李飞刀～～～他是个农民～～～
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({ selector: '[datagrid-row-detail]' })
export class DataGridRowDetailDirective {
    /**
     * @param template 行明细模板
     *
     * @author alfadb
     * @created 2017-02-16
     */
    constructor(public template: TemplateRef<any>) { }
}
