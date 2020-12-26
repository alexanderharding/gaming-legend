import { IShipping } from './shipping';

export class ShippingRatesResult {
  shippingRates: IShipping[];
  error?: string;
}
