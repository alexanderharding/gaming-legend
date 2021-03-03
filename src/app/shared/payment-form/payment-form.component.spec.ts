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
import { By } from '@angular/platform-browser';

import { PaymentFormComponent } from './payment-form.component';

function cardNumberChecker(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const value = c.value?.toString() as string;

  if (c.pristine || !value) {
    return null;
  }

  const visa = /^4[0-9]{12}(?:[0-9]{3})?$/.test(value);
  const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(
    value
  );
  const amex = /^3[47][0-9]{13}$/.test(value);
  const discover = /^6(?:011\d{12}|5\d{14}|4[4-9]\d{13}|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d{2}|9(?:[01]\d|2[0-5]))\d{10})$/.test(
    value
  );
  const dinersClub = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(value);
  const carteBlanche = /^389[0-9]{11}$/.test(value);
  const jcb = /^(?:2131|1800|35\d{3})\d{11}/.test(value);
  const unionPay = /^(62[0-9]{14,17})$/.test(value);
  const bcGlobal = /^(6541|6556)[0-9]{12}/.test(value);
  const maestro = /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/.test(
    value
  );

  const valid =
    visa ||
    amex ||
    mastercard ||
    discover ||
    dinersClub ||
    carteBlanche ||
    jcb ||
    unionPay ||
    bcGlobal ||
    maestro;

  if (valid) {
    return null;
  }

  return { cardNumber: true };
}

const CARDNUMBERVALIDATIONMESSAGES = {
  required: 'Please enter a card number.',
  cardNumber: 'Please enter a valid card number with no hyphens.',
};

const EXPIRATIONVALIDATIONMESSAGES = {
  required: 'Please enter an expiration date.',
};

const CVVVALIDATIONMESSAGES = {
  required: 'Please enter the security code on the back of your card.',
  pattern: 'Please enter a valid security code.',
};

const CVVPATTERN = /^[0-9]{3,4}$/;

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [PaymentFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    component.parentForm = fb.group({
      paymentGroup: fb.group({
        cardNumber: ['', [Validators.required, cardNumberChecker]],
        cvv: [null, [Validators.required, Validators.pattern(CVVPATTERN)]],
        expiration: ['', [Validators.required]],
      }),
    });
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have set pageTitle correctly', () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Payment');
  });

  it('should have set cardMinExpiration correctly', () => {
    const date = new Date();

    fixture.detectChanges();

    expect(component.cardMinExpiration).toBe(
      `${date.getFullYear()}-0${date.getMonth() + 1}`
    );
  });

  it('should have set cardMaxExpiration correctly', () => {
    const date = new Date();

    fixture.detectChanges();

    expect(component.cardMaxExpiration).toBe(
      `${date.getFullYear() + 8}-0${date.getMonth() + 1}`
    );
  });

  it('should have set cardNumberMessage$ correctly', () => {
    let message: string;
    fixture.detectChanges();

    component.cardNumberMessage$.subscribe((m) => (message = m));

    expect(message).toBe(CARDNUMBERVALIDATIONMESSAGES.required);
  });

  it('should have set expirationMessage$ correctly', () => {
    let message: string;
    fixture.detectChanges();

    component.expirationMessage$.subscribe((m) => (message = m));

    expect(message).toBe(EXPIRATIONVALIDATIONMESSAGES.required);
  });

  it('should have set cvvMessage$ correctly', () => {
    let message: string;
    fixture.detectChanges();

    component.cvvMessage$.subscribe((m) => (message = m));

    expect(message).toBe(CVVVALIDATIONMESSAGES.required);
  });

  it(`should set cardNumberMessage$ correctly when cardNumber control on the
    parentForm is required`, fakeAsync(() => {
    let message: string;
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    fixture.detectChanges();

    cardNumberControl.setValue('');
    tick(1000);
    component.cardNumberMessage$.subscribe((m) => (message = m));

    expect(cardNumberControl.hasError('cardNumber')).toBeFalse();
    expect(cardNumberControl.hasError('required')).toBeTrue();
    expect(cardNumberControl.valid).toBeFalse();
    expect(message).toBe(CARDNUMBERVALIDATIONMESSAGES.required);
  }));

  xit(`should set cardNumberMessage$ correctly when cardNumber control value is
    an invalid card number`, fakeAsync(() => {
    let message: string;
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    fixture.detectChanges();

    cardNumberControl.setValue(12);
    tick(1000);
    component.cardNumberMessage$.subscribe((m) => (message = m));

    expect(cardNumberControl.hasError('cardNumber')).toBeTrue();
    // expect(cardNumberControl.hasError('required')).toBeFalse();
    expect(message).toBe(CARDNUMBERVALIDATIONMESSAGES.cardNumber);
  }));

  it(`should set cardNumberMessage$ correctly when cardNumber control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    fixture.detectChanges();

    cardNumberControl.setValue(4154514587412547);
    tick(1000);
    component.cardNumberMessage$.subscribe((m) => (message = m));

    expect(cardNumberControl.hasError('cardNumber')).toBeFalse();
    expect(cardNumberControl.hasError('required')).toBeFalse();
    expect(cardNumberControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set expirationMessage$ correctly when expiration control on the
    parentForm is required`, fakeAsync(() => {
    let message: string;
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    fixture.detectChanges();

    expirationControl.setValue(null);
    tick(1000);
    component.expirationMessage$.subscribe((m) => (message = m));

    expect(expirationControl.hasError('required')).toBeTrue();
    expect(expirationControl.valid).toBeFalse();
    expect(message).toBe(EXPIRATIONVALIDATIONMESSAGES.required);
  }));

  it(`should set expirationMessage$ correctly when expiration control on the
    parentForm is valid`, fakeAsync(() => {
    let message: string;
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    fixture.detectChanges();

    expirationControl.setValue('2021-02');
    tick(1000);
    component.expirationMessage$.subscribe((m) => (message = m));

    expect(expirationControl.hasError('required')).toBeFalse();
    expect(expirationControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set cvvMessage$ correctly when cvv control on the
    parentForm is required`, fakeAsync(() => {
    let message: string;
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    fixture.detectChanges();

    cvvControl.setValue(null);
    tick(1000);
    component.cvvMessage$.subscribe((m) => (message = m));

    expect(cvvControl.hasError('pattern')).toBeFalse();
    expect(cvvControl.hasError('required')).toBeTrue();
    expect(cvvControl.valid).toBeFalse();
    expect(message).toBe(CVVVALIDATIONMESSAGES.required);
  }));

  it(`should set cvvMessage$ correctly when cvv control value on the
    parentForm has a pattern error`, fakeAsync(() => {
    let message: string;
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    fixture.detectChanges();

    cvvControl.setValue(1);
    tick(1000);
    component.cvvMessage$.subscribe((m) => (message = m));

    expect(cvvControl.hasError('pattern')).toBeTrue();
    expect(cvvControl.hasError('required')).toBeFalse();
    expect(cvvControl.valid).toBeFalse();
    expect(message).toBe(CVVVALIDATIONMESSAGES.pattern);
  }));

  it(`should set cvvMessage$ correctly when cvv control on the parentForm is
    valid`, fakeAsync(() => {
    let message: string;
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    fixture.detectChanges();

    cvvControl.setValue(1234);
    tick(1000);
    component.cvvMessage$.subscribe((m) => (message = m));

    expect(CVVPATTERN.test(cvvControl.value as string)).toBeTrue();
    expect(cvvControl.hasError('pattern')).toBeFalse();
    expect(cvvControl.hasError('required')).toBeFalse();
    expect(cvvControl.valid).toBeTrue();
    expect(message).toBe('');
  }));

  it(`should set cardNumber input value when cardNumber control value on the
    parentForm changes`, fakeAsync(() => {
    const cardNumber = '123';
    fixture.detectChanges();
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    const input = fixture.debugElement.query(By.css('#cardNumberControl'));

    cardNumberControl.setValue(cardNumber);
    tick(1000);

    expect(input.nativeElement.value).toBe(cardNumber);
  }));

  it(`should set expiration input value when expiration control value on the
    parentForm changes`, fakeAsync(() => {
    const expiration = '2021-02';
    fixture.detectChanges();
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    const input = fixture.debugElement.query(By.css('#expirationControl'));

    expirationControl.setValue(expiration);
    tick(1000);

    expect(input.nativeElement.value).toBe(expiration);
  }));

  it(`should set cvv input value when cvv control value on the parentForm
    changes`, fakeAsync(() => {
    const cvv = 123;
    fixture.detectChanges();
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    const input = fixture.debugElement.query(By.css('#cvvControl'));

    cvvControl.setValue(cvv);
    tick(1000);

    expect(+input.nativeElement.value).toBe(cvv);
  }));
});

describe('PaymentFormComponent w/ template', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [PaymentFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    component.parentForm = fb.group({
      paymentGroup: fb.group({
        cardNumber: ['', [Validators.required, cardNumberChecker]],
        cvv: [null, [Validators.required, Validators.pattern(CVVPATTERN)]],
        expiration: ['', [Validators.required]],
      }),
    });
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set pageTitle in the template', () => {
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('legend span'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
  });

  it(`should set cardNumber control on parentForm in the template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#cardNumberControl'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.autocomplete).toBe('cc-number');
    expect(inputs[0].nativeElement.type).toBe('text');
    expect(inputs[0].nativeElement.placeholder).toBe('Card number (required)');
  });

  it(`should set expiration control on parentForm in the template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#expirationControl'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.type).toBe('month');
    expect(inputs[0].nativeElement.min).toBe(component.cardMinExpiration);
    expect(inputs[0].nativeElement.max).toBe(component.cardMaxExpiration);
  });

  it(`should set cvv control on parentForm in the template`, () => {
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('#cvvControl'));

    expect(inputs.length).toBe(1);
    expect(inputs[0].nativeElement.type).toBe('number');
    expect(inputs[0].nativeElement.placeholder).toBe('CVV (required)');
  });

  it(`should set cardNumberMessage$ correctly in the template when cardNumber
    control on parentForm is valid`, fakeAsync(() => {
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    fixture.detectChanges();

    cardNumberControl.setValue('4121451235123147');
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(cardNumberControl.valid).toBeTrue();
    expect(element.nativeElement.textContent).toBe('');
  }));

  it(`should set cardNumberMessage$ correctly in the template when cardNumber
    control on parentForm is required`, fakeAsync(() => {
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    fixture.detectChanges();

    cardNumberControl.setValue('');
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(cardNumberControl.valid).toBeFalse();
    expect(element.nativeElement.textContent).toBe(
      CARDNUMBERVALIDATIONMESSAGES.required
    );
  }));

  xit(`should set cardNumberMessage$ correctly in the template when cardNumber
    control on parentForm has cardNumber error`, fakeAsync(() => {
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    fixture.detectChanges();

    cardNumberControl.setValue('4');
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[0];
    expect(cardNumberControl.valid).toBeFalse();
    expect(element.nativeElement.textContent).toBe(
      CARDNUMBERVALIDATIONMESSAGES.cardNumber
    );
  }));

  it(`should set expirationMessage$ correctly in the template when expiration
    control on parentForm is valid`, fakeAsync(() => {
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    fixture.detectChanges();

    expirationControl.setValue('2021-02');
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    expect(expirationControl.valid).toBeTrue();
    expect(element.nativeElement.textContent).toBe('');
  }));

  it(`should set expirationMessage$ correctly in the template when expiration
    control on parentForm is required`, fakeAsync(() => {
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    fixture.detectChanges();

    expirationControl.setValue('');
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[1];
    expect(expirationControl.valid).toBeFalse();
    expect(element.nativeElement.textContent).toBe(
      EXPIRATIONVALIDATIONMESSAGES.required
    );
  }));

  it(`should set cvvMessage$ correctly in the template when cvv
    control on parentForm is valid`, fakeAsync(() => {
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    fixture.detectChanges();

    cvvControl.setValue(1234);
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[2];
    expect(cvvControl.valid).toBeTrue();
    expect(element.nativeElement.textContent).toBe('');
  }));

  it(`should set cvvMessage$ correctly in the template when cvv
    control on parentForm is required`, fakeAsync(() => {
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    fixture.detectChanges();

    cvvControl.setValue(null);
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[2];
    expect(cvvControl.valid).toBeFalse();
    expect(element.nativeElement.textContent).toBe(
      CVVVALIDATIONMESSAGES.required
    );
  }));

  it(`should set cvvMessage$ correctly in the template when cvv
    control on parentForm has a pattern error`, fakeAsync(() => {
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    fixture.detectChanges();

    cvvControl.setValue(1);
    tick(1000);
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(
      By.css('.invalid-tooltip span')
    )[2];
    expect(CVVPATTERN.test(cvvControl.value as string)).toBeFalse();
    expect(cvvControl.valid).toBeFalse();
    expect(element.nativeElement.textContent).toBe(
      CVVVALIDATIONMESSAGES.pattern
    );
  }));

  it(`should set cardNumber control value on parentForm when cardNumber input
    value changes`, fakeAsync(() => {
    const cardString = '412365471';
    fixture.detectChanges();
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    const input = fixture.debugElement.query(By.css('#cardNumberControl'));

    input.nativeElement.value = cardString;
    input.nativeElement.dispatchEvent(new Event('input'));
    tick(1000);

    expect(cardNumberControl.value).toBe(cardString);
  }));

  it(`should set expiration control value on parentForm when expiration input
    value changes`, fakeAsync(() => {
    const expiration = '2022-01';
    fixture.detectChanges();
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    const input = fixture.debugElement.query(By.css('#expirationControl'));

    input.nativeElement.value = expiration;
    input.nativeElement.dispatchEvent(new Event('input'));
    tick(1000);

    expect(expirationControl.value).toBe(expiration);
  }));

  it(`should set cvv control value on parentForm when cvv input
    value changes`, fakeAsync(() => {
    const cvv = 123;
    fixture.detectChanges();
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    const input = fixture.debugElement.query(By.css('#cvvControl'));

    input.nativeElement.value = cvv;
    input.nativeElement.dispatchEvent(new Event('input'));
    tick(1000);

    expect(cvvControl.value).toBe(cvv);
  }));

  xit(`should set cardNumber input classes correctly when submitted is
    false`, fakeAsync(() => {
    const cardNumberControl = component.parentForm.get(
      'paymentGroup.cardNumber'
    );
    component.submitted = false;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#cardNumberControl'));

    cardNumberControl.setValue('');
    tick(1000);

    expect(cardNumberControl.valid).toBeFalse();
    expect(cardNumberControl.hasError('required')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });
  }));

  it(`should set expiration input classes correctly when submitted is
    false`, fakeAsync(() => {
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    component.submitted = false;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#expirationControl'));

    expirationControl.setValue('');
    tick(1000);
    fixture.detectChanges();

    expect(expirationControl.valid).toBeFalse();
    expect(expirationControl.hasError('required')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });

    expirationControl.setValue('2021-02');
    tick(1000);
    fixture.detectChanges();

    expect(expirationControl.valid).toBeTrue();
    expect(expirationControl.hasError('required')).toBeFalse();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
      'is-valid': true,
    });
  }));

  it(`should set expiration input classes correctly when submitted is
    true`, fakeAsync(() => {
    const expirationControl = component.parentForm.get(
      'paymentGroup.expiration'
    );
    component.submitted = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#expirationControl'));

    expirationControl.setValue('');
    tick(1000);
    fixture.detectChanges();

    expect(expirationControl.valid).toBeFalse();
    expect(expirationControl.hasError('required')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
      'is-invalid': true,
    });

    expirationControl.setValue('2021-02');
    tick(1000);
    fixture.detectChanges();

    expect(expirationControl.valid).toBeTrue();
    expect(expirationControl.hasError('required')).toBeFalse();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
      'is-valid': true,
    });
  }));

  it(`should set cvv input classes correctly when submitted is
    false`, fakeAsync(() => {
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    component.submitted = false;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#cvvControl'));

    cvvControl.setValue(null);
    tick(1000);
    fixture.detectChanges();

    expect(cvvControl.valid).toBeFalse();
    expect(cvvControl.hasError('required')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });

    cvvControl.setValue(1);
    tick(1000);
    fixture.detectChanges();

    expect(cvvControl.valid).toBeFalse();
    expect(cvvControl.hasError('pattern')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
    });

    cvvControl.setValue(1234);
    tick(1000);
    fixture.detectChanges();

    expect(cvvControl.valid).toBeTrue();
    expect(cvvControl.hasError('required')).toBeFalse();
    expect(cvvControl.hasError('pattern')).toBeFalse();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
      'is-valid': true,
    });
  }));

  it(`should set cvv input classes correctly when submitted is
    true`, fakeAsync(() => {
    const cvvControl = component.parentForm.get('paymentGroup.cvv');
    component.submitted = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#cvvControl'));

    cvvControl.setValue(null);
    tick(1000);
    fixture.detectChanges();

    expect(cvvControl.valid).toBeFalse();
    expect(cvvControl.hasError('required')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
      'is-invalid': true,
    });

    cvvControl.setValue(1);
    tick(1000);
    fixture.detectChanges();

    expect(cvvControl.valid).toBeFalse();
    expect(cvvControl.hasError('pattern')).toBeTrue();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-invalid': true,
      'is-invalid': true,
    });

    cvvControl.setValue(1234);
    tick(1000);
    fixture.detectChanges();

    expect(cvvControl.valid).toBeTrue();
    expect(cvvControl.hasError('required')).toBeFalse();
    expect(cvvControl.hasError('pattern')).toBeFalse();
    expect(input.classes).toEqual({
      'form-control': true,
      'ng-untouched': true,
      'ng-pristine': true,
      'ng-valid': true,
      'is-valid': true,
    });
  }));
});
