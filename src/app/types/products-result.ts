import { IProduct } from './product';
import { IProductBrand } from './product-brand';

export class ProductListResult {
  products: IProduct[];
  brands: IProductBrand[];
  error?: string;
}
