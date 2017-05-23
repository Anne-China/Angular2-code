import { NgModule } from '@angular/core';
import { SecurityModule } from '../../../framework';

import { PhoneAppAdapter } from './phone-app.adapter';
import { PhoneAppService } from './phone-app.service';

@NgModule({
    imports: [
        SecurityModule
    ],
    providers: [
        PhoneAppAdapter,
        PhoneAppService
    ]
})
export class SystemPhoneAppAdapterModule { }
