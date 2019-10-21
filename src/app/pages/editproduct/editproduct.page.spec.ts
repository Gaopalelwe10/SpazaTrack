import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditproductPage } from './editproduct.page';

describe('EditproductPage', () => {
  let component: EditproductPage;
  let fixture: ComponentFixture<EditproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditproductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
