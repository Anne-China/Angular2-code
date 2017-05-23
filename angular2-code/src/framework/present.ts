import { Injectable } from '@angular/core';

/**
 * 前端持久化状态
 */
@Injectable()
export class Present {
    private static _isSidebarOpenned = 'true';
    public set sidebarStatus(value: string) {
        Present._isSidebarOpenned = value;
    }
    public get sidebarStatus() { return Present._isSidebarOpenned; }
}
