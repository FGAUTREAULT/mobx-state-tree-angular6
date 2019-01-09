import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSidePanelComponent } from './action-side-panel.component';

describe('ActionSidePanelComponent', () => {
  let component: ActionSidePanelComponent;
  let fixture: ComponentFixture<ActionSidePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionSidePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
