import { ICartItem } from './cart-item';

export class CartItemsResult {
  items: ICartItem[];
  error?: string;
}
