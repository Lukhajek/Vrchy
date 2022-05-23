import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { HomePageComponent } from './home-page/home-page.component';
import { OverallHistoryResultsComponent } from './overall-history-results/overall-history-results.component';
import { OverallResultsComponent } from './overall-results/overall-results.component';
import { RacerComponent } from './racer/racer.component';
import { ResultsHistoryComponent } from './results-history/results-history.component';
import { ResultsComponent } from './results/results.component';
import { SuggestEditComponent } from './suggest-edit/suggest-edit.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'vysledky/:id', component: ResultsComponent },
  { path: 'zavodnik/:id', component: RacerComponent },
  {
    path: 'vysledky/historie/celkove/:year',
    component: OverallHistoryResultsComponent,
  },
  { path: 'vysledky/historie/:id', component: ResultsHistoryComponent },
  { path: 'vysledky', component: OverallResultsComponent },
  { path: 'historie', component: HistoryComponent },
  { path: 'upravy', component: SuggestEditComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'zavod/:id',
    loadChildren: () => import('./race/race.module').then((m) => m.RaceModule),
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
