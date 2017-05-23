import { Component, ViewChild, OnDestroy, Host, AfterViewInit } from '@angular/core';
import { DataGridComponent, DataLoaderParameter } from '../../../utils';
import { LayoutComponent } from '../../../framework';
import { UserClientService } from '../../../data-adapters/user';

@Component({
    templateUrl: 'client.component.html',
    styleUrls: ['client.component.scss'],
})
export class ClientComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() public layout: LayoutComponent,
        private srv: UserClientService
    ) {
        this.layout.addBreadcrumb('注册用户管理', './constr');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;
    public ngAfterViewInit() {
        this.queryData();
    }
    public query = {
        Phone: null,
        MxcomeID: null,
    };
    public getFilter = () => {
        return { ...this.query };
    }
    public usersLoader = (parameter: DataLoaderParameter) => {
        return this.srv.queryUsers(parameter);
    }
    public queryData() {
        this.dataGrid.loadData();
    }
}
