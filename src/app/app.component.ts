import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private swUpdate: SwUpdate) {
    this.swUpdate
      .checkForUpdate()
      .then((updateAvailible) => {
        if (updateAvailible) {
          location.reload();
        }
      })
      .catch(() => {});
  }
}
