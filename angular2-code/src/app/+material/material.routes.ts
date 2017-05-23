import { ZRoute, AuthGuard } from '../../framework';
import { MaterialComponent } from './material.component';

export const routes: ZRoute[] = [
    {
        path: '', component: MaterialComponent, children: [
            { path: '', redirectTo: 'provider', pathMatch: 'prefix' },
            { path: 'provider', loadChildren: './+provider#MaterialProviderModule' },
            { path: 'brands', loadChildren: './+brands#MaterialBrandsModule' },
            { path: 'advertise', loadChildren: './+advertise#MaterialAdvertiseModule'},
            { path: 'categories', loadChildren: './+categories#MaterialCategoriesModule' }
        ], canActivate: [AuthGuard]
    },
];
