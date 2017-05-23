import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
    MdSnackBarModule,
    MdButtonModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdTooltipModule
} from '@angular/material';

import { CategoriesComponent } from './categories.component';
import { FrameworkModule } from '../../../framework/index';
import { UtilsModule } from '../../../utils/index';
import { routes } from './categories.routes';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MaterialEditComponent } from './material-edit/material-edit.component';
import {
    MaterialCategoriesAdapterModule,
    MaterialBrandsAdapterModule,
    MaterialProviderAdapterModule,
    MaterialAdapterModule
} from '../../../data-adapters/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FrameworkModule,
        UtilsModule,
        RouterModule.forChild(routes),
        MdSnackBarModule,
        MdButtonModule,
        MdDialogModule,
        MdIconModule,
        MdInputModule,
        MdTooltipModule,
        MaterialCategoriesAdapterModule,
        MaterialBrandsAdapterModule,
        MaterialProviderAdapterModule,
        MaterialAdapterModule
    ],
    declarations: [
        CategoriesComponent,
        CategoryEditComponent,
        MaterialEditComponent
    ],
    exports: [
        CategoriesComponent,
    ],
    entryComponents: [
        CategoryEditComponent,
        MaterialEditComponent
    ]
})
export class MaterialCategoriesModule { }
