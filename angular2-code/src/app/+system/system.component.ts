import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent } from '../../framework';
@Component({
    templateUrl: 'system.component.html'
})
export class SystemComponent implements OnInit, OnDestroy {
   @ViewChild(LayoutComponent) public layout: LayoutComponent;
    public ngOnInit() {
       return this.layout.addBreadcrumb('系统管理', './system');
    }
    public ngOnDestroy() {
       return this.layout.removeLastBreadcrumb();
    }
}
