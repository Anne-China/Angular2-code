import { NgModule } from '@angular/core';
import { MdAutocompleteModule, MdInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
    imports: [
        ReactiveFormsModule, MdAutocompleteModule, MdInputModule, CommonModule
    ],
    declarations: [
        AutocompleteComponent,
    ],
    exports: [
        AutocompleteComponent,
    ]
})
export class AutocompleteModule { }
