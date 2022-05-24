import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppService,
  HistoryResult,
  Race,
  RacerDetails,
  Result,
} from '../app.service';

@Component({
  selector: 'app-racer',
  templateUrl: './racer.component.html',
  styleUrls: ['./racer.component.scss'],
})
export class RacerComponent implements OnInit {
  loading: boolean = true;
  schema?: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public _AppService: AppService,
    private router: Router,
    private titleService: Title
  ) {}

  async ngOnInit() {
    await this._AppService.getRacersDetails(
      this.activatedRoute.snapshot.params['id']
    );
    if (!this.racer) {
      this.router.navigate(['']);
      return;
    }
    this.schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: this.racer.name,
      url: 'https://vrchy.maratonstav.cz/zavodnik/' + this.racer._id,
    };
    this.titleService.setTitle(`Závodník ${this.racer?.name} | Vrchy`);
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

  get historyResults(): HistoryResult[] {
    let historyResults = this.racer?.historyResults.sort(
      (a, b) => a.race.year - b.race.year
    );
    return historyResults || [];
  }

  get historyResultsSortedByYears(): HistoryResult[][] {
    let historyResults: HistoryResult[][] = [];
    this.historyResults.forEach((historyResult) => {
      let lastYear = historyResults[historyResults.length - 1];
      if (
        lastYear?.[lastYear.length - 1]?.race?.year == historyResult.race.year
      )
        lastYear.push(historyResult);
      else historyResults.push([historyResult]);
    });
    return historyResults;
  }

  getRaceById(_id: any): Race | undefined {
    return this.races.find((race) => race._id == _id);
  }

  getCategoryRaceResultsById(_id: any): Result | undefined {
    return this.racer?.categoryResults?.races.find((race) => race._id == _id);
  }

  edit() {
    this.router.navigate(['upravy'], {
      queryParams: { racer_id: this.racer?._id },
    });
  }
}
