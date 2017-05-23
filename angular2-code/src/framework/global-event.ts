import { EventEmitter } from '@angular/core';
import { DataGridResizeListenner } from '../utils';

export interface GlobalEvent {
    type?: string;
    message?: string;
}

/** 全局事件总线 */
export let GlobalEventBus: EventEmitter<GlobalEvent> = new EventEmitter<GlobalEvent>();

GlobalEventBus.subscribe((e: GlobalEvent) => {
    if (e != null && e.type === 'resize') {
        DataGridResizeListenner.emit();
    }
});
