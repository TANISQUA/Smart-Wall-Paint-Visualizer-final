import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintEditor } from './paint-editor';

describe('PaintEditor', () => {
  let component: PaintEditor;
  let fixture: ComponentFixture<PaintEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(PaintEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
