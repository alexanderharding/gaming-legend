import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

import { NameFormComponent } from './name-form.component';

xdescribe('NameFormComponent', () => {
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
        declarations: [NameFormComponent],
        providers: [
          FormBuilder,
          {
            provide: FormValidationRuleService,
            useValue: mockFormValidationRuleService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
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

  it('should set firstNameMessage$ correctly to start', () => {
    let message: string;
    fixture.detectChanges();

    component.firstNameMessage$.subscribe((m) => (message = m));

    expect(message).toBe('Please enter a first name.');
  });

  it('should set lastNameMessage$ correctly to start', () => {
    let message: string;
    fixture.detectChanges();

    component.lastNameMessage$.subscribe((m) => (message = m));

    expect(message).toBe('Please enter a last name.');
  });

  describe('parentForm', () => {
    it('should set firstNameMessage$ correctly', fakeAsync(() => {
      let errors = {};
      let name: string;
      let message: string;

      fixture.detectChanges();
      const nameGroupControl = component.parentForm.controls['nameGroup'];

      name = 'J';
      expect(name.length).toBeLessThan(NAMEMINLENGTH);
      nameGroupControl.get('firstName').setValue(name);
      tick(1000);
      component.firstNameMessage$.subscribe((m) => (message = m));
      errors = nameGroupControl.errors || {};

      expect(nameGroupControl.valid).toBeFalsy();
      expect(errors['required']).toBeFalsy();
      // expect(errors['minlength']).toBeTruthy();

      expect(message).toEqual(`First name must be longer than ${
        NAMEMINLENGTH - 1
      }
      characters.`);
    }));
  });
});
