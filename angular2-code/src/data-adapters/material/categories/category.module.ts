import { NgModule } from '@angular/core';
import { SecurityModule } from '../../../framework';

import { CategoriesAdapter } from './category.adapter';
import { CategoriesService } from './category.service';

@NgModule({
    imports: [SecurityModule],
    providers: [CategoriesAdapter, CategoriesService],
})
export class MaterialCategoriesAdapterModule { }
