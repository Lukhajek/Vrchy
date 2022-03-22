import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallResultsComponent } from './overall-results.component';

describe('OverallResultsComponent', () => {
  let component: OverallResultsComponent;
  let fixture: ComponentFixture<OverallResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
