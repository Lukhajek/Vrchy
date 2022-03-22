import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService, Race } from 'src/app/app.service';

@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrls: ['./passwords.component.scss'],
})
export class PasswordsComponent implements OnInit {
  form: FormGroup;
  sending: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _AppService: AppService,
    private router: Router
  ) {
    this.form = fb.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      race: ['', Validators.required],
    });
  }

  get races(): Race[] {
    return this._AppService.races || [];
  }

  ngOnInit(): void {
    this._AppService.getRaces();
  }

  async send() {
    this.sending = true;
    var response = await this._AppService.makeAPIRequest(
      '/admin/passwords/' + encodeURIComponent(this.form.value.race),
      'POST',
      {
        password: this.form.value.password,
        email: this.form.value.email,
      }
    );
    this.sending = false;
    if (response) {
      alert('Heslo úspěšně odesláno');
      this.router.navigate(['']);
    }
  }
}
