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

  it('should set pageTitle correctly', () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Gaming Legend');
  });

  it(`should have called setTitle method on Title service with correct
    value`, () => {
    fixture.detectChanges();

    expect(mockTitle.setTitle).toHaveBeenCalledTimes(1);
    expect(mockTitle.setTitle).toHaveBeenCalledWith(
      `${component.pageTitle} | Welcome`
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

  it('should set pageTitle correctly in the template', () => {
    let elements: DebugElement[];

    fixture.detectChanges();

    elements = fixture.debugElement.queryAll(By.css('h1'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
    elements = fixture.debugElement.queryAll(By.css('p'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toContain(
      component.pageTitle
    );
  });
});
