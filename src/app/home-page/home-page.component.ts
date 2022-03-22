import { Component, OnInit } from '@angular/core';
import { AppService, Race } from '../app.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  loadingRaces: boolean = true;

  constructor(private _AppService: AppService) {}

  ngOnInit(): void {
    this._AppService.getRaces().then(() => {
      this.loadingRaces = false;
    });
  }

  get races(): Race[] {
    return this._AppService.races || [];
  }
}
