import { TestBed } from '@angular/core/testing';
import { IMonthOption } from '../types/month-option';

import { FormValidationRuleService } from './form-validation-rule.service';

describe('FormValidationRuleService', () => {
  let service: FormValidationRuleService;
  let STATES: string[];
  let MONTHOPTIONS: IMonthOption[];

  beforeEach(() => {
    STATES = [
      'Alabama',
      'Alaska',
      'American Samoa',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'District of Columbia',
      'Federated States of Micronesia',
      'Florida',
      'Georgia',
      'Guam',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Marshall Islands',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Carolina',
      'North Dakota',
      'Northern Mariana Islands',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Palau',
      'Pennsylvania',
      'Puerto Rico',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virgin Island',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming',
    ];
    MONTHOPTIONS = [
      { value: 0, name: 'Janurary' },
      { value: 1, name: 'Februrary' },
      { value: 2, name: 'March' },
      { value: 3, name: 'April' },
      { value: 4, name: 'May' },
      { value: 5, name: 'June' },
      { value: 6, name: 'July' },
      { value: 7, name: 'August' },
      { value: 8, name: 'September' },
      { value: 9, name: 'October' },
      { value: 10, name: 'November' },
      { value: 11, name: 'December' },
    ];
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidationRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set nameMinLength correctly', () => {
    expect(service.nameMinLength).toBe(3);
  });

  it('should set nameMaxLength correctly', () => {
    expect(service.nameMaxLength).toBe(20);
  });

  it('should set streetMinLength correctly', () => {
    expect(service.streetMinLength).toBe(5);
  });

  it('should set streetMaxLength correctly', () => {
    expect(service.streetMaxLength).toBe(20);
  });

  it('should set cityMinLength correctly', () => {
    expect(service.cityMinLength).toBe(3);
  });

  it('should set cityMaxLength correctly', () => {
    expect(service.cityMaxLength).toBe(15);
  });

  it('should set zipPattern correctly', () => {
    expect(service.zipPattern).toEqual(/^[0-9]{5}(?:-[0-9]{4})?$/);
  });

  it('should set cvvPattern correctly', () => {
    expect(service.cvvPattern).toEqual(/^[0-9]{3,4}$/);
  });

  it('should set phonePattern correctly', () => {
    expect(service.phonePattern).toEqual(
      /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/
    );
  });

  it('should set passwordPattern correctly', () => {
    expect(service.passwordPattern).toEqual(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    );
  });

  it('should set states correctly', () => {
    expect(service.states).toEqual(STATES);
  });

  it('should set monthOptions correctly', () => {
    expect(service.monthOptions).toEqual(MONTHOPTIONS);
  });

  describe('getYearOptions', () => {
    it('should return correct value', () => {
      const date = new Date();
      const yearOptions: number[] = [];
      let currentYear = date.getFullYear();
      for (let index = 0; index < 8; index++) {
        yearOptions.push(currentYear);
        currentYear++;
      }

      expect(service.getYearOptions()).toEqual(yearOptions);
    });
  });
});
