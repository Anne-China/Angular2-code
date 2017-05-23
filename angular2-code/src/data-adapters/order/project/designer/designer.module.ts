import { NgModule } from '@angular/core';
import { SecurityModule } from '../../../../framework/security/security.module';

import { DesignerService } from './designer.service';
import { DesignerAdapter } from './designer.adapter';
@NgModule({
    imports: [ SecurityModule ],
    providers: [
        DesignerService,
        DesignerAdapter
    ]
})
export class DesignerAdapterModule {

}
