import { NgModule } from '@angular/core';
import { OrderMgrAdapter } from './ordermgr.adapter';
import { OrderMgrService } from './ordermgr.service';
import { SecurityModule } from '../../../framework/security';

@NgModule({
    imports: [
        SecurityModule
    ],
    providers: [
        OrderMgrAdapter,
        OrderMgrService
    ]
})
export class OrderOrderMgrAdapterModule {

}
