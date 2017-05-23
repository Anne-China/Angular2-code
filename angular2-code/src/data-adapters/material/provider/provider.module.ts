import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SecurityModule } from '../../../framework';

import { ProviderAdapter } from './provider.adapter';
import { ProviderService } from './provider.service';

@NgModule({
    imports: [HttpModule, SecurityModule],
    providers: [ProviderAdapter, ProviderService],
})
export class MaterialProviderAdapterModule { }
