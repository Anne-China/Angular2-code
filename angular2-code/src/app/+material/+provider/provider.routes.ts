import { ZRoute, AuthGuard } from '../../../framework';
import { ProviderComponent } from './provider.component';

export const routes: ZRoute[] = [
    {
        path: '', component: ProviderComponent, canActivate: [AuthGuard]
    }
];
