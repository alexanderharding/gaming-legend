import { IProductFeature } from './product-feature';

export interface ICartItem {
  id: number;
  name: string;
  code: string;
  brandId: number;
  brand: string;
  description: string;
  features?: IProductFeature[];
  price: number;
  quantity: number;
  starRating: number;
  imageUrl: string;
  imageUrls?: string[];
  type: string;
}
