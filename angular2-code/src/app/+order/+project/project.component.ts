import { Component, ViewChild, Host, OnDestroy, AfterViewInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DataGridComponent, DataLoaderParameter } from '../../../utils';
import { LayoutComponent } from '../../../framework';

import { DesignerComponent } from './designer/designer.component';
import { DesignerDetailComponent } from './designer-detail/designer-detail.component';
import { IsBlank } from '../../../utils/func';
import {
    AppointDesignerService,
    ClientProjectService,
    ClientProject,
    ChangeDesignerService,
    Designer,
    DesignerService
} from '../../../data-adapters/order';

@Component({
    templateUrl: 'project.component.html',
    styleUrls: ['project.component.scss'],
})
export class ProjectComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() public layout: LayoutComponent,
        public srv: ClientProjectService,
        public appointDesignerSrv: AppointDesignerService,
        public changeDesignerSrv: ChangeDesignerService,
        public designerSrv: DesignerService,
        public dialog: MdDialog,
        public snackBar: MdSnackBar
    ) {
        this.layout.addBreadcrumb('工程管理', '/ordermgr/project');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }
    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;

    public queryData() {
        this.dataGrid.loadData();
    }
    public ngAfterViewInit() {
        this.queryData();
    }
    public query = {
        Publisher: null,
        ContactPhone: null
    };
    public getFilter = () => {
        return { ...this.query };
    }
    public projectLoader = (parameter: DataLoaderParameter) => {
        return this.srv.queryProject(parameter);
    }

    public openDesigner(clientProject: ClientProject) {
        this.dialog.open(DesignerComponent, {
            disableClose: true,
            width: '800px',
            data: clientProject
        }).afterClosed().subscribe((value: Designer) => {
            if (clientProject.DesignerName) {
                if (value != null) {
                    this.changeDesignerSrv.ChangeDesigner(value, clientProject.ID).subscribe(() => {
                        this.queryData();
                        this.snackBar.open(`更换设计师成功！`, null, { duration: 1000 });
                    });
                }
            } else {
                if (value != null) {
                    this.appointDesignerSrv.AppointDesigner(value, clientProject.ID).subscribe(() => {
                        this.queryData();
                        this.snackBar.open(`指派设计师成功！`, null, { duration: 1000 });
                    });
                }
            }
        });
    }

    public designerDetail(clientProject: ClientProject) {
        this.dialog.open(DesignerDetailComponent, {
            disableClose: true,
            width: '600px',
            data: clientProject
        });
    }
}
