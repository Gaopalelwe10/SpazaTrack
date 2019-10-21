import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductPage } from './addproduct.page';

describe('AddproductPage', () => {
  let component: AddproductPage;
  let fixture: ComponentFixture<AddproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddproductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
