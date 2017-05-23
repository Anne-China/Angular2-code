import { Component, OnInit, ContentChild, TemplateRef, Host } from '@angular/core';
import { TreeViewNode } from './tree-view-node';
import { TreeViewNodeDirective } from './tree-view-node.directive';
import { TreeViewContainerComponent } from './tree-view-container.component';

@Component({
    selector: 'tree-view',
    templateUrl: 'tree-view.component.html',
    styleUrls: ['tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {
    constructor( @Host() private container: TreeViewContainerComponent) { }

    public rootNode: TreeViewNode<any>;

    /** 树节点模板 */
    @ContentChild(TreeViewNodeDirective, { read: TemplateRef })
    public nodeTemplate: TemplateRef<any>;

    public ngOnInit() {
        this.rootNode = new TreeViewNode(
            null,
            this.container.keyProp,
            this.container.dataLoader,
            null,
            this.container.sortProp,
            this.container.sortDir,
            this.nodeTemplate,
            true
        );
        this.rootNode.$$rootKey = this.container.rootKey;
        this.rootNode.loadData();
        this.container.rootNode = this.rootNode;
    }
}
