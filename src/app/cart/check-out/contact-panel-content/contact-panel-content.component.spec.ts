import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPanelContent } from './contact-panel-content.component';

describe('ContactPanelContent', () => {
  let component: ContactPanelContent;
  let fixture: ComponentFixture<ContactPanelContent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactPanelContent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPanelContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
