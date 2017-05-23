import { Component, Renderer } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'code404.component.html',
    styleUrls: ['code404.component.scss']
})
export class Code404Component {
    constructor(private router: Router, private renderer: Renderer) { }

    public ReturnHome() {
        this.router.navigate(['/']);
    }
}
