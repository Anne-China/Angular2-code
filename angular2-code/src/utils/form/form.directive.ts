import { Directive, Input, ElementRef } from '@angular/core';
import { ConvertInt } from '../func';

@Directive({ selector: 'form.editor' })
export class FormDirective {
    public isInline = false;
    constructor(private hostRef: ElementRef) {
        const el = this.hostRef.nativeElement as HTMLFormElement;
        this.isInline = el.classList.contains('form-inline');
    }

    private _labelWidth = 120;
    @Input('lable-width') set labelWidth(value: number) {
        const nv = ConvertInt(value);
        if (value >= 0) {
            this._labelWidth = nv;
        }
    }
    get labelWidth() { return this._labelWidth; }

    private _inputWidth = 200;
    @Input('input-width') set inputWidth(value: number) {
        const nv = ConvertInt(value);
        if (value >= 0) {
            this._inputWidth = nv;
        }
    }
    get inputWidth() { return this._inputWidth; }
}
