import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, OverallHistoryResult } from '../app.service';

@Component({
  selector: 'app-overall-history-results',
  templateUrl: './overall-history-results.component.html',
  styleUrls: ['./overall-history-results.component.scss'],
})
export class OverallHistoryResultsComponent implements OnInit {
  loading: boolean = true;
  sortedResults: { category: string; results: OverallHistoryResult[] }[] = [];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    public _AppService: AppService,
    private router: Router,
    private titleService: Title
  ) {}

  async ngOnInit() {
    this.titleService.setTitle(
      `Celkové výsledky ${
        this._ActivatedRoute.snapshot.params?.['year'] || '2021'
      } | Vrchy`
    );
    var results = await this._AppService.getOverallHistoryResults(
      this._ActivatedRoute.snapshot.params?.['year'] || '2021'
    );
    if (!results) {
      this.router.navigate(['']);
      return;
    }
    if (results.length == 0) {
      this.router.navigate(['']);
      return;
    }
    this.sortedResults = this.sortResults();
    this.loading = false;
  }

  get results() {
    return (
      this._AppService.overallHistoryResults.find(
        (results) => results.year == this.year
      )?.results || []
    );
  }

  sortResults() {
    var categories: { category: string; results: OverallHistoryResult[] }[] = [
      { category: 'Ženy', results: [] },
      { category: 'Muži', results: [] },
    ];
    for (let result of this.results) {
      let category = categories.find((c) => c.category == result.category);
      if (category) {
        category.results.push(result);
      } else {
        categories.push({ category: result.category, results: [result] });
      }
      if (
        result.category.toLowerCase().includes('ženy') ||
        result.category.toLowerCase().includes('juniorky')
      ) {
        categories
          .find((category) => category.category == 'Ženy')
          ?.results.push(result);
      }
      if (
        result.category.toLowerCase().includes('muži') ||
        result.category.toLowerCase().includes('junioři')
      ) {
        categories
          .find((category) => category.category == 'Muži')
          ?.results.push(result);
      }
    }
    for (let category of categories) {
      category.results.sort((a, b) => {
        if (category.category == 'Ženy' || category.category == 'Muži') {
          return b.points - a.points;
        } else {
          return b.categoryPoints - a.categoryPoints;
        }
      });
    }
    return categories;
  }

  get year(): string {
    return this._ActivatedRoute.snapshot.params?.['year'];
  }
}
