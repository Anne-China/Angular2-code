import {
    Component,
    HostListener,
    ElementRef,
    Renderer,
    AfterViewInit
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { IsBlank } from '../../utils';
import { Passport } from '../security';
import { GlobalEventBus } from '../global-event';
import { Present } from '../present';
import { ViewChild, Input } from '@angular/core';
import { ConvertBoolean } from '../../utils/func';

@Component({
    selector: 'layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.scss'],
    providers: [Present],
    animations: [
        trigger('userCtrl', [
            state('true', style({
                height: '*'
            })),
            state('false', style({ height: 0 })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('fade', [
            state('true', style({
                opacity: 1,
                zIndex: 2
            })),
            state('false', style({
                opacity: 0, display: 'none'
            })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('aside', [
            state('false', style({
                marginLeft: '-224px'
            })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('expander', [
            state('false', style({
                marginLeft: '225px',
                transform: 'rotate(180deg)'
            })),
            transition('* => *', animate('.2s'))
        ]),
        trigger('header', [
            state('false', style({
                paddingLeft: '76px'
            })),
            transition('* => *', animate('.2s'))
        ])
    ]
})
export class LayoutComponent implements AfterViewInit {
    constructor(
        public passport: Passport,
        private present: Present,
        private hostRef: ElementRef,
        private renderer: Renderer) {
        this._isAsideExpanded = this.present.sidebarStatus;
        if (!this._isAsideExpanded) {
            this.renderer.setElementClass(this.hostRef.nativeElement, 'init-closed', true);
        }
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.renderer.setElementClass(this.hostRef.nativeElement, 'init-closed', false);
        });
    }

    public isUserCtrlInited = 'false';
    public isUserCtrlFocus = 'false';
    private _isAsideExpanded = 'true';
    set isAsideExpanded(value: string) {
        this._isAsideExpanded = value;
        this.present.sidebarStatus = value;
        setTimeout(() => {
            GlobalEventBus.emit({
                type: 'resize'
            });
        }, 250);
    }
    get isAsideExpanded() { return this._isAsideExpanded; }

    @HostListener('window:resize') public onWindowResize() {
        setTimeout(() => {
            GlobalEventBus.emit({
                type: 'resize'
            });
        });
    }

    public isAnnouncement = false;
    public announcementText: string;
    private announcementTimer: any;
    public setAnnouncement(text: string, delay: number = null) {
        this.announcementText = text;
        this.isAnnouncement = true;
        clearTimeout(this.announcementTimer);
        if (delay != null && delay > 0) {
            setTimeout(() => {
                this.isAnnouncement = false;
            });
        }
    }

    public closeAnnouncement() {
        clearTimeout(this.announcementTimer);
        this.isAnnouncement = false;
    }

    public get DisplayUser() {
        if (this.passport == null) {
            return null;
        } else if (IsBlank(this.passport.Current.Name)) {
            return this.passport.Current.UserName;
        } else {
            return this.passport.Current.Name;
        }
    }

    public get UserAvatar() {
        const defaultAvatar = '/assets/img/avatar.png';
        if (this.passport == null || IsBlank(this.passport.Current.Avatar)) {
            return defaultAvatar;
        } else {
            return this.passport.Current.Avatar;
        }
    }

    public breadcrumbs: Array<{ name: string, url: string }> = [];
    public addBreadcrumb(name: string, url: string = null) {
        this.breadcrumbs.push({
            name,
            url
        });
    }
    public removeLastBreadcrumb() {
        this.breadcrumbs.pop();
    }

    @ViewChild('nav') public navContianerRef: ElementRef;

    public navScroll(e: MouseWheelEvent) {
        e.preventDefault();
        const el = this.navContianerRef.nativeElement as HTMLElement;
        el.scrollTop += e.deltaY;
    }

    private _isFill = false;
    @Input('fill') set isFill(value: boolean) {
        this._isFill = ConvertBoolean(value);
    }
    get isFill() { return this._isFill; }

    public logout() {
       this.passport.signOut();
    }
}
