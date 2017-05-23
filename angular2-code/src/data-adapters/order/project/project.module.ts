import { NgModule } from '@angular/core';
import { SecurityModule } from '../../../framework/security/security.module';

import { ClientProjectAdapter } from './project.adapter';
import { ClientProjectService } from './project.service';
@NgModule({
    imports: [ SecurityModule ],
    providers: [ ClientProjectAdapter, ClientProjectService ]
})

export class OrderProjectAdapterModule {

}
