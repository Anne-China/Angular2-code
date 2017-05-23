import { Injectable, EventEmitter } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Passport } from './passport';
import { ZRoute } from './zroute';
import { SecurityAdapter, SecurityService, SystemUser } from '../../data-adapters/security';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private passport: Passport,
        private router: Router,
        private srv: SecurityService,
        private adapter: SecurityAdapter) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        if (this.passport.IsAuthenticated && this.passport.Status === 'complete') {
            const route = next.routeConfig as ZRoute;
            if (this.CheckPrivilege(route.privilegeCodes)) {
                return true;
            } else {
                this.router.navigate(['/']);
                return false;
            }
        }
        const e = new EventEmitter<boolean>();
        if (this.passport.Status !== 'complete' && this.passport.Status !== 'not login') {
            this.passport.StatusChangeEvent.subscribe((status: string) => {
                if (status === 'complete') {
                    const route = next.routeConfig as ZRoute;
                    if (this.CheckPrivilege(route.privilegeCodes)) {
                        e.emit(true);
                    } else {
                        this.router.navigate(['/']);
                        e.emit(false);
                    }
                    e.complete();
                }
            });
            return e;
        }
        this.passport.Status = 'checking';
        this.srv.isLogin().subscribe((data: SystemUser) => {
            this.passport.StatusChangeEvent.subscribe((status: string) => {
                if (status === 'complete') {
                    const route = next.routeConfig as ZRoute;
                    if (this.CheckPrivilege(route.privilegeCodes)) {
                        e.emit(true);
                    } else {
                        this.router.navigate(['/']);
                        e.emit(false);
                    }
                    e.complete();
                }
            });
            this.passport.signIn(data);
        }, () => {
            if (state.url === '/') {
                this.router.navigate(['/login']);
            } else {
                this.router.navigate(['/login', state.url]);
            }
            this.passport.Status = 'not login';
            e.emit(false);
            e.complete();
        });
        return e;
    }

    private CheckPrivilege(routePrivilegeCodes: string[]) {
        if (routePrivilegeCodes == null || routePrivilegeCodes.length === 0) {
            return true;
        } else {
            for (const privilegeCode of routePrivilegeCodes) {
                if (this.passport.hasPrivilege(privilegeCode)) {
                    return true;
                }
            }
            return false;
        }
    }
}
