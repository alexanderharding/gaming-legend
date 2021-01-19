import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { User } from '../types/user';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let USERS: User[];

  beforeEach(() => {
    USERS = [
      {
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
      },
    ];
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  describe('signIn', () => {
    it('should call http client with the correct url', inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.signIn(USERS[0].contact.email, USERS[0].password).subscribe();

        // Assert
        const req = controller.expectOne(
          `http://localhost:3000/users/?contact.email=${USERS[0].contact.email}`
        );
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ user: USERS[0] });
      }
    ));
  });

  describe('checkForUser', () => {
    it('should call http client with the correct url', inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.checkForUser(USERS[0].contact.email).subscribe();

        // Assert
        const req = controller.expectOne(
          `http://localhost:3000/users/?contact.email=${USERS[0].contact.email}`
        );
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ user: USERS[0] });
      }
    ));
  });

  describe('saveUser', () => {
    it(`should call http client with the correct url when user has no id`, inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.saveUser(USERS[0]).subscribe();

        // Assert
        const req = controller.expectOne(`http://localhost:3000/users`);
        expect(req.request.method).toEqual('POST');
        controller.verify();
        req.flush({ user: USERS[0] });
      }
    ));
    it(`should call http client with the correct url when user has an id`, inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange
        USERS[0] = {
          ...USERS[0],
          id: 1,
        };

        // Act
        service.saveUser(USERS[0]).subscribe();

        // Assert
        const req = controller.expectOne(
          `http://localhost:3000/users/${USERS[0].id}`
        );
        expect(req.request.method).toEqual('PUT');
        controller.verify();
        req.flush({ user: USERS[0] });
      }
    ));
  });

  describe('users$', () => {
    it('should call http client with the correct url', inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.users$.subscribe();

        // Assert
        const req = controller.expectOne(`http://localhost:3000/users`);
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ users: USERS });
      }
    ));
  });
});
