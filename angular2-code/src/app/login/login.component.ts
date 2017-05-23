import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Passport } from '../../framework';
import { IsBlank, AjaxException, AjaxExceptionType, ENTER } from '../../utils';
import { SecurityService, SystemUser } from '../../data-adapters/security';

@Component({
    selector: 'login-page',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private nextNav: string = '/';
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private srv: SecurityService,
        private passport: Passport,
        private element: ElementRef) { }

    private _signEventSubscriber: Subscription;
    public ngOnInit() {
        this.onResize();
        this.activatedRoute.params.forEach((params: { access: string }) => {
            this.nextNav = IsBlank(params.access) ? '/' : params.access;
        });
        this._signEventSubscriber = this.passport.SignEvent.subscribe((e: boolean) => {
            if (e) {
                this.router.navigate([this.nextNav]);
            }
        });
        this.usernameInput.nativeElement.focus();
    }

    public ngOnDestroy() {
        this._signEventSubscriber.unsubscribe();
    }

    public loginBoxPos: number = 0;

    public isLogining = false;
    public username: string;
    public password: string;
    public verifycode: string;
    public error: string;

    @ViewChild('usernameInput') public usernameInput: ElementRef;
    @ViewChild('passwordInput') public passwordInput: ElementRef;
    @ViewChild('verifycodeInput') public verifycodeInput: ElementRef;
    @ViewChild('loginBtn') public loginBtn: ElementRef;
    @ViewChild('loginForm') public loginForm: NgForm;

    public usernameKeyup(e: KeyboardEvent) {
        const de = document.getElementById('deleteAll');
        de.style.display = 'inline';
        if (e.keyCode === ENTER) {
            if (!IsBlank(this.username) && (this.password == null || this.password === '')) {
                (this.passwordInput.nativeElement as HTMLInputElement).focus();
            }
        }
    }

    public passwordKeyup(e: KeyboardEvent) {
        if (e.keyCode === ENTER) {
            if (IsBlank(this.username) && !(this.password == null || this.password === '')) {
                (this.usernameInput.nativeElement as HTMLInputElement).focus();
            }
        }
    }

    public login(e: Event) {
        if (e != null) {
            e.preventDefault();
        }
        if (IsBlank(this.username)) {
            this.error = '请输入账号！';
            (this.usernameInput.nativeElement as HTMLInputElement).focus();
            return;
        } else if (this.password == null || this.password === '') {
            this.error = '请输入密码！';
            (this.passwordInput.nativeElement as HTMLInputElement).focus();
            return;
        }
        if (this.loginForm.valid) {
            this.isLogining = true;
            this.error = null;
            this.passport.Status = 'logining';
            this.srv.login(this.username, this.password).subscribe((user: SystemUser) => {
                this.passport.signIn(user);
            }, (ex: AjaxException) => {
                if (ex == null) {
                    this.error = '登录认证失败！';
                } else if (ex.Type === AjaxExceptionType.HTML) {
                    this.error = '服务器错误！';
                } else {
                    if (IsBlank(ex.Data)) {
                        this.error = '登录认证失败！';
                    } else {
                        this.error = ex.Data;
                    }
                }
                this.isLogining = false;
            }, () => {
                this.isLogining = false;
                setTimeout(() => {
                    (this.usernameInput.nativeElement as HTMLInputElement).focus();
                    (this.usernameInput.nativeElement as HTMLInputElement).select();
                });
            });
        }
    }

    @HostListener('window:resize') public onResize() {
        const wheight = (this.element.nativeElement as HTMLElement).clientHeight;
        if (wheight <= 600) {
            this.loginBoxPos = 5;
        } else {
            this.loginBoxPos = Math.ceil((wheight - 600) / 2);
        }
    }

    @HostListener('click', ['$event']) public onClick(e: MouseEvent) {
        const ctrls = [
            this.usernameInput.nativeElement,
            this.passwordInput.nativeElement,
            this.verifycodeInput.nativeElement,
            this.loginBtn.nativeElement
        ];
        if (ctrls.indexOf(e.srcElement) < 0) {
            if (IsBlank(this.username)) {
                ctrls[0].focus();
                return;
            } else if (this.password == null || this.password === '') {
                ctrls[1].focus();
                return;
            }
            ctrls[0].focus();
        }
    }

    public deleteAll() {
       const de = document.getElementById('deleteAll');
       de.style.display = 'none';
    }
}
