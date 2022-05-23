import { Component, OnInit } from '@angular/core';
import { AppService, HistoryRace } from '../app.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  loadingRaces: boolean = true;
  historyRacesSorted: { year: number; races: HistoryRace[] }[] = [];

  constructor(public _AppService: AppService) {}

  async ngOnInit() {
    this._AppService.getHistoryRaces().then(() => {
      this.historyRacesSorted = this.historyRacesSort();
      this.loadingRaces = false;
    });
    this._AppService.getAvailableOverallHistoryResults();
  }

  historyRacesSort() {
    var years: { year: number; races: HistoryRace[] }[] = [];
    for (let historyRace of this._AppService.historyRaces || []) {
      let existing = years.find((year) => year.year == historyRace.year);
      if (existing) existing.races.push(historyRace);
      else years.push({ year: historyRace.year, races: [historyRace] });
    }
    years.sort((a, b) => a.year - b.year);
    return years;
  }

  get availableOverallHistoryResults() {
    return this._AppService.availableOverallHistoryResults;
  }
}
