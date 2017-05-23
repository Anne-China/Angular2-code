import { NgModule } from '@angular/core';
import { SecurityModule } from '../../../framework';

import { BrandsAdapter } from './brands.adapter';
import { BrandsService } from './brands.service';

@NgModule({
    imports: [SecurityModule],
    providers: [BrandsAdapter, BrandsService]
})
export class MaterialBrandsAdapterModule { }
