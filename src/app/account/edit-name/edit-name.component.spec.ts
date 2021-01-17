import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNameComponent } from './edit-name.component';

xdescribe('EditNameComponent', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditNameComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
