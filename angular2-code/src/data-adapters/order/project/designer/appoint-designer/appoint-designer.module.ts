import { NgModule } from '@angular/core';

import { AppointDesignerService } from './appoint-designer.service';
import { AppointDesignerAdapter } from './appoint-designer.adapter';
@NgModule({
    providers: [
        AppointDesignerService,
        AppointDesignerAdapter
    ]
})
export class AppointDesignerAdapterModule {

}
