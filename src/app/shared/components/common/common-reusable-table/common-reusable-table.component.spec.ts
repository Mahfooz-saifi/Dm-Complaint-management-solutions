import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonReusableTableComponent } from './common-reusable-table.component';

describe('CommonReusableTableComponent', () => {
  let component: CommonReusableTableComponent;
  let fixture: ComponentFixture<CommonReusableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonReusableTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonReusableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
