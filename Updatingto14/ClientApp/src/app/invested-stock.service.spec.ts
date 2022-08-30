import { TestBed } from '@angular/core/testing';

import { InvestedStockService } from './invested-stock.service';

describe('InvestedStockService', () => {
  let service: InvestedStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestedStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
