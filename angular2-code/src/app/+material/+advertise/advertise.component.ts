import { Component, Host, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';

import { DataGridComponent, DataLoaderParameter } from '../../../utils';
import { LayoutComponent } from '../../../framework';
import { PhotoService, Photo } from '../../../data-adapters/material';
import { PhotoComponent } from './photo/photo.component';
import { AddPhotoComponent } from './photo/add/add.component';
import { DelComponent } from './del/del.component';

@Component({
    templateUrl: 'advertise.component.html',
    styleUrls: ['advertise.component.scss']
})

export class AdvertiseComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() private layout: LayoutComponent,
        public dialog: MdDialog,
        public srv: PhotoService,
        public snackBar: MdSnackBar
    ) {
        this.layout.addBreadcrumb('广告管理', './advertise');
    }

    public ngOnDestroy() {
        return this.layout.removeLastBreadcrumb();
    }

    public ngAfterViewInit() {
        this.queryData();
    }
    public queryData() {
        this.dataGrid.loadData();
    }
    public query = {
        BrandId: null,
        Location: null
    };
    public getFilter = () => {
        return { ...this.query };
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;

    public advertiseLoader = (parameter: DataLoaderParameter) => {
        return this.srv.queryPhoto(parameter);
    }
    public advertiseLocationLoader = () => {
        return this.srv.queryAdvertiseLocation().map((res) => res.data);
    }
    public brandsLoader = () => {
        return this.srv.queryBrandsById().map((res) => res.data);
    }

    public seePhoto(photo: Photo) {
        this.dialog.open(PhotoComponent, {
            disableClose: true,
            width: '700px',
            data: photo
        }).afterClosed().subscribe(() => {
            this.queryData();
        });
    }

    public addAdvertise() {
        this.dialog.open(AddPhotoComponent, {
            disableClose: true,
            width: '700px'
        }).afterClosed().subscribe((value: Photo) => {
            if (value != null) {
                this.srv.addAdvertise(value).subscribe(() => {
                    this.queryData();
                    this.snackBar.open(`新增广告“${value.Name}”成功。`, null, { duration: 1000 });
                });
            }
        });
    }

    public delAdvertise() {
        if (this.dataGrid.selectedItem) {
            this.dialog.open(DelComponent, {
                disableClose: true,
                data: this.dataGrid.selectedItem,
                width: '500px'
            }).afterClosed().subscribe((value: boolean) => {
                if (value) {
                    this.srv.delAdvertise(this.dataGrid.selectedItem).subscribe(() => {
                        this.queryData();
                        this.snackBar.open(`删除广告成功。`, null, { duration: 1000 });
                    });
                }
            });
        } else {
            this.snackBar.open(`请选择要删除的广告！`, null, { duration: 1000 });
        }
    }
}
