import { Component, Input, HostBinding } from '@angular/core';

/**
 * Box组件
 *
 * @howToUse
 *      <box name="标题" sub-name="子标题">
 *          <box-ctrl>
 *              ...右上角按钮
 *          </box-ctrl>
 *          <box-toolbar>
 *              ...
 *          </box-toolbar>
 *          <box-body>
 *              ...
 *          </box-body>
 *          <box-footer>
 *              ...
 *          </box-footer>
 *      </box>
 *
 * @say 好好工作，才能法力无边！
 * @author alfadb
 * @created 2017-02-16
 */
@Component({
    selector: 'box',
    templateUrl: 'box.component.html',
    styleUrls: ['box.component.scss']
})
export class BoxComponent {
    /** 设置Box标题 */
    @Input('name') public name: string;
    /** 设置Box子标题 */
    @Input('sub-name') public subName: string;
    /** 是否显示Box阴影，默认true */
    @Input() @HostBinding('class.mat-elevation-z4') public shadow = true;
}
