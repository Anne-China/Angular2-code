import { EventEmitter, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Rx';

import { SystemUser, SecurityService, UserSpecialPrivilege, SystemRole, Privilege } from '../../data-adapters/security';

@Injectable()
export class Passport {
    private static _administrator: SystemUser;
    private static _status = 'not login';
    private static _signEvent = new EventEmitter<boolean>();
    private static _statusChangeEvent = new EventEmitter<string>();

    constructor(private securitySrv: SecurityService) { }

    public get Current() {
        return Passport._administrator;
    }

    public get IsAuthenticated(): boolean {
        return Passport._administrator != null;
    }

    public get Status() {
        return Passport._status;
    }
    public set Status(value: string) {
        Passport._status = value;
        Passport._statusChangeEvent.emit(value);
    }

    public get SignEvent() { return Passport._signEvent; }

    public get StatusChangeEvent() { return Passport._statusChangeEvent; }

    public signIn(user: SystemUser) {
        Passport._administrator = user;
        this.SignEvent.emit(true);
        this.Status = 'loading privilege';
        this.loadPrivileges();
    }

    public signOut() {
        this.Status = 'not login';
        Passport._signEvent.emit(false);
        Passport._administrator = null;
    }

    public hasPrivilege(privilegeCode: string) {
        const user = this.Current;
        if (user.Privileges != null) {
            for (const pri of user.Privileges) {
                if (pri.Code === privilegeCode) {
                    return pri.Denied;
                }
            }
        }
        if (user.Roles != null) {
            for (const role of user.Roles) {
                if (role.Privileges != null) {
                    for (const pri of role.Privileges) {
                        if (pri.Code === privilegeCode) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private loadPrivileges() {
        this.securitySrv.getUserPrivilegeDetail(this.Current.ID).subscribe((data:
            { roles: SystemRole[], privileges: UserSpecialPrivilege[] }) => {
            this.Current.Privileges = data.privileges;
            this.Current.Roles = data.roles;
            let roleReader: Observable<any>;
            for (const role of data.roles) {
                const iroleReader = Observable.create((observer: Observer<any>) => {
                    this.securitySrv.getRolePrivileges(role.ID).subscribe((privileges: Privilege[]) => {
                        role.Privileges = role.Privileges.concat(privileges);
                    }, null, () => { observer.complete(); });
                });
                if (roleReader == null) {
                    roleReader = iroleReader;
                } else {
                    roleReader = roleReader.merge(iroleReader);
                }
            }
            if (roleReader != null) {
                roleReader.subscribe(null, null, () => {
                    this.computeCurrentMenu();
                });
            }
        });
    }

    private computeCurrentMenu() {
        this.Status = 'complete';
        // TODO: computeCurrentMenu
    }
}
