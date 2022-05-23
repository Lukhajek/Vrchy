import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppService,
  HistoryRace,
  RaceHistoryResult,
  RaceResults,
} from '../app.service';

@Component({
  selector: 'app-results-history',
  templateUrl: './results-history.component.html',
  styleUrls: ['./results-history.component.scss'],
})
export class ResultsHistoryComponent implements OnInit {
  race?: HistoryRace;
  loading: boolean = true;
  sortedResults: { category: string; results: RaceHistoryResult[] }[] = [];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    public _AppService: AppService,
    private router: Router,
    private titleService: Title
  ) {}

  async ngOnInit(): Promise<void> {
    let races = await this._AppService.getHistoryRaces();
    this.race = races?.find(
      (race) => race._id == this._ActivatedRoute.snapshot.params['id']
    );
    if (!this.race) {
      this.router.navigate(['']);
      return;
    }
    this.titleService.setTitle(
      `Historické výsledky závodu ${this.race.name} | Vrchy`
    );
    this._AppService.getHistoryResults(this.race._id).then(() => {
      this.loading = false;
      this.sortedResults = this.sortResults();
    });
  }

  get results(): RaceHistoryResult[] {
    return (
      this._AppService.historyResults?.find(
        (results) => results.race_id == this.race?._id
      )?.results || []
    );
  }

  sortResults(): { category: string; results: RaceHistoryResult[] }[] {
    var sortedResults: { category: string; results: RaceHistoryResult[] }[] = [
      { category: 'Ženy', results: [] },
      { category: 'Muži', results: [] },
    ];
    for (let result of this.results) {
      let category = sortedResults.find((r) => r.category == result.category);
      if (category) {
        category.results.push(result);
      } else {
        sortedResults.push({ category: result.category, results: [result] });
      }
      if (
        result.category.toLowerCase().includes('ženy') ||
        result.category.toLowerCase().includes('juniorky')
      ) {
        sortedResults[0].results.push(result);
      }
      if (
        result.category.toLowerCase().includes('muži') ||
        result.category.toLowerCase().includes('junioři')
      ) {
        sortedResults[1].results.push(result);
      }
    }
    for (let result of sortedResults) {
      result.results.sort((a, b) => a.time - b.time);
    }
    return sortedResults;
  }
}
