import { Directive, TemplateRef } from '@angular/core';

/**
 * DataGrid单元格指令
 *
 * @howToUse
 *      <ng-template datagrid-cell let-value="value" let-row="row" let-column="column">
 *          <span>{{value}}</span>
 *      </ng-template>
 *
 * @say 小李飞刀～～～他是个农民～～～
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({ selector: '[datagrid-cell]' })
export class DataGridCellDirective {
    /**
     * @param template 单元格模板
     *
     * @author alfadb
     * @created 2017-02-16
     */
    constructor(public template: TemplateRef<any>) { }
}
