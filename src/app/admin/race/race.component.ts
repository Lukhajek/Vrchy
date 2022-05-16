import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { duration, min } from 'moment';
import { AppService, Category, Race, Racer } from 'src/app/app.service';
import categories from '../../categories.json';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  password: string;
  finishes?: {
    _id: string;
    racer_id: string;
    race_id: string;
    time: number;
    dontCount: boolean;
    category: string;
  }[];
  race?: Race;
  newRacerForm: FormGroup;
  dontCountCategories: FormGroup;
  categories: Category[] = categories;
  usedRacers: Racer[] = [];
  saving: boolean = false;

  constructor(
    private router: Router,
    public _AppService: AppService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.dontCountCategories = fb.group(
      this.categories.reduce((previousValue, currentValue) => {
        (previousValue as any)[currentValue.name] = false;
        return previousValue;
      }, {})
    );

    this.newRacerForm = fb.group({
      name: ['', Validators.required],
      team: ['', Validators.required],
      year: ['', [Validators.required]],
      gender: ['', Validators.required],
      category: ['', Validators.required],
      foreigner: [false],
      time: [
        '',
        [
          Validators.required,
          (control: any) => {
            var value = control.value;
            let hours = Number(value?.split(':')[0]);
            let minutes = Number(value?.split(':')[1]);
            let seconds = Number(value?.split(':')[2]);
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds))
              return { invalidTime: true };
            return null;
          },
        ],
      ],
    });
    this.password =
      this.activatedRoute.snapshot.queryParams['password'] ||
      prompt('Zadejte heslo pro přidávání výsledků') ||
      '';
    if (!this.password) {
      router.navigate(['']);
      return;
    }
  }

  async ngOnInit() {
    await this._AppService.getRacers(true);
    var response = await this._AppService.makeAPIRequest<any>(
      '/admin/finishes',
      'GET',
      {
        password: this.password,
      }
    );
    if (!response) {
      this.router.navigate(['']);
      return;
    }
    this.finishes = response.finishes.sort((a: any, b: any) => a.time - b.time);
    this.finishes?.forEach((finish) => {
      let racer = this._AppService.racers?.find(
        (racer) => racer._id == finish.racer_id
      );
      if (!racer) return;
      this.usedRacers.push(racer);
    });
    this.race = response.race;

    this.updateDontCount();

    this.dontCountCategories.valueChanges.subscribe(() => {
      this.updateDontCount();
    });

    let previousName = '';
    let previousGender = '';
    let previousYear = 0;
    this.newRacerForm.valueChanges.subscribe((value) => {
      if (value.name != previousName) {
        previousName = value.name;
        var existingRacer = this.racers?.find(
          (racer) => racer.name == value.name
        );
        if (!existingRacer) return;
        this.newRacerForm.get('team')?.setValue(existingRacer?.team);
        this.newRacerForm.get('year')?.setValue(existingRacer?.year);
        this.newRacerForm.get('gender')?.setValue(existingRacer?.gender);
        this.newRacerForm
          .get('category')
          ?.setValue(
            this._AppService.getCategoryByYear(
              existingRacer?.year || 0,
              existingRacer?.gender || 'Muži'
            )?.name
          );
        this.newRacerForm.get('foreigner')?.setValue(existingRacer?.foreigner);
      }
      if (previousGender != value.gender) {
        previousGender = value.gender;
        this.newRacerForm
          .get('category')
          ?.setValue(
            this._AppService.getCategoryByYear(
              value?.year || 0,
              value?.gender || 'Muži'
            )?.name
          );
      }
      if (previousYear != value.year) {
        previousYear = value.year;
        this.newRacerForm
          .get('category')
          ?.setValue(
            this._AppService.getCategoryByYear(
              value?.year || 0,
              value?.gender || 'Muži'
            )?.name
          );
      }
    });
  }

  updateDontCount() {
    this.finishes?.forEach((finish) => {
      finish.dontCount =
        this.dontCountCategories.value[finish.category] || false;
    });
  }

  get racers() {
    return this._AppService.racers;
  }

  get time() {
    var value = this.newRacerForm.value.time;
    let hours = Number(value?.split(':')[0]);
    let minutes = Number(value?.split(':')[1]);
    let seconds = Number(value?.split(':')[2]);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return undefined;
    return duration({ hours, minutes, seconds }).asSeconds();
  }

  get timeFormated() {
    return this._AppService.getTimeString(this.time || 0);
  }

  get exists() {
    return !!this.finishes?.find(
      (finish) =>
        finish.racer_id ==
        this.racers?.find(
          (racer) =>
            racer.name == this.newRacerForm.value.name &&
            racer.year == this.newRacerForm.value.year
        )?._id
    );
  }

  getRacerById(racer_id: string): Racer | undefined {
    return this.usedRacers?.find((racer) => racer._id == racer_id);
  }

  get filteredRacers(): Racer[] {
    if ((this.newRacerForm.value.name?.length || 0) >= 3)
      return (
        this.racers?.filter((racer) =>
          racer.name
            .toLowerCase()
            .includes(this.newRacerForm.value.name?.toLowerCase())
        ) || []
      );
    else return [];
  }

  addFinish() {
    const existingRacer = this.racers?.find(
      (racer) =>
        racer.name == this.newRacerForm.value.name &&
        racer.year == this.newRacerForm.value.year
    );
    var racer_id = existingRacer?._id || `new-${this._AppService.createId(20)}`;
    if (existingRacer) {
      this.usedRacers = this.usedRacers.filter(
        (racer) => racer._id != existingRacer._id
      );
      this.usedRacers.push(existingRacer);
    } else {
      this.usedRacers.push({
        _id: racer_id,
        name: this.newRacerForm.value.name,
        team: this.newRacerForm.value.team,
        year: this.newRacerForm.value.year,
        gender: this.newRacerForm.value.gender,
        foreigner: this.newRacerForm.value.foreigner,
      });
    }

    this.finishes = [
      {
        _id: this._AppService.createId(20),
        race_id: this.race?._id || '',
        racer_id: racer_id,
        time: this.time || 0,
        dontCount:
          this.dontCountCategories.value[this.newRacerForm.value.category] ||
          false,
        category: this.newRacerForm.value.category,
      },
      ...(this.finishes || []),
    ];
    this.newRacerForm.reset();
  }

  remove(_id: string) {
    this.finishes = this.finishes?.filter((finish) => finish._id != _id);
    this.usedRacers = this.usedRacers.filter((usedRacer) => {
      if (this.finishes?.find((finish) => finish.racer_id == usedRacer._id))
        return true;
      return false;
    });
  }

  async save() {
    this.saving = true;
    this.usedRacers = this.usedRacers.filter((usedRacer) => {
      if (this.finishes?.find((finish) => finish.racer_id == usedRacer._id))
        return true;
      return false;
    });
    var response = await this._AppService.makeAPIRequest<any>(
      '/admin/finishes',
      'POST',
      {
        password: this.password,
        finishes: this.finishes,
        usedRacers: this.usedRacers,
      }
    );
    this.saving = false;
    if (!response) {
      return;
    }
    alert('Výsledky uloženy. Děkujeme :D');
    this.router.navigate(['']);
  }
}
