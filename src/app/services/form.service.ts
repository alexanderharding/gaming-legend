import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  readonly nameMinLength = 3;
  readonly nameMaxLength = 20;
  readonly streetMinLength = 5;
  readonly streetMaxLength = 20;
  readonly cityMinLength = 3;
  readonly cityMaxLength = 15;
  readonly zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
  readonly phonePattern = /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/;
  readonly passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  constructor() {}
}
