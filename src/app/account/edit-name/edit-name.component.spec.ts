import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IUser, User } from 'src/app/types/user';

import { EditNameComponent } from './edit-name.component';

describe('EditNameComponent', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;
  let mockAuthService;

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
      mockAuthService = jasmine.createSpyObj(['saveUser']);
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
        providers: [{ provide: AuthService, useValue: mockAuthService }],
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

  it('should set submitted to false to start', () => {
    fixture.detectChanges();

    expect(component.submitted).toBeFalsy();
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

    describe('firstName field', () => {
      it('should be set to an empty string to start', () => {
        fixture.detectChanges();

        const firstNameControl = component.editForm.get('nameGroup.firstName');

        expect(firstNameControl.value).toEqual('');
      });

      it('should be invalid when empty', () => {
        let errors = {};
        fixture.detectChanges();

        const firstNameControl = component.editForm.get('nameGroup.firstName');
        errors = firstNameControl.errors || {};

        expect(firstNameControl.valid).toBeFalsy();
        expect(errors['required']).toBeTruthy();
      });

      it('should be invalid when length is less than 3', () => {
        let errors = {};
        fixture.detectChanges();

        const firstNameControl = component.editForm.get('nameGroup.firstName');
        firstNameControl.setValue('Jo');
        errors = firstNameControl.errors || {};

        expect(firstNameControl.valid).toBeFalsy();
        expect(errors['minlength']).toBeTruthy();

        firstNameControl.setValue('Joe');
        errors = firstNameControl.errors || {};
        expect(firstNameControl.valid).toBeTruthy();
        expect(errors['minlength']).toBeFalsy();
      });

      it('should be invalid when length is more than 20', () => {
        const maxLength = 20;
        let errors = {},
          name: string;
        fixture.detectChanges();

        const firstNameControl = component.editForm.get('nameGroup.firstName');
        name = 'Hardndeisnckdslfsalwf';
        expect(name.length).toBeGreaterThan(maxLength);
        firstNameControl.setValue(name);
        errors = firstNameControl.errors || {};

        expect(firstNameControl.valid).toBeFalsy();
        expect(errors['maxlength']).toBeTruthy();

        name = 'Hardndeisnckdslfsalw';
        firstNameControl.setValue(name);
        expect(name.length).toBeLessThanOrEqual(maxLength);
        errors = firstNameControl.errors || {};
        expect(firstNameControl.valid).toBeTruthy();
        expect(errors['maxlength']).toBeFalsy();
      });

      it('should be valid when set correctly', () => {
        let errors = {};
        fixture.detectChanges();
        const firstNameControl = component.editForm.get('nameGroup.firstName');

        firstNameControl.setValue('John');
        errors = firstNameControl.errors || {};

        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
        expect(errors['maxlength']).toBeFalsy();
        expect(firstNameControl.valid).toBeTruthy();
      });
    });

    describe('lastName field', () => {
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

      it('should be invalid when length is less than 3', () => {
        let errors = {};
        fixture.detectChanges();

        const lastNameControl = component.editForm.get('nameGroup.lastName');
        lastNameControl.setValue('Jo');
        errors = lastNameControl.errors || {};

        expect(lastNameControl.valid).toBeFalsy();
        expect(errors['minlength']).toBeTruthy();

        lastNameControl.setValue('Joe');
        errors = lastNameControl.errors || {};
        expect(lastNameControl.valid).toBeTruthy();
        expect(errors['minlength']).toBeFalsy();
      });

      it('should be invalid when length is more than 20', () => {
        const maxLength = 20;
        let errors = {},
          name: string;
        fixture.detectChanges();

        const lastNameControl = component.editForm.get('nameGroup.lastName');
        name = 'Hardndeisnckdslfsalwf';
        expect(name.length).toBeGreaterThan(maxLength);
        lastNameControl.setValue(name);
        errors = lastNameControl.errors || {};

        expect(lastNameControl.valid).toBeFalsy();
        expect(errors['maxlength']).toBeTruthy();

        name = 'Hardndeisnckdslfsalw';
        lastNameControl.setValue(name);
        expect(name.length).toBeLessThanOrEqual(maxLength);
        errors = lastNameControl.errors || {};
        expect(lastNameControl.valid).toBeTruthy();
        expect(errors['maxlength']).toBeFalsy();
      });

      it('should be valid when set correctly', () => {
        let errors = {};
        fixture.detectChanges();
        const lastNameControl = component.editForm.get('nameGroup.lastName');

        lastNameControl.setValue('Doe');
        errors = lastNameControl.errors || {};

        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
        expect(errors['maxlength']).toBeFalsy();
        expect(lastNameControl.valid).toBeTruthy();
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

      it(`should be invalid when input doesn't match the USER.password`, () => {
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

    xit(`should call onLoadingChange.emit with correct value when editForm is
      valid`, () => {
      fixture.detectChanges();
      spyOn(component.onLoadingChange, 'emit');
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
      expect(component.onLoadingChange.emit).toHaveBeenCalledTimes(1);
    });

    xit(`should call AuthService.saveUser and onLoadingChange.emit with correct
      values when editForm is valid`, () => {
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

      expect(component.onLoadingChange.emit).toHaveBeenCalledWith(true);
      expect(component.onLoadingChange.emit).toHaveBeenCalledWith(false);
      expect(component.onLoadingChange.emit).toHaveBeenCalledTimes(2);
      expect(mockAuthService.saveUser).toHaveBeenCalledWith(updatedUser);
      expect(component.user).toEqual(updatedUser as IUser);
    });
  });

  xit('should set editForm correctly', () => {
    fixture.detectChanges();

    const nameGroupControl = component.editForm.controls['nameGroup'];
    const passwordGroupControl = component.editForm.controls['passwordGroup'];
    expect(nameGroupControl.get('firstName').value).toEqual('');
    expect(nameGroupControl.get('lastName').value).toEqual('');
    expect(passwordGroupControl.get('currentPassword').value).toEqual('');
  });

  xit('email field validity', () => {
    let errors = {};
    let email = component.editForm.controls['email'];
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    1;
  });
});
