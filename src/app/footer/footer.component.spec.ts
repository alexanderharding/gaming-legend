import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentYear', () => {
    let year: number;

    it('should be set to current year', () => {
      year = new Date().getFullYear();

      expect(component.currentYear).toBe(year);
    });
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
    fixture.detectChanges();
  });

  it('should set the currentYear in the template', () => {
    // Arrange
    year = new Date().getFullYear();
    // Act

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p'));
    expect(elements[0].nativeElement.textContent).toContain(year);
  });

  xit('should set the pageTitle in the template', () => {
    // Arrange

    // Act

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p'));
    expect(elements[0].nativeElement.textContent).toContain(
      component.pageTitle
    );
  });
});
