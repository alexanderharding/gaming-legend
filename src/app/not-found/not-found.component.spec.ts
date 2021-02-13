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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageTitle correctly in the template', () => {
    const elements = fixture.debugElement.queryAll(By.css('h1'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
  });
});
