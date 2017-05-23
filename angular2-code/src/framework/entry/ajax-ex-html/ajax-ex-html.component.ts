import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { IsBlank } from '../../../utils/func';

@Component({
    selector: 'ajax-ex-html-dialog',
    templateUrl: 'ajax-ex-html.component.html',
    styleUrls: ['ajax-ex-html.component.scss']
})
export class AjaxExHtmlComponent implements AfterViewInit {
    constructor(
        public dialogRef: MdDialogRef<AjaxExHtmlComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) {
        if (IsBlank(this.data)) {
            this.data = null;
        }
    }

    @ViewChild('iframe') public iframeRef: ElementRef;

    public ngAfterViewInit() {
        const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
        let iframedoc: Document;
        if (iframe.contentDocument) {
            iframedoc = iframe.contentDocument;
        } else if (iframe.contentWindow) {
            iframedoc = iframe.contentWindow.document;
        }
        if (iframedoc) {
            iframedoc.open();
            iframedoc.writeln(this.data);
            iframedoc.close();
        }
    }
}
