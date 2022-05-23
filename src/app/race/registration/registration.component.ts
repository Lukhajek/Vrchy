import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService, Race, Racer, RaceRegistration } from 'src/app/app.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  race?: Race;
  loading: boolean = true;
  form: FormGroup;
  valueChangeSubs?: Subscription;
  sending: boolean = false;
  finished: boolean = false;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private _AppService: AppService,
    private router: Router,
    private fb: FormBuilder,
    private titleService: Title
  ) {
    this.form = fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      year: ['', Validators.required],
      team: [''],
    });
  }

  async ngOnInit() {
    let _id = this.ActivatedRoute.snapshot.params['id'];
    var races = await this._AppService.getRaces();
    if (!races) {
      this.router.navigate(['']);
      return;
    }
    this.titleService.setTitle(
      `Registrace na závod ${this.race?.name} | Vrchy`
    );
    this.race = races.find((race1) => race1._id == _id);
    if (!this.race || !this.race.registration) {
      this.router.navigate(['']);
      return;
    }

    this._AppService.getRaceRegistrations(this.race._id, true);

    this._AppService.getRacers().then(() => {
      this.loading = false;
    });

    this.valueChangeSubs = this.form.controls['name'].valueChanges.subscribe(
      () => {
        if (this.selectedRacer)
          this.form.patchValue({
            gender: this.selectedRacer.gender,
            year: this.selectedRacer.year,
            team: this.selectedRacer.team,
          });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.valueChangeSubs) this.valueChangeSubs.unsubscribe();
  }

  get filteredRacers(): Racer[] {
    if (this.form.controls['name'].value.length < 3) return [];
    return this.racers.filter((racer) => {
      return `${racer.name} (${racer.year})`
        .toLowerCase()
        .includes(this.form.controls['name'].value.toLowerCase());
    });
  }

  get selectedRacer(): Racer | undefined {
    return this.racers.find((racer) => {
      return (
        `${racer.name} (${racer.year})`.toLowerCase() ==
        this.form.controls['name'].value.toLowerCase()
      );
    });
  }

  get racers(): Racer[] {
    return this._AppService.racers || [];
  }

  async submit() {
    this.sending = true;
    var data = Object.assign({}, this.data);
    var result = await this._AppService.makeAPIRequest(
      `/race/${encodeURIComponent(this.race?._id || '')}/register`,
      'POST',
      data
    );
    await this._AppService.getRaceRegistrations(this.race?._id || '', true);
    this.sending = false;
    if (result) this.finished = true;
  }

  get data() {
    return {
      name: this.form.controls['name'].value.split(' (')[0],
      gender: this.form.controls['gender'].value,
      year: this.form.controls['year'].value,
      team: this.form.controls['team'].value,
    };
  }

  get category(): string | undefined {
    if (!this.data.year || !this.data.gender) return;
    return this._AppService.getCategoryByYear(this.data.year, this.data.gender)
      ?.name;
  }

  get alreadyRegistered(): boolean {
    return !!this.registrations.find(
      (racer) =>
        racer.name.toLowerCase() == this.data.name.toLowerCase() &&
        racer.year == this.data.year
    );
  }

  get registrations(): RaceRegistration[] {
    return (
      this._AppService.raceRegistrations.find(
        (race) => race.race_id == this.race?._id
      )?.registrations || []
    );
  }

  reload() {
    this.router.navigate(['']).then(() => {
      this.router.navigate(['zavod', this.race?._id, 'registrace']);
    });
  }
}
