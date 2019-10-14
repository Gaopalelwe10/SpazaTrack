import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpazaformPage } from './spazaform.page';

describe('SpazaformPage', () => {
  let component: SpazaformPage;
  let fixture: ComponentFixture<SpazaformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpazaformPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpazaformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
