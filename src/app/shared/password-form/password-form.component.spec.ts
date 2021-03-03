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
import { passwordMatcher } from 'src/app/functions/password-matcher';

import { PasswordFormComponent } from './password-form.component';

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

const PASSWORDPATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

describe('PasswordFormComponent', () => {
  let component: PasswordFormComponent;
  let fixture: ComponentFixture<PasswordFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [PasswordFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(PasswordFormComponent);
    component = fixture.componentInstance;
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

  it('should have set showPassword', () => {
    fixture.detectChanges();

    expect(component.showPassword).toBeFalse();
  });

  it('should have set passwordMessage$', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));

    expect(message).toBe(PASSWORDVALIDATIONMESSAGES.required);
  }));

  it('should have set confirmPasswordMessage$', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);
    component.confirmPasswordMessage$.subscribe((m) => (message = m));

    expect(message).toBe(CONFIRMPASSWORDVALIDATIONMESSAGES.required);
  }));

  it('should have set passwordGroupMessage$', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);
    component.passwordGroupMessage$.subscribe((m) => (message = m));

    expect(message).toBe(PASSWORDGROUPVALIDATIONMESSAGES.match);
  }));

  it(`should set passwordMessage$ correctly when password control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const passwordControl = component.parentForm.get('passwordGroup.password');
    fixture.detectChanges();

    passwordControl.setValue('ValidPassword123');
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));

    expect(PASSWORDPATTERN.test(passwordControl.value)).toBeTrue();
    expect(passwordControl.hasError('pattern')).toBeFalse();
    expect(passwordControl.hasError('required')).toBeFalse();
    expect(passwordControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set passwordMessage$ correctly when password control on the
    parentForm is required`, fakeAsync(() => {
    let message: string;
    const passwordControl = component.parentForm.get('passwordGroup.password');
    fixture.detectChanges();

    passwordControl.setValue('');
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));

    expect(passwordControl.hasError('pattern')).toBeFalse();
    expect(passwordControl.hasError('required')).toBeTrue();
    expect(passwordControl.valid).toBeFalse();
    expect(message).toBe(PASSWORDVALIDATIONMESSAGES.required);
  }));

  it(`should set passwordMessage$ correctly when password control on the
    parentForm has a pattern error`, fakeAsync(() => {
    let message: string;
    const passwordControl = component.parentForm.get('passwordGroup.password');
    fixture.detectChanges();

    passwordControl.setValue('invalid');
    tick(1000);
    component.passwordMessage$.subscribe((m) => (message = m));

    expect(PASSWORDPATTERN.test(passwordControl.value)).toBeFalse();
    expect(passwordControl.hasError('required')).toBeFalse();
    expect(passwordControl.hasError('pattern')).toBeTrue();
    expect(passwordControl.valid).toBeFalse();
    expect(message).toBe(PASSWORDVALIDATIONMESSAGES.pattern);
  }));

  it(`should set confirmPasswordMessage$ correctly when confirmPassword control
    on the parentForm is valid`, fakeAsync(() => {
    let message: string;
    const confirmPasswordControl = component.parentForm.get(
      'passwordGroup.confirmPassword'
    );
    fixture.detectChanges();

    confirmPasswordControl.setValue('password');
    tick(1000);
    component.confirmPasswordMessage$.subscribe((m) => (message = m));

    expect(confirmPasswordControl.hasError('required')).toBeFalse();
    expect(confirmPasswordControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set confirmPasswordMessage$ correctly when confirmPassword control
    on the parentForm is required`, fakeAsync(() => {
    let message: string;
    const confirmPasswordControl = component.parentForm.get(
      'passwordGroup.confirmPassword'
    );
    fixture.detectChanges();

    confirmPasswordControl.setValue('');
    tick(1000);
    component.confirmPasswordMessage$.subscribe((m) => (message = m));

    expect(confirmPasswordControl.hasError('required')).toBeTrue();
    expect(confirmPasswordControl.valid).toBeFalse();
    expect(message).toBe(CONFIRMPASSWORDVALIDATIONMESSAGES.required);
  }));

  it(`should set passwordGroupMessage$ correctly when passwordGroup control on
    the parentForm is valid`, fakeAsync(() => {
    const password = 'ValidPassword123';
    let message: string;
    const passwordGroupControl = component.parentForm.get('passwordGroup');
    const passwordControl = passwordGroupControl.get('password');
    const confirmPasswordGroup = passwordGroupControl.get('confirmPassword');
    fixture.detectChanges();

    passwordControl.setValue(password);
    confirmPasswordGroup.setValue(password);
    tick(1000);
    component.passwordGroupMessage$.subscribe((m) => (message = m));

    expect(passwordControl.value === confirmPasswordGroup.value).toBeTrue();
    expect(passwordGroupControl.hasError('match')).toBeFalse();
    expect(passwordGroupControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set passwordGroupMessage$ correctly when passwordGroup control on
    the parentForm has a match error`, fakeAsync(() => {
    let message: string;
    const passwordGroupControl = component.parentForm.get('passwordGroup');
    const passwordControl = passwordGroupControl.get('password');
    const confirmPasswordGroup = passwordGroupControl.get('confirmPassword');
    fixture.detectChanges();

    passwordControl.setValue('password');
    confirmPasswordGroup.setValue('differentPassword');
    tick(1000);
    component.passwordGroupMessage$.subscribe((m) => (message = m));

    expect(passwordControl.value === confirmPasswordGroup.value).toBeFalse();
    expect(passwordGroupControl.hasError('match')).toBeTrue();
    expect(passwordGroupControl.valid).toBeFalse();
    expect(message).toBe(PASSWORDGROUPVALIDATIONMESSAGES.match);
  }));

  describe('toggleShowPassword', () => {
    it('should set showPassword correctly', () => {
      component.showPassword = false;
      fixture.detectChanges();

      component.toggleShowPassword();

      expect(component.showPassword).toBeTrue();

      component.toggleShowPassword();

      expect(component.showPassword).toBeFalse();
    });
  });
});

describe('PasswordFormComponent w/ template', () => {
  let component: PasswordFormComponent;
  let fixture: ComponentFixture<PasswordFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [PasswordFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(PasswordFormComponent);
    component = fixture.componentInstance;
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
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set pageTitle in the template', () => {
    component.pageTitle = 'Title';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('legend span'));
    expect(element.nativeElement.textContent).toBe(component.pageTitle);
  });

  it(`should not set pageTitle in the template if pageTitle is null`, () => {
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('legend span'));
    expect(element).toBeNull();
    expect(component.pageTitle).toBeUndefined();
  });

  it(`should set password control on parentForm in the template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#passwordControl'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.type).toBe('password');
    expect(inputs[0].nativeElement.placeholder).toBe('Password (required)');
  });

  it(`should set confirmPassword control on parentForm in the template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(
      By.css('#confirmPasswordControl')
    );

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.type).toBe('password');
    expect(inputs[0].nativeElement.placeholder).toBe('Confirm (required)');
  });

  // it(`should set passwordMessage$ correctly in the template when password
  //   control on parentForm is valid`, fakeAsync(() => {
  //   const passwordControl = component.parentForm.get('passwordGroup.password');
  //   fixture.detectChanges();

  //   passwordControl.setValue('ValidPassword123');
  //   tick(1000);
  //   fixture.detectChanges();

  //   const element = fixture.debugElement.queryAll(
  //     By.css('.invalid-tooltip span')
  //   )[0];
  //   expect(PASSWORDPATTERN.test(passwordControl.value)).toBeTrue();
  //   expect(passwordControl.valid).toBeTrue();
  //   expect(element.nativeElement.textContent).toBe('');
  // }));
});
