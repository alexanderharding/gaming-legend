import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizePanelContentComponent } from './finalize-panel-content.component';

describe('FinalizePanelContentComponent', () => {
  let component: FinalizePanelContentComponent;
  let fixture: ComponentFixture<FinalizePanelContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizePanelContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizePanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
