import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let year: number;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FooterComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Arrange
    fixture.detectChanges();

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should set currentYear correctly', () => {
    // Arrange
    year = new Date().getFullYear();
    fixture.detectChanges();

    // Act

    // Assert
    expect(component.currentYear).toBe(year);
  });
});

describe('FooterComponent w/ template', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let year: number;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FooterComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should set the currentYear in the template', () => {
    // Arrange
    year = new Date().getFullYear();

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p'));
    expect(elements[0].nativeElement.textContent).toContain(year);
  });

  it('should set the pageTitle in the template', () => {
    // Arrange
    component.pageTitle = 'Gaming Legend';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p'));
    expect(elements[0].nativeElement.textContent).toContain(
      component.pageTitle
    );
  });
});
