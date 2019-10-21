import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlistcustomerPage } from './productlistcustomer.page';

describe('ProductlistcustomerPage', () => {
  let component: ProductlistcustomerPage;
  let fixture: ComponentFixture<ProductlistcustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductlistcustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductlistcustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
