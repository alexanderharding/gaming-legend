import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { passwordChecker } from 'src/app/functions/password-checker';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { IUser } from 'src/app/types/user';

import { PasswordFormComponent } from './password-form.component';

describe('PasswordFormComponent', () => {
  let component: PasswordFormComponent;
  let fixture: ComponentFixture<PasswordFormComponent>;
  let USER: IUser;
  let PASSWORDPATTERN: RegExp;

  const PASSWORDVALIDATIONMESSAGES = {
    required: 'Please enter a password.',
    pattern: 'Please enter a valid password that is at least 8 characters.',
  };

  const CONFIRMPASSWORDVALIDATIONMESSAGES = {
    required: 'Please confirm the password.',
  };

  const PASSWORDGROUPVALIDATIONMESSAGES = {
    match: 'The confirmation does not match the password.',
  };

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
      PASSWORDPATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [PasswordFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(PasswordFormComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.parentForm = fb.group({
      passwordGroup: fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(PASSWORDPATTERN)],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        { validator: passwordMatcher }
      ),
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showPassword correctly to start', () => {
    fixture.detectChanges();

    expect(component.showPassword).toBeFalse();
  });

  it('should set passwordMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.passwordMessage$.subscribe((m) => (message = m));
    expect(message).toBe(PASSWORDVALIDATIONMESSAGES['required']);
  }));

  it(`should set passwordMessage$ correctly when password control on the
    parentForm is not valid`, fakeAsync(() => {
    let password: string;
    let errors: Object;
    let message: string;
    const passwordControl = component.parentForm.get('passwordGroup.password');
    fixture.detectChanges();

    password = '';
    passwordControl.setValue(password);
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));
    errors = passwordControl.errors || {};

    expect(passwordControl.valid).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
    expect(errors['required']).toBeTruthy();
    expect(message).toBe(PASSWORDVALIDATIONMESSAGES['required']);

    password = 'invalidpassword';
    expect(PASSWORDPATTERN.test(password)).toBeFalse();
    passwordControl.setValue(password);
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));
    errors = passwordControl.errors || {};

    expect(passwordControl.valid).toBeFalsy();
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    expect(message).toBe(PASSWORDVALIDATIONMESSAGES['pattern']);
  }));

  it(`should set passwordMessage$ correctly when password control on the
    parentForm is valid`, fakeAsync(() => {
    let password: string;
    let errors: Object;
    let message: string;
    const passwordControl = component.parentForm.get('passwordGroup.password');
    fixture.detectChanges();

    password = 'ValidPassword123';
    expect(PASSWORDPATTERN.test(password)).toBeTrue();
    passwordControl.setValue(password);
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));
    errors = passwordControl.errors || {};

    expect(errors['pattern']).toBeFalsy();
    expect(errors['required']).toBeFalsy();
    expect(passwordControl.valid).toBeTruthy();
    expect(message).toBe('');
  }));

  it('should set confirmPasswordMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.confirmPasswordMessage$.subscribe((m) => (message = m));
    expect(message).toBe(CONFIRMPASSWORDVALIDATIONMESSAGES['required']);
  }));

  it(`should set confirmPasswordMessage$ correctly when confirmPassword control
    on parentForm is not valid`, fakeAsync(() => {
    let errors: Object;
    let message: string;
    const confirmPasswordControl = component.parentForm.get(
      'passwordGroup.confirmPassword'
    );
    fixture.detectChanges();

    confirmPasswordControl.setValue('');
    tick(1000);
    component.confirmPasswordMessage$.subscribe((m) => (message = m));
    errors = confirmPasswordControl.errors || {};

    expect(confirmPasswordControl.valid).toBeFalsy();
    expect(errors['required']).toBeTruthy();
    expect(message).toBe(CONFIRMPASSWORDVALIDATIONMESSAGES['required']);
  }));

  it(`should set confirmPasswordMessage$ correctly when confirmPassword control
    on parentForm is valid`, fakeAsync(() => {
    let errors: Object;
    let message: string;
    const confirmPasswordControl = component.parentForm.get(
      'passwordGroup.confirmPassword'
    );
    fixture.detectChanges();

    confirmPasswordControl.setValue('ValidPassword123');
    tick(1000);
    component.confirmPasswordMessage$.subscribe((m) => (message = m));
    errors = confirmPasswordControl.errors || {};

    expect(errors['required']).toBeFalsy();
    expect(confirmPasswordControl.valid).toBeTruthy();
    expect(message).toBe('');
  }));

  it('should set passwordGroupMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.passwordGroupMessage$.subscribe((m) => (message = m));
    expect(message).toBe(PASSWORDGROUPVALIDATIONMESSAGES['match']);
  }));

  it(`should set passwordGroupMessage$ correctly when passwordControl value
    and passwordGroup control value on parentForm is not
    valid`, fakeAsync(() => {
    let errors: Object;
    let message: string;
    const passwordGroupControl = component.parentForm.get('passwordGroup');
    const passwordControl = passwordGroupControl.get('password');
    const confirmPasswordControl = passwordGroupControl.get('confirmPassword');
    fixture.detectChanges();

    passwordControl.setValue('something');
    confirmPasswordControl.setValue('somethingElse');
    expect(passwordControl.value !== confirmPasswordControl.value).toBeTruthy();
    tick(1000);
    component.passwordGroupMessage$.subscribe((m) => (message = m));
    errors = passwordGroupControl.errors || {};

    expect(passwordGroupControl.valid).toBeFalsy();
    expect(errors['match']).toBeTruthy();
    expect(message).toBe(PASSWORDGROUPVALIDATIONMESSAGES['match']);
  }));

  it(`should set passwordGroupMessage$ correctly when passwordGroup on
    parentForm is valid`, fakeAsync(() => {
    let password: string;
    let errors: Object;
    let message: string;
    const passwordGroupControl = component.parentForm.get('passwordGroup');
    const passwordControl = passwordGroupControl.get('password');
    const confirmPasswordControl = passwordGroupControl.get('confirmPassword');
    fixture.detectChanges();

    password = 'validPassword123';
    expect(PASSWORDPATTERN.test(password)).toBeTrue();
    passwordControl.setValue(password);
    confirmPasswordControl.setValue(password);
    tick(1000);
    component.passwordGroupMessage$.subscribe((m) => (message = m));
    errors = passwordGroupControl.errors || {};

    expect(passwordGroupControl.valid).toBeTruthy();
    expect(errors['match']).toBeFalsy();
    expect(message).toBe('');
  }));
});

xdescribe('PasswordFormComponent w/ template', () => {
  let component: PasswordFormComponent;
  let fixture: ComponentFixture<PasswordFormComponent>;
  let USER: IUser;
  let PASSWORDPATTERN: RegExp;

  const PASSWORDVALIDATIONMESSAGES = {
    required: 'Please enter a password.',
    pattern: 'Please enter a valid password that is at least 8 characters.',
  };

  const CONFIRMPASSWORDVALIDATIONMESSAGES = {
    required: 'Please confirm the password.',
  };

  const PASSWORDGROUPVALIDATIONMESSAGES = {
    match: 'The confirmation does not match the password.',
  };

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
      PASSWORDPATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [PasswordFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(PasswordFormComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.parentForm = fb.group({
      passwordGroup: fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(PASSWORDPATTERN)],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        { validator: passwordMatcher }
      ),
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageTitle correctly in the template', () => {
    component.pageTitle = 'Title';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('legend span'));
    expect(element.nativeElement.textContent).toBe(component.pageTitle);
  });

  it(`should set password control on parentForm correctly in the
    template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#password'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.type).toBe('password');
    expect(inputs[0].nativeElement.placeholder).toBe('Password (required)');
    expect(inputs[0].nativeElement.value).toBe('');
  });

  it(`should set confirmPassword control on parentForm correctly in the
    template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#confirmPassword'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.type).toBe('password');
    expect(inputs[0].nativeElement.placeholder).toBe('Confirm (required)');
    expect(inputs[0].nativeElement.value).toBe('');
  });
});
