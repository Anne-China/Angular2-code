import { Route } from '@angular/router';

export interface ZRoute extends Route {
    children?: ZRoute[];
    privilegeCodes?: string[];
}
