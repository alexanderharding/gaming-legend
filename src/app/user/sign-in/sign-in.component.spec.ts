// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
//   waitForAsync,
// } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { of, throwError } from 'rxjs';
// import { AuthService } from 'src/app/services/auth.service';
// import { NotificationService } from 'src/app/services/notification.service';
// import { SignUpComponent } from '../sign-up/sign-up.component';

// import { SignInComponent } from './sign-in.component';

// describe('SignInComponent', () => {
//   let component: SignInComponent;
//   let fixture: ComponentFixture<SignInComponent>;
//   let mockRouter: Router;
//   let mockAuthService;
//   let mockNotificationService;

//   const EMAILVALIDATIONMESSAGES = {
//     required: 'Please enter your email address.',
//     email: 'Please enter a valid email address',
//   };
//   const PASSWORDVALIDATIONMESSAGES = {
//     required: 'Please enter your password.',
//   };

//   @Component({
//     selector: 'ctacu-sign-up',
//     template: '<div></div>',
//   })
//   class FakeSignUpComponent {
//     @Input() loading: boolean;
//   }

//   beforeEach(
//     waitForAsync(() => {
//       mockRouter = jasmine.createSpyObj(['navigate']);
//       mockAuthService = jasmine.createSpyObj(['signIn']);
//       mockNotificationService = jasmine.createSpyObj(['show']);
//       TestBed.configureTestingModule({
//         imports: [HttpClientTestingModule, ReactiveFormsModule],
//         declarations: [SignInComponent, FakeSignUpComponent],
//         providers: [
//           { provide: Router, useValue: mockRouter },
//           { provide: AuthService, useValue: mockAuthService },
//           { provide: NotificationService, useValue: mockNotificationService },
//         ],
//       }).compileComponents();
//     })
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignInComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     fixture.detectChanges();

//     expect(component).toBeTruthy();
//   });

//   it('should have set signInForm value correctly', () => {
//     fixture.detectChanges();

//     expect(component.signInForm.value).toEqual({
//       email: '',
//       password: '',
//       showPassword: false,
//       user: null,
//     });
//   });

//   it('should have set pageTitle correctly', () => {
//     fixture.detectChanges();

//     expect(component.pageTitle).toBe('sign in');
//   });

//   it('should have set submitted correctly', () => {
//     fixture.detectChanges();

//     expect(component.submitted).toBeFalse();
//   });

//   it('should have set signInMessage correctly', () => {
//     fixture.detectChanges();

//     expect(component.signInMessage).toBe('');
//   });

//   it('should have set loading$ correctly', () => {
//     let loading: boolean;
//     fixture.detectChanges();

//     component.loading$.subscribe((l) => (loading = l));

//     expect(loading).toBeFalse();
//   });

//   it('should have set emailMessage$ correctly', () => {
//     let message: string;
//     fixture.detectChanges();

//     component.emailMessage$.subscribe((m) => (message = m));

//     expect(message).toBe(EMAILVALIDATIONMESSAGES.required);
//   });

//   it('should have set passwordMessage$ correctly', () => {
//     let message: string;
//     fixture.detectChanges();

//     component.passwordMessage$.subscribe((m) => (message = m));

//     expect(message).toBe(PASSWORDVALIDATIONMESSAGES.required);
//   });

//   describe('signInForm', () => {
//     it('should not be valid when control values are empty', () => {
//       fixture.detectChanges();

//       component.signInForm.patchValue({
//         email: '',
//         password: '',
//       });

//       expect(component.signInForm.valid).toBeFalse();
//     });

//     it('should be valid when set correctly', () => {
//       fixture.detectChanges();

//       component.signInForm.patchValue({
//         email: 'validEmail@test.com',
//         password: 'ValidPassword',
//       });

//       expect(component.signInForm.errors).toBeNull();
//       expect(component.signInForm.valid).toBeTrue();
//     });

//     describe('email control', () => {
//       it('should not be valid when value is empty', () => {
//         fixture.detectChanges();
//         const emailControl = component.signInForm.controls.email;

//         emailControl.setValue('');

//         expect(emailControl.hasError('email')).toBeFalse();
//         expect(emailControl.hasError('required')).toBeTrue();
//         expect(emailControl.valid).toBeFalse();
//       });

//       it(`should not be valid when value isn't a valid email`, () => {
//         fixture.detectChanges();
//         const emailControl = component.signInForm.controls.email;

//         emailControl.setValue('invalidEmail');

//         expect(emailControl.hasError('required')).toBeFalse();
//         expect(emailControl.hasError('email')).toBeTrue();
//         expect(emailControl.valid).toBeFalse();
//       });

//       it(`should be valid when value is a valid email`, () => {
//         fixture.detectChanges();
//         const emailControl = component.signInForm.controls.email;

//         emailControl.setValue('validEmail@test.com');

//         expect(emailControl.errors).toBeNull();
//         expect(emailControl.valid).toBeTrue();
//       });

//       it(`should set emailMessage$ correctly when value is
//         empty`, fakeAsync(() => {
//         let message: string;
//         fixture.detectChanges();
//         const emailControl = component.signInForm.controls.email;

//         emailControl.setValue('');
//         tick(1000);
//         component.emailMessage$.subscribe((m) => (message = m));

//         expect(message).toBe(EMAILVALIDATIONMESSAGES.required);
//       }));

//       it(`should set emailMessage$ correctly when value isn't a valid
//         email`, fakeAsync(() => {
//         let message: string;
//         fixture.detectChanges();
//         const emailControl = component.signInForm.controls.email;

//         emailControl.setValue('invalidEmail');
//         tick(1000);
//         component.emailMessage$.subscribe((m) => (message = m));

//         expect(message).toBe(EMAILVALIDATIONMESSAGES.email);
//       }));

//       it(`should set emailMessage$ correctly when valid`, fakeAsync(() => {
//         let message: string;
//         fixture.detectChanges();
//         const emailControl = component.signInForm.controls.email;

//         emailControl.setValue('validEmail@test.com');
//         tick(1000);
//         component.emailMessage$.subscribe((m) => (message = m));

//         expect(message).toBe('');
//       }));
//     });

//     describe('password control', () => {
//       it('should not be valid when value is empty', () => {
//         fixture.detectChanges();
//         const passwordControl = component.signInForm.controls.password;

//         passwordControl.setValue('');

//         expect(passwordControl.hasError('required')).toBeTrue();
//         expect(passwordControl.valid).toBeFalse();
//       });

//       it('should be valid when value is not empty', () => {
//         fixture.detectChanges();
//         const passwordControl = component.signInForm.controls.password;

//         passwordControl.setValue('t');

//         expect(passwordControl.errors).toBeNull();
//         expect(passwordControl.valid).toBeTrue();
//       });

//       it(`should set passwordMessage$ correctly when not
//         valid`, fakeAsync(() => {
//         let message: string;
//         fixture.detectChanges();
//         const passwordControl = component.signInForm.controls.password;

//         passwordControl.setValue('');
//         tick(1000);
//         component.passwordMessage$.subscribe((m) => (message = m));

//         expect(passwordControl.valid).toBeFalse();
//         expect(message).toBe(PASSWORDVALIDATIONMESSAGES.required);
//       }));

//       it(`should set passwordMessage$ correctly when valid`, fakeAsync(() => {
//         let message: string;
//         fixture.detectChanges();
//         const passwordControl = component.signInForm.controls.password;

//         passwordControl.setValue('t');
//         tick(1000);
//         component.passwordMessage$.subscribe((m) => (message = m));

//         expect(passwordControl.valid).toBeTrue();
//         expect(message).toBe('');
//       }));
//     });

//     describe('showPassword control', () => {
//       it(`should be valid when value is true`, () => {
//         fixture.detectChanges();
//         const showPasswordControl = component.signInForm.controls.showPassword;

//         showPasswordControl.setValue(true);

//         expect(showPasswordControl.errors).toBeNull();
//         expect(showPasswordControl.valid).toBeTrue();
//       });

//       it(`should be valid when value is false`, () => {
//         fixture.detectChanges();
//         const showPasswordControl = component.signInForm.controls.showPassword;

//         showPasswordControl.setValue(false);

//         expect(showPasswordControl.errors).toBeNull();
//         expect(showPasswordControl.valid).toBeTrue();
//       });
//     });
//   });

//   describe('onSubmit', () => {
//     it('should set submitted correctly', () => {
//       fixture.detectChanges();

//       component.onSubmit(component.signInForm);

//       expect(component.submitted).toBeTruthy();
//     });

//     it('should set signInMessage correctly', () => {
//       component.signInMessage = 'message!';
//       fixture.detectChanges();

//       component.onSubmit(component.signInForm);

//       expect(component.signInMessage).toBe('');
//     });

//     it(`should call signIn method with correct value when signInForm is
//       valid`, () => {
//       spyOn(component, 'signIn');
//       fixture.detectChanges();

//       component.signInForm.patchValue({
//         email: 'validEmail@test.com',
//         password: 'password',
//       });
//       component.onSubmit(component.signInForm);

//       expect(component.signInForm.valid).toBeTruthy();
//       expect(component.signIn).toHaveBeenCalledWith(
//         component.signInForm.controls.email.value,
//         component.signInForm.controls.password.value
//       );
//     });

//     it(`should not call signIn method with when signInForm is not
//       valid`, () => {
//       spyOn(component, 'signIn');
//       fixture.detectChanges();

//       component.signInForm.patchValue({
//         email: '',
//         password: '',
//       });
//       component.onSubmit(component.signInForm);

//       expect(component.signInForm.valid).toBeFalsy();
//       expect(component.signIn).toHaveBeenCalledTimes(0);
//     });

//     it(`should call setLoading method with correct value when signInForm is
//       valid`, () => {
//       mockAuthService.signIn.and.returnValue(of(true));
//       spyOn(component, 'setLoading');
//       fixture.detectChanges();

//       component.signInForm.patchValue({
//         email: 'validEmail@test.com',
//         password: 'password',
//       });
//       component.onSubmit(component.signInForm);

//       expect(component.signInForm.valid).toBeTrue();
//       expect(component.setLoading).toHaveBeenCalledWith(true);
//     });

//     it(`should not call setLoading method with correct value when signInForm is
//       not valid`, () => {
//       spyOn(component, 'setLoading');
//       fixture.detectChanges();

//       component.signInForm.patchValue({
//         email: '',
//         password: '',
//       });
//       component.onSubmit(component.signInForm);

//       expect(component.signInForm.valid).toBeFalse();
//       expect(component.setLoading).toHaveBeenCalledTimes(0);
//     });
//   });

//   describe('signIn', () => {
//     it(`should retrieve call signIn method on AuthService with correct
//       value`, () => {
//       mockAuthService.signIn.and.returnValue(of(true));
//       const email = 'validEmail@test.com';
//       const password = 'password';
//       fixture.detectChanges();

//       component.signIn(email, password);

//       expect(mockAuthService.signIn).toHaveBeenCalledWith(email, password);
//     });

//     it(`should call setLoading method with correct value when signIn method on
//       AuthService returns of(true)`, () => {
//       mockAuthService.signIn.and.returnValue(of(true));
//       spyOn(component, 'setLoading');
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(component.setLoading).toHaveBeenCalledWith(false);
//     });

//     it(`should call setLoading method with correct value when signIn method on
//       AuthService throws an error`, () => {
//       mockAuthService.signIn.and.returnValue(throwError(''));
//       spyOn(component, 'setLoading');
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(component.setLoading).toHaveBeenCalledWith(false);
//     });

//     it(`should not call setLoading method when signIn method on AuthService
//       returns of(false)`, () => {
//       mockAuthService.signIn.and.returnValue(of(false));
//       spyOn(component, 'setLoading');
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(component.setLoading).toHaveBeenCalledTimes(0);
//     });

//     it(`should set signInMessage correctly when signIn method on AuthService
//       returns of(false)`, () => {
//       mockAuthService.signIn.and.returnValue(of(false));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(component.signInMessage).toBe('Invalid email or password.');
//     });

//     it(`should not set signInMessage when signIn method on AuthService returns
//       of(true)`, () => {
//       mockAuthService.signIn.and.returnValue(of(true));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(component.signInMessage).toBe('');
//     });

//     it(`should call navigate method on Router when signIn method on AuthService
//       returns of(true)`, () => {
//       mockAuthService.signIn.and.returnValue(of(true));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
//     });

//     it(`should not call navigate method on Router when sign method on AuthService
//       returns throws an error`, () => {
//       mockAuthService.signIn.and.returnValue(throwError(''));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
//     });

//     it(`should call show method on NotificationService when sign method on
//       AuthService returns of(true)`, () => {
//       mockAuthService.signIn.and.returnValue(of(true));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
//     });

//     it(`should not call show method on NotificationService when sign method on
//       AuthService returns of(false)`, () => {
//       mockAuthService.signIn.and.returnValue(of(false));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
//     });

//     it(`should call show method on NotificationService when sign method on
//       AuthService throws an error`, () => {
//       mockAuthService.signIn.and.returnValue(throwError(''));
//       fixture.detectChanges();

//       component.signIn('validEmail@test.com', 'password');

//       expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
//     });
//   });

//   describe('setLoading', () => {
//     it('should set loading$ correctly', () => {
//       let loading: boolean;
//       fixture.detectChanges();

//       component.setLoading(true);
//       component.loading$.subscribe((l) => (loading = l));

//       expect(loading).toBeTrue();

//       component.setLoading(false);
//       component.loading$.subscribe((l) => (loading = l));

//       expect(loading).toBeFalse();
//     });
//   });
// });

// describe('SignInComponent w/ template', () => {
//   let component: SignInComponent;
//   let fixture: ComponentFixture<SignInComponent>;
//   let mockRouter: Router;
//   let mockAuthService;
//   let mockNotificationService;

//   const EMAILVALIDATIONMESSAGES = {
//     required: 'Please enter your email address.',
//     email: 'Please enter a valid email address',
//   };

//   const PASSWORDVALIDATIONMESSAGES = {
//     required: 'Please enter your password.',
//   };

//   beforeEach(
//     waitForAsync(() => {
//       mockRouter = jasmine.createSpyObj(['navigate']);
//       mockAuthService = jasmine.createSpyObj(['signIn']);
//       mockNotificationService = jasmine.createSpyObj(['show']);
//       TestBed.configureTestingModule({
//         imports: [HttpClientTestingModule, ReactiveFormsModule, NgbModule],
//         declarations: [SignInComponent, SignUpComponent],
//         providers: [
//           { provide: Router, useValue: mockRouter },
//           { provide: AuthService, useValue: mockAuthService },
//           { provide: NotificationService, useValue: mockNotificationService },
//         ],
//         schemas: [NO_ERRORS_SCHEMA],
//       }).compileComponents();
//     })
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignInComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     fixture.detectChanges();

//     expect(component).toBeTruthy();
//   });

//   it('should set pageTitle correctly in the template', () => {
//     fixture.detectChanges();

//     const elements = fixture.debugElement.queryAll(By.css('h1'));

//     expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
//   });

//   it('should set SignUpComponent correctly in the template', () => {
//     let loading: boolean;
//     fixture.detectChanges();

//     const SignUpComponentDEs = fixture.debugElement.queryAll(
//       By.directive(SignUpComponent)
//     );
//     component.loading$.subscribe((l) => (loading = l));

//     expect(SignUpComponentDEs.length).toBe(1);
//     expect(SignUpComponentDEs[0].componentInstance.loading).toBe(loading);
//   });

//   it(`should set email input classes correctly in the template when
//     submitted is false`, fakeAsync(() => {
//     const input = fixture.debugElement.query(By.css('#userEmail'));
//     fixture.detectChanges();
//     const emailControl = component.signInForm.get('email');

//     expect(input.classes).toEqual({
//       'form-control': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//       'ng-invalid': true,
//     });

//     emailControl.setValue('validEmail@test.com');
//     tick(1000);
//     fixture.detectChanges();

//     expect(emailControl.valid).toBeTruthy();
//     expect(input.classes).toEqual({
//       'form-control': true,
//       'is-valid': true,
//       'ng-valid': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//     });
//   }));

//   it(`should set email input classes correctly in the template when
//     submitted is true`, fakeAsync(() => {
//     component.submitted = true;
//     fixture.detectChanges();
//     const input = fixture.debugElement.query(By.css('#userEmail'));
//     const emailControl = component.signInForm.get('email');

//     expect(emailControl.valid).toBeFalsy();
//     expect(input.classes).toEqual({
//       'form-control': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//       'ng-invalid': true,
//       'is-invalid': true,
//     });

//     emailControl.setValue('validEmail@test.com');
//     tick(1000);
//     fixture.detectChanges();

//     expect(emailControl.valid).toBeTruthy();
//     expect(input.classes).toEqual({
//       'form-control': true,
//       'is-valid': true,
//       'ng-valid': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//     });
//   }));

//   it(`should set password input classes correctly in the template when
//     submitted is false`, fakeAsync(() => {
//     const input = fixture.debugElement.query(By.css('#userPassword'));
//     fixture.detectChanges();
//     const passwordControl = component.signInForm.get('password');

//     expect(input.classes).toEqual({
//       'form-control': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//       'ng-invalid': true,
//     });

//     passwordControl.setValue('validpasswordm');
//     tick(1000);
//     fixture.detectChanges();

//     expect(passwordControl.valid).toBeTruthy();
//     expect(input.classes).toEqual({
//       'form-control': true,
//       'is-valid': true,
//       'ng-valid': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//     });
//   }));

//   it(`should set password input classes correctly in the template when
//     submitted is true`, fakeAsync(() => {
//     component.submitted = true;
//     fixture.detectChanges();
//     const passwordControl = component.signInForm.get('password');

//     const inputs = fixture.debugElement.queryAll(By.css('#userPassword'));
//     expect(inputs.length).toBe(1);
//     expect(passwordControl.valid).toBeFalsy();
//     expect(inputs[0].classes).toEqual({
//       'form-control': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//       'ng-invalid': true,
//       'is-invalid': true,
//     });

//     passwordControl.setValue('validPassword');
//     tick(1000);
//     fixture.detectChanges();

//     expect(passwordControl.valid).toBeTruthy();
//     expect(inputs[0].classes).toEqual({
//       'form-control': true,
//       'is-valid': true,
//       'ng-valid': true,
//       'ng-untouched': true,
//       'ng-pristine': true,
//     });
//   }));

//   it(`should set password input type correctly in the template`, () => {
//     fixture.detectChanges();

//     const inputs = fixture.debugElement.queryAll(By.css('#userPassword'));
//     expect(inputs.length).toBe(1);
//     component.signInForm.get('showPassword').setValue(false);
//     fixture.detectChanges();

//     expect(inputs[0].nativeElement.type).toBe('password');

//     component.signInForm.get('showPassword').setValue(true);
//     fixture.detectChanges();

//     expect(inputs[0].nativeElement.type).toBe('text');
//   });

//   it(`should set emailMessage$ correctly in the template`, () => {
//     fixture.detectChanges();
//     const element = fixture.debugElement.queryAll(
//       By.css('.invalid-tooltip span')
//     )[0];
//     const emailControl = component.signInForm.get('email');

//     expect(emailControl.valid).toBeFalsy();
//     expect(element.nativeElement.textContent).toBe(
//       EMAILVALIDATIONMESSAGES.required
//     );
//   });

//   it(`should set passwordMessage$ correctly in the template`, () => {
//     fixture.detectChanges();
//     const element = fixture.debugElement.queryAll(
//       By.css('.invalid-tooltip span')
//     )[1];
//     const passwordControl = component.signInForm.get('password');

//     expect(passwordControl.valid).toBeFalsy();
//     expect(element.nativeElement.textContent).toBe(
//       PASSWORDVALIDATIONMESSAGES.required
//     );
//   });

//   it(`should set signInMessage correctly in the template`, () => {
//     component.signInMessage = 'message';
//     fixture.detectChanges();
//     const element = fixture.debugElement.queryAll(
//       By.css('.invalid-tooltip span')
//     )[1];
//     const passwordControl = component.signInForm.get('password');

//     expect(passwordControl.valid).toBeFalsy();
//     expect(element.nativeElement.textContent).toBe('message');
//   });

//   it(`should call onSubmit method with correct value when editForm is
//     submitted`, () => {
//     spyOn(component, 'onSubmit');
//     fixture.detectChanges();
//     const form = fixture.debugElement.query(By.css('form'));

//     form.triggerEventHandler('ngSubmit', null);

//     expect(component.onSubmit).toHaveBeenCalledWith(component.signInForm);
//   });

//   it(`should not disable signIn button when loading$ returns of(false)`, () => {
//     let loading: boolean;
//     fixture.detectChanges();
//     const button = fixture.debugElement.query(By.css('button'));

//     component.loading$.subscribe((l) => (loading = l));

//     expect(loading).toBeFalsy();
//     expect(button.nativeElement.disabled).toBeFalsy();
//   });

//   it(`should call setLoading with correct value when loadingChange on
//     SignUpComponent emits a value`, () => {
//     spyOn(component, 'setLoading');
//     fixture.detectChanges();
//     const SignUpComponentDEs = fixture.debugElement.queryAll(
//       By.directive(SignUpComponent)
//     );

//     (SignUpComponentDEs[0]
//       .componentInstance as SignUpComponent).loadingChange.emit(true);

//     expect(component.setLoading).toHaveBeenCalledWith(true);
//   });
// });
