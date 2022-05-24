import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, Race, RaceRegistration } from '../app.service';
import config from '../config.json';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  loading: boolean = true;
  schema?: any;

  constructor(
    public _AppService: AppService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {}

  async ngOnInit() {
    await this._AppService.getRaces();
    if (!this.race) {
      this.router.navigate(['']);
      return;
    }
    this.schema = {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: this.race.name,
      startDate: this.race.date?.split('T')[0],
      superEvent: config.schemas.event,
      url: `https://vrchy.maratonstav.cz/zavod/${this.race._id}`,
    };
    this.titleService.setTitle(`${this.race.name} | Vrchy`);
    await this._AppService.getRaceRegistrations(this.race._id);
    this.loading = false;
  }

  get race(): Race | undefined {
    return this._AppService.races?.find(
      (race) => race._id == this.ActivatedRoute.snapshot.params['id']
    );
  }

  get raceRegistrations(): RaceRegistration[] {
    return (
      this._AppService.raceRegistrations.find(
        (race) => race.race_id == this.race?._id
      )?.registrations || []
    );
  }
}
