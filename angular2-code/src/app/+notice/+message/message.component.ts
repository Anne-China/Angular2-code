import {Component, Host, OnDestroy, ViewChild} from '@angular/core';

import { LayoutComponent } from '../../../framework';
import { DataGridComponent } from '../../../utils';
@Component({
    templateUrl: 'message.component.html',
    styleUrls: ['message.component.scss']
})
export class MessageComponent implements OnDestroy {
    constructor(
        @Host() public layout: LayoutComponent
    ) {
        this.layout.addBreadcrumb('公告管理', './notice/message');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
    @ViewChild('messageDataGrid') public dataGrid: DataGridComponent;
}
