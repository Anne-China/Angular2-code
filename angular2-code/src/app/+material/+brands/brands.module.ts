import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MdSnackBarModule,
    MdButtonModule,
    MdRippleModule,
    MdDialogModule,
    MdInputModule,
    MdAutocompleteModule
} from '@angular/material';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { BrandsComponent } from './brands.component';
import { BrandEditComponent } from './edit/edit.component';
import { routes } from './brands.routes';
import { MaterialBrandsAdapterModule, MaterialProviderAdapterModule } from '../../../data-adapters/material';
import { BrandDeleteComponent } from './del/del.component';

@NgModule({
    declarations: [
        BrandsComponent,
        BrandEditComponent,
        BrandDeleteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FrameworkModule,
        MdSnackBarModule,
        MdInputModule,
        MdButtonModule,
        MdRippleModule,
        MdDialogModule,
        MdAutocompleteModule,
        MaterialBrandsAdapterModule,
        MaterialProviderAdapterModule,
        UtilsModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [
        BrandEditComponent,
        BrandDeleteComponent
    ]
})
export class MaterialBrandsModule { }
