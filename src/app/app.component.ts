import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private swUpdate: SwUpdate,
    private router: Router,
    private _AppService: AppService
  ) {
    this.swUpdate
      .checkForUpdate()
      .then((updateAvailible) => {
        if (updateAvailible) {
          location.reload();
        }
      })
      .catch(() => {});
  }

  get currentURL(): string {
    return this.router.url.split('#')[0];
  }

  scrollAnchor(anchor: string) {
    this.router.navigate(['/']);
    setTimeout(() => {
      this.router.navigate(['/'], {
        fragment: anchor,
      });
    }, 100);
  }
}
