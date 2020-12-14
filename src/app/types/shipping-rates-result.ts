import { IShippingRate } from './shipping-rate';

export class ShippingRatesResult {
  shippingRates: IShippingRate[];
  error?: string;
}
