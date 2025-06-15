import { TestBed } from '@angular/core/testing';

import { InquiryDataService } from './inquiry-data.service';

describe('InquiryDataService', () => {
  let service: InquiryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquiryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
