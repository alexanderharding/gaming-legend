import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../types/user';

import { AuthGuard } from './auth.guard';

xdescribe('AuthGuard w/ USER', () => {
  let guard: AuthGuard, mockAuthService, USER: User, mockRouter;

  beforeEach(() => {
    USER = {
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      contact: {
        phone: '8011231234',
        email: 'test@test.com',
      },
      address: {
        street: '123 S Bend Ct',
        city: 'Las Vegas',
        state: 'Nevada',
        zip: '12345',
        country: 'USA',
      },
      password: 'TestPassword1234',
      isAdmin: true,
      id: 121014,
    };
    mockAuthService = jasmine.createSpyObj([''], { currentUser$: of(USER) });
    mockRouter = jasmine.createSpyObj(['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should call Router.navigate with the correct value', () => {
      let value: boolean;
      mockRouter.navigate.and.returnValue();
      guard.canActivate().subscribe((v) => (value = v));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/user']);
    });
  });
});
