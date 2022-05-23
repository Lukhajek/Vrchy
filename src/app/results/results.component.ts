import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, Race, RaceResults } from '../app.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  race?: Race;
  loading: boolean = true;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    public _AppService: AppService,
    private router: Router,
    private titleService: Title
  ) {}

  async ngOnInit(): Promise<void> {
    let races = await this._AppService.getRaces();
    this.race = races?.find(
      (race) => race._id == this._ActivatedRoute.snapshot.params['id']
    );
    if (!this.race) {
      this.router.navigate(['']);
      return;
    }
    this.titleService.setTitle(`Výsledky závodu ${this.race.name} | Vrchy`);
    this._AppService.getResults(this.race._id).then(() => {
      this.loading = false;
    });
  }

  get results(): RaceResults | undefined {
    return this._AppService.results?.find(
      (results) => results._id == this.race?._id
    );
  }
}
