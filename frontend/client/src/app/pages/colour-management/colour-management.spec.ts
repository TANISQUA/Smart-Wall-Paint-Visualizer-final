import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourManagement } from './colour-management';

describe('ColourManagement', () => {
  let component: ColourManagement;
  let fixture: ComponentFixture<ColourManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColourManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ColourManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
