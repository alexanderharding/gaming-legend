import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

import { EditContactComponent } from './edit-contact.component';

describe('EditContactComponent', () => {
  let component: EditContactComponent,
    fixture: ComponentFixture<EditContactComponent>,
    USER: IUser,
    mockAuthService,
    mockFormValidationRuleService: FormValidationRuleService,
    mockNotificationService,
    PHONEPATTERN: RegExp;

  @Component({
    selector: 'ctacu-current-password-form',
    template: '<div></div>',
  })
  class FakeCurrentPasswordFormComponent {
    @Input() parentForm: FormGroup;
    @Input() submitted: FormGroup;
  }

  @Component({
    selector: 'ctacu-contact-form',
    template: '<div></div>',
  })
  class FakeContactFormComponent {
    @Input() parentForm: FormGroup;
    @Input() submitted: FormGroup;
    @Input() pageTitle: string;
    @Input() emailTakenMessage: string;
    @Input() user: IUser;
  }
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
      PHONEPATTERN = /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/;
      mockAuthService = jasmine.createSpyObj(['saveUser', 'checkForUser']);
      mockNotificationService = jasmine.createSpyObj(['show']);
      mockFormValidationRuleService = jasmine.createSpyObj([''], {
        phonePattern: PHONEPATTERN,
      });
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ReactiveFormsModule,
          FormsModule,
          NgbModule,
        ],
        declarations: [
          EditContactComponent,
          FakeCurrentPasswordFormComponent,
          FakeContactFormComponent,
        ],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          {
            provide: FormValidationRuleService,
            useValue: mockFormValidationRuleService,
          },
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactComponent);
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

  it('should set hasEmailChanged correctly to start', () => {
    fixture.detectChanges();

    expect(component.hasEmailChanged).toBeFalsy();
  });

  it('should set emailTakenMessage correctly to start', () => {
    fixture.detectChanges();

    expect(component.emailTakenMessage).toBeUndefined();
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

      const contactGroupControl = component.editForm.controls['contactGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      contactGroupControl.setValue({
        phone: USER.contact.phone,
        email: USER.contact.email,
        confirmEmail: USER.contact.email,
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });

      expect(component.editForm.valid).toBeTruthy();
    });

    describe('contactGroup', () => {
      it('should create', () => {
        fixture.detectChanges();

        expect(component.editForm.controls['contactGroup']).toBeTruthy();
      });

      it('should set hasValueChanged correctly', () => {
        fixture.detectChanges();

        const contactGroupControl = component.editForm.controls['contactGroup'];
        contactGroupControl.setValue({
          phone: '8011471471',
          email: 'testEmail1232@email.com',
          confirmEmail: 'testEmail1232@email.com',
        });

        expect(component.hasValueChanged).toBeTruthy();

        contactGroupControl.setValue({
          phone: USER.contact.phone,
          email: USER.contact.email,
          confirmEmail: USER.contact.email,
        });
        expect(component.hasValueChanged).toBeFalsy();
      });

      describe('email field', () => {
        it('should be set to an empty string to start', () => {
          fixture.detectChanges();

          const emailControl = component.editForm.get('contactGroup.email');

          expect(emailControl.value).toEqual('');
        });

        it('should be invalid when empty', () => {
          let errors = {};
          fixture.detectChanges();

          const emailControl = component.editForm.get('contactGroup.email');
          errors = emailControl.errors || {};

          expect(emailControl.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
        });

        it('should not be required when there is a value', () => {
          let errors = {},
            email: string;
          fixture.detectChanges();

          const emailControl = component.editForm.get('contactGroup.email');
          email = 'J';
          expect(email.length).toBeGreaterThanOrEqual(1);
          emailControl.setValue(email);
          errors = emailControl.errors || {};

          expect(errors['required']).toBeFalsy();
        });

        it('should be valid when value is a valid email', () => {
          let errors = {},
            email: string;
          fixture.detectChanges();

          const emailControl = component.editForm.get('contactGroup.email');
          email = USER.contact.email;
          emailControl.setValue(email);
          errors = emailControl.errors || {};

          expect(emailControl.valid).toBeTruthy();
          expect(errors['required']).toBeFalsy();
          expect(errors['email']).toBeFalsy();
        });

        it('should be invalid when value is not a valid email', () => {
          let errors = {};
          fixture.detectChanges();

          const emailControl = component.editForm.get('contactGroup.email');
          emailControl.setValue('invalidEmail');
          errors = emailControl.errors || {};

          expect(emailControl.valid).toBeFalsy();
          expect(errors['email']).toBeTruthy();
        });
      });

      describe('confirmEmail field', () => {
        it('should be set to an empty string to start', () => {
          fixture.detectChanges();

          const confirmEmailControl = component.editForm.get(
            'contactGroup.confirmEmail'
          );

          expect(confirmEmailControl.value).toEqual('');
        });

        it('should be invalid when empty', () => {
          let errors = {};
          fixture.detectChanges();

          const confirmEmailControl = component.editForm.get(
            'contactGroup.confirmEmail'
          );
          errors = confirmEmailControl.errors || {};

          expect(confirmEmailControl.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
        });

        it('should be valid when there is a value', () => {
          let errors = {},
            email: string;
          fixture.detectChanges();

          const confirmEmailControl = component.editForm.get(
            'contactGroup.confirmEmail'
          );
          email = 'email';
          confirmEmailControl.setValue(email);
          errors = confirmEmailControl.errors || {};

          expect(confirmEmailControl.valid).toBeTruthy();
          expect(errors['required']).toBeFalsy();
        });
      });

      describe('currentPassword field', () => {
        it('should be set to an empty string to start', () => {
          fixture.detectChanges();

          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          expect(currentPasswordControl.value).toEqual('');
        });

        it('should be required when empty', () => {
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
          const password = 'testPassword42';
          fixture.detectChanges();

          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue(password);
          errors = currentPasswordControl.errors || {};

          expect(currentPasswordControl.value === USER.password).toBeFalsy();
          expect(currentPasswordControl.valid).toBeFalsy();
          expect(errors['invalid']).toBeTruthy();
          expect(errors['required']).toBeFalsy();
        });

        it(`should be valid when value matches USER.password`, () => {
          let errors = {};
          fixture.detectChanges();
          const currentPasswordControl = component.editForm.get(
            'passwordGroup.currentPassword'
          );

          currentPasswordControl.setValue(USER.password);
          errors = currentPasswordControl.errors || {};

          expect(currentPasswordControl.value === USER.password).toBeTruthy();
          expect(currentPasswordControl.valid).toBeTruthy();
          expect(errors['required']).toBeFalsy();
          expect(errors['invalid']).toBeFalsy();
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

    it(`should call onLoadingChange.emit with correct value`, () => {
      fixture.detectChanges();
      mockAuthService.checkForUser.and.returnValue(of(true));
      mockAuthService.saveUser.and.returnValue(of(true));
      spyOn(component.onLoadingChange, 'emit');
      spyOn(component, 'resetForm');

      const contactGroupControl = component.editForm.controls['contactGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      contactGroupControl.setValue({
        phone: '8011231471',
        email: 'testemail@test.com',
        confirmEmail: 'testemail@test.com',
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

    xit(`should call saveUser method on AuthService with correct value`, () => {
      let updatedUser: User;
      // mockAuthService.checkForUser.and.returnValue(of(true));
      fixture.detectChanges();
      const contactGroupControl = component.editForm.controls['contactGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      contactGroupControl.setValue({
        phone: '8011231471',
        email: USER.contact.email,
        confirmEmail: USER.contact.email,
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      updatedUser = {
        ...USER,
        contact: {
          phone: contactGroupControl.get('phone').value as string,
          email: contactGroupControl.get('email').value as string,
        },
      };
      mockAuthService.saveUser.and.returnValue(of(updatedUser as IUser));
      expect(component.editForm.valid).toBeTruthy();

      component.onSubmit(component.editForm);

      expect(mockAuthService.saveUser).toHaveBeenCalledWith(updatedUser);
      expect(component.user).toEqual(updatedUser as IUser);
    });

    xit(`should not call saveUser method on AuthService when editForm is not
      valid`, () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(mockAuthService.saveUser).toHaveBeenCalledTimes(0);
    });

    xit(`should call resetForm method with correct value`, () => {
      let updatedUser: User;
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      const contactGroupControl = component.editForm.controls['contactGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      contactGroupControl.setValue({
        firstName: 'John',
        lastName: 'Doe',
      });
      passwordGroupControl.setValue({
        currentPassword: USER.password,
      });
      updatedUser = {
        ...USER,
        name: {
          firstName: contactGroupControl.get('firstName').value as string,
          lastName: contactGroupControl.get('lastName').value as string,
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

    xit(`should not call resetForm method when editForm is not valid`, () => {
      fixture.detectChanges();
      spyOn(component, 'resetForm');

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(0);
    });

    xit(`should not call resetForm method when saveUser on AuthService throws an
      error`, () => {
      fixture.detectChanges();
      mockAuthService.saveUser.and.returnValue(throwError(''));
      spyOn(component, 'resetForm');

      component.onSubmit(component.editForm);

      expect(component.resetForm).toHaveBeenCalledTimes(0);
    });

    xit(`should call show method on Notification service`, () => {
      mockAuthService.saveUser.and.returnValue(of(true));
      spyOn(component, 'resetForm');
      fixture.detectChanges();
      const contactGroupControl = component.editForm.controls['contactGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      contactGroupControl.setValue({
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

    xit(`should call show method on Notification service when saveUser on
      AuthService throws an error`, () => {
      mockAuthService.saveUser.and.returnValue(throwError(''));
      fixture.detectChanges();
      const contactGroupControl = component.editForm.controls['contactGroup'];
      const passwordGroupControl = component.editForm.controls['passwordGroup'];
      contactGroupControl.setValue({
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

    xit(`should not call show method on Notification service when editForm is not
      valid`, () => {
      fixture.detectChanges();

      component.onSubmit(component.editForm);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
    });
  });
});
