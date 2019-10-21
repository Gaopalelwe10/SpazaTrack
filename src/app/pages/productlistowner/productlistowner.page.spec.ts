import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlistownerPage } from './productlistowner.page';

describe('ProductlistownerPage', () => {
  let component: ProductlistownerPage;
  let fixture: ComponentFixture<ProductlistownerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductlistownerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductlistownerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
