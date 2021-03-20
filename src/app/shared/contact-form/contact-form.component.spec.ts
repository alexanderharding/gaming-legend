import { Pipe, PipeTransform } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ContactFormComponent } from './contact-form.component';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (!emailControl.value || !confirmControl.value) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true };
}

const PHONEVALIDATIONMESSAGES = {
  required: 'Please enter a phone number.',
  pattern: 'Please enter a valid phone number.',
};
const EMAILVALIDATIONMESSAGES = {
  required: 'Please enter an email address.',
  email: 'Please enter a valid email address. ie. fake@1234.com',
};
const CONFIRMEMAILVALIDATIONMESSAGES = {
  required: 'Please confirm the email address.',
};
const CONTACTGROUPVALIDATIONMESSAGES = {
  match: 'The confirmation does not match the email address.',
};
const PHONEPATTERN = /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/;

@Pipe({
  name: 'capitalize',
})
class MockCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [ContactFormComponent, MockCapitalizePipe],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    component.parentForm = fb.group({
      contactGroup: fb.group(
        {
          phone: ['', [Validators.required, Validators.pattern(PHONEPATTERN)]],
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcher }
      ),
    });
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have set pageTitle', () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Contact Information');
  });

  it('should have set phoneMessage$', () => {
    let message: string;
    fixture.detectChanges();

    component.phoneMessage$.subscribe((m) => (message = m));

    expect(message).toBe(PHONEVALIDATIONMESSAGES.required);
  });

  it('should have set emailMessage$', () => {
    let message: string;
    fixture.detectChanges();

    component.emailMessage$.subscribe((m) => (message = m));

    expect(message).toBe(EMAILVALIDATIONMESSAGES.required);
  });

  it('should have set confirmEmailMessage$', () => {
    let message: string;
    fixture.detectChanges();

    component.confirmEmailMessage$.subscribe((m) => (message = m));

    expect(message).toBe(CONFIRMEMAILVALIDATIONMESSAGES.required);
  });

  it('should have set contactGroupMessage$', () => {
    let message: string;
    fixture.detectChanges();

    component.contactGroupMessage$.subscribe((m) => (message = m));

    expect(message).toBe(CONTACTGROUPVALIDATIONMESSAGES.match);
  });

  it(`should set phoneMessage$ correctly when phone control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const phoneControl = component.parentForm.get('contactGroup.phone');
    fixture.detectChanges();

    phoneControl.setValue('1234567890');
    tick(1000);
    component.phoneMessage$.subscribe((m) => (message = m));

    expect(phoneControl.hasError('pattern')).toBeFalse();
    expect(phoneControl.hasError('required')).toBeFalse();
    expect(phoneControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set phoneMessage$ correctly when phone control on the
    parentForm is required`, fakeAsync(() => {
    let message: string;
    const phoneControl = component.parentForm.get('contactGroup.phone');
    fixture.detectChanges();

    phoneControl.setValue('');
    tick(1000);
    component.phoneMessage$.subscribe((m) => (message = m));

    expect(phoneControl.hasError('pattern')).toBeFalse();
    expect(phoneControl.hasError('required')).toBeTrue();
    expect(phoneControl.valid).toBeFalse();
    expect(message).toBe(PHONEVALIDATIONMESSAGES.required);
  }));

  it(`should set phoneMessage$ correctly when phone control on the
    parentForm has a pattern error`, fakeAsync(() => {
    let message: string;
    const phoneControl = component.parentForm.get('contactGroup.phone');
    fixture.detectChanges();

    phoneControl.setValue('invalidPattern');
    tick(1000);
    component.phoneMessage$.subscribe((m) => (message = m));

    expect(phoneControl.hasError('pattern')).toBeTrue();
    expect(phoneControl.hasError('required')).toBeFalse();
    expect(phoneControl.valid).toBeFalse();
    expect(message).toBe(PHONEVALIDATIONMESSAGES.pattern);
  }));

  it(`should set emailMessage$ correctly when email control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const emailControl = component.parentForm.get('contactGroup.email');
    fixture.detectChanges();

    emailControl.setValue('validEmail@test.com');
    tick(1000);
    component.emailMessage$.subscribe((m) => (message = m));

    expect(emailControl.hasError('email')).toBeFalse();
    expect(emailControl.hasError('required')).toBeFalse();
    expect(emailControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set emailMessage$ correctly when password control on the
    parentForm is required`, fakeAsync(() => {
    let message: string;
    const emailControl = component.parentForm.get('contactGroup.email');

    fixture.detectChanges();

    emailControl.setValue('');
    tick(1000);
    component.emailMessage$.subscribe((m) => (message = m));

    expect(emailControl.hasError('email')).toBeFalse();
    expect(emailControl.hasError('required')).toBeTrue();
    expect(emailControl.valid).toBeFalse();
    expect(message).toBe(EMAILVALIDATIONMESSAGES.required);
  }));

  it(`should set emailMessage$ correctly when password control on the
    parentForm has an email error`, fakeAsync(() => {
    let message: string;
    const emailControl = component.parentForm.get('contactGroup.email');

    fixture.detectChanges();

    emailControl.setValue('invalid');
    tick(1000);
    component.emailMessage$.subscribe((m) => (message = m));

    expect(emailControl.hasError('email')).toBeTrue();
    expect(emailControl.hasError('required')).toBeFalse();
    expect(emailControl.valid).toBeFalse();
    expect(message).toBe(EMAILVALIDATIONMESSAGES.email);
  }));

  it(`should set confirmEmailMessage$ correctly when confirmEmail control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const confirmEmailControl = component.parentForm.get(
      'contactGroup.confirmEmail'
    );
    fixture.detectChanges();

    confirmEmailControl.setValue('email');
    tick(1000);
    component.confirmEmailMessage$.subscribe((m) => (message = m));

    expect(confirmEmailControl.hasError('required')).toBeFalse();
    expect(confirmEmailControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set confirmEmailMessage$ correctly when confirmEmail control on
    the parentForm is required`, fakeAsync(() => {
    let message: string;
    const confirmEmailControl = component.parentForm.get(
      'contactGroup.confirmEmail'
    );
    fixture.detectChanges();

    confirmEmailControl.setValue('');
    tick(1000);
    component.confirmEmailMessage$.subscribe((m) => (message = m));

    expect(confirmEmailControl.hasError('required')).toBeTrue();
    expect(confirmEmailControl.valid).toBeFalse();
    expect(message).toBe(CONFIRMEMAILVALIDATIONMESSAGES.required);
  }));

  it(`should set contactGroupMessage$ correctly when contactGroup control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const contactGroupControl = component.parentForm.get('contactGroup');
    const phoneControl = contactGroupControl.get('phone');
    const emailControl = contactGroupControl.get('email');
    const confirmEmailControl = contactGroupControl.get('confirmEmail');

    fixture.detectChanges();

    phoneControl.setValue('1234567890');
    emailControl.setValue('validEmail@test.com');
    confirmEmailControl.setValue('validEmail@test.com');
    tick(1000);
    component.contactGroupMessage$.subscribe((m) => (message = m));

    expect(emailControl.value === confirmEmailControl.value).toBeTrue();
    expect(contactGroupControl.hasError('match')).toBeFalse();
    expect(contactGroupControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set contactGroupMessage$ correctly when contactGroup control on the
    parentForm has a match error`, fakeAsync(() => {
    let message: string;
    const contactGroupControl = component.parentForm.get('contactGroup');
    const phoneControl = contactGroupControl.get('phone');
    const emailControl = contactGroupControl.get('email');
    const confirmEmailControl = contactGroupControl.get('confirmEmail');

    fixture.detectChanges();

    phoneControl.setValue('1234567890');
    emailControl.setValue('validEmail@test.com');
    confirmEmailControl.setValue('validEmail@test.co');
    tick(1000);
    component.contactGroupMessage$.subscribe((m) => (message = m));

    expect(emailControl.value === confirmEmailControl.value).toBeFalse();
    expect(contactGroupControl.hasError('match')).toBeTrue();
    expect(contactGroupControl.valid).toBeFalse();
    expect(message).toBe(CONTACTGROUPVALIDATIONMESSAGES.match);
  }));
});
