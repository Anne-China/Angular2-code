import { ZRoute, AuthGuard } from '../../../framework';
import { OrderMgrComponent } from './ordermgr.component';

export const routes: ZRoute[] = [
    {
        path: '', component: OrderMgrComponent, canActivate: [AuthGuard]
    }
];
