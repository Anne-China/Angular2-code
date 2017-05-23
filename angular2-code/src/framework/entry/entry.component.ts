import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog } from '@angular/material';

import { GlobalEvent, GlobalEventBus } from '../global-event';
import { Passport } from '../security';
import { AjaxException } from '../../utils/mcajax/exception';
import { MCAjax } from '../../utils/mcajax/mcajax';
import { AjaxExceptionType } from '../../utils/mcajax/exception-type';
import { AjaxExStringComponent } from './ajax-ex-string/ajax-ex-string.component';
import { AjaxExHtmlComponent } from './ajax-ex-html/ajax-ex-html.component';

@Component({
    selector: 'body',
    templateUrl: 'entry.component.html'
})
export class EntryComponent implements OnInit, OnDestroy {
    private _signSubscription: Subscription;
    private _unhandledAjaxExceptionSubscription: Subscription;

    constructor(
        private router: Router,
        public passport: Passport,
        private dialog: MdDialog) {
        this._signSubscription = this.passport.SignEvent.subscribe((e: boolean) => {
            if (!e) {
                this.router.navigate(['/login', { access: this.router.url }]);
            }
        });
        this._unhandledAjaxExceptionSubscription =
            MCAjax.OnUnhandledError.asObservable().subscribe((ex: AjaxException) => {
                this.unhandledAjaxExceptionHandle(ex);
            });
    }

    public ngOnInit() {
        GlobalEventBus.subscribe((e: GlobalEvent) => {
            this.GlobalEventPreHandler(e);
        });
    }

    public GlobalEventPreHandler = (e: GlobalEvent) => {
        if (e.type === 'not authorized') {
            this.passport.signOut();
        }
    }

    public ngOnDestroy() {
        this._signSubscription.unsubscribe();
        this._unhandledAjaxExceptionSubscription.unsubscribe();
    }

    public unhandledAjaxExceptionHandle(ex: AjaxException) {
        switch (ex.Type) {
            case AjaxExceptionType.STRING:
            case AjaxExceptionType.JSON:
                this.dialog.open(AjaxExStringComponent, {
                    disableClose: false,
                    data: ex.Type === AjaxExceptionType.JSON ? JSON.stringify(ex.Data) : ex.Data,
                    width: '600px'
                });
                break;
            case AjaxExceptionType.HTML:
                this.dialog.open(AjaxExHtmlComponent, {
                    disableClose: false,
                    data: ex.Data,
                    width: '90%',
                    height: '90%'
                });
                break;
            default:
                break;
        }
    }
}
