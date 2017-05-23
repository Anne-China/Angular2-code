import { NgModule } from '@angular/core';
import { UserClientAdapter } from './client.adapter';
import { UserClientService } from './client.service';
import { SecurityModule } from '../../../framework/security/security.module';

@NgModule({
    imports: [SecurityModule],
    providers: [
        UserClientAdapter, UserClientService
    ]
})
export class UserClientAdapterModule { }
