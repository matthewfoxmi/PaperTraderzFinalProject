import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StonkDetailsComponent } from './stonk-details.component';

describe('StonkDetailsComponent', () => {
  let component: StonkDetailsComponent;
  let fixture: ComponentFixture<StonkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StonkDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StonkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
