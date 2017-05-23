import { MessageComponent } from './message.component';
import { ZRoute, AuthGuard } from '../../../framework';

export const routes: ZRoute[] = [
    {
        path: '', component: MessageComponent, canActivate: [AuthGuard]
    }
];
