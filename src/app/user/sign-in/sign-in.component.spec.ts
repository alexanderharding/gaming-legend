import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SignUpComponent } from '../sign-up/sign-up.component';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockRouter: Router;
  let mockAuthService;
  let mockNotificationService;

  const EMAILVALIDATIONMESSAGES = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address',
  };

  const PASSWORDVALIDATIONMESSAGES = {
    required: 'Please enter your password.',
  };

  @Component({
    selector: 'ctacu-sign-up',
    template: '<div></div>',
  })
  class FakeSignUpComponent {
    @Input() loading: boolean;
  }

  beforeEach(
    waitForAsync(() => {
      mockRouter = jasmine.createSpyObj(['navigate']);
      mockAuthService = jasmine.createSpyObj(['signIn']);
      mockNotificationService = jasmine.createSpyObj(['show']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, ReactiveFormsModule],
        declarations: [SignInComponent, FakeSignUpComponent],
        providers: [
          { provide: Router, useValue: mockRouter },
          { provide: AuthService, useValue: mockAuthService },
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set signInForm correctly', () => {
    fixture.detectChanges();

    expect(component.signInForm).toBeTruthy();
    expect(component.signInForm.controls.email).toBeTruthy();
    expect(component.signInForm.controls.password).toBeTruthy();
  });

  it('should set pageTitle correctly', () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('sign in');
  });

  it('should set submitted correctly to start', () => {
    fixture.detectChanges();

    expect(component.submitted).toBeFalsy();
  });

  it('should set signInMessage correctly to start', () => {
    fixture.detectChanges();

    expect(component.signInMessage).toBe('');
  });

  it('should set loading$ correctly to start', () => {
    let loading: boolean;
    fixture.detectChanges();

    component.loading$.subscribe((l) => (loading = l));

    expect(loading).toBeFalsy();
  });

  it('should set emailMessage$ correctly to start', () => {
    let message: string;
    fixture.detectChanges();

    component.emailMessage$.subscribe((m) => (message = m));

    expect(message).toBe(EMAILVALIDATIONMESSAGES.required);
  });

  it('should set passwordMessage$ correctly to start', () => {
    let message: string;
    fixture.detectChanges();

    component.passwordMessage$.subscribe((m) => (message = m));

    expect(message).toBe(PASSWORDVALIDATIONMESSAGES.required);
  });

  describe('signInForm', () => {
    it('should be invalid when empty', () => {
      fixture.detectChanges();

      expect(component.signInForm.valid).toBeFalsy();
    });

    it('should be valid when set correctly', () => {
      fixture.detectChanges();
      const emailControl = component.signInForm.controls.email;
      const passwordControl = component.signInForm.controls.password;

      emailControl.setValue('validEmail@test.com');
      passwordControl.setValue('ValidPassword');

      expect(component.signInForm.valid).toBeTruthy();
    });

    describe('emailControl', () => {
      it('should be set to an empty string to start', () => {
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        expect(emailControl.value).toBe('');
      });

      it('should be invalid when empty', () => {
        let errors: object;
        let message: string;
        let key: string;
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        component.emailMessage$.subscribe((m) => (message = m));
        errors = emailControl.errors || {};

        key = 'email';
        expect(errors[key]).toBeFalsy();
        key = 'required';
        expect(errors[key]).toBeTruthy();
      });

      it('should set emailMessage$ correctly when empty', fakeAsync(() => {
        let message: string;
        let key: string;
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        emailControl.setValue('');
        tick(1000);
        component.emailMessage$.subscribe((m) => (message = m));

        key = 'required';
        expect(message).toBe(EMAILVALIDATIONMESSAGES[key]);
      }));

      it(`should be invalid when value isn't a valid email`, () => {
        let errors: object;
        let key: string;
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        emailControl.setValue('invalidEmail');
        errors = emailControl.errors || {};

        key = 'required';
        expect(errors[key]).toBeFalsy();
        key = 'email';
        expect(errors[key]).toBeTruthy();
      });

      it(`should set emailMessage$ correctly when value isn't a valid
        email`, fakeAsync(() => {
        let key: string;
        let message: string;
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        emailControl.setValue('invalidEmail');
        tick(1000);
        component.emailMessage$.subscribe((m) => (message = m));

        key = 'email';
        expect(message).toBe(EMAILVALIDATIONMESSAGES[key]);
      }));

      it(`should be valid when value is a valid email`, () => {
        let key: string;
        let errors: object;
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        emailControl.setValue('validEmail@test.com');
        errors = emailControl.errors || {};

        key = 'required';
        expect(errors[key]).toBeFalsy();
        key = 'email';
        expect(errors[key]).toBeFalsy();
        expect(emailControl.valid).toBeTruthy();
      });

      it(`should set emailMessage$ correctly when value is a valid
        email`, fakeAsync(() => {
        let message: string;
        fixture.detectChanges();
        const emailControl = component.signInForm.controls.email;

        emailControl.setValue('validEmail@test.com');
        tick(1000);
        component.emailMessage$.subscribe((m) => (message = m));

        expect(message).toBe('');
      }));
    });

    describe('passwordControl', () => {
      it('should be set to an empty string to start', () => {
        fixture.detectChanges();
        const passwordControl = component.signInForm.controls.password;

        expect(passwordControl.value).toBe('');
      });

      it('should be invalid when empty', () => {
        let errors: object;
        let key: string;
        fixture.detectChanges();
        const passwordControl = component.signInForm.controls.password;

        errors = passwordControl.errors || {};

        expect(passwordControl.valid).toBeFalsy();
        key = 'required';
        expect(errors[key]).toBeTruthy();
      });

      it('should set passwordMessage$ correctly when empty', fakeAsync(() => {
        let message: string;
        fixture.detectChanges();
        const passwordControl = component.signInForm.controls.password;

        passwordControl.setValue('');
        tick(1000);
        component.passwordMessage$.subscribe((m) => (message = m));

        expect(message).toBe(PASSWORDVALIDATIONMESSAGES.required);
      }));

      it('should be valid when there is a value', () => {
        let errors: object;
        let key: string;
        fixture.detectChanges();
        const passwordControl = component.signInForm.controls.password;

        passwordControl.setValue('t');
        errors = passwordControl.errors || {};

        key = 'required';
        expect(errors[key]).toBeFalsy();
        expect(passwordControl.valid).toBeTruthy();
      });

      it(`should set passwordMessage$ correctly when there is a
        value`, fakeAsync(() => {
        let message: string;
        fixture.detectChanges();
        const passwordControl = component.signInForm.controls.password;

        passwordControl.setValue('j');
        tick(1000);
        component.passwordMessage$.subscribe((m) => (message = m));

        expect(message).toBe('');
      }));
    });
  });

  describe('onSubmit', () => {
    it('should set submitted correctly', () => {
      fixture.detectChanges();

      component.onSubmit(component.signInForm);

      expect(component.submitted).toBeTruthy();
    });

    it('should set signInMessage correctly', () => {
      component.signInMessage = 'message!';
      fixture.detectChanges();
      expect(component.signInMessage).toBe('message!');

      component.onSubmit(component.signInForm);

      expect(component.signInMessage).toBe('');
    });

    it(`should call signIn method with correct value when signInForm is
      valid`, () => {
      spyOn(component, 'signIn');
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();
      const form = component.signInForm;

      form.patchValue({
        email,
        password,
      });
      component.onSubmit(form);

      expect(form.valid).toBeTruthy();
      expect(component.signIn).toHaveBeenCalledWith(email, password);
    });

    it(`should not call signIn method with when signInForm is not
      valid`, fakeAsync(() => {
      spyOn(component, 'signIn');
      fixture.detectChanges();

      component.onSubmit(component.signInForm);

      expect(component.signInForm.valid).toBeFalsy();
      expect(component.signIn).toHaveBeenCalledTimes(0);
    }));

    it(`should call setLoading method with correct value when signInForm is
      valid`, () => {
      mockAuthService.signIn.and.returnValue(of(true));
      spyOn(component, 'setLoading');
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();
      const form = component.signInForm;

      form.patchValue({
        email,
        password,
      });
      component.onSubmit(form);

      expect(component.setLoading).toHaveBeenCalledWith(true);
    });

    it(`should not call setLoading method with correct value when signInForm is
      not valid`, () => {
      spyOn(component, 'setLoading');
      fixture.detectChanges();

      component.onSubmit(component.signInForm);

      expect(component.setLoading).toHaveBeenCalledTimes(0);
    });
  });

  describe('signIn', () => {
    it(`should retrieve call signIn method on AuthService with correct
      value`, () => {
      mockAuthService.signIn.and.returnValue(of(true));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(email, password);
    });

    it(`should call setLoading method with correct value when signIn method on
      AuthService returns of(true)`, () => {
      mockAuthService.signIn.and.returnValue(of(true));
      spyOn(component, 'setLoading');
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(component.setLoading).toHaveBeenCalledWith(false);
    });

    it(`should call setLoading method with correct value when signIn method on
      AuthService returns throwError('')`, () => {
      mockAuthService.signIn.and.returnValue(throwError(''));
      spyOn(component, 'setLoading');
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(component.setLoading).toHaveBeenCalledWith(false);
    });

    it(`should not call setLoading method when signIn method on AuthService
      returns of(false)`, () => {
      mockAuthService.signIn.and.returnValue(of(false));
      spyOn(component, 'setLoading');
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(component.setLoading).toHaveBeenCalledTimes(0);
    });

    it(`should set signInMessage when signIn method on AuthService returns
      of(false)`, () => {
      mockAuthService.signIn.and.returnValue(of(false));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(component.signInMessage).toBe('Invalid email or password.');
    });

    it(`should not set signInMessage when signIn method on AuthService returns
      of(true)`, () => {
      mockAuthService.signIn.and.returnValue(of(true));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(component.signInMessage).toBe('');
    });

    it(`should call navigate method on Router when sign method on AuthService
      returns of(true)`, () => {
      mockAuthService.signIn.and.returnValue(of(true));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
    });

    it(`should not call navigate method on Router when sign method on AuthService
      returns throwError('')`, () => {
      mockAuthService.signIn.and.returnValue(throwError(''));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
    });

    it(`should call show method on NotificationService when sign method on
      AuthService returns of(true)`, () => {
      mockAuthService.signIn.and.returnValue(of(true));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(mockNotificationService.show).toHaveBeenCalled();
    });

    it(`should not call show method on NotificationService when sign method on
      AuthService returns of(false)`, () => {
      mockAuthService.signIn.and.returnValue(of(false));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
    });

    it(`should call show method on NotificationService when sign method on
      AuthService returns throwError('')`, () => {
      mockAuthService.signIn.and.returnValue(throwError(''));
      const email = 'validEmail@test.com';
      const password = 'password';
      fixture.detectChanges();

      component.signIn(email, password);

      expect(mockNotificationService.show).toHaveBeenCalled();
    });
  });

  describe('setLoading', () => {
    it('should set loading$ correctly', () => {
      let loading: boolean;
      fixture.detectChanges();

      component.setLoading(true);
      component.loading$.subscribe((l) => (loading = l));

      expect(loading).toBeTruthy();

      component.setLoading(false);
      component.loading$.subscribe((l) => (loading = l));

      expect(loading).toBeFalsy();
    });
  });
});

describe('SignInComponent w/ template', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockRouter: Router;
  let mockAuthService;
  let mockNotificationService;

  const EMAILVALIDATIONMESSAGES = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address',
  };

  const PASSWORDVALIDATIONMESSAGES = {
    required: 'Please enter your password.',
  };

  beforeEach(
    waitForAsync(() => {
      mockRouter = jasmine.createSpyObj(['navigate']);
      mockAuthService = jasmine.createSpyObj(['signIn']);
      mockNotificationService = jasmine.createSpyObj(['show']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, ReactiveFormsModule, NgbModule],
        declarations: [SignInComponent, SignUpComponent],
        providers: [
          { provide: Router, useValue: mockRouter },
          { provide: AuthService, useValue: mockAuthService },
          { provide: NotificationService, useValue: mockNotificationService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set pageTitle correctly in the template', () => {
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('h1'));

    expect(element.nativeElement.textContent).toBe(component.pageTitle);
  });

  it('should set SignUpComponent correctly in the template', () => {
    let loading: boolean;
    fixture.detectChanges();

    const SignUpComponentDEs = fixture.debugElement.queryAll(
      By.directive(SignUpComponent)
    );
    component.loading$.subscribe((l) => (loading = l));

    expect(SignUpComponentDEs.length).toBe(1);
    expect(SignUpComponentDEs[0].componentInstance.loading).toBe(loading);
  });

  it(`should set email field classes correctly in the template when
    submitted is false`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#userEmail'));
    fixture.detectChanges();
    const emailControl = component.signInForm.get('email');

    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });

    emailControl.setValue('validEmail@test.com');
    tick(1000);
    fixture.detectChanges();

    expect(emailControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
    });
  }));

  it(`should set email field classes correctly in the template when
    submitted is true`, fakeAsync(() => {
    component.submitted = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#userEmail'));
    const emailControl = component.signInForm.get('email');

    expect(emailControl.valid).toBeFalsy();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
      'is-invalid': true,
    });

    emailControl.setValue('validEmail@test.com');
    tick(1000);
    fixture.detectChanges();

    expect(emailControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
    });
  }));

  it(`should set password field classes correctly in the template when
    submitted is false`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#userPassword'));
    fixture.detectChanges();
    const passwordControl = component.signInForm.get('password');

    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });

    passwordControl.setValue('validpasswordm');
    tick(1000);
    fixture.detectChanges();

    expect(passwordControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
    });
  }));

  it(`should set password field classes correctly in the template when
    submitted is true`, fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('#userPassword'));
    component.submitted = true;
    fixture.detectChanges();
    const passwordControl = component.signInForm.get('password');

    expect(passwordControl.valid).toBeFalsy();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
      'is-invalid': true,
    });

    passwordControl.setValue('validPassword');
    tick(1000);
    fixture.detectChanges();

    expect(passwordControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
    });
  }));

  it(`should set password field type correctly in the template`, () => {
    const input = fixture.debugElement.query(By.css('#userPassword'));
    fixture.detectChanges();

    component.signInForm.get('showPassword').setValue(false);
    fixture.detectChanges();

    expect(input.nativeElement.type).toBe('password');

    component.signInForm.get('showPassword').setValue(true);
    fixture.detectChanges();

    expect(input.nativeElement.type).toBe('text');
  });

  it(`should set emailMessage$ correctly in the template`, () => {
    fixture.detectChanges();
    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    const emailControl = component.signInForm.get('email');

    expect(emailControl.valid).toBeFalsy();
    expect(element.nativeElement.textContent).toBe(
      EMAILVALIDATIONMESSAGES.required
    );
  });

  it(`should set passwordMessage$ correctly in the template`, () => {
    fixture.detectChanges();
    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    const passwordControl = component.signInForm.get('password');

    expect(passwordControl.valid).toBeFalsy();
    expect(element.nativeElement.textContent).toBe(
      PASSWORDVALIDATIONMESSAGES.required
    );
  });

  it(`should set signInMessage correctly in the template`, () => {
    component.signInMessage = 'message';
    fixture.detectChanges();
    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    const passwordControl = component.signInForm.get('password');

    expect(passwordControl.valid).toBeFalsy();
    expect(element.nativeElement.textContent).toBe('message');
  });

  it(`should call onSubmit method with correct value when editForm is
    submitted`, () => {
    spyOn(component, 'onSubmit');
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));

    form.triggerEventHandler('ngSubmit', null);

    expect(component.onSubmit).toHaveBeenCalledWith(component.signInForm);
  });

  it(`should not disable signIn button when loading$ returns of(false)`, () => {
    let loading: boolean;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));

    component.loading$.subscribe((l) => (loading = l));

    expect(loading).toBeFalsy();
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it(`should call setLoading with correct value when loadingChange on
    SignUpComponent emits a value`, () => {
    spyOn(component, 'setLoading');
    fixture.detectChanges();
    const SignUpComponentDEs = fixture.debugElement.queryAll(
      By.directive(SignUpComponent)
    );

    (SignUpComponentDEs[0]
      .componentInstance as SignUpComponent).loadingChange.emit(true);

    expect(component.setLoading).toHaveBeenCalledWith(true);
  });
});
