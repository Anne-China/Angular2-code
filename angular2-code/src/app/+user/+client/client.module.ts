import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdSnackBarModule, MdButtonModule, MdRippleModule, MdDialogModule, MdInputModule } from '@angular/material';

import { UtilsModule } from '../../../utils';
import { FrameworkModule } from '../../../framework';

import { UserClientAdapterModule } from '../../../data-adapters/user';
import { ClientComponent } from './client.component';
import { routes } from './client.routes';

@NgModule({
    declarations: [
        ClientComponent
    ],
    imports: [
        CommonModule,
        UserClientAdapterModule,
        FormsModule,
        FrameworkModule,
        MdSnackBarModule,
        MdButtonModule,
        MdRippleModule,
        MdDialogModule,
        MdInputModule,
        RouterModule.forChild(routes),
        UtilsModule
    ]
})
export class UserClientModule {

}
