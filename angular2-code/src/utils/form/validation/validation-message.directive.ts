import { Directive, Input, ElementRef, Renderer, AfterViewInit, Host } from '@angular/core';
import { ValidationDirective } from './validation.directive';

/**
 * 表单验证消息指令
 *
 * @howToUse
 *      <input [(ngModel)]="model" #inputModel="ngModel" required maxlength="10" custom-validator="...">
 *      <validation [for]="inputModel">
 *        <message pristine>默认</message>
 *        <message valid>正确</message>
 *        <message validator="required">请填写</message>
 *        <message validator="maxlength">最长为10个字符</message>
 *        <message validator="custom-validator" when="required,maxlength">自定义验证失败</message>
 *      </validation
 *
 * @say 他们都说我好厉害！
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({
    selector: 'message[validator],message[pristine],message[valid]'
})
export class ValidateMessageDirective implements AfterViewInit {
    /** 验证器 */
    @Input('validator') public Validator: string;
    /** 输入前置验证器(前置验证通过时才进行此验证)，多个验证器用逗号隔开 */
    @Input('when') public When: string;

    /**
     * @author alfadb
     * @created 2017-02-16
     *
     * @param validation {ValidationDirective}
     * @param element {ElementRef}
     * @param renderer {Renderer}
     */
    constructor(
        @Host() private validation: ValidationDirective,
        private element: ElementRef,
        private renderer: Renderer) { }

    /** 前置验证器组 */
    get WhenValidators() {
        if (this.When == null) {
            return null;
        }
        return this.When.split(',');
    }

    private _pristine: boolean;
    /** 是否在ngModel状态是pristine时显示 */
    @Input() set pristine(value) {
        this._pristine = this._coerceBooleanProperty(value);
    }
    get pristine(): boolean {
        return this._pristine;
    }

    private _valid: boolean;
    /** 是否在ngModel状态是valid时显示 */
    @Input() set valid(value) {
        this._valid = this._coerceBooleanProperty(value);
    }
    get valid(): boolean {
        return this._valid;
    }

    private _coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    /**
     * 指令视图初始化完成后执行
     *
     * @author alfadb
     * @created 2017-02-16
     */
    public ngAfterViewInit() {
        setTimeout(() => {
            this.validation.control.statusChanges.subscribe(() => {
                this.checkValidateMessage();
            });
            this.validation.control.valueChanges.subscribe(() => {
                this.checkValidateMessage();
            });
            this.checkValidateMessage();
        });
    }

    private checkValidateMessage() {
        const c = this.validation.control;
        if (this.pristine && this.valid) {
            this.renderer.setElementClass(this.element.nativeElement, 'active', c.pristine || c.valid);
            this.renderer.setElementClass(this.element.nativeElement, 'pristine', c.pristine);
            return;
        }
        if (this.pristine) {
            this.renderer.setElementClass(this.element.nativeElement, 'active', c.pristine);
            return;
        }
        if (this.valid && !c.pristine) {
            this.renderer.setElementClass(this.element.nativeElement, 'active', c.valid);
            return;
        }
        if (c.pristine || c.valid) {
            this.renderer.setElementClass(this.element.nativeElement, 'active', false);
            return;
        }
        if (this.WhenValidators != null) {
            for (const validator of this.WhenValidators) {
                const error = c.errors == null ? null : c.errors[validator];
                if (error) {
                    this.renderer.setElementClass(this.element.nativeElement, 'active', false);
                    return;
                }
            }
        }
        const error = c.errors == null ? null : c.errors[this.Validator];
        this.renderer.setElementClass(this.element.nativeElement, 'active', error);
    }
}
