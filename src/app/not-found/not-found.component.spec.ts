import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockTitle: Title;

  beforeEach(
    waitForAsync(() => {
      mockTitle = jasmine.createSpyObj(['setTitle']);
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [NotFoundComponent],
        providers: [{ provide: Title, useValue: mockTitle }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have set pageTitle correctly', () => {
    expect(component.pageTitle).toBe('Page Not Found');
  });

  it('should have set errorMessage correctly', () => {
    expect(component.erroMessage).toBe(
      'Oops! Something went wrong. Please check the URL and try again.'
    );
  });

  it('should have called setTitle method on Title with correct value', () => {
    // Arrange

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockTitle.setTitle).toHaveBeenCalledTimes(1);
    expect(mockTitle.setTitle).toHaveBeenCalledWith(
      `Gaming Legend | ${component.pageTitle}`
    );
  });
});

describe('NotFoundComponent w/ template', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [NotFoundComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set pageTitle in the template', () => {
    let elements: DebugElement[] = [];

    fixture.detectChanges();

    elements = fixture.debugElement.queryAll(By.css('h1'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(
      component.pageTitle.toLowerCase()
    );
    expect(elements[0].classes).toEqual({
      'display-4': true,
      'd-none': true,
      'd-sm-block': true,
    });
    elements = fixture.debugElement.queryAll(By.css('h2'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(
      component.pageTitle.toLowerCase()
    );
    expect(elements[0].classes).toEqual({
      'd-sm-none': true,
    });
  });

  it('should set erroMessage in the template', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('ngb-alert'));

    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(component.erroMessage);
    expect(elements[0].classes).toEqual({
      alert: true,
      show: true,
      'alert-danger': true,
      fade: true,
      'text-center': true,
    });
  });
});
