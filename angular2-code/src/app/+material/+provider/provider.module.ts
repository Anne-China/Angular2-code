import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MdSnackBarModule,
    MdRippleModule,
    MdButtonModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule
} from '@angular/material';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { ProviderComponent } from './provider.component';
import { ProviderEditComponent } from './edit/edit.component';
import { ProviderDeleteComponent } from './del/del.component';
import { MaterialProviderAdapterModule } from '../../../data-adapters/material';
import { routes } from './provider.routes';

@NgModule({
    declarations: [
        ProviderComponent,
        ProviderEditComponent,
        ProviderDeleteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FrameworkModule,
        UtilsModule,
        RouterModule.forChild(routes),
        MdSnackBarModule,
        MdRippleModule,
        MdButtonModule,
        MdDialogModule,
        MdIconModule,
        MdInputModule,
        MaterialProviderAdapterModule
    ],
    entryComponents: [
        ProviderEditComponent,
        ProviderDeleteComponent
    ]
})
export class MaterialProviderModule { }
