import { NgModule } from '@angular/core';
import { SecurityModule } from '../../../framework';

import { MaterialAdapter } from './material.adapter';
import { MaterialService } from './material.service';

@NgModule({
    imports: [SecurityModule],
    providers: [MaterialAdapter, MaterialService]
})
export class MaterialAdapterModule { }
