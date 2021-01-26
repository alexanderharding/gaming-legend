import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

import { NameFormComponent } from './name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;
  let mockFormValidationRuleService: FormValidationRuleService;
  let NAMEMINLENGTH: number;
  let NAMEMAXLENGTH: number;
  let USER: IUser;

  beforeEach(
    waitForAsync(() => {
      USER = {
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        contact: {
          phone: '8011231234',
          email: 'test@test.com',
        },
        address: {
          street: '123 S Bend Ct',
          city: 'Las Vegas',
          state: 'Nevada',
          zip: '12345',
          country: 'USA',
        },
        password: 'TestPassword1234',
        isAdmin: true,
        id: 121014,
      };
      NAMEMINLENGTH = 3;
      NAMEMAXLENGTH = 20;
      mockFormValidationRuleService = jasmine.createSpyObj([''], {
        nameMinLength: NAMEMINLENGTH,
        nameMaxLength: NAMEMAXLENGTH,
      });
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [NameFormComponent],
        providers: [
          FormBuilder,
          {
            provide: FormValidationRuleService,
            useValue: mockFormValidationRuleService,
          },
        ],
        // schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.submitted = false;
    component.parentForm = fb.group({
      nameGroup: fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAMEMINLENGTH),
            Validators.maxLength(NAMEMAXLENGTH),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAMEMINLENGTH),
            Validators.maxLength(NAMEMAXLENGTH),
          ],
        ],
      }),
    });
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set defaultPageTitle correctly', () => {
    fixture.detectChanges();

    expect(component.defaultPageTitle).toBe('Full Name');
  });

  it('should set firstNameMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.firstNameMessage$.subscribe((m) => (message = m));
    expect(message).toBe('');
  }));

  it('should set lastNameMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.lastNameMessage$.subscribe((m) => (message = m));
    expect(message).toBe('');
  }));

  describe('parentForm', () => {
    describe('nameGroup', () => {
      describe('firstName control', () => {
        it('should be set correctly to start', fakeAsync(() => {
          let errors = {};
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          errors = nameGroupControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(firstNameControl.valid).toBeTruthy();
          expect(firstNameControl.value).toEqual(USER.name.firstName);
        }));

        it(`should set firstNameMessage$ correctly when there's no
          value`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = '';
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(errors['required']).toBeTruthy();
          expect(message).toBe('Please enter a first name.');
        }));

        it(`should set firstNameMessage$ correctly when value is less than
          NAMEMINLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = 'j';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          expect(name.length).toBeGreaterThan(0);
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(errors['minlength']).toBeTruthy();
          expect(message).toBe(`First name must be longer than ${
            NAMEMINLENGTH - 1
          }
    characters.`);
        }));

        it(`should set firstNameMessage$ correctly when value is greater than or
          equal to NAMEMAXLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnnysilverhandsiscool';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeTruthy();
          expect(message)
            .toBe(`First name cannot be longer than ${NAMEMAXLENGTH}
    characters.`);
        }));

        it(`should set firstNameMessage$ correctly when
          valid`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnny';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(message).toBe('');
          expect(firstNameControl.valid).toBeTruthy();
        }));
      });

      describe('lastName control', () => {
        it('should be set correctly to start', fakeAsync(() => {
          let errors = {};
          fixture.detectChanges();
          tick(1000);
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');

          errors = lastNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(lastNameControl.valid).toBeTruthy();
          expect(lastNameControl.value).toEqual(USER.name.lastName);
        }));

        it(`should set lastNameMessage$ correctly when there's no
          value`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = '';
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
          expect(message).toBe('Please enter a last name.');
        }));

        it(`should set lastNameMessage$ correctly when value is less than
          NAMEMINLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = 'j';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          expect(name.length).toBeGreaterThan(0);
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(errors['minlength']).toBeTruthy();
          expect(message).toBe(`Last name must be longer than ${
            NAMEMINLENGTH - 1
          }
    characters.`);
        }));

        it(`should set lastNameMessage$ correctly when value is greater than or
          equal to NAMEMAXLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnnysilverhandsiscool';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeTruthy();
          expect(message).toBe(`Last name cannot be longer than ${NAMEMAXLENGTH}
    characters.`);
        }));

        it(`should set lastNameMessage$ correctly when valid`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnny';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(lastNameControl.valid).toBeTruthy();
          expect(message).toBe('');
        }));
      });
    });
  });
});
