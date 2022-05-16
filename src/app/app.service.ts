import { Injectable } from '@angular/core';
import { firstValueFrom, race } from 'rxjs';
import { stringify } from 'query-string';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { duration } from 'moment';
import categories from './categories.json';

export interface Race {
  _id: string;
  name: string;
  date: string;
  day: string;
  proposition: string;
  hasResults: boolean;
}

export interface Result {
  _id: string;
  time: number;
  dontCount: boolean;
  category: string;
  racer: Racer;
  place: number;
  points: number;
}

export interface Racer {
  _id: string;
  name: string;
  gender: 'Muži' | 'Ženy';
  team: string;
  year: number;
  foreigner: boolean;
}

export interface RaceResults {
  _id: string;
  categories: { name: string; results: Result[] }[];
}

export interface OverallResultsCategory {
  name: string;
  results: {
    points: number;
    numberOfRaces: number;
    racer: Racer;
    place: number;
    races: Result[];
  }[];
}
[];

export interface Category {
  name: string;
  min: number;
  max: number;
}

export interface RacerDetails {
  _id: string;
  name: string;
  team: string;
  year: number;
  gender: string;
  category: string;
  bestInCategoryPoints: number;
  bestInGenderPoints: number;
  categoryResults: {
    points: number;
    numberOfRaces: number;
    racer: Racer;
    place: number;
    races: Result[];
  };
  genderResults: {
    points: number;
    numberOfRaces: number;
    racer: Racer;
    place: number;
    races: Result[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  races?: Race[];
  results?: RaceResults[] = [];
  racers?: Racer[];
  overallResults?: OverallResultsCategory[];
  racersDetails: RacerDetails[] = [];

  constructor(private _snackBar: MatSnackBar, private http: HttpClient) {}

  async makeAPIRequest<o>(
    url: string,
    method: string = 'GET',
    body?: any
  ): Promise<o | undefined> {
    var response = await firstValueFrom<any>(
      this.http.request(
        method,
        `/api${url}${method == 'GET' ? `?${stringify(body)}` : ''}`,
        {
          body: body,
        }
      )
    ).catch((error) => {
      this._snackBar.open('Error: ' + error.statusText, undefined, {
        duration: 5000,
      });
    });
    if (response?.error) {
      this._snackBar.open(response.error, undefined, {
        duration: 5000,
      });
      return;
    }
    return response;
  }

  async getRaces(): Promise<Race[] | undefined> {
    if (this.races) return this.races;
    var races = await this.makeAPIRequest<Race[]>('/races/');
    if (!races) return;
    this.races = races;
    return races;
  }

  async getResults(race_id: string): Promise<RaceResults | undefined> {
    let existing = this.results?.find((results) => results._id == race_id);
    if (existing) return existing;
    var results = await this.makeAPIRequest<RaceResults>(
      `/races/${encodeURIComponent(race_id)}/results`
    );
    if (!results) return;
    this.results = this.results?.filter(
      (results1) => results1._id != results?._id
    );
    this.results?.push(results);
    return results;
  }

  async getOverallResults() {
    if (this.overallResults) return this.overallResults;
    var overallResults = await this.makeAPIRequest<OverallResultsCategory[]>(
      '/results'
    );
    if (!overallResults) return;
    this.overallResults = overallResults;
    return overallResults;
  }

  async getRacers(reload?: boolean): Promise<Racer[] | undefined> {
    if (this.racers && !reload) return this.racers;
    this.racers = await this.makeAPIRequest('/racers');
    return this.racers;
  }

  getTimeString(time: number) {
    let timeDuration = duration(time * 1000);
    var hours = timeDuration.hours().toString();
    while (hours.length < 2) hours = '0' + hours;
    var minutes = timeDuration.minutes().toString();
    while (minutes.length < 2) minutes = '0' + minutes;
    var seconds = timeDuration.seconds().toString();
    while (seconds.length < 2) seconds = '0' + seconds;
    return `${hours}:${minutes}:${seconds}`;
  }

  getCategoryByYear(
    year: number,
    gender: 'Muži' | 'Ženy'
  ): Category | undefined {
    return categories.find(
      (category) =>
        category.min <= year &&
        (category.max >= year || category.max === 100) &&
        gender == category.gender
    );
  }

  createId(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async getRacersDetails(id: string) {
    let existing = this.racersDetails.find((racer) => racer._id == id);
    if (existing) return existing;
    var racer = await this.makeAPIRequest<RacerDetails>(`/racers/${id}`);
    if (!racer) return;
    this.racersDetails = this.racersDetails.filter((racer) => racer._id != id);
    this.racersDetails.push(racer);
    return racer;
  }
}
