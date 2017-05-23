import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    MdAutocompleteModule,
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    MdSnackBarModule,
    MdTooltipModule
} from '@angular/material';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { AdvertiseComponent } from './advertise.component';
import { PhotoComponent } from './photo/photo.component';
import { AddPhotoComponent } from './photo/add/add.component';
import { DelComponent } from './del/del.component';
import { AdvertisePhotoAdapterModule, MaterialAdapterModule } from '../../../data-adapters/material';
import { routes } from './advertise.routes';
import { MaterialCategoriesAdapterModule } from '../../../data-adapters/material';

@NgModule({
    declarations: [
        AdvertiseComponent,
        PhotoComponent,
        AddPhotoComponent,
        DelComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FrameworkModule,
        MdAutocompleteModule,
        MdButtonModule,
        MdDialogModule,
        MdInputModule,
        MdSnackBarModule,
        MdTooltipModule,
        MaterialCategoriesAdapterModule,
        MaterialAdapterModule,
        RouterModule.forChild(routes),
        AdvertisePhotoAdapterModule,
        UtilsModule
    ],
    entryComponents: [
        PhotoComponent,
        AddPhotoComponent,
        DelComponent
    ]
})
export class MaterialAdvertiseModule { }
