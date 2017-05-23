import { NgModule } from '@angular/core';
import { SecurityAdapter } from './security.adapter';
import { SecurityService } from './security.service';

@NgModule({
    providers: [SecurityAdapter, SecurityService],
})
export class SecurityAdapterModule { }
