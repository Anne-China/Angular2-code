import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Passport } from './passport';
import { AuthGuard } from './auth-guard';
import { SecurityAdapterModule } from '../../data-adapters/security/security.module';

@NgModule({
    imports: [RouterModule, SecurityAdapterModule],
    providers: [Passport, AuthGuard]
})
export class SecurityModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SecurityModule,
            providers: [
                Passport, AuthGuard
            ]
        };
    }
}
