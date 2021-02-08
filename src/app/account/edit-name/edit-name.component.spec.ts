import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

import { EditNameComponent } from './edit-name.component';
import { NameFormComponent } from 'src/app/shared/name-form/name-form.component';
import { CurrentPasswordFormComponent } from 'src/app/shared/current-password-form/current-password-form.component';

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
        imports: [HttpClientTestingModule, ReactiveFormsModule, NgbModule],
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

  it('should set editForm correctly', () => {
    fixture.detectChanges();

    expect(component.editForm).toBeTruthy();
    expect(component.editForm.controls.nameGroup).toBeTruthy();
    expect(component.editForm.controls.passwordGroup).toBeTruthy();
  });

  describe('editForm', () => {
    it('should be invalid when empty', () => {
      fixture.detectChanges();

      expect(component.editForm.valid).toBeFalsy();
    });

    it('should be valid when set correctly', () => {
      fixture.detectChanges();

      const nameGroupControl = component.editForm.controls.nameGroup;
      const passwordGroupControl = component.editForm.controls.passwordGroup;
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
      it('should set hasValueChanged correctly', () => {
        fixture.detectChanges();

        const nameGroupControl = component.editForm.controls.nameGroup;
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
          let key: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          key = 'required';
          expect(errors[key]).toBeTruthy();
        });

        it('should not be required when there is a value', () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          name = 'J';
          expect(name.length).toBeGreaterThanOrEqual(1);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          key = 'required';
          expect(errors[key]).toBeFalsy();
        });

        it(`should be invalid when value.length is less than
          NAMEMINLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          name = 'Jo';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          key = 'minlength';
          expect(errors[key]).toBeTruthy();
        });

        it(`should be valid when value.length is greater than or equal to
         NAMEMINLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          name = 'Joe';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};
          expect(firstNameControl.valid).toBeTruthy();
          key = 'minlength';
          expect(errors[key]).toBeFalsy();
        });

        it(`should be invalid when value.length is greater than
          NAMEMAXLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );
          name = 'Hardndeisnckdslfsalwf';
          expect(name.length).toBeGreaterThan(NAMEMAXLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          key = 'maxlength';
          expect(errors[key]).toBeTruthy();
        });

        it(`should be valid when value.length is less than or equal to
          NAMEMAXLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();
          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          name = 'Hardndeisnckdslfsalw';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          firstNameControl.setValue(name);
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeTruthy();
          key = 'maxlength';
          expect(errors[key]).toBeFalsy();
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
          let key: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          key = 'required';
          expect(errors[key]).toBeTruthy();
        });

        it('should not be required when there is a value', () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'J';
          expect(name.length).toBeGreaterThanOrEqual(1);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          key = 'required';
          expect(errors[key]).toBeFalsy();
        });

        it(`should be invalid when value.length is less than
          NAMEMINLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'Jo';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          key = 'minlength';
          expect(errors[key]).toBeTruthy();
        });

        it(`should be valid when value.length is greater than or equal to
          NAMEMINLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');

          name = 'Joe';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};
          expect(lastNameControl.valid).toBeTruthy();
          key = 'minlength';
          expect(errors[key]).toBeFalsy();
        });

        it(`should be invalid when value.length is greater than
          NAMEMAXLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'Hardndeisnckdslfsalwf';
          expect(name.length).toBeGreaterThan(NAMEMAXLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          key = 'maxlength';
          expect(errors[key]).toBeTruthy();
        });

        it(`should be valid when value.length is less than or equal to
          NAMEMAXLENGTH`, () => {
          let errors = {};
          let name: string;
          let key: string;
          fixture.detectChanges();
          const lastNameControl = component.editForm.get('nameGroup.lastName');

          name = 'Hardndeisnckdslfsalw';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          lastNameControl.setValue(name);
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeTruthy();
          key = 'maxlength';
          expect(errors[key]).toBeFalsy();
        });
      });
    });

    describe('passwordGroup', () => {
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
          let key: string;
          fixture.detectChanges();

          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );
          errors = currentPasswordControl.errors || {};

          expect(currentPasswordControl.valid).toBeFalsy();
          key = 'required';
          expect(errors[key]).toBeTruthy();
          key = 'invalid';
          expect(errors[key]).toBeFalsy();
        });

        it(`should be invalid when value doesn't match the USER.password`, () => {
          let errors = {};
          let key: string;
          fixture.detectChanges();

          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue('testPassword42');
          errors = currentPasswordControl.errors || {};

          expect(currentPasswordControl.valid).toBeFalsy();
          key = 'invalid';
          expect(errors[key]).toBeTruthy();
          key = 'required';
          expect(errors[key]).toBeFalsy();
        });

        it('should be valid when set correctly', () => {
          let errors = {};
          let key: string;
          fixture.detectChanges();
          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue(USER.password);
          errors = currentPasswordControl.errors || {};

          key = 'required';
          expect(errors[key]).toBeFalsy();
          key = 'invalid';
          expect(errors[key]).toBeFalsy();
          expect(currentPasswordControl.valid).toBeTruthy();
        });
      });
    });
  });

  describe('onSubmit', () => {
    it('should set submitted to true', () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(component.submitted).toBeTruthy();
    });

    it(`should call loadingChange.emit with correct value`, () => {
      fixture.detectChanges();
      spyOn(component.loadingChange, 'emit');
      spyOn(component, 'resetForm');

      mockAuthService.saveUser.and.returnValue(of(true));

      const nameGroupControl = component.editForm.controls.nameGroup;
      const passwordGroupControl = component.editForm.controls.passwordGroup;
      nameGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      expect(component.editForm.valid).toBeTruthy();
      component.onSubmit(component.editForm);

      expect(component.loadingChange.emit).toHaveBeenCalledWith(true);
      expect(component.loadingChange.emit).toHaveBeenCalledWith(false);
      expect(component.loadingChange.emit).toHaveBeenCalledTimes(2);
    });

    it(`should not call loadingChange.emit when editForm is not
      valid`, () => {
      fixture.detectChanges();
      spyOn(component.loadingChange, 'emit');

      component.onSubmit(component.editForm);

      expect(component.loadingChange.emit).toHaveBeenCalledTimes(0);
    });

    it(`should call saveUser method on AuthService with correct value`, () => {
      let updatedUser: User;
      spyOn(component.loadingChange, 'emit');
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls.nameGroup;
      const passwordGroupControl = component.editForm.controls.passwordGroup;
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
      const nameGroupControl = component.editForm.controls.nameGroup;
      const passwordGroupControl = component.editForm.controls.passwordGroup;
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
      const nameGroupControl = component.editForm.controls.nameGroup;
      const passwordGroupControl = component.editForm.controls.passwordGroup;
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
      const nameGroupControl = component.editForm.controls.nameGroup;
      const passwordGroupControl = component.editForm.controls.passwordGroup;
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
      const nameGroupControl = component.editForm.controls.nameGroup;
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
      const passwordGroupControl = component.editForm.controls.passwordGroup;

      component.resetForm(component.editForm, USER);

      expect(passwordGroupControl.get('currentPassword').value).toEqual('');
    });
  });
});

describe('EditNameComponent w/ template', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, ReactiveFormsModule, NgbModule],
        declarations: [
          EditNameComponent,
          NameFormComponent,
          CurrentPasswordFormComponent,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameComponent);
    component = fixture.componentInstance;
    component.user = USER;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set NameFormComponent in the template', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    const firstNameControl = component.editForm.get('nameGroup.firstName');
    const NameFormComponentDEs = fixture.debugElement.queryAll(
      By.directive(NameFormComponent)
    );

    expect(component.hasValueChanged).toBeFalsy();
    expect(NameFormComponentDEs.length).toBe(1);
    expect(NameFormComponentDEs[0].componentInstance.user).toBe(component.user);
    expect(NameFormComponentDEs[0].componentInstance.submitted).toBe(
      component.submitted
    );
    expect(NameFormComponentDEs[0].componentInstance.parentForm).toBe(
      component.editForm
    );
    expect(NameFormComponentDEs[0].componentInstance.pageTitle).toBe('');

    firstNameControl.setValue('j');
    fixture.detectChanges();
    tick(1000);

    expect(component.hasValueChanged).toBeTruthy();
    expect(NameFormComponentDEs[0].componentInstance.pageTitle).toBe(
      'Edit Full Name'
    );
  }));

  it('should set CurrentPasswordFormComponent in the template', () => {
    fixture.detectChanges();
    const CurrentPasswordFormComponentDEs = fixture.debugElement.queryAll(
      By.directive(CurrentPasswordFormComponent)
    );

    expect(CurrentPasswordFormComponentDEs.length).toBe(1);
    expect(CurrentPasswordFormComponentDEs[0].componentInstance.submitted).toBe(
      component.submitted
    );
    expect(
      CurrentPasswordFormComponentDEs[0].componentInstance.parentForm
    ).toBe(component.editForm);
  });

  it(`should call onSubmit method with correct value when editForm is
    submitted`, () => {
    spyOn(component, 'onSubmit');
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));

    form.triggerEventHandler('ngSubmit', null);

    expect(component.onSubmit).toHaveBeenCalledWith(component.editForm);
  });

  it(`should call resetForm method with correct value when cancel input is
    clicked`, () => {
    spyOn(component, 'resetForm');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#cancel'));

    input.triggerEventHandler('click', null);

    expect(component.resetForm).toHaveBeenCalledWith(
      component.editForm,
      component.user
    );
  });

  it(`should disable submit input when loading`, () => {
    const input = fixture.debugElement.query(By.css('#submit'));
    component.loading = true;
    fixture.detectChanges();

    expect(input.nativeElement.disabled).toBeTruthy();
  });

  it(`should set submit input classes correctly when editForm is
    valid`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#submit'));
    fixture.detectChanges();
    const nameGroupControl = component.editForm.controls.nameGroup;
    const passwordGroupControl = component.editForm.controls.passwordGroup;

    nameGroupControl.setValue({
      firstName: 'John',
      lastName: 'Doe',
    });
    passwordGroupControl.setValue({
      currentPassword: USER.password,
    });
    tick(1000);
    fixture.detectChanges();

    expect(component.editForm.valid).toBeTruthy();
    expect(input.classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-success': true,
    });
  }));

  it(`should set submit input classes correctly when not submitted`, () => {
    const input = fixture.debugElement.query(By.css('#submit'));
    component.submitted = false;
    fixture.detectChanges();

    expect(component.editForm.valid).toBeFalsy();
    expect(input.classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-success': true,
    });
  });

  it(`should set submit input classes correctly when
    submitted`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#submit'));
    component.submitted = true;
    fixture.detectChanges();
    const nameGroupControl = component.editForm.controls.nameGroup;
    const passwordGroupControl = component.editForm.controls.passwordGroup;

    expect(component.editForm.valid).toBeFalsy();
    expect(input.classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-outline-danger': true,
    });

    nameGroupControl.setValue({
      firstName: 'John',
      lastName: 'Doe',
    });
    passwordGroupControl.setValue({
      currentPassword: USER.password,
    });
    tick(1000);
    fixture.detectChanges();

    expect(component.editForm.valid).toBeTruthy();
    expect(input.classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-success': true,
    });
  }));

  it(`should disable submit input when editForm is not valid`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#submit'));
    component.submitted = true;
    fixture.detectChanges();
    tick(1000);

    expect(component.editForm.valid).toBeFalsy();
    expect(input.nativeElement.disabled).toBeTruthy();
  }));

  it(`should not disable submit input when editForm is valid`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#submit'));
    component.submitted = true;
    fixture.detectChanges();
    const nameGroupControl = component.editForm.controls.nameGroup;
    const passwordGroupControl = component.editForm.controls.passwordGroup;

    nameGroupControl.setValue({
      firstName: 'John',
      lastName: 'Doe',
    });
    passwordGroupControl.setValue({
      currentPassword: USER.password,
    });
    tick(1000);
    fixture.detectChanges();

    expect(component.editForm.valid).toBeTruthy();
    expect(input.nativeElement.disabled).toBeFalsy();
  }));

  it(`should not disable submit input when not submitted`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#submit'));
    component.submitted = false;
    fixture.detectChanges();
    const nameGroupControl = component.editForm.controls.nameGroup;
    const passwordGroupControl = component.editForm.controls.passwordGroup;

    expect(component.editForm.valid).toBeFalsy();
    expect(input.nativeElement.disabled).toBeFalsy();

    nameGroupControl.setValue({
      firstName: 'John',
      lastName: 'Doe',
    });
    passwordGroupControl.setValue({
      currentPassword: USER.password,
    });
    tick(1000);
    fixture.detectChanges();

    expect(component.editForm.valid).toBeTruthy();
    expect(input.nativeElement.disabled).toBeFalsy();
  }));

  it(`should disable cancel input when loading`, () => {
    const input = fixture.debugElement.query(By.css('#cancel'));
    component.loading = true;
    fixture.detectChanges();

    expect(input.nativeElement.disabled).toBeTruthy();
  });

  it(`should not disable cancel input when not loading`, () => {
    const input = fixture.debugElement.query(By.css('#cancel'));
    component.loading = false;
    fixture.detectChanges();

    expect(input.nativeElement.disabled).toBeFalsy();
  });
});
