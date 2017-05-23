import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { Code404Component, AuthGuard, ZRoute } from '../framework';

export const ROUTES: ZRoute[] = [
  { path: 'login', component: LoginComponent },
  { path: 'login/:access', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'system', loadChildren: './+system#SystemModule'},
  { path: 'user', loadChildren: './+user#UserModule'},
  { path: 'order', loadChildren: './+order#OrderModule'},
  { path: 'material', loadChildren: './+material#MaterialModule'},
  { path: 'notice', loadChildren: './+notice#NoticeModule'},
  { path: '**', component: Code404Component },
];
