import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { MdInputModule, MdButtonModule } from '@angular/material';
import { OrderMgrComponent } from './ordermgr.component';
import { routes } from './ordermgr.routes';
import { OrderOrderMgrAdapterModule } from '../../../data-adapters/order';
@NgModule({
    declarations: [
        OrderMgrComponent
    ],
    imports: [
        CommonModule,
        OrderOrderMgrAdapterModule,
        FormsModule,
        FrameworkModule,
        MdInputModule,
        MdButtonModule,
        RouterModule.forChild(routes),
        UtilsModule
    ]
})
export class OrderOrderMgrModule {

}
