import { TestBed } from '@angular/core/testing';

import { SpazaService } from './spaza.service';

describe('SpazaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpazaService = TestBed.get(SpazaService);
    expect(service).toBeTruthy();
  });
});
