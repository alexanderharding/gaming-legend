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
import { FormService } from 'src/app/services/form.service';
import { IUser } from 'src/app/types/user';

import { NameFormComponent } from './name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;
  let mockFormService: FormService;
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
      mockFormService = jasmine.createSpyObj([''], {
        nameMinLength: NAMEMINLENGTH,
        nameMaxLength: NAMEMAXLENGTH,
      });
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [NameFormComponent],
        providers: [
          {
            provide: FormService,
            useValue: mockFormService,
          },
        ],
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

  it(`should set nameGroup control value on parentForm correctly to
    start`, fakeAsync(() => {
    const nameGroupControl = component.parentForm.controls.nameGroup;
    fixture.detectChanges();
    tick(1000);

    expect(nameGroupControl.valid).toBeTruthy();
    expect(nameGroupControl.value).toEqual({
      firstName: USER.name.firstName,
      lastName: USER.name.lastName,
    });
  }));

  it(`should set firstNameMessage$ correctly when firstName control on the
    parentForm is required`, fakeAsync(() => {
    let errors: object;
    let message: string;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    firstNameControl.setValue('');
    tick(1000);
    component.firstNameMessage$.subscribe((m) => (message = m));
    errors = firstNameControl.errors || {};

    expect(firstNameControl.valid).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeTruthy();
    expect(message).toBe('Please enter a first name.');
  }));

  it(`should set firstNameMessage$ correctly when firstName control value.length
    on parentForm is less than NAMEMINLENGTH and greater than 0`, fakeAsync(() => {
    let errors: object;
    let name: string;
    let message: string;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    name = 'j';
    expect(name.length).toBeLessThan(NAMEMINLENGTH);
    expect(name.length).toBeGreaterThan(0);
    firstNameControl.setValue(name);
    tick(1000);
    component.firstNameMessage$.subscribe((m) => (message = m));
    errors = firstNameControl.errors || {};

    expect(firstNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeTruthy();
    expect(message).toBe(`First name must be longer than ${NAMEMINLENGTH - 1}
    characters.`);
  }));

  it(`should set firstNameMessage$ correctly when firstName control value.length
    on parentForm is greater than or equal to NAMEMAXLENGTH`, fakeAsync(() => {
    let errors: object;
    let name: string;
    let message: string;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    name = 'johnnysilverhandsiscool';
    expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
    firstNameControl.setValue(name);
    tick(1000);
    component.firstNameMessage$.subscribe((m) => (message = m));
    errors = firstNameControl.errors || {};

    expect(firstNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeTruthy();
    expect(message).toBe(`First name cannot be longer than ${NAMEMAXLENGTH}
    characters.`);
  }));

  it(`should set firstNameMessage$ correctly when firstName control on the
    parentForm is valid`, fakeAsync(() => {
    let errors: object;
    let name: string;
    let message: string;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    name = 'johnny';
    expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
    expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
    firstNameControl.setValue(name);
    tick(1000);
    component.firstNameMessage$.subscribe((m) => (message = m));
    errors = firstNameControl.errors || {};

    key = 'required';
    expect(errors[key]).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeFalsy();
    expect(firstNameControl.valid).toBeTruthy();
    expect(message).toBe('');
  }));

  it(`should set lastNameMessage$ correctly when lastName control on the
    parentForm is required`, fakeAsync(() => {
    let errors: object;
    let message: string;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();

    lastNameControl.setValue('');
    tick(1000);
    component.lastNameMessage$.subscribe((m) => (message = m));
    errors = lastNameControl.errors || {};

    expect(lastNameControl.valid).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeTruthy();
    expect(message).toBe('Please enter a last name.');
  }));

  it(`should set lastNameMessage$ correctly when lastName control value.length
    on parentForm is less than NAMEMINLENGTH and greater than
    0`, fakeAsync(() => {
    let errors: object;
    let name: string;
    let message: string;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();

    name = 'j';
    expect(name.length).toBeLessThan(NAMEMINLENGTH);
    expect(name.length).toBeGreaterThan(0);
    lastNameControl.setValue(name);
    tick(1000);
    component.lastNameMessage$.subscribe((m) => (message = m));
    errors = lastNameControl.errors || {};

    expect(lastNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeTruthy();
    expect(message).toBe(`Last name must be longer than ${NAMEMINLENGTH - 1}
    characters.`);
  }));

  it(`should set lastNameMessage$ correctly when lastName control value on
    parentForm is greater than or equal to NAMEMAXLENGTH`, fakeAsync(() => {
    let errors: object;
    let name: string;
    let message: string;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();

    name = 'johnnysilverhandsiscool';
    expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
    lastNameControl.setValue(name);
    tick(1000);
    component.lastNameMessage$.subscribe((m) => (message = m));
    errors = lastNameControl.errors || {};

    expect(lastNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeTruthy();
    expect(message).toBe(`Last name cannot be longer than ${NAMEMAXLENGTH}
    characters.`);
  }));

  it(`should set lastNameMessage$ correctly when lastName control on the
    parentForm is valid`, fakeAsync(() => {
    let errors: object;
    let name: string;
    let message: string;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();

    name = 'johnny';
    expect(name.length).toBeLessThanOrEqual(NAMEMAXLENGTH);
    expect(name.length).toBeGreaterThanOrEqual(NAMEMINLENGTH);
    lastNameControl.setValue(name);
    tick(1000);
    component.lastNameMessage$.subscribe((m) => (message = m));
    errors = lastNameControl.errors || {};

    key = 'required';
    expect(errors[key]).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeFalsy();
    expect(lastNameControl.valid).toBeTruthy();
    expect(message).toBe('');
  }));
});

describe('NameFormComponent w/ template', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;
  let mockFormService: FormService;
  let USER: IUser;

  const NAMEMINLENGTH = 3;
  const NAMEMAXLENGTH = 20;

  const FIRSTNAMEVALIDATIONMESSAGES = {
    required: 'Please enter a first name.',
    minlength: `First name must be longer than ${NAMEMINLENGTH - 1}
    characters.`,
    maxlength: `First name cannot be longer than ${NAMEMAXLENGTH}
    characters.`,
  };
  const LASTNAMEVALIDATIONMESSAGES = {
    required: 'Please enter a last name.',
    minlength: `Last name must be longer than ${NAMEMINLENGTH - 1}
    characters.`,
    maxlength: `Last name cannot be longer than ${NAMEMAXLENGTH}
    characters.`,
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

      mockFormService = jasmine.createSpyObj([''], {
        nameMinLength: NAMEMINLENGTH,
        nameMaxLength: NAMEMAXLENGTH,
      });
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [NameFormComponent],
        providers: [
          {
            provide: FormService,
            useValue: mockFormService,
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

    const elements = fixture.debugElement.queryAll(By.css('legend span'));
    expect(elements.length).toBe(1);
    expect(component.pageTitle).toBeUndefined();
    expect(elements[0].nativeElement.textContent).toBe(
      component.defaultPageTitle.toLocaleLowerCase()
    );
  });

  it('should set pageTitle correctly in the template', () => {
    component.pageTitle = 'Test title';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('legend span'));
    expect(element.nativeElement.textContent).toBe(
      component.pageTitle.toLocaleLowerCase()
    );
  });

  it(`should set firstName control on parentForm correctly in the
    template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#firstName'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.autocomplete).toBe('given-name');
    expect(inputs[0].nativeElement.type).toBe('text');
    expect(inputs[0].nativeElement.placeholder).toBe('First name (required)');
    expect(inputs[0].nativeElement.value).toBe(USER.name.firstName);
  });

  it(`should set firstName control value on parentForm when firstName input
    value changes`, () => {
    const name = 'Jay';
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#firstName'));

    input.nativeElement.value = name;
    input.nativeElement.dispatchEvent(new Event('input'));

    expect(firstNameControl.value).toBe(name);
  });

  it(`should set firstName input classes correctly in the template when
    firstName control on parentForm is valid`, fakeAsync(() => {
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#firstName'));
    expect(firstNameControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
    });
  }));

  it(`should set firstName input classes correctly in the template when
    firstName control on parentForm is not valid and submitted is
    true`, fakeAsync(() => {
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    component.submitted = true;
    fixture.detectChanges();

    firstNameControl.setValue('');
    tick(1000);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#firstName'));
    expect(component.submitted).toBeTrue();
    expect(firstNameControl.valid).toBeFalsy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-invalid': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });
  }));

  it(`should set firstName input classes correctly in the template when
    firstName control on parentForm is not valid and submitted is
    false`, fakeAsync(() => {
    let errors: object;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    component.submitted = false;
    fixture.detectChanges();

    firstNameControl.setValue('');
    tick(1000);
    fixture.detectChanges();
    errors = firstNameControl.errors || {};

    const input = fixture.debugElement.query(By.css('#firstName'));
    expect(component.submitted).toBeFalse();
    expect(firstNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });
  }));

  it(`should set lastName control on parentForm correctly in the
    template`, () => {
    fixture.detectChanges();

    const inputs = fixture.debugElement.queryAll(By.css('#lastName'));
    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.autocomplete).toBe('family-name');
    expect(inputs[0].nativeElement.type).toBe('text');
    expect(inputs[0].nativeElement.placeholder).toBe('Last name (required)');
    expect(inputs[0].nativeElement.value).toBe(USER.name.lastName);
  });

  it(`should set lastName control value on parentForm when lastName input value
    changes`, fakeAsync(() => {
    const name = 'Jay';
    fixture.detectChanges();
    const firstNameControl = component.parentForm.get('nameGroup.lastName');
    const input = fixture.debugElement.query(By.css('#lastName'));

    input.nativeElement.value = name;
    input.nativeElement.dispatchEvent(new Event('input'));
    tick(1000);

    expect(firstNameControl.value).toBe(name);
  }));

  it(`should set lastName input classes correctly in the template when lastName
    control on parentForm is valid`, fakeAsync(() => {
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#lastName'));
    expect(lastNameControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
    });
  }));

  it(`should set lastName input classes correctly in the template when
    lastName control on parentForm is not valid and submitted is
    true`, fakeAsync(() => {
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    component.submitted = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#lastName'));
    tick(1000);

    fixture.detectChanges();

    expect(component.submitted).toBeTrue();
    expect(lastNameControl.valid).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'is-valid': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
    });
  }));

  it(`should set lastName input classes correctly in the template when
    lastName control on parentForm is not valid and submitted is
    false`, fakeAsync(() => {
    let errors: object;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    component.submitted = false;
    fixture.detectChanges();

    lastNameControl.setValue('');
    tick(1000);
    fixture.detectChanges();
    errors = lastNameControl.errors || {};

    const input = fixture.debugElement.query(By.css('#lastName'));
    expect(component.submitted).toBeFalse();
    expect(lastNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeTruthy();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    control on parentForm is valid`, fakeAsync(() => {
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(firstNameControl.valid).toBeTruthy();
    expect(element.nativeElement.textContent).toBe('');
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    control on parentForm is required`, fakeAsync(() => {
    let errors: object;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    firstNameControl.setValue('');
    tick(1000);
    fixture.detectChanges();
    errors = firstNameControl.errors || {};

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(firstNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeTruthy();
    expect(element.nativeElement.textContent).toBe(
      FIRSTNAMEVALIDATIONMESSAGES.required
    );
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    control value.length on parentForm is less than NAMEMINLENGTH and greater
    than 0`, fakeAsync(() => {
    let name: string;
    let errors: object;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    name = 'jo';
    expect(name.length).toBeLessThan(NAMEMINLENGTH);
    expect(name.length).toBeGreaterThan(0);
    firstNameControl.setValue(name);
    tick(1000);
    errors = firstNameControl.errors || {};
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(firstNameControl.valid).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeTruthy();
    expect(element.nativeElement.textContent).toBe(
      FIRSTNAMEVALIDATIONMESSAGES.minlength
    );
  }));

  it(`should set firstNameMessage$ correctly in the template when firstName
    control value.length on parentForm is greater than or equal to
    NAMEMAXLENGTH`, fakeAsync(() => {
    let name: string;
    let errors: object;
    let key: string;
    const firstNameControl = component.parentForm.get('nameGroup.firstName');
    fixture.detectChanges();

    name = 'johnnysilverhandsiscool';
    expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
    firstNameControl.setValue(name);
    tick(1000);
    fixture.detectChanges();
    errors = firstNameControl.errors || {};

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(firstNameControl.valid).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeTruthy();
    expect(element.nativeElement.textContent).toBe(
      FIRSTNAMEVALIDATIONMESSAGES.maxlength
    );
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    constrol on parentForm is valid`, fakeAsync(() => {
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    tick(1000);

    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    expect(lastNameControl.valid).toBeTruthy();
    expect(element.nativeElement.textContent).toBe('');
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    control on parentForm is required`, fakeAsync(() => {
    let errors: object;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();
    // tick(1000);

    lastNameControl.setValue('');
    tick(1000);
    errors = lastNameControl.errors || {};
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    expect(lastNameControl.valid).toBeFalsy();
    key = 'required';
    expect(errors[key]).toBeTruthy();
    expect(element.nativeElement.textContent).toBe(
      LASTNAMEVALIDATIONMESSAGES.required
    );
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    control value.length on parentForm is less than NAMEMINLENGTH and greater
    than 0`, fakeAsync(() => {
    let name: string;
    let errors: object;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();

    name = 'jo';
    expect(name.length).toBeLessThan(NAMEMINLENGTH);
    expect(name.length).toBeGreaterThan(0);
    lastNameControl.setValue(name);
    tick(1000);
    errors = lastNameControl.errors || {};
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    expect(lastNameControl.valid).toBeFalsy();
    key = 'minlength';
    expect(errors[key]).toBeTruthy();
    expect(element.nativeElement.textContent).toBe(
      LASTNAMEVALIDATIONMESSAGES.minlength
    );
  }));

  it(`should set lastNameMessage$ correctly in the template when lastName
    control value on parentForm is greater than or equal to
    NAMEMAXLENGTH`, fakeAsync(() => {
    let name: string;
    let errors: object;
    let key: string;
    const lastNameControl = component.parentForm.get('nameGroup.lastName');
    fixture.detectChanges();

    name = 'johnnysilverhandsiscool';
    expect(name.length).toBeGreaterThanOrEqual(NAMEMAXLENGTH);
    lastNameControl.setValue(name);
    tick(1000);
    errors = lastNameControl.errors || {};
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    expect(lastNameControl.valid).toBeFalsy();
    key = 'maxlength';
    expect(errors[key]).toBeTruthy();
    expect(element.nativeElement.textContent).toBe(
      LASTNAMEVALIDATIONMESSAGES.maxlength
    );
  }));
});
