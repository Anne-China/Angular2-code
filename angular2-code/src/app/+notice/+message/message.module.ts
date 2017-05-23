import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdInputModule, MdButtonModule } from '@angular/material';

import { FrameworkModule } from '../../../framework';
import { UtilsModule } from '../../../utils';

import { MessageComponent } from './message.component';
import { routes } from './message.routes';

@NgModule({
    declarations: [
        MessageComponent
    ],
    imports: [
        FrameworkModule,
        MdInputModule,
        MdButtonModule,
        RouterModule.forChild(routes),
        UtilsModule
    ]
})
export class NoticeMessageModule { }
