import { NgModule } from '@angular/core';

import { SecurityModule } from '../../../framework/security/security.module';

import { UserConstrAdapter } from './constr.adapter';
import { UserConstrService } from './constr.service';

@NgModule({
    imports: [SecurityModule],
    providers: [UserConstrAdapter, UserConstrService],
})
export class UserConstrAdapterModule { }
