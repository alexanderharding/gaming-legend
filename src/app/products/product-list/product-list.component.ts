import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EMPTY, combineLatest, BehaviorSubject, Subscription } from 'rxjs';
import { catchError, map, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IProduct } from 'src/app/types/product';
import { IProductBrand } from 'src/app/types/product-brand';
import { ProductListResult } from 'src/app/types/products-result';
import { Title } from '@angular/platform-browser';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly pageSize = 6;
  private isFirstSort = true;
  private readonly queryParamMap = this.route.snapshot.queryParamMap;
  readonly pageTitle = this.route.snapshot.paramMap.get('type') || 'products';
  page = +this.queryParamMap.get('p') || 1;
  readonly productFilter = this.queryParamMap.get('search') || '';
  readonly brandId = +this.queryParamMap.get('id') || 0;
  readonly sort = +this.queryParamMap.get('sort') || 0;

  filterForm: FormGroup;

  private readonly isFilteringSubject = new BehaviorSubject<boolean>(false);
  readonly isFiltering$ = this.isFilteringSubject.asObservable();

  readonly productType$ = this.route.paramMap.pipe(map((p) => p.get('type')));

  private readonly resolvedData$ = this.route.data.pipe(
    map((d) => {
      const resolvedData = d.resolvedData as ProductListResult;
      const title = resolvedData.products
        ? `${resolvedData.products[0].type}`
        : 'Retrieval Error';
      this.title.setTitle(
        `Gaming Legend | ${this.capitalizePipe.transform(title)}`
      );
      return resolvedData;
    })
  );
  private readonly products$ = this.resolvedData$.pipe(
    map((r) => r.products as IProduct[])
  );

  readonly brands$ = this.resolvedData$.pipe(
    map((r) => r.brands as IProductBrand[])
  );
  readonly error$ = this.resolvedData$.pipe(map((r) => r.error as string));

  private readonly subscriptions: Subscription[] = [];

  private readonly brandSelectedSubject = new BehaviorSubject<number>(0);
  private readonly brandSelectedAction$ = this.brandSelectedSubject.asObservable();

  private readonly productsWithSelectedBrand$ = combineLatest([
    this.products$,
    this.brandSelectedAction$,
  ]).pipe(
    debounceTime(500),
    map(
      ([products, selectedBrandId]) =>
        products.filter((p) =>
          selectedBrandId ? p.brandId === selectedBrandId : true
        ) as IProduct[]
    ),
    catchError((err) => {
      console.log(err);
      return EMPTY;
    })
  );

  private readonly productFilteredSubject = new BehaviorSubject<string>('');
  private readonly productsFilteredAction$ = this.productFilteredSubject.asObservable();

  private readonly filteredProducts$ = combineLatest([
    this.productsWithSelectedBrand$,
    this.productsFilteredAction$,
  ]).pipe(
    map(
      ([products, searchFilter]) =>
        products.filter((product) =>
          searchFilter
            ? product.name.toLowerCase().indexOf(searchFilter) > -1
            : true
        ) as IProduct[]
    ),
    catchError((err) => {
      console.log(err);
      return EMPTY;
    })
  );

  private readonly sortSelectedSubject = new BehaviorSubject<number>(0);
  private readonly sortSelectedAction$ = this.sortSelectedSubject.asObservable();

  readonly sortedProducts$ = combineLatest([
    this.filteredProducts$,
    this.sortSelectedAction$,
  ]).pipe(
    debounceTime(500),
    map(([products, sortFilter]) => {
      if (!this.isFirstSort) {
        this.page = 1;
      } else {
        this.isFirstSort = false;
      }
      let sortedProducts: IProduct[];
      switch (sortFilter) {
        case 1:
          sortedProducts = products.sort((a, b) =>
            a.name > b.name ? 1 : -1
          ) as IProduct[];
          this.setFiltering(false);
          return sortedProducts;
        case 2:
          sortedProducts = products.sort((a, b) =>
            a.name < b.name ? 1 : -1
          ) as IProduct[];
          this.setFiltering(false);
          return sortedProducts;
        case 3:
          sortedProducts = products.sort(
            (low, high) => low.price - high.price
          ) as IProduct[];
          this.setFiltering(false);
          return sortedProducts;
        case 4:
          sortedProducts = products.sort(
            (low, high) => high.price - low.price
          ) as IProduct[];
          this.setFiltering(false);
          return sortedProducts;
        default:
          sortedProducts = products.sort(
            (low, high) => low.id - high.id
          ) as IProduct[];
          this.setFiltering(false);
          return sortedProducts;
      }
    }),
    catchError((err) => {
      console.log(err);
      return EMPTY;
    })
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly capitalizePipe: CapitalizePipe,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  clearFilters(): void {
    const searchValue = this.filterForm.get('search').value;
    if (searchValue) {
      const searchInput = document.getElementById('search');
      searchInput.focus();
    }
    this.filterForm.patchValue({
      search: '',
      brand: 0,
    });
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }

  private setFiltering(value: boolean): void {
    this.isFilteringSubject.next(value);
  }

  private buildForm(): void {
    this.filterForm = this.formBuilder.group({
      search: '',
      brand: null,
      sort: null,
    });
    this.subToValueChanges();
    this.filterForm.setValue({
      search: this.productFilter,
      brand: this.brandId,
      sort: this.sort,
    });
  }

  private subToValueChanges() {
    this.subscriptions.push(
      this.filterForm
        .get('search')
        .valueChanges.pipe(debounceTime(1000))
        .subscribe((value: string) => {
          this.setFiltering(true);
          this.productFilteredSubject.next(value.trim().toLowerCase());
        })
    );

    this.subscriptions.push(
      this.filterForm.get('brand').valueChanges.subscribe((value: number) => {
        this.setFiltering(true);
        this.brandSelectedSubject.next(+value);
      })
    );

    this.subscriptions.push(
      this.filterForm.get('sort').valueChanges.subscribe((value: number) => {
        this.setFiltering(true);
        this.sortSelectedSubject.next(+value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
