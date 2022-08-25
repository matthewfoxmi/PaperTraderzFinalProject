import { TestBed } from '@angular/core/testing';

import { StonkService } from './stonk.service';

describe('StonkService', () => {
  let service: StonkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StonkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
