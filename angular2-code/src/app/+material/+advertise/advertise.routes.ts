import { ZRoute, AuthGuard } from '../../../framework';
import { AdvertiseComponent } from './advertise.component';

export const routes: ZRoute[] = [
    {
        path: '', component: AdvertiseComponent, canActivate: [AuthGuard]
    }
];
