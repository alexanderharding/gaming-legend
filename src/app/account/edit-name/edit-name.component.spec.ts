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
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

import { EditNameComponent } from './edit-name.component';
import { NameFormComponent } from 'src/app/shared/name-form/name-form.component';
import { CurrentPasswordFormComponent } from 'src/app/shared/current-password-form/current-password-form.component';
import { FormService } from 'src/app/services/form.service';

describe('EditNameComponent', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;
  let mockAuthService;
  let mockNotificationService;
  let mockFormService: FormService;
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
      mockFormService = jasmine.createSpyObj([''], {
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
            provide: FormService,
            useValue: mockFormService,
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

  it('should set editForm value correctly to start', () => {
    fixture.detectChanges();

    expect(component.editForm.value).toEqual({
      nameGroup: {
        firstName: '',
        lastName: '',
      },
      passwordGroup: {
        currentPassword: '',
      },
    });
  });

  describe('editForm', () => {
    it('should not be valid when control values are empty empty', () => {
      fixture.detectChanges();

      component.editForm.setValue({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });

      expect(component.editForm.valid).toBeFalse();
    });

    it('should be valid when value is set correctly', () => {
      fixture.detectChanges();

      component.editForm.setValue({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });

      expect(component.editForm.errors).toBeNull();
      expect(component.editForm.valid).toBeTrue();
    });

    describe('nameGroup', () => {
      it('should set hasValueChanged correctly', () => {
        fixture.detectChanges();

        const nameGroupControl = component.editForm.controls.nameGroup;
        nameGroupControl.setValue({
          firstName: 'Ricky',
          lastName: 'Bobby',
        });

        expect(component.hasValueChanged).toBeTrue();

        nameGroupControl.setValue({
          firstName: USER.name.firstName,
          lastName: USER.name.lastName,
        });
        expect(component.hasValueChanged).toBeFalse();
      });

      describe('firstName control', () => {
        it('should not be valid when value is empty', () => {
          fixture.detectChanges();
          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          firstNameControl.setValue('');

          expect(firstNameControl.value.length).toBe(0);
          expect(firstNameControl.valid).toBeFalse();
          expect(firstNameControl.hasError('minlength')).toBeFalse();
          expect(firstNameControl.hasError('maxlength')).toBeFalse();
          expect(firstNameControl.hasError('required')).toBeTrue();
        });

        it(`should not be valid when value.length is less than
          NAMEMINLENGTH`, () => {
          fixture.detectChanges();
          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          firstNameControl.setValue('Jo');

          expect(firstNameControl.value.length).toBeLessThan(NAMEMINLENGTH);
          expect(firstNameControl.value.length).toBeGreaterThan(0);
          expect(firstNameControl.valid).toBeFalse();
          expect(firstNameControl.hasError('maxlength')).toBeFalse();
          expect(firstNameControl.hasError('required')).toBeFalse();
          expect(firstNameControl.hasError('minlength')).toBeTrue();
        });

        it(`should be valid when value.length is greater than or equal to
          NAMEMINLENGTH and less than or equal to NAMMAXLENGTH`, () => {
          fixture.detectChanges();
          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          firstNameControl.setValue('Joe');

          expect(firstNameControl.value.length).toBeGreaterThanOrEqual(
            NAMEMINLENGTH
          );
          expect(firstNameControl.value.length).toBeLessThanOrEqual(
            NAMEMAXLENGTH
          );
          expect(firstNameControl.errors).toBeNull();
          expect(firstNameControl.valid).toBeTrue();
        });

        it(`should not be valid when value.length is greater than
          NAMEMAXLENGTH`, () => {
          fixture.detectChanges();
          const firstNameControl = component.editForm.get(
            'nameGroup.firstName'
          );

          firstNameControl.setValue('Hardndeisnckdslfsalwf');

          expect(firstNameControl.value.length).toBeGreaterThan(NAMEMAXLENGTH);
          expect(firstNameControl.valid).toBeFalse();
          expect(firstNameControl.hasError('required')).toBeFalse();
          expect(firstNameControl.hasError('minlength')).toBeFalse();
          expect(firstNameControl.hasError('maxlength')).toBeTrue();
        });
      });

      describe('lastName control', () => {
        it('should not be valid when value is empty', () => {
          fixture.detectChanges();
          const lastNameControl = component.editForm.get('nameGroup.lastName');

          lastNameControl.setValue('');

          expect(lastNameControl.value.length).toBe(0);
          expect(lastNameControl.valid).toBeFalse();
          expect(lastNameControl.hasError('minlength')).toBeFalse();
          expect(lastNameControl.hasError('maxlength')).toBeFalse();
          expect(lastNameControl.hasError('required')).toBeTrue();
        });

        it(`should not be valid when value.length is less than
          NAMEMINLENGTH`, () => {
          let name: string;
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');
          name = 'Jo';
          lastNameControl.setValue(name);

          expect(lastNameControl.value.length).toBeLessThan(NAMEMINLENGTH);
          expect(lastNameControl.value.length).toBeGreaterThan(0);
          expect(lastNameControl.valid).toBeFalse();
          expect(lastNameControl.hasError('maxlength')).toBeFalse();
          expect(lastNameControl.hasError('required')).toBeFalse();
          expect(lastNameControl.hasError('minlength')).toBeTrue();
        });

        it(`should be valid when value.length is greater than or equal to
          NAMEMINLENGTH and less than or equal to NAMMAXLENGTH`, () => {
          fixture.detectChanges();

          const lastNameControl = component.editForm.get('nameGroup.lastName');

          lastNameControl.setValue('Joe');

          expect(lastNameControl.value.length).toBeGreaterThanOrEqual(
            NAMEMINLENGTH
          );
          expect(lastNameControl.value.length).toBeLessThanOrEqual(
            NAMEMAXLENGTH
          );
          expect(lastNameControl.hasError('maxlength')).toBeFalse();
          expect(lastNameControl.hasError('required')).toBeFalse();
          expect(lastNameControl.hasError('minlength')).toBeFalse();
          expect(lastNameControl.errors).toBeNull();
          expect(lastNameControl.valid).toBeTrue();
        });

        it(`should not be valid when value.length is greater than
          NAMEMAXLENGTH`, () => {
          fixture.detectChanges();
          const lastNameControl = component.editForm.get('nameGroup.lastName');

          lastNameControl.setValue('Hardndeisnckdslfsalwf');

          expect(lastNameControl.value.length).toBeGreaterThan(NAMEMAXLENGTH);
          expect(lastNameControl.valid).toBeFalse();
          expect(lastNameControl.hasError('minlength')).toBeFalse();
          expect(lastNameControl.hasError('required')).toBeFalse();
          expect(lastNameControl.hasError('maxlength')).toBeTrue();
        });
      });
    });

    describe('passwordGroup', () => {
      describe('currentPassword control', () => {
        it('should not be valid when the value is empty', () => {
          fixture.detectChanges();
          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue('');

          expect(currentPasswordControl.value.length).toBe(0);
          expect(currentPasswordControl.valid).toBeFalse();
          expect(currentPasswordControl.hasError('invalid')).toBeFalse();
          expect(currentPasswordControl.hasError('required')).toBeTrue();
        });

        it(`should not be valid when the value doesn't match the
          USER.password`, () => {
          fixture.detectChanges();
          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue('testPassword42');

          expect(currentPasswordControl.value !== USER.password).toBeTruthy();
          expect(currentPasswordControl.valid).toBeFalse();
          expect(currentPasswordControl.hasError('required')).toBeFalse();
          expect(currentPasswordControl.hasError('invalid')).toBeTrue();
        });

        it('should be valid when set correctly', () => {
          fixture.detectChanges();
          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue(USER.password);

          expect(currentPasswordControl.errors).toBeNull();
          expect(currentPasswordControl.valid).toBeTrue();
        });
      });
    });
  });

  describe('onSubmit', () => {
    it('should set submitted to true', () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(component.submitted).toBeTrue();
    });

    it(`should call loadingChange.emit with correct value`, () => {
      spyOn(component.loadingChange, 'emit');
      spyOn(component, 'resetForm');
      mockAuthService.saveUser.and.returnValue(of(true));
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
      expect(component.editForm.valid).toBeTrue();

      component.onSubmit(component.editForm);

      expect(component.loadingChange.emit).toHaveBeenCalledWith(true);
      expect(component.loadingChange.emit).toHaveBeenCalledWith(false);
      expect(component.loadingChange.emit).toHaveBeenCalledTimes(2);
    });

    it(`should not call loadingChange.emit when editForm is not
      valid`, () => {
      fixture.detectChanges();
      spyOn(component.loadingChange, 'emit');
      component.editForm.setValue({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.valid).toBeFalse();

      component.onSubmit(component.editForm);

      expect(component.loadingChange.emit).toHaveBeenCalledTimes(0);
    });

    it(`should call saveUser method on AuthService with correct value when
      editForm is valid`, () => {
      let updatedUser: User;
      spyOn(component.loadingChange, 'emit');
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.valid).toBeTrue();

      updatedUser = {
        ...USER,
        name: component.editForm.controls.nameGroup.value,
      };
      mockAuthService.saveUser.and.returnValue(of(updatedUser));
      component.onSubmit(component.editForm);

      expect(mockAuthService.saveUser).toHaveBeenCalledTimes(1);
      expect(mockAuthService.saveUser).toHaveBeenCalledWith(updatedUser);
      expect(component.user).toEqual(updatedUser as IUser);
    });

    it(`should not call saveUser method on AuthService when editForm is not
      valid`, () => {
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.valid).toBeFalse();

      component.onSubmit(component.editForm);

      expect(mockAuthService.saveUser).toHaveBeenCalledTimes(0);
    });

    it(`should call resetForm method with correct value when edit form is
      valid`, () => {
      let updatedUser: User;
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.valid).toBeTrue();
      updatedUser = {
        ...USER,
        name: component.editForm.controls.nameGroup.value,
      };
      mockAuthService.saveUser.and.returnValue(of(updatedUser as IUser));

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(1);
      expect(component.resetForm).toHaveBeenCalledWith(
        component.editForm,
        updatedUser as IUser
      );
    });

    it(`should not call resetForm method when editForm is not valid`, () => {
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.valid).toBeFalse();

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(0);
    });

    it(`should not call resetForm method when saveUser on AuthService throws an
      error`, () => {
      spyOn(component, 'resetForm');
      mockAuthService.saveUser.and.returnValue(throwError(''));
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.valid).toBeTrue();

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(0);
    });

    it(`should call show method on Notification service when editForm is
      valid`, () => {
      mockAuthService.saveUser.and.returnValue(of(true));
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.valid).toBeTrue();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
    });

    it(`should call show method on Notification service when saveUser on
      AuthService throws an error`, () => {
      mockAuthService.saveUser.and.returnValue(throwError(''));
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: 'John',
          lastName: 'Doe',
        },
        passwordGroup: {
          currentPassword: USER.password,
        },
      });
      expect(component.editForm.valid).toBeTrue();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
    });

    it(`should not call show method on Notification service when editForm is not
      valid`, () => {
      fixture.detectChanges();
      component.editForm.setValue({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.value).toEqual({
        nameGroup: {
          firstName: '',
          lastName: '',
        },
        passwordGroup: {
          currentPassword: '',
        },
      });
      expect(component.editForm.valid).toBeFalse();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
    });
  });

  describe('resetForm', () => {
    it('should set submitted correctly', () => {
      component.submitted = true;
      fixture.detectChanges();

      component.resetForm(component.editForm, USER);

      expect(component.submitted).toBeFalse();
    });

    it('should set nameGroup control value correctly', () => {
      fixture.detectChanges();
      const nameGroupControl = component.editForm.controls.nameGroup;
      nameGroupControl.setValue({
        firstName: '',
        lastName: '',
      });
      expect(nameGroupControl.value).toEqual({
        firstName: '',
        lastName: '',
      });

      component.resetForm(component.editForm, USER);

      expect(nameGroupControl.value).toEqual({
        firstName: USER.name.firstName,
        lastName: USER.name.lastName,
      });
    });

    it('should set passwordGroup control value correctly', () => {
      fixture.detectChanges();
      const passwordGroupControl = component.editForm.get('passwordGroup');
      passwordGroupControl.setValue({
        currentPassword: 'password',
      });
      expect(passwordGroupControl.value).toEqual({
        currentPassword: 'password',
      });

      component.resetForm(component.editForm, USER);

      expect(passwordGroupControl.value).toEqual({
        currentPassword: '',
      });
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

  it('should set NameFormComponent correctly in the template', fakeAsync(() => {
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

  it(`should set CurrentPasswordFormComponent correctly in the
    template`, () => {
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

    expect(component.onSubmit).toHaveBeenCalledTimes(1);
    expect(component.onSubmit).toHaveBeenCalledWith(component.editForm);
  });

  it(`should call resetForm method with correct value when cancel input button
    is clicked`, () => {
    spyOn(component, 'resetForm');
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('#cancel'));

    buttons[0].triggerEventHandler('click', null);

    expect(buttons.length).toBe(1);
    expect(component.resetForm).toHaveBeenCalledWith(
      component.editForm,
      component.user
    );
  });

  it(`should disable submit input button when loading is true`, () => {
    component.loading = true;
    component.submitted = false;
    fixture.detectChanges();
    component.editForm.setValue({
      nameGroup: {
        firstName: '',
        lastName: '',
      },
      passwordGroup: {
        currentPassword: '',
      },
    });

    const buttons = fixture.debugElement.queryAll(By.css('#submit'));
    expect(buttons.length).toBe(1);
    expect(component.editForm.value).toEqual({
      nameGroup: {
        firstName: '',
        lastName: '',
      },
      passwordGroup: {
        currentPassword: '',
      },
    });
    expect(component.editForm.valid).toBeFalse();
    expect(component.submitted).toBeFalse();
    expect(component.loading).toBeTrue();
    expect(buttons[0].nativeElement.disabled).toBeTrue();
  });

  it(`should disable submit input button when editForm is not valid and
    submitted is true`, () => {
    component.loading = false;
    component.submitted = true;
    fixture.detectChanges();
    component.editForm.setValue({
      nameGroup: {
        firstName: '',
        lastName: '',
      },
      passwordGroup: {
        currentPassword: '',
      },
    });

    const buttons = fixture.debugElement.queryAll(By.css('#submit'));
    expect(buttons.length).toBe(1);
    expect(component.editForm.valid).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(component.submitted).toBeTrue();
    expect(buttons[0].nativeElement.disabled).toBeTrue();
  });

  it(`should not disable submit input button when submitted is false`, () => {
    component.loading = false;
    component.submitted = false;
    fixture.detectChanges();
    component.editForm.setValue({
      nameGroup: {
        firstName: '',
        lastName: '',
      },
      passwordGroup: {
        currentPassword: '',
      },
    });

    const buttons = fixture.debugElement.queryAll(By.css('#submit'));
    expect(buttons.length).toBe(1);
    expect(component.editForm.valid).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(component.submitted).toBeFalse();
    expect(buttons[0].nativeElement.disabled).toBeFalse();
  });

  it(`should not disable submit input button when editForm is valid and
    submitted is true`, fakeAsync(() => {
    component.loading = false;
    component.submitted = true;
    fixture.detectChanges();
    component.editForm.setValue({
      nameGroup: {
        firstName: 'John',
        lastName: 'Doe',
      },
      passwordGroup: {
        currentPassword: USER.password,
      },
    });

    tick(1000);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('#submit'));
    expect(buttons.length).toBe(1);
    expect(component.editForm.valid).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.submitted).toBeTrue();
    expect(buttons[0].nativeElement.disabled).toBeFalsy();
  }));

  it(`should set submit input button classes correctly when editForm is
    valid`, fakeAsync(() => {
    fixture.detectChanges();

    component.editForm.setValue({
      nameGroup: {
        firstName: 'John',
        lastName: 'Doe',
      },
      passwordGroup: {
        currentPassword: USER.password,
      },
    });
    tick(1000);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('#submit'));
    expect(buttons.length).toBe(1);
    expect(component.editForm.valid).toBeTrue();
    expect(buttons[0].classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-success': true,
    });
  }));

  it(`should set submit button input classes correctly when not
    submitted`, () => {
    component.submitted = false;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('#submit'));
    expect(component.submitted).toBeFalse();
    expect(buttons.length).toBe(1);
    expect(component.editForm.valid).toBeFalse();
    expect(buttons[0].classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-success': true,
    });
  });

  it(`should set submit input button classes correctly when
    submitted`, fakeAsync(() => {
    component.submitted = true;
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('#submit'));

    component.editForm.setValue({
      nameGroup: {
        firstName: 'John',
        lastName: 'Doe',
      },
      passwordGroup: {
        currentPassword: '',
      },
    });
    tick(1000);
    fixture.detectChanges();

    expect(component.editForm.valid).toBeFalse();
    expect(buttons.length).toBe(1);
    expect(buttons[0].classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-outline-danger': true,
    });

    component.editForm.setValue({
      nameGroup: {
        firstName: 'John',
        lastName: 'Doe',
      },
      passwordGroup: {
        currentPassword: USER.password,
      },
    });
    tick(1000);
    fixture.detectChanges();

    expect(component.editForm.valid).toBeTrue();
    expect(buttons[0].classes).toEqual({
      btn: true,
      'btn-sm': true,
      'btn-success': true,
    });
  }));

  it(`should disable cancel input button when loading`, () => {
    component.loading = true;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('#cancel'));
    expect(buttons.length).toBe(1);
    expect(component.loading).toBeTrue();
    expect(buttons[0].nativeElement.disabled).toBeTrue();
  });

  it(`should not disable cancel input button when not loading`, () => {
    component.loading = false;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('#cancel'));
    expect(buttons.length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(buttons[0].nativeElement.disabled).toBeFalse();
  });
});
