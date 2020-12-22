import { TestBed } from '@angular/core/testing';

import { FormValidationRuleService } from './form-validation-rule.service';

describe('FormValidationRuleService', () => {
  let service: FormValidationRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidationRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
