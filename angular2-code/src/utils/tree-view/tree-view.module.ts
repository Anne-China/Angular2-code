import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeViewComponent } from './tree-view.component';
import { TreeViewNodeDirective } from './tree-view-node.directive';
import { TreeViewContainerComponent } from './tree-view-container.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TreeViewComponent,
        TreeViewNodeDirective,
        TreeViewContainerComponent
    ],
    exports: [
        TreeViewContainerComponent,
    ]
})
export class TreeViewModule { }
