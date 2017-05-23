import { Component, ViewChild, Host, OnDestroy, AfterViewInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { LayoutComponent } from '../../../framework/index';
import { Brand, BrandsService, ProviderService } from '../../../data-adapters/material';
import { DataLoaderParameter, DataGridComponent } from '../../../utils/index';

import { BrandEditComponent } from './edit/edit.component';
import { BrandDeleteComponent } from './del/del.component';

@Component({
    templateUrl: 'brands.component.html',
    styleUrls: ['brands.component.scss']
})

export class BrandsComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() private layout: LayoutComponent,
        private srv: BrandsService,
        private providerSrv: ProviderService,
        private dialog: MdDialog,
        private snackBar: MdSnackBar) {
        this.layout.addBreadcrumb('品牌管理', './brands');
    }

    public ngAfterViewInit() {
        this.queryData();
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }

    public query = {
        Name: null,
        ProviderID: null
    };

    public getFilter = () => {
        return { ...this.query };
    }

    public brandsLoader = (paramter: DataLoaderParameter) => {
        return this.srv.queryBrands(paramter);
    }

    public providersLoader = (parameter: DataLoaderParameter) => {
        return this.providerSrv.queryProviders(parameter).map((res) => res.data);
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;
    public queryData() {
        this.dataGrid.loadData();
    }

    public addBrand() {
        this.dialog.open(BrandEditComponent, {
            disableClose: true,
            width: '700px'
        }).afterClosed().subscribe((value: Brand) => {
            if (value != null) {
                this.srv.addBrand(value).subscribe(() => {
                    this.queryData();
                    this.snackBar.open(`新增品牌“${value.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }

    public editBrand(brand: Brand) {
        this.dialog.open(BrandEditComponent, {
            disableClose: true,
            width: '700px',
            data: brand
        }).afterClosed().subscribe((value: Brand) => {
            if (value != null) {
                this.srv.editBrand(value).subscribe(() => {
                    Object.assign(brand, value);
                    this.snackBar.open(`修改品牌“${value.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }

    public delBrand(brand: Brand) {
        this.dialog.open(BrandDeleteComponent, {
            disableClose: true,
            data: brand,
            width: '500px'
        }).afterClosed().subscribe((value: boolean) => {
            if (value) {
                this.srv.delBrand(value).subscribe(() => {
                    this.queryData();
                    this.snackBar.open(`删除供应商“${brand.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }
}
