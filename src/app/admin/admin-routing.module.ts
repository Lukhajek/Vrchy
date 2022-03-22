import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordsComponent } from './passwords/passwords.component';
import { RaceComponent } from './race/race.component';

const routes: Routes = [
  { path: 'race', component: RaceComponent },
  { path: 'passwords', component: PasswordsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
