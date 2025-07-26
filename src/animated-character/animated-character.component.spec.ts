import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedCharacterComponent } from './animated-character.component';

describe('AnimatedCharacterComponent', () => {
  let component: AnimatedCharacterComponent;
  let fixture: ComponentFixture<AnimatedCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedCharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
