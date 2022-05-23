import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallHistoryResultsComponent } from './overall-history-results.component';

describe('OverallHistoryResultsComponent', () => {
  let component: OverallHistoryResultsComponent;
  let fixture: ComponentFixture<OverallHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallHistoryResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallHistoryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
