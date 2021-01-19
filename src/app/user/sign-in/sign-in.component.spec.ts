import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SignInComponent } from './sign-in.component';

fdescribe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockRouter: Router;

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
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
        declarations: [SignInComponent, FakeSignUpComponent],
        providers: [{ provide: Router, useValue: mockRouter }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signInForm', () => {
    beforeEach(() => component.ngOnInit());

    it('should be invalid when empty', () => {
      expect(component.signInForm.valid).toBeFalsy();
    });

    it('email field validity', () => {
      let errors = {};
      let email = component.signInForm.controls['email'];
      expect(email.valid).toBeFalsy();

      // Email field is required
      errors = email.errors || {};
      expect(errors['required']).toBeTruthy();

      // Set email to something
      email.setValue('test');
      errors = email.errors || {};
      expect(errors['required']).toBeFalsy();
      expect(errors['email']).toBeTruthy();

      // Set email to something correct
      email.setValue('test@example.com');
      errors = email.errors || {};
      expect(errors['required']).toBeFalsy();
      expect(errors['email']).toBeFalsy();
    });

    it('password field validity', () => {
      let errors = {};
      let password = component.signInForm.controls['password'];

      // Password field is required
      errors = password.errors || {};
      expect(errors['required']).toBeTruthy();

      // Set password to something
      password.setValue('123456');
      errors = password.errors || {};
      expect(errors['required']).toBeFalsy();

      // Set password to something correct
      password.setValue('123456789');
      errors = password.errors || {};
      expect(errors['required']).toBeFalsy();
    });
  });
});
