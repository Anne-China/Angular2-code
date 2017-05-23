import { NoticeComponent } from './notice.component';
import { ZRoute, AuthGuard } from '../../framework';

export const routes: ZRoute[] = [
    {
        path: '', component: NoticeComponent, children: [
        { path: '', redirectTo: 'message', pathMatch: 'prefix' },
        { path: 'message', loadChildren: './+message#NoticeMessageModule'}
    ], canActivate: [AuthGuard]
    }
];
