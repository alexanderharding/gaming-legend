import { ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';

import { IProductType } from 'src/app/types/product-type';
import { ProductTypesResult } from 'src/app/types/product-types-result';

@Component({
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypesComponent implements OnInit {
  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ProductTypesResult;
  readonly productTypes = this.resolvedData.productTypes as IProductType[];
  readonly errorMessage = this.resolvedData.error as string;

  /* Set pageTitle */
  readonly pageTitle = this.productTypes
    ? ('All Products' as string)
    : ('Retrieval Error' as string);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }
}
