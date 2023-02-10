import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelApptComponent } from './cancel-appt.component';

describe('CancelApptComponent', () => {
  let component: CancelApptComponent;
  let fixture: ComponentFixture<CancelApptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelApptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelApptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
