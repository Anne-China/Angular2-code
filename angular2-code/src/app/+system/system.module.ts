import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FrameworkModule } from '../../framework';

import { SystemComponent } from './system.component';
import { routes } from './system.routes';

@NgModule({
    declarations: [
        SystemComponent
    ],
    imports: [
        FrameworkModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        SystemComponent
    ]
})
export class SystemModule { }
