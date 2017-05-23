import { Directive, TemplateRef } from '@angular/core';

/**
 * DataGrid列头指令
 *
 * @howToUse
 *      <ng-template datagrid-column-header let-column="column">
 *          <span>{{column.name}}</span>
 *      </ng-template>
 *
 * @say 小李飞刀～～～他是个农民～～～
 * @author alfadb
 * @created 2017-03-10
 */
@Directive({ selector: '[datagrid-column-header]' })
export class DataGridColumnHeaderDirective {
    /**
     * @param template 列头模板
     *
     * @author alfadb
     * @created 2017-02-16
     */
    constructor(public template: TemplateRef<any>) { }
}
