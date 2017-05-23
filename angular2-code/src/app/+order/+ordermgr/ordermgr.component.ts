import { Component, Host, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataGridComponent, DataLoaderParameter } from '../../../utils';
import { LayoutComponent } from '../../../framework';
import { OrderMgrService, OrderMgr } from '../../../data-adapters/order/ordermgr';

@Component({
    templateUrl: 'ordermgr.component.html',
    styleUrls: ['ordermgr.component.scss']
})
export class OrderMgrComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() public layout: LayoutComponent,
        public srv: OrderMgrService,
        private router: Router
    ) {
        this.layout.addBreadcrumb('订单管理', './ordermgr/ordermgr');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;
    public ngAfterViewInit() {
        this.queryData();
    }
    public queryData() {
        this.dataGrid.loadData();
    }
    public orderLoader = (parameter: DataLoaderParameter) => {
        return this.srv.queryOrder(parameter);
    }
    public query = {
        Name: null
    };
    public getFilter = () => {
        return { ...this.query };
    }

    public showProjectDetail(order: OrderMgr) {
        this.router.navigateByUrl(`/order/project/${order.Pid}`);
    }
}
