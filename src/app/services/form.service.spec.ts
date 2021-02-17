import { TestBed } from '@angular/core/testing';

import { FormService } from './form.service';

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have set nameMinLength correctly', () => {
    expect(service.nameMinLength).toBe(3);
  });

  it('should have set nameMaxLength correctly', () => {
    expect(service.nameMaxLength).toBe(20);
  });

  it('should have set streetMinLength correctly', () => {
    expect(service.streetMinLength).toBe(5);
  });

  it('should have set streetMaxLength correctly', () => {
    expect(service.streetMaxLength).toBe(20);
  });

  it('should have set cityMinLength correctly', () => {
    expect(service.cityMinLength).toBe(3);
  });

  it('should have set cityMaxLength correctly', () => {
    expect(service.cityMaxLength).toBe(15);
  });

  it('should have set zipPattern correctly', () => {
    expect(service.zipPattern).toEqual(/^[0-9]{5}(?:-[0-9]{4})?$/);
  });

  it('should have set phonePattern correctly', () => {
    expect(service.phonePattern).toEqual(
      /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/
    );
  });

  it('should have set passwordPattern correctly', () => {
    expect(service.passwordPattern).toEqual(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    );
  });
});
