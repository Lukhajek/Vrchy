import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService, Race, Racer } from '../app.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  loadingRaces: boolean = true;
  loadingRacers: boolean = true;
  racersSearchInput = new FormControl('');

  constructor(private _AppService: AppService, private router: Router) {}

  ngOnInit(): void {
    this._AppService.getRaces().then(() => {
      this.loadingRaces = false;
    });

    this._AppService.getRacers().then(() => {
      this.loadingRacers = false;
    });
  }

  get races(): Race[] {
    return this._AppService.races || [];
  }

  get racers(): Racer[] {
    return this._AppService.racers || [];
  }

  get filteredRacers(): Racer[] {
    if (this.racersSearchInput.value.length < 3) return [];
    return this.racers.filter((racer) => {
      return `${racer.name} (${racer.year})`
        .toLowerCase()
        .includes(this.racersSearchInput.value.toLowerCase());
    });
  }

  get selectedRacer(): Racer | undefined {
    return this.racers.find((racer) => {
      return (
        `${racer.name} (${racer.year})`.toLowerCase() ==
        this.racersSearchInput.value.toLowerCase()
      );
    });
  }

  showStatistics() {
    this.router.navigate(['zavodnik', this.selectedRacer?._id]);
  }
}
