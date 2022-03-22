import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { OverallResultsComponent } from './overall-results/overall-results.component';
import { RacerComponent } from './racer/racer.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'vysledky/:id', component: ResultsComponent },
  { path: 'zavodnik/:id', component: RacerComponent },
  { path: 'vysledky', component: OverallResultsComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
