import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { LayoutComponent } from '../../framework';

@Component({
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
    @ViewChild(LayoutComponent) public layout: LayoutComponent;

    public ngOnInit() {
        this.layout.addBreadcrumb('注册用户', '/user');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
}
