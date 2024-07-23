import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsLayerComponent } from './controls-layer.component';

describe('ControlsLayerComponent', () => {
  let component: ControlsLayerComponent;
  let fixture: ComponentFixture<ControlsLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlsLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
