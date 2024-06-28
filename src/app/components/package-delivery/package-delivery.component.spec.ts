import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDeliveryComponent } from './package-delivery.component';

describe('PackageDeliveryComponent', () => {
  let component: PackageDeliveryComponent;
  let fixture: ComponentFixture<PackageDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
