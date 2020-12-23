import { Injectable } from '@angular/core';
import { IMonthOption } from '../types/month-option';

@Injectable({
  providedIn: 'root',
})
export class FormValidationRuleService {
  readonly nameMinLength = 3;
  readonly nameMaxLength = 20;
  readonly streetMinLength = 5;
  readonly streetMaxLength = 20;
  readonly cityMinLength = 3;
  readonly cityMaxLength = 15;
  readonly zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/gm;
  readonly cvvPattern = /^[0-9]{3,4}$/;
  readonly phonePattern = /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/;
  readonly passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  readonly states = [
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
  readonly monthOptions: IMonthOption[] = [
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

  constructor() {}

  getYearOptions(): number[] {
    const date = new Date();
    const yearOptions: number[] = [];

    let currentYear = date.getFullYear();
    for (let index = 0; index < 8; index++) {
      yearOptions.push(currentYear);
      currentYear++;
    }
    return yearOptions;
  }
}
