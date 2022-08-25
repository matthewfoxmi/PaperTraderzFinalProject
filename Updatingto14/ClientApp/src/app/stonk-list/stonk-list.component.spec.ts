import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StonkListComponent } from './stonk-list.component';

describe('StonkListComponent', () => {
  let component: StonkListComponent;
  let fixture: ComponentFixture<StonkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StonkListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StonkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
