import { ZRoute, AuthGuard } from '../../framework';
import { UserComponent } from './user.component';

export const routes: ZRoute[] = [
    {
        path: '', component: UserComponent, children: [
            { path: '', redirectTo: 'client', pathMatch: 'prefix' },
            { path: 'client', loadChildren: './+client#UserClientModule'},
            { path: 'constr', loadChildren: './+constr#UserConstrModule' },
        ], canActivate: [AuthGuard]
    }
];
