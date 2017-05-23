import { Directive, Input, ElementRef, Renderer, Optional, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormDirective } from '../form.directive';

/**
 * 表单验证指令
 *
 * @howToUse
 *      <input [(ngModel)]="model" #inputModel="ngModel">
 *      <validation [for]="inputModel">
 *          ...
 *      </validation
 *
 * @say 我是星宿老仙，不要惹我，小心我扁你！
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({ selector: 'validation' })
export class ValidationDirective implements OnInit {
    /** 要验证的表单 */
    @Input('for') public control: NgModel;

    /**
     * @author alfadb
     * @created 2017-02-16
     *
     * @param element {ElementRef}
     */
    constructor(
        private hostRef: ElementRef,
        private renderer: Renderer,
        @Optional() private form: FormDirective) { }

    public ngOnInit() {
        if (this.form != null && !this.form.isInline) {
            const el = this.hostRef.nativeElement as HTMLElement;
            this.renderer.setElementStyle(el, 'order', '2');
        }
    }
}
