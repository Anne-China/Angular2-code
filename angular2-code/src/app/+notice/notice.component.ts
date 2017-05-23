import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';

import { LayoutComponent } from '../../framework';
@Component({
    templateUrl: 'notice.component.html',
    styleUrls: ['notice.component.scss']
})

export class NoticeComponent implements OnInit, OnDestroy {
    @ViewChild(LayoutComponent) public layout: LayoutComponent;

    public ngOnInit() {
        this.layout.addBreadcrumb('消息管理', '/notice');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
}
