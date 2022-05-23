import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaceRoutingModule } from './race-routing.module';
import { RaceComponent } from './race.component';
import { RegistrationComponent } from './registration/registration.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RaceComponent, RegistrationComponent],
  imports: [
    CommonModule,
    RaceRoutingModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class RaceModule {}
