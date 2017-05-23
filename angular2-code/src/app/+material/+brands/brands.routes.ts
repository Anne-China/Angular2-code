import { ZRoute, AuthGuard } from '../../../framework';
import { BrandsComponent } from './brands.component';

export const routes: ZRoute[] = [
    {
        path: '', component: BrandsComponent, canActivate: [AuthGuard]
    }
];
