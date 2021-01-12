import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { User } from '../types/user';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let email: string;
  let password: string;
  let user: User;

  beforeEach(() => {
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
        email = 'testemail@test.com';
        password = 'TestPassword1234';

        // Act
        service.signIn(email, password).subscribe();

        // Assert
        controller.expectOne(
          `http://localhost:3000/users/?contact.email=${email}`
        );
        controller.verify();
      }
    ));
  });

  describe('checkForUser', () => {
    it('should call http client with the correct url', inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange
        email = 'testemail@test.com';

        // Act
        service.checkForUser(email).subscribe();

        // Assert
        controller.expectOne(
          `http://localhost:3000/users/?contact.email=${email}`
        );
        controller.verify();
      }
    ));
  });

  describe('saveUser', () => {
    it(`should call http client with the correct url when user has no id`, inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange
        user = {
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
        };

        // Act
        service.saveUser(user).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/users`);
        controller.verify();
      }
    ));
    it(`should call http client with the correct url when user has an id`, inject(
      [AuthService, HttpTestingController],
      (service: AuthService, controller: HttpTestingController) => {
        // Arrange
        user = {
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
          id: 111214,
        };

        // Act
        service.saveUser(user).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/users/${user.id}`);
        controller.verify();
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
        controller.expectOne(`http://localhost:3000/users`);
        controller.verify();
      }
    ));
  });
});
