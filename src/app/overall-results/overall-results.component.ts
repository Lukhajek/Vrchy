import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  AppService,
  OverallResultsCategory,
  Race,
  Result,
} from '../app.service';

@Component({
  selector: 'app-overall-results',
  templateUrl: './overall-results.component.html',
  styleUrls: ['./overall-results.component.scss'],
})
export class OverallResultsComponent implements OnInit {
  loading: boolean = true;
  showAllRaces = new FormControl(false);

  constructor(public _AppService: AppService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Celkové výsledky | Vrchy');
    this._AppService.getRaces();
    this._AppService.getOverallResults().then(() => {
      this.loading = false;
    });
  }

  get results(): OverallResultsCategory[] | undefined {
    return this._AppService.overallResults;
  }

  get races(): Race[] {
    return this._AppService.races || [];
  }

  getRacersRace(races: Result[], race_id: string): Result | undefined {
    return races.find((race) => race._id == race_id);
  }
}
