import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminDasboardComponent } from './sub-admin-dasboard.component';

describe('SubAdminDasboardComponent', () => {
  let component: SubAdminDasboardComponent;
  let fixture: ComponentFixture<SubAdminDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAdminDasboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAdminDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
