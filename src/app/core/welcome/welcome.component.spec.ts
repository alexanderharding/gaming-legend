import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';

import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockTitle: Title;

  beforeEach(
    waitForAsync(() => {
      mockTitle = jasmine.createSpyObj(['setTitle']);
      TestBed.configureTestingModule({
        declarations: [WelcomeComponent],
        providers: [{ provide: Title, useValue: mockTitle }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have set pageTitle correctly', () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Welcome');
  });

  it('should have set welcomeMessage correctly', () => {
    fixture.detectChanges();

    expect(component.welcomeMessage)
      .toBe(`A top-of-the-line PC will outpace many gaming
    consoles when it comes to sheer computing power, but many low- to mid-tier
    computers also provide great gaming experiences. PC gaming is largely about
    customization, giving you a vast array of hardware and accessories to choose
    from. No matter how you want to game, Gaming Legend has the perfect
    hardware for you.`);
  });

  it(`should have called setTitle method on Title service with correct
    value`, () => {
    fixture.detectChanges();

    expect(mockTitle.setTitle).toHaveBeenCalledOnceWith(
      `Gaming Legend | ${component.pageTitle}`
    );
  });
});

describe('WelcomeComponent w/ template', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WelcomeComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set pageTitle in the template', () => {
    let elements: DebugElement[];
    fixture.detectChanges();

    elements = fixture.debugElement.queryAll(By.css('h1'));
    expect(elements.length).toBe(1);
    expect(elements[0].classes).toEqual({
      'display-4': true,
      'd-none': true,
      'd-sm-block': true,
    });
    expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
    elements = fixture.debugElement.queryAll(By.css('h2'));
    expect(elements.length).toBe(1);
    expect(elements[0].classes).toEqual({
      'd-sm-none': true,
    });
    expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
  });

  it('should set welcomeMessage in the template', () => {
    let elements: DebugElement[];
    fixture.detectChanges();

    elements = fixture.debugElement.queryAll(By.css('p'));
    expect(elements.length).toBe(2);
    elements.forEach((e) =>
      expect(e.nativeElement.textContent)
        .toBe(`A top-of-the-line PC will outpace many gaming
    consoles when it comes to sheer computing power, but many low- to mid-tier
    computers also provide great gaming experiences. PC gaming is largely about
    customization, giving you a vast array of hardware and accessories to choose
    from. No matter how you want to game, Gaming Legend has the perfect
    hardware for you.`)
    );
  });
});
