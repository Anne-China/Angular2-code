import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import {
    MdInputModule,
    MdButtonModule,
    MdDialogModule,
    MdRadioModule,
    MdSnackBarModule
} from '@angular/material';
import { PhoneAppComponent } from './phone-app.component';
import { SystemPhoneAppAdapterModule } from '../../../data-adapters/system';
import { PhoneAppEditComponent } from './edit/edit.component';
import { routes } from './phone-app.routes';

@NgModule({
    declarations: [
        PhoneAppComponent,
        PhoneAppEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FrameworkModule,
        MdButtonModule,
        MdInputModule,
        MdDialogModule,
        MdRadioModule,
        MdSnackBarModule,
        RouterModule.forChild(routes),
        SystemPhoneAppAdapterModule,
        UtilsModule
    ],
    entryComponents: [
        PhoneAppEditComponent
    ]
})

export class SystemPhoneAppModule { }
