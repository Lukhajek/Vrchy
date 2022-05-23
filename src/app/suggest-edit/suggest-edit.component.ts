import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService, Racer } from '../app.service';

@Component({
  selector: 'app-suggest-edit',
  templateUrl: './suggest-edit.component.html',
  styleUrls: ['./suggest-edit.component.scss'],
})
export class SuggestEditComponent implements OnInit, OnDestroy {
  loadingRacers: boolean = true;
  racersSearchInput = new FormControl('');
  form: FormGroup;
  valueChangeSubs?: Subscription;
  sending: boolean = false;
  finished: boolean = false;

  constructor(
    private _AppService: AppService,
    private fb: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.form = fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      year: ['', Validators.required],
      team: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Návrh na úpravu závodníka | Vrchy');
    this._AppService.getRacers().then(() => {
      this.loadingRacers = false;

      let racer_id = this.ActivatedRoute.snapshot.queryParams['racer_id'];
      if (racer_id)
        this.racersSearchInput.patchValue(
          `${this.racers.find((racer) => racer._id == racer_id)?.name} (${
            this.racers.find((racer) => racer._id == racer_id)?.year
          })`
        );
    });

    this.valueChangeSubs = this.racersSearchInput.valueChanges.subscribe(() => {
      if (this.selectedRacer)
        this.form.patchValue({
          name: this.selectedRacer.name,
          gender: this.selectedRacer.gender,
          year: this.selectedRacer.year,
          team: this.selectedRacer.team,
        });
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangeSubs) this.valueChangeSubs.unsubscribe();
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

  get racers(): Racer[] {
    return this._AppService.racers || [];
  }

  async submit() {
    this.sending = true;
    var response = await this._AppService.makeAPIRequest(
      `/racers/${encodeURIComponent(
        this.selectedRacer?._id || ''
      )}/suggest-edit`,
      'POST',
      {
        name: this.form.controls['name'].value,
        gender: this.form.controls['gender'].value,
        year: this.form.controls['year'].value,
        team: this.form.controls['team'].value,
      }
    );
    this.sending = false;
    if (response) this.finished = true;
  }
}
