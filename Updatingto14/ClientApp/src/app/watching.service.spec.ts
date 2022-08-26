import { TestBed } from '@angular/core/testing';

import { WatchingService } from './watching.service';

describe('WatchingService', () => {
  let service: WatchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
