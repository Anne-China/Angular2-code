import { ZRoute, AuthGuard } from '../../../framework';
import { PhoneAppComponent } from './phone-app.component';

export const routes: ZRoute[] = [
    {
        path: '', component: PhoneAppComponent, canActivate: [AuthGuard]
    }
];
