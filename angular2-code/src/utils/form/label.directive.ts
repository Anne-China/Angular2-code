import { Directive, ElementRef, Optional, OnInit, Renderer } from '@angular/core';
import { FormDirective } from './form.directive';

@Directive({ selector: 'label' })
export class LabelDirective implements OnInit {
    public isInline = false;
    constructor(
        private hostRef: ElementRef,
        private renderer: Renderer,
        @Optional() private form: FormDirective) { }

    public ngOnInit() {
        if (this.form != null) {
            const el = this.hostRef.nativeElement as HTMLLabelElement;
            if (!this.form.isInline) {
                this.renderer.setElementStyle(el, 'order', '1');
            } else {
                this.renderer.setElementStyle(el, 'width', this.form.labelWidth + 'px');
            }
        }
    }
}
