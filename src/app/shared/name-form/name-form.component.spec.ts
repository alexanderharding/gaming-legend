import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

import { NameFormComponent } from './name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;
  let mockFormValidationRuleService: FormValidationRuleService;
  let NAMEMINLENGTH: number;
  let NAMEMAXLENGTH: number;
  let USER: IUser;

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
      NAMEMINLENGTH = 3;
      NAMEMAXLENGTH = 20;
      mockFormValidationRuleService = jasmine.createSpyObj([''], {
        nameMinLength: NAMEMINLENGTH,
        nameMaxLength: NAMEMAXLENGTH,
      });
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [NameFormComponent],
        providers: [
          FormBuilder,
          {
            provide: FormValidationRuleService,
            useValue: mockFormValidationRuleService,
          },
        ],
        // schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.parentForm = fb.group({
      nameGroup: fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAMEMINLENGTH),
            Validators.maxLength(NAMEMAXLENGTH),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAMEMINLENGTH),
            Validators.maxLength(NAMEMAXLENGTH),
          ],
        ],
      }),
    });
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set defaultPageTitle correctly', () => {
    fixture.detectChanges();

    expect(component.defaultPageTitle).toBe('Full Name');
  });

  it('should set firstNameMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.firstNameMessage$.subscribe((m) => (message = m));
    expect(message).toBe('');
  }));

  it('should set lastNameMessage$ correctly to start', fakeAsync(() => {
    let message: string;

    fixture.detectChanges();
    tick(1000);

    component.lastNameMessage$.subscribe((m) => (message = m));
    expect(message).toBe('');
  }));

  describe('parentForm', () => {
    describe('nameGroup', () => {
      describe('firstName control', () => {
        it('should be set correctly to start', fakeAsync(() => {
          let errors = {};
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          errors = nameGroupControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(firstNameControl.valid).toBeTruthy();
          expect(firstNameControl.value).toEqual(USER.name.firstName);
        }));

        it(`should set firstNameMessage$ correctly when there's no
          value`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = '';
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(errors['required']).toBeTruthy();
          expect(message).toBe('Please enter a first name.');
        }));

        it(`should set firstNameMessage$ correctly when value is less than
          NAMEMINLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = 'j';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          expect(name.length).toBeGreaterThan(0);
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(errors['minlength']).toBeTruthy();
          expect(message).toBe(`First name must be longer than ${
            NAMEMINLENGTH - 1
          }
    characters.`);
        }));

        it(`should set firstNameMessage$ correctly when value is greater than or
          equal to NAMEMAXLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnnysilverhandsiscool';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(firstNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeTruthy();
          expect(message)
            .toBe(`First name cannot be longer than ${NAMEMAXLENGTH}
    characters.`);
        }));

        it(`should set firstNameMessage$ correctly when
          valid`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const firstNameControl = nameGroupControl.get('firstName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnny';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          firstNameControl.setValue(name);
          tick(1000);
          component.firstNameMessage$.subscribe((m) => (message = m));
          errors = firstNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(message).toBe('');
          expect(firstNameControl.valid).toBeTruthy();
        }));
      });

      describe('lastName control', () => {
        it('should be set correctly to start', fakeAsync(() => {
          let errors = {};
          fixture.detectChanges();
          tick(1000);
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');

          errors = lastNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(lastNameControl.valid).toBeTruthy();
          expect(lastNameControl.value).toEqual(USER.name.lastName);
        }));

        it(`should set lastNameMessage$ correctly when there's no
          value`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = '';
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeTruthy();
          expect(message).toBe('Please enter a last name.');
        }));

        it(`should set lastNameMessage$ correctly when value is less than
          NAMEMINLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = 'j';
          expect(name.length).toBeLessThan(NAMEMINLENGTH);
          expect(name.length).toBeGreaterThan(0);
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(errors['minlength']).toBeTruthy();
          expect(message).toBe(`Last name must be longer than ${
            NAMEMINLENGTH - 1
          }
    characters.`);
        }));

        it(`should set lastNameMessage$ correctly when value is greater than or
          equal to NAMEMAXLENGTH`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnnysilverhandsiscool';
          expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(lastNameControl.valid).toBeFalsy();
          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeTruthy();
          expect(message).toBe(`Last name cannot be longer than ${NAMEMAXLENGTH}
    characters.`);
        }));

        it(`should set lastNameMessage$ correctly when valid`, fakeAsync(() => {
          let errors: Object;
          let name: string;
          let message: string;
          const nameGroupControl = component.parentForm.controls['nameGroup'];
          const lastNameControl = nameGroupControl.get('lastName');
          fixture.detectChanges();
          tick(1000);

          name = 'johnny';
          expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
          expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
          lastNameControl.setValue(name);
          tick(1000);
          component.lastNameMessage$.subscribe((m) => (message = m));
          errors = lastNameControl.errors || {};

          expect(errors['required']).toBeFalsy();
          expect(errors['minlength']).toBeFalsy();
          expect(errors['maxlength']).toBeFalsy();
          expect(lastNameControl.valid).toBeTruthy();
          expect(message).toBe('');
        }));
      });
    });
  });
});

describe('NameFormComponent w/ template', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;
  let mockFormValidationRuleService: FormValidationRuleService;
  let NAMEMINLENGTH: number;
  let NAMEMAXLENGTH: number;
  let USER: IUser;
  let FIRSTNAMEVALIDATIONMESSAGES: Object;
  let LASTNAMEVALIDATIONMESSAGES: Object;

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
      NAMEMINLENGTH = 3;
      NAMEMAXLENGTH = 20;
      FIRSTNAMEVALIDATIONMESSAGES = {
        required: 'Please enter a first name.',
        minlength: `First name must be longer than ${NAMEMINLENGTH - 1}
    characters.`,
        maxlength: `First name cannot be longer than ${NAMEMAXLENGTH}
    characters.`,
      };
      LASTNAMEVALIDATIONMESSAGES = {
        required: 'Please enter a last name.',
        minlength: `Last name must be longer than ${NAMEMINLENGTH - 1}
    characters.`,
        maxlength: `Last name cannot be longer than ${NAMEMAXLENGTH}
    characters.`,
      };
      mockFormValidationRuleService = jasmine.createSpyObj([''], {
        nameMinLength: NAMEMINLENGTH,
        nameMaxLength: NAMEMAXLENGTH,
      });
      TestBed.configureTestingModule({
        // imports: [ReactiveFormsModule],
        declarations: [NameFormComponent],
        providers: [
          FormBuilder,
          {
            provide: FormValidationRuleService,
            useValue: mockFormValidationRuleService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.parentForm = fb.group({
      nameGroup: fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAMEMINLENGTH),
            Validators.maxLength(NAMEMAXLENGTH),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAMEMINLENGTH),
            Validators.maxLength(NAMEMAXLENGTH),
          ],
        ],
      }),
    });
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set defaultPageTitle correctly in the template', () => {
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('legend'));

    expect(component.pageTitle).toBeUndefined();
    expect(element.nativeElement.textContent).toContain(
      component.defaultPageTitle.toLocaleLowerCase()
    );
  });

  it('should set pageTitle correctly in the template', () => {
    component.pageTitle = 'Test title';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('legend'));

    expect(element.nativeElement.textContent).toContain(
      component.pageTitle.toLocaleLowerCase()
    );
  });

  xit('should set firstName field correctly in the template', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#firstName'));
    expect(input.nativeElement.autocomplete).toBe('given-name');
    expect(input.nativeElement.type).toBe('text');
    expect(input.nativeElement.placeholder).toBe('First name (required)');
    expect(input.nativeElement.value).toBe(USER.name.firstName);
    // expect(input.classes).toEqual({ 'form-control': true });
  }));

  xit('should set lastName field correctly in the template', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    const input = fixture.debugElement.queryAll(By.css('input'))[1];
    expect(input.nativeElement.autocomplete).toBe('family-name');
    expect(input.nativeElement.type).toBe('text');
    console.log(input.classes);
    expect(input.nativeElement.placeholder).toBe('Last name (required)');
    expect(input.classes).toEqual({ 'form-control': true });
    // expect(input.nativeElement.value).toBe(USER.name.lastName);
  }));

  it(`should set firstName field classes correctly in the template when
    firstName field is valid`, fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#firstName'));
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
    });
  }));

  xit(`should set firstName field classes correctly in the template when
    firstName field is required`, fakeAsync(() => {
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    component.submitted = false;
    fixture.detectChanges();
    tick(1000);

    const input = fixture.debugElement.query(By.css('#firstName'));
    firstNameControl.setValue('');
    tick(1000);
    fixture.detectChanges();

    expect(firstNameControl.valid).toBeFalsy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-invalid': true,
    });

    // component.submitted = false;
    // fixture.detectChanges();

    // expect(input.classes).toEqual({
    //   'form-control': true,
    // });
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    field is valid`, fakeAsync(() => {
    const element = fixture.debugElement.queryAll(By.css('span'))[1];
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();
    expect(firstNameControl.valid).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual('');
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    field is required`, fakeAsync(() => {
    let errors: Object;
    const element = fixture.debugElement.queryAll(By.css('span'))[1];
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    tick(1000);

    firstNameControl.setValue('');
    tick(1000);
    errors = firstNameControl.errors || {};
    fixture.detectChanges();

    expect(firstNameControl.valid).toBeFalsy();
    expect(errors['required']).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual(
      FIRSTNAMEVALIDATIONMESSAGES['required']
    );
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    field value is less than NAMEMINLENGTH`, fakeAsync(() => {
    let errors: Object;
    const element = fixture.debugElement.queryAll(By.css('span'))[1];
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    tick(1000);

    firstNameControl.setValue('jo');
    tick(1000);
    errors = firstNameControl.errors || {};
    fixture.detectChanges();

    expect(firstNameControl.valid).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual(
      FIRSTNAMEVALIDATIONMESSAGES['minlength']
    );
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    field value is greater than or equal to NAMEMAXLENGTH`, fakeAsync(() => {
    let errors: Object;
    const element = fixture.debugElement.queryAll(By.css('span'))[1];
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    tick(1000);

    firstNameControl.setValue('johnnysilverhandsiscool');
    tick(1000);
    errors = firstNameControl.errors || {};
    fixture.detectChanges();

    expect(firstNameControl.valid).toBeFalsy();
    expect(errors['maxlength']).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual(
      FIRSTNAMEVALIDATIONMESSAGES['maxlength']
    );
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    field is valid`, fakeAsync(() => {
    const element = fixture.debugElement.queryAll(By.css('span'))[3];
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();
    expect(lastNameControl.valid).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual('');
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    field value is less than NAMEMINLENGTH`, fakeAsync(() => {
    let errors: Object;
    const element = fixture.debugElement.queryAll(By.css('span'))[3];
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    tick(1000);

    lastNameControl.setValue('jo');
    tick(1000);
    errors = lastNameControl.errors || {};
    fixture.detectChanges();

    expect(lastNameControl.valid).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual(
      LASTNAMEVALIDATIONMESSAGES['minlength']
    );
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    field value is less than NAMEMINLENGTH`, fakeAsync(() => {
    let errors: Object;
    const element = fixture.debugElement.queryAll(By.css('span'))[3];
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    tick(1000);

    lastNameControl.setValue('jo');
    tick(1000);
    errors = lastNameControl.errors || {};
    fixture.detectChanges();

    expect(lastNameControl.valid).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual(
      LASTNAMEVALIDATIONMESSAGES['minlength']
    );
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    field value is greater than or equal to NAMEMAXLENGTH`, fakeAsync(() => {
    let errors: Object;
    const element = fixture.debugElement.queryAll(By.css('span'))[3];
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    tick(1000);

    lastNameControl.setValue('johnnysilverhandsiscool');
    tick(1000);
    errors = lastNameControl.errors || {};
    fixture.detectChanges();

    expect(lastNameControl.valid).toBeFalsy();
    expect(errors['maxlength']).toBeTruthy();
    expect(element.nativeElement.textContent).toEqual(
      LASTNAMEVALIDATIONMESSAGES['maxlength']
    );
  }));
});
