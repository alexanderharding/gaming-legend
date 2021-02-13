import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IUser } from '../types/user';

import { UserGuard } from './user.guard';

describe('UserGuard', () => {
  describe('w/ USER', () => {
    let guard: UserGuard;
    let mockAuthService;
    let mockRouter;

    const USER = {
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
    } as IUser;
    beforeEach(() => {
      mockRouter = jasmine.createSpyObj(['navigate']);
      mockAuthService = jasmine.createSpyObj([''], {
        currentUser$: of(USER),
      });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: Router, useValue: mockRouter },
        ],
      });
      guard = TestBed.inject(UserGuard);
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    describe('canActivate', () => {
      it('should return correct value', () => {
        let value: boolean;

        guard.canActivate().subscribe((v) => (value = v));

        expect(value).toBeFalse();
      });

      it('should call navigate method on Router with correct value', () => {
        guard.canActivate().subscribe();

        expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
      });
    });
  });

  describe('w/o USER', () => {
    let guard: UserGuard;
    let mockAuthService;
    let mockRouter;

    const USER = null;

    beforeEach(() => {
      mockRouter = jasmine.createSpyObj(['navigate']);
      mockAuthService = jasmine.createSpyObj([''], {
        currentUser$: of(USER),
      });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: Router, useValue: mockRouter },
        ],
      });
      guard = TestBed.inject(UserGuard);
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    describe('canActivate', () => {
      it('should return correct value', () => {
        let value: boolean;

        guard.canActivate().subscribe((v) => (value = v));

        expect(value).toBeTrue();
      });

      it('should not call navigate method on Router', () => {
        guard.canActivate().subscribe();

        expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
      });
    });
  });
});
