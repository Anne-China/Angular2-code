import { Component, Host, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataGridComponent, DataLoaderParameter } from '../../../utils';
import { MdDialog, MdSnackBar } from '@angular/material';
import { LayoutComponent } from '../../../framework';

import { GlobalDicts } from '../../../data-adapters/app.dicts';
import { PhoneAppService, PhoneApp } from '../../../data-adapters/system';
import { PhoneAppEditComponent } from './edit/edit.component';

@Component({
    templateUrl: 'phone-app.component.html',
    styleUrls: ['phone-app.component.scss']
})
export class PhoneAppComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() private layout: LayoutComponent,
        public srv: PhoneAppService,
        public dialog: MdDialog,
        public snackBar: MdSnackBar,
    ) {
        this.layout.addBreadcrumb('App管理', './phoneApp');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
    public ngAfterViewInit() {
        this.queryData();
    }

    public get dicts() {
        return GlobalDicts.System.PhoneApp;
    }
    public queryData() {
        this.dataGrid.loadData();
    }

    public query = {
        VersionNumber: null,
        TypeId: null
    };
    public getFilter = () => {
        return {...this.query};
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;
    public phoneAppLoader = (parameter: DataLoaderParameter) => {
        return this.srv.queryPhoneApp(parameter);
    }

    public addVersion() {
        this.dialog.open(PhoneAppEditComponent, {
            disableClose: true,
            width: '700px'
        }).afterClosed().subscribe((value: PhoneApp) => {
            if (value != null) {
                this.srv.addPhoneApp(value).subscribe(() => {
                    this.queryData();
                    this.snackBar.open(`发布版本“${value.VersionNumber}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }
}
