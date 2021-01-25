import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

import { EditNameComponent } from './edit-name.component';

describe('EditNameComponent', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;
  let mockAuthService;
  let mockNotificationService;
  let mockFormValidationRuleService: FormValidationRuleService;
  let NAMEMINLENGTH: number;
  let NAMEMAXLENGTH: number;

  const USER: IUser = {
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

  @Component({
    selector: 'ctacu-current-password-form',
    template: '<div></div>',
  })
  class FakeCurrentPasswordFormComponent {
    @Input() parentForm: FormGroup;
    @Input() submitted: FormGroup;
  }

  @Component({
    selector: 'ctacu-name-form',
    template: '<div></div>',
  })
  class FakeNameFormComponent {
    @Input() parentForm: FormGroup;
    @Input() submitted: FormGroup;
    @Input() pageTitle: string;
    @Input() user: IUser;
  }

  beforeEach(
    waitForAsync(() => {
      NAMEMINLENGTH = 3;
      NAMEMAXLENGTH = 20;
      mockAuthService = jasmine.createSpyObj(['saveUser']);
      mockNotificationService = jasmine.createSpyObj(['show']);
      mockFormValidationRuleService = jasmine.createSpyObj([''], {
        nameMinLength: NAMEMINLENGTH,
        nameMaxLength: NAMEMAXLENGTH,
      });
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ReactiveFormsModule,
          FormsModule,
          NgbModule,
        ],
        declarations: [
          EditNameComponent,
          FakeNameFormComponent,
          FakeCurrentPasswordFormComponent,
        ],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: NotificationService, useValue: mockNotificationService },
          {
            provide: FormValidationRuleService,
            useValue: mockFormValidationRuleService,
          },
        ],
        // schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.loading = false;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set submitted correctly to start', () => {
    fixture.detectChanges();

    expect(component.submitted).toBeFalsy();
  });

  it('should set hasValueChanged correctly to start', () => {
    fixture.detectChanges();

    expect(component.hasValueChanged).toBeFalsy();
  });

  it('should set nameMinLength correctly', () => {
    fixture.detectChanges();

    expect(component.nameMinLength).toBe(NAMEMINLENGTH);
  });

  it('should set nameMaxLength correctly', () => {
    fixture.detectChanges();

    expect(component.nameMaxLength).toBe(NAMEMAXLENGTH);
  });

  describe('editForm', () => {
    it('should create', () => {
      fixture.detectChanges();

      expect(component.editForm).toBeTruthy();
    });

    it('should be invalid when empty', () => {
      fixture.detectChanges();

      expect(component.editForm.valid).toBeFalsy();
    });

    it('should be valid when set correctly', () => {
      fixture.detectChanges();

      const nameGroupControl = component.editForm.controls['nameGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });

      expect(component.editForm.valid).toBeTruthy();
    });

    describe('nameGroup', () => {
      it('should create', () => {
        fixture.detectChanges();

        expect(component.editForm.controls['nameGroup']).toBeTruthy();
      });

      it('should set hasValueChanged correctly', () => {
        fixture.detectChanges();

        const nameGroupControl = component.editForm.controls['nameGroup'];
        nameGroupControl.setValue({
          firstName: 'Ricky',
          lastName: 'Bobby',
        });

        expect(component.hasValueChanged).toBeTruthy();

        nameGroupControl.setValue({
          firstName: USER.name.firstName,
          lastName: USER.name.lastName,
        });
        expect(component.hasValueChanged).toBeFalsy();
      });

      describe('firstName control', () => {
        it('should be set to an empty string to start', () => {
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          expect(firstNameControl.value).toEqual('');
        });

        it('should be invalid when empty', () => {
          let errors = {};
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
        });

        it('should not be required when there is a value', () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          name = 'J';
          expect(name.length).toBeGreaterThanOrEqual(1);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
        });

        it('should be invalid when length is less than NAMEMINLENGTH', () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          name = 'Jo';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['minlength']).toBeTruthy();
        });

        it(`should be valid when length is greater than or equal to
         NAMEMINLENGTH`, () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          name = 'Joe';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};
          expect(firstNameControl.valid).toBeTruthy();
          expect(errors['minlength']).toBeFalsy();
        });

        it('should be invalid when length is greater than NAMEMAXLENGTH', () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          name = 'Hardndeisnckdslfsalwf';
          expect(name.length).toBeGreaterThan(NAMEMAXLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['maxlength']).toBeTruthy();
        });

        it(`should be valid when length is less than or equal to
          NAMEMAXLENGTH`, () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          name = 'Hardndeisnckdslfsalw';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};
          expect(firstNameControl.valid).toBeTruthy();
          expect(errors['maxlength']).toBeFalsy();
        });
      });

      describe('lastName control', () => {
        it('should be set to an empty string to start', () => {
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');

          expect(lastNameControl.value).toEqual('');
        });

        it('should be invalid when empty', () => {
          let errors = {};
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
        });

        it('should not be required when there is a value', () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'J';
          expect(name.length).toBeGreaterThanOrEqual(1);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
        });

        it('should be invalid when length is less than NAMEMINLENGTH', () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'Jo';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['minlength']).toBeTruthy();
        });

        it(`should be valid when length is greater than or equal to
        NAMEMINLENGTH`, () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');

          name = 'Joe';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};
          expect(lastNameControl.valid).toBeTruthy();
          expect(errors['minlength']).toBeFalsy();
        });

        it('should be invalid when length is greater than NAMEMAXLENGTH', () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'Hardndeisnckdslfsalwf';
          expect(name.length).toBeGreaterThan(NAMEMAXLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['maxlength']).toBeTruthy();
        });

        it(`should be valid when length is less than or equal to
          NAMEMAXLENGTH`, () => {
          let errors = {},
            name: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');

          name = 'Hardndeisnckdslfsalw';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};
          expect(lastNameControl.valid).toBeTruthy();
          expect(errors['maxlength']).toBeFalsy();
        });
      });
    });

    describe('currentPassword control', () => {
      it('should be set to an empty string to start', () => {
        fixture.detectChanges();

        const currentPasswordControl = component.editForm.get(
          'passwordGroup.currentPassword'
        );

        expect(currentPasswordControl.value).toEqual('');
      });

      it('should be invalid when empty', () => {
        let errors = {};
        fixture.detectChanges();

        const currentPasswordControl = component.editForm.get(
          'passwordGroup.currentPassword'
        );
        errors = currentPasswordControl.errors || {};

        expect(currentPasswordControl.valid).toBeFalsy();
        expect(errors['required']).toBeTruthy();
        expect(errors['invalid']).toBeFalsy();
      });

      it(`should be invalid when value doesn't match the USER.password`, () => {
        let errors = {};
        fixture.detectChanges();

        const currentPasswordControl = component.editForm.get(
          'passwordGroup.currentPassword'
        );

        currentPasswordControl.setValue('testPassword42');
        errors = currentPasswordControl.errors || {};

        expect(currentPasswordControl.valid).toBeFalsy();
        expect(errors['invalid']).toBeTruthy();
        expect(errors['required']).toBeFalsy();
      });

      it('should be valid if set correctly', () => {
        let errors = {};
        fixture.detectChanges();
        const currentPasswordControl = component.editForm.get(
          'passwordGroup.currentPassword'
        );

        currentPasswordControl.setValue(USER.password);
        errors = currentPasswordControl.errors || {};

        expect(errors['required']).toBeFalsy();
        expect(errors['invalid']).toBeFalsy();
        expect(currentPasswordControl.valid).toBeTruthy();
      });
    });
  });

  describe('onSubmit', () => {
    it('should set submitted to true', () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(component.submitted).toBeTruthy();
    });

    it(`should call onLoadingChange.emit with correct value`, () => {
      fixture.detectChanges();
      spyOn(component.onLoadingChange, 'emit');
      spyOn(component, 'resetForm');

      mockAuthService.saveUser.and.returnValue(of(true));

      const nameGroupControl = component.editForm.controls['nameGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      expect(component.editForm.valid).toBeTruthy();
      component.onSubmit(component.editForm);

      expect(component.onLoadingChange.emit).toHaveBeenCalledWith(true);
      expect(component.onLoadingChange.emit).toHaveBeenCalledWith(false);
      expect(component.onLoadingChange.emit).toHaveBeenCalledTimes(2);
    });

    it(`should not call onLoadingChange.emit when editForm is not
      valid`, () => {
      fixture.detectChanges();
      spyOn(component.onLoadingChange, 'emit');

      component.onSubmit(component.editForm);

      expect(component.onLoadingChange.emit).toHaveBeenCalledTimes(0);
    });

    it(`should call saveUser method on AuthService with correct value`, () => {
      let updatedUser: User;
      spyOn(component.onLoadingChange, 'emit');
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls['nameGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      updatedUser = {
        ...USER,
        name: {
          firstName: nameGroupControl.get('firstName').value as string,
          lastName: nameGroupControl.get('lastName').value as string,
        },
      };
      mockAuthService.saveUser.and.returnValue(of(updatedUser as IUser));
      expect(component.editForm.valid).toBeTruthy();

      component.onSubmit(component.editForm);

      expect(mockAuthService.saveUser).toHaveBeenCalledWith(updatedUser);
      expect(component.user).toEqual(updatedUser as IUser);
    });

    it(`should not call saveUser method on AuthService when editForm is not
      valid`, () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(mockAuthService.saveUser).toHaveBeenCalledTimes(0);
    });

    it(`should call resetForm method with correct value`, () => {
      let updatedUser: User;
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls['nameGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      updatedUser = {
        ...USER,
        name: {
          firstName: nameGroupControl.get('firstName').value as string,
          lastName: nameGroupControl.get('lastName').value as string,
        },
      };
      mockAuthService.saveUser.and.returnValue(of(updatedUser as IUser));
      expect(component.editForm.valid).toBeTruthy();

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledWith(
        component.editForm,
        updatedUser as IUser
      );
    });

    it(`should not call resetForm method when editForm is not valid`, () => {
      fixture.detectChanges();
      spyOn(component, 'resetForm');

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(0);
    });

    it(`should not call resetForm method when saveUser on AuthService throws an
      error`, () => {
      fixture.detectChanges();
      mockAuthService.saveUser.and.returnValue(throwError(''));
      spyOn(component, 'resetForm');

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(0);
    });

    it(`should call show method on Notification service`, () => {
      mockAuthService.saveUser.and.returnValue(of(true));
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls['nameGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      expect(component.editForm.valid).toBeTruthy();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
    });

    it(`should call show method on Notification service when saveUser on
      AuthService throws an error`, () => {
      mockAuthService.saveUser.and.returnValue(throwError(''));
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls['nameGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      expect(component.editForm.valid).toBeTruthy();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
    });

    it(`should not call show method on Notification service when editForm is not
      valid`, () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
    });
  });

  describe('resetForm', () => {
    it('should set submitted correctly', () => {
      fixture.detectChanges();
      component.submitted = true;

      component.resetForm(component.editForm, USER);

      expect(component.submitted).toBeFalsy();
    });

    it('should set nameGroup control correctly', () => {
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls['nameGroup'];
      const updatedUser = {
        ...USER,
        name: {
          firstName: 'Ricky',
          lastName: 'Bobby',
        },
      };
      component.resetForm(component.editForm, updatedUser);

      expect(nameGroupControl.get('firstName').value).toEqual('Ricky');
      expect(nameGroupControl.get('lastName').value).toEqual('Bobby');
    });

    it('should set passwordGroup control correctly', () => {
      fixture.detectChanges();
      const passwordGroupControl = component.editForm.controls['passwordGroup'];

      component.resetForm(component.editForm, USER);

      expect(passwordGroupControl.get('currentPassword').value).toEqual('');
    });
  });
});
