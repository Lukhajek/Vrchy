import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, Race, RacerDetails, Result } from '../app.service';

@Component({
  selector: 'app-racer',
  templateUrl: './racer.component.html',
  styleUrls: ['./racer.component.scss'],
})
export class RacerComponent implements OnInit {
  loading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _AppService: AppService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this._AppService.getRacersDetails(
      this.activatedRoute.snapshot.params['id']
    );
    if (!this.racer) {
      this.router.navigate(['']);
    }
    await this._AppService.getRaces();
    this.loading = false;
  }

  get racer(): RacerDetails | undefined {
    return this._AppService.racersDetails.find(
      (racer) => racer._id == this.activatedRoute.snapshot.params['id']
    );
  }

  get races(): Race[] {
    return this._AppService.races || [];
  }

  getRaceById(_id: any): Race | undefined {
    return this.races.find((race) => race._id == _id);
  }

  getCategoryRaceResultsById(_id: any): Result | undefined {
    return this.racer?.categoryResults?.races.find((race) => race._id == _id);
  }
}
