import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'query-string';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-edits',
  templateUrl: './edits.component.html',
  styleUrls: ['./edits.component.scss'],
})
export class EditsComponent implements OnInit {
  type?: 'approve' | 'deny';
  _id: string;
  loading: boolean = true;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private _AppService: AppService
  ) {
    this._id = this.ActivatedRoute.snapshot.params['id'];
    this.type = this.ActivatedRoute.snapshot.queryParams['type'];
  }

  async ngOnInit() {
    this._AppService
      .makeAPIRequest(
        `/admin/edits/${encodeURIComponent(this._id)}?${stringify({
          type: this.type,
        })}`,
        'POST'
      )
      .then(() => {
        this.loading = false;
      });
  }
}
