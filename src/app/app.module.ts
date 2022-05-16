import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ResultsComponent } from './results/results.component';
import { OverallResultsComponent } from './overall-results/overall-results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RacerComponent } from './racer/racer.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ResultsComponent,
    OverallResultsComponent,
    RacerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
