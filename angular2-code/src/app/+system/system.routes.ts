import { ZRoute } from '../../framework';
import { SystemComponent } from './system.component';

export const routes: ZRoute[] = [
    {
        path: '', component: SystemComponent, children: [
            {   path: '', redirectTo: 'phoneApp', pathMatch: 'prefix' },
            {   path: 'phoneApp', loadChildren: './+phone-app#SystemPhoneAppModule' }
        ]
    }
];
