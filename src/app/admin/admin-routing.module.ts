import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditsComponent } from './edits/edits.component';
import { PasswordsComponent } from './passwords/passwords.component';
import { RaceComponent } from './race/race.component';

const routes: Routes = [
  { path: 'race', component: RaceComponent },
  { path: 'passwords', component: PasswordsComponent },
  { path: 'edits/:id', component: EditsComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
