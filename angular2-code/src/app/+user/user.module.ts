import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FrameworkModule } from '../../framework';

import { UserComponent } from './user.component';

import { routes } from './user.routes';

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FrameworkModule
  ]
})
export class UserModule {
  public static routes = routes;
}
