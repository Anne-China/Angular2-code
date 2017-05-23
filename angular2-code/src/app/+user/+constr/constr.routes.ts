import { ZRoute, AuthGuard } from '../../../framework';
import { ConstrComponent } from './constr.component';

export const routes: ZRoute[] = [
    {
        path: '', component: ConstrComponent, canActivate: [AuthGuard]
    }
];
