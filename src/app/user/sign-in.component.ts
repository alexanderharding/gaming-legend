import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  showErrors = false;
  // signInForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.signIn('harding1996@gmail.com', 'test').subscribe();
    // this.signInForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required]],
    // });
  }

  ngOnDestroy(): void {
    this.authService.signOut();
  }
}
