import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent } from '../../framework/index';

@Component({
    templateUrl: 'material.component.html'
})
export class MaterialComponent implements OnInit, OnDestroy {
    @ViewChild(LayoutComponent) public layout: LayoutComponent;

    public ngOnInit() {
        this.layout.addBreadcrumb('材料管理', '/material');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
}
