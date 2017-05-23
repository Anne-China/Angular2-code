import { ZRoute, AuthGuard } from '../../../framework';
import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './detail/detail.component';

export const routes: ZRoute[] = [
    {
        path: '', component: ProjectComponent, canActivate: [AuthGuard]
    },
    {
        path: ':pid', component: ProjectDetailComponent, canActivate: [AuthGuard]
    }
];
