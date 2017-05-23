import { ZRoute, AuthGuard } from '../../framework';
import { OrderComponent } from './order.component';

export const routes: ZRoute[] = [
    {
        path: '', component: OrderComponent, children: [
            { path: '', redirectTo: 'ordermgr', pathMatch: 'prefix' },
            { path: 'ordermgr', loadChildren: './+ordermgr#OrderOrderMgrModule'},
            { path: 'project', loadChildren: './+project#OrderProjectModule'},
        ], canActivate: [AuthGuard]
    }
];
