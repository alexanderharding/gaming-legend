import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IUser, User } from '../types/user';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  describe('w/ USER', () => {
    let guard: AuthGuard;
    let mockAuthService;
    let USER: IUser;
    let mockRouter;
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
      it('should return true', () => {
        let value: boolean;

        guard.canActivate().subscribe((v) => (value = v));

        expect(value).toBeTruthy();
      });

      it('should not call the navigate method on Router', () => {
        guard.canActivate().subscribe();

        expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
      });
    });

    describe('canLoad', () => {
      it('should return true', () => {
        let value: boolean;

        guard.canLoad().subscribe((v) => (value = v));

        expect(value).toBeTruthy();
      });
    });
  });

  describe('w/o USER', () => {
    let guard: AuthGuard;
    let mockAuthService;
    let USER: IUser;
    let mockRouter;

    beforeEach(() => {
      USER = null;
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
      it('should return false', () => {
        let value: boolean;

        guard.canActivate().subscribe((v) => (value = v));

        expect(value).toBeFalsy();
      });

      it('should call navigate method on Router with correct value', () => {
        guard.canActivate().subscribe();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/user']);
      });
    });

    describe('canLoad', () => {
      it('should return false', () => {
        let value: boolean;

        guard.canLoad().subscribe((v) => (value = v));

        expect(value).toBeFalsy();
      });
    });
  });
});
