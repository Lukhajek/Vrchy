import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RaceComponent } from './race.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: 'registrace', component: RegistrationComponent },
  { path: '', component: RaceComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaceRoutingModule {}
