import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppService, Race, Racer } from '../app.service';
import config from '../config.json';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  loadingRaces: boolean = true;
  loadingRacers: boolean = true;
  racersSearchInput = new FormControl('');
  schema?: any;

  constructor(
    public _AppService: AppService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Maratonstav Český pohár v běhu do vrchu');
    this._AppService.getRaces().then(() => {
      this.loadingRaces = false;

      this.schema = {
        ...config.schemas.event,
        subEvent: this.races.map((race) => {
          return {
            '@type': 'SportsEvent',
            name: race.name,
            startDate: race.date?.split('T')[0],
            url: `https://vrchy.maratonstav.cz/zavod/${race._id}`,
          };
        }),
      };
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
