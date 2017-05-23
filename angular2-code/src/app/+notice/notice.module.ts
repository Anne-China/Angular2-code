import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FrameworkModule } from '../../framework';
import { NoticeComponent } from './notice.component';
import { routes } from './notice.routes';

@NgModule({
    declarations: [
        NoticeComponent
    ],
    imports: [
        FrameworkModule,
        RouterModule.forChild(routes)
    ]
})
export class NoticeModule { }
