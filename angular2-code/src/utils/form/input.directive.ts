import { Directive, ElementRef, Optional, OnInit, Renderer } from '@angular/core';
import { FormDirective } from './form.directive';

@Directive({ selector: 'input,textarea,dropdown,md-input-contianer,autocomplete' })
export class InputDirective implements OnInit {
    public isInline = false;
    constructor(
        private hostRef: ElementRef,
        private renderer: Renderer,
        @Optional() private form: FormDirective) { }

    public ngOnInit() {
        if (this.form != null) {
            const el = this.hostRef.nativeElement as HTMLElement;
            if (!this.form.isInline) {
                this.renderer.setElementStyle(el, 'order', '3');
            } else {
                this.renderer.setElementStyle(el, 'width', this.form.inputWidth + 'px');
            }
        }
    }
}
