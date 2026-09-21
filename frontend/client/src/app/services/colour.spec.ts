import { TestBed } from '@angular/core/testing';

import { Colour } from './colour';

describe('Colour', () => {
  let service: Colour;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Colour);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
