import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { MCAjax, AjaxException } from '../../utils';
import { ApiHosts } from '../api.config';

import { Observable, Observer } from 'rxjs/Rx';
import { SystemUser } from './systemuser';
import { SystemRole } from './systemrole';
import { UserSpecialPrivilege } from './user-special-privilege';
import { Privilege } from './privilege';
import { SecurityAdapter } from './security.adapter';

@Injectable()
export class SecurityService {
    constructor(private http: Http, private adapter: SecurityAdapter) { }

    public isLogin(): Observable<SystemUser> {
        return Observable.create((observer: Observer<SystemUser>) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                method: RequestMethod.Post,
                url: 'main/isLogin.do'
            }).success((response: any) => {
                const user = this.adapter.login(response);
                if (user == null) {
                    observer.error(null);
                } else {
                    observer.next(user);
                }
            }).error((ex: AjaxException) => {
                observer.error(ex);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public login(username: string, password: string): Observable<SystemUser> {
        return Observable.create((observer: Observer<SystemUser>) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                method: RequestMethod.Post,
                url: 'admin_doLogin.do',
                datas: { user_name: username, pwd: password }
            }).success((response: any) => {
                const user = this.adapter.login(response);
                if (user == null) {
                    observer.error(null);
                } else {
                    observer.next(user);
                }
            }).error((ex: AjaxException) => {
                observer.error(ex);
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public getUserPrivilegeDetail(userid: string):
        Observable<{ roles: SystemRole[], privileges: UserSpecialPrivilege[] }> {
        return Observable.create((observer: Observer<{ roles: SystemRole[], privileges: UserSpecialPrivilege[] }>) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                method: RequestMethod.Post,
                url: 'menu/queryUserFun.do',
                datas: { user_id: userid }
            }).success((response: any) => {
                observer.next(this.adapter.queryUserPrivilege(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }

    public getRolePrivileges(roleid: number): Observable<Privilege[]> {
        return Observable.create((observer: Observer<Privilege[]>) => {
            MCAjax.Create(this.http, ApiHosts.main).request({
                method: RequestMethod.Post,
                url: 'menu/queryRoleAllFunById.do',
                datas: { role_id: roleid }
            }).success((response: any) => {
                observer.next(this.adapter.queryRolePrivileges(response));
            }).finally(() => {
                observer.complete();
            }).exec();
        });
    }
}
