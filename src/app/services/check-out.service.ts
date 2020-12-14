import { Injectable } from '@angular/core';
import { Order } from '../types/order';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Observable } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { IMonthOption } from '../types/month-option';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class CheckOutService {
  private readonly baseUrl: string = 'http://localhost:3000';

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

  constructor(
    private readonly http: HttpClient,
    private readonly cartService: CartService,
    private readonly errorService: ErrorService
  ) {}

  placeOrder(order: Order): Observable<Order> {
    return this.http
      .post<Order>(`${this.baseUrl}/orders`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

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
