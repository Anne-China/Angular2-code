import { Component, Host, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { LayoutComponent } from '../../../framework/index';
import { DataLoaderParameter, DataGridComponent } from '../../../utils/index';
import { Provider, ProviderService } from '../../../data-adapters/material';
import { ProviderEditComponent } from './edit/edit.component';
import { ProviderDeleteComponent } from './del/del.component';

@Component({
    templateUrl: 'provider.component.html',
    styleUrls: ['provider.component.scss']
})
export class ProviderComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() private layout: LayoutComponent,
        private srv: ProviderService,
        private dialog: MdDialog,
        private snackBar: MdSnackBar) {
        this.layout.addBreadcrumb('供应商管理', './provider');
    }

    public ngAfterViewInit() {
        this.queryData();
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }

    public query = {
        Name: null
    };

    public getFilter = () => {
        return { ...this.query };
    }

    public providersLoader = (paramter: DataLoaderParameter) => {
        return this.srv.queryProviders(paramter);
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;
    public queryData() {
        this.dataGrid.loadData();
    }

    public addProvider() {
        this.dialog.open(ProviderEditComponent, {
            disableClose: true,
            width: '600px'
        }).afterClosed().subscribe((value: Provider) => {
            if (value != null) {
                this.srv.addProvider(value).subscribe(() => {
                    this.queryData();
                    this.snackBar.open(`新增供应商“${value.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }

    public editProvider(provider: Provider) {
        this.dialog.open(ProviderEditComponent, {
            disableClose: true,
            data: provider,
            width: '600px'
        }).afterClosed().subscribe((value: Provider) => {
            if (value != null) {
                this.srv.editProvider(value).subscribe(() => {
                    Object.assign(provider, value);
                    this.snackBar.open(`修改供应商“${value.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }

    public delProvider(provider: Provider) {
        this.dialog.open(ProviderDeleteComponent, {
            disableClose: true,
            data: provider,
            width: '500px'
        }).afterClosed().subscribe((value: boolean) => {
            if (value) {
                this.srv.delProvider(value).subscribe(() => {
                    this.queryData();
                    this.snackBar.open(`删除供应商“${provider.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }
}
