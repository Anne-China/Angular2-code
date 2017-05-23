import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';

/**
 * 表单聚焦样式处理指令
 *
 * @author alfadb
 * @created 2017-02-16
 */
@Directive({ selector: 'input,textarea' })
export class FormCtrlDirective {
    private shadowLevel = 4;
    private isFormCtrl = false;
    private isParentCtrl = false;
    /**
     *
     * @author alfadb
     * @created 2017-02-16
     *
     * @param element {ElementRef}
     * @param renderer {Renderer}
     */
    constructor(
        private element: ElementRef,
        private renderer: Renderer
    ) {
        const el = this.element.nativeElement as HTMLElement;
        if (el != null && el.classList.contains('form-ctrl')) {
            this.isFormCtrl = true;
        } else if (el != null && el.parentElement != null && el.parentElement.classList.contains('form-ctrl')) {
            this.isFormCtrl = true;
            this.isParentCtrl = true;
        }
    }

    /**
     * 处理表单focus事件
     *
     * @author alfadb
     * @created 2017-02-16
     */
    @HostListener('focus') public onFocus() {
        if (this.isFormCtrl) {
            if (this.isParentCtrl) {
                this.renderer.setElementClass(
                    this.element.nativeElement.parentElement, 'mat-elevation-z' + this.shadowLevel, true);
            } else {
                this.renderer.setElementClass(
                    this.element.nativeElement, 'mat-elevation-z' + this.shadowLevel, true);
            }
        }
    }

    /**
     * 处理表单blur事件
     *
     * @author alfadb
     * @created 2017-02-16
     */
    @HostListener('blur') public onBlur() {
        if (this.isFormCtrl) {
            if (this.isParentCtrl) {
                this.renderer.setElementClass(
                    this.element.nativeElement.parentElement, 'mat-elevation-z' + this.shadowLevel, false);
            } else {
                this.renderer.setElementClass(
                    this.element.nativeElement, 'mat-elevation-z' + this.shadowLevel, false);
            }
        }
    }
}
