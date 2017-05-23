import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FrameworkModule } from '../../framework';

import { OrderComponent } from './order.component';
import { routes } from './order.routes';
@NgModule({
    declarations: [
        OrderComponent
    ],
    imports: [
        FrameworkModule,
        RouterModule.forChild(routes)
    ]
})

export class OrderModule {
    public static routes = routes;
}
