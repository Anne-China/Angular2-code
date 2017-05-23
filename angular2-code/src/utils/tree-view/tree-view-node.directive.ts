import { Directive, TemplateRef } from '@angular/core';

/**
 * TreeView树节点指令
 *
 * @howToUse
 *      <ng-template tree-view-node let-node="node" let-options="options">
 *          ...
 *      </ng-template>
 *
 * @say 小李飞刀～～～他是个农民～～～
 * @author alfadb
 * @created 2017-03-29
 */
@Directive({ selector: '[tree-view-node]' })
export class TreeViewNodeDirective {
    /**
     * @param template TreeView树节点模板
     *
     * @author alfadb
     * @created 2017-03-29
     */
    constructor(public template: TemplateRef<any>) { }
}
