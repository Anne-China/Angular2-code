import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent } from '../../framework';

@Component({
    templateUrl: 'order.component.html',
    styleUrls: ['order.component.scss'],
})

export class OrderComponent implements OnInit, OnDestroy {
    @ViewChild(LayoutComponent) public layout: LayoutComponent;

    public ngOnInit() {
        this.layout.addBreadcrumb('工程管理', '/ordermgr');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
}
