import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FrameworkModule } from '../../framework/index';

import { MaterialComponent } from './material.component';
import { routes } from './material.routes';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FrameworkModule
    ],
    declarations: [
        MaterialComponent
    ],
    exports: [
        MaterialComponent
    ]
})
export class MaterialModule { }
