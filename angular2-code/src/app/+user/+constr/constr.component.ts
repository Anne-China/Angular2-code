import { Component, Host, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { LayoutComponent } from '../../../framework';

import { UserConstr, UserConstrService } from '../../../data-adapters/user';
import { DataLoaderParameter, DataGridComponent, DataGridRow } from '../../../utils';
import { IsBlank } from '../../../utils/func';
import { GlobalDicts } from '../../../data-adapters/app.dicts';

@Component({
    templateUrl: 'constr.component.html',
    styleUrls: ['constr.component.scss']
})
export class ConstrComponent implements OnDestroy, AfterViewInit {
    constructor(
        @Host() private layout: LayoutComponent,
        private srv: UserConstrService,
        private snackBar: MdSnackBar) {
        this.layout.addBreadcrumb('注册用户管理', './list');
    }

    public ngOnDestroy() {
        this.layout.removeLastBreadcrumb();
    }

    public ngAfterViewInit() {
        this.queryData();
    }

    public get dicts() {
        return GlobalDicts.Construction.User;
    }

    public query = {
        name: null,
        phone: null,
        type: null,
        ceStatus: null,
        trStatus: null
    };

    public getFilter = () => {
        return { ...this.query };
    }

    public usersLoader = (paramter: DataLoaderParameter) => {
        return this.srv.queryUsers(paramter);
    }

    @ViewChild(DataGridComponent) public dataGrid: DataGridComponent;
    public queryData() {
        this.dataGrid.loadData();
    }

    public onRowExpandStatusChanged(e: DataGridRow<UserConstr>) {
        if (e.$$expanded) {
            this.feedbacks[e.data.ID] = e.data.CertInfo == null ? null : e.data.CertInfo.FailedDescription;
        } else {
            delete this.feedbacks[e.data.ID];
        }
    }

    public feedbacks: { [key: string]: string } = {};

    public notSubmit(e: Event) {
        if (e != null) {
            e.preventDefault();
        }
    }

    public certPass(user: UserConstr) {
        this.srv.auditUser(user.ID, `5${user.TrainingStatusID}`).subscribe(() => {
            user.CertStatusID = 5;
            user.CertStatus = this.dicts.Status.Certification[5];
            if (user.CertInfo == null) {
                user.CertInfo = {};
            }
            this.feedbacks[user.ID] = user.CertInfo.FailedDescription = null;
            this.snackBar.open(`设定用户“${user.Name}”审核认证通过完成。`, null, { duration: 1000 });
        });
    }

    public certFailed(user: UserConstr) {
        if (IsBlank(this.feedbacks[user.ID])) {
            this.snackBar.open(`请填写认证不通过的原因。`, null, { duration: 2000 });
            return;
        }
        this.srv.auditUser(user.ID, `4${user.TrainingStatusID}`, this.feedbacks[user.ID]).subscribe(() => {
            user.CertStatusID = 4;
            user.CertStatus = this.dicts.Status.Certification[4];
            if (user.CertInfo == null) {
                user.CertInfo = {};
            }
            user.CertInfo.FailedDescription = this.feedbacks[user.ID];
            this.snackBar.open(`设定用户“${user.Name}”审核认证不通过完成。`, null, { duration: 1000 });
        });
    }
}
