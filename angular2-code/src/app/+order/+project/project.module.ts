import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    MdButtonModule,
    MdRippleModule,
    MdDialogModule,
    MdCheckboxModule,
    MdInputModule,
    MdSnackBarModule,
    MdTabsModule,
    MdCardModule
} from '@angular/material';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { routes } from './project.routes';
import { ProjectComponent } from './project.component';
import { DesignerComponent } from './designer/designer.component';
import { DesignerDetailComponent } from './designer-detail/designer-detail.component';
import { ProjectDetailComponent } from './detail/detail.component';
import { ProductSelectorComponent } from './detail/edit/edit.component';
import { ProductDeleteComponent } from './detail/del/del.component';
import { JobSelectorComponent } from './detail/jobedit/jobedit.component';
import { JobDeleteComponent } from './detail/jobdel/jobdel.component';
import {
    DesignerAdapterModule,
    AppointDesignerAdapterModule,
    ChangeDesignerAdapterModule,
    OrderProjectAdapterModule
} from '../../../data-adapters/order';

@NgModule({
    declarations: [
        ProjectComponent,
        DesignerComponent,
        DesignerDetailComponent,
        ProjectDetailComponent,
        ProductSelectorComponent,
        ProductDeleteComponent,
        JobSelectorComponent,
        JobDeleteComponent
    ],
    imports: [
        AppointDesignerAdapterModule,
        CommonModule,
        OrderProjectAdapterModule,
        ChangeDesignerAdapterModule,
        DesignerAdapterModule,
        FormsModule,
        FrameworkModule,
        MdButtonModule,
        MdDialogModule,
        MdRippleModule,
        MdCheckboxModule,
        MdInputModule,
        MdSnackBarModule,
        MdTabsModule,
        MdCardModule,
        RouterModule.forChild(routes),
        UtilsModule
    ],
    entryComponents: [
        DesignerComponent,
        DesignerDetailComponent,
        ProductSelectorComponent,
        ProductDeleteComponent,
        JobSelectorComponent,
        JobDeleteComponent
    ]
})
export class OrderProjectModule {

}
