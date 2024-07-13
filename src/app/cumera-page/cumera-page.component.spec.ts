import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumeraPageComponent } from './cumera-page.component';

describe('CumeraPageComponent', () => {
  let component: CumeraPageComponent;
  let fixture: ComponentFixture<CumeraPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CumeraPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CumeraPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
