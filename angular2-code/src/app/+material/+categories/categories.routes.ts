import { ZRoute, AuthGuard } from '../../../framework';
import { CategoriesComponent } from './categories.component';

export const routes: ZRoute[] = [
    {
        path: '', component: CategoriesComponent, canActivate: [AuthGuard]
    }
];
