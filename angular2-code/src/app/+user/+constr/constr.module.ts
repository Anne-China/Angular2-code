import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MdSnackBarModule,
    MdRippleModule,
    MdButtonModule,
    MdDialogModule,
    MdChipsModule,
    MdInputModule
} from '@angular/material';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { ConstrComponent } from './constr.component';
import { UserConstrAdapterModule } from '../../../data-adapters/user';
import { routes } from './constr.routes';

@NgModule({
    declarations: [
        ConstrComponent
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
        MdChipsModule,
        MdInputModule,
        UserConstrAdapterModule
    ]
})
export class UserConstrModule { }
