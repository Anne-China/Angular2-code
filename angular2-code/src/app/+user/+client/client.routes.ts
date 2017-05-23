import { ZRoute, AuthGuard } from '../../../framework';
import { ClientComponent } from './client.component';

export const routes: ZRoute[] = [
    {
        path: '', component: ClientComponent, canActivate: [AuthGuard]
    }
];
