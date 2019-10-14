import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpazaboardPage } from './spazaboard.page';

describe('SpazaboardPage', () => {
  let component: SpazaboardPage;
  let fixture: ComponentFixture<SpazaboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpazaboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpazaboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
