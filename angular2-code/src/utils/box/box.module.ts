import { NgModule } from '@angular/core';
import { BoxComponent } from './box.component';
import { BoxCtrlDirective } from './box-ctrl.directive';
import { BoxToolbarDirective } from './box-toolbar.directive';
import { BoxBodyDirective } from './box-body.directive';
import { BoxFooterDirective } from './box-footer.directive';
import { BoxTitleDirective } from './box-title.directive';

/**
 * Box模块
 *
 * @author alfadb
 * @created 2017-02-16
 */
@NgModule({
    declarations: [
        BoxComponent,
        BoxCtrlDirective,
        BoxToolbarDirective,
        BoxBodyDirective,
        BoxFooterDirective,
        BoxTitleDirective
    ],
    exports: [
        BoxComponent,
        BoxCtrlDirective,
        BoxToolbarDirective,
        BoxBodyDirective,
        BoxFooterDirective,
        BoxTitleDirective
    ]
})
export class BoxDirectiveModule { }
