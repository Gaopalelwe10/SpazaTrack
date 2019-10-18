import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcommentPage } from './addcomment.page';

describe('AddcommentPage', () => {
  let component: AddcommentPage;
  let fixture: ComponentFixture<AddcommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcommentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
