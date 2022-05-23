import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, Race, RaceRegistration } from '../app.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  loading: boolean = true;

  constructor(
    public _AppService: AppService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    await this._AppService.getRaces();
    if (!this.race) {
      this.router.navigate(['']);
      return;
    }
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
