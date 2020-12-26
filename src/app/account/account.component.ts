import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatcher } from '../functions/password-matcher';
import { AuthService } from '../services/auth.service';
import { FormValidationRuleService } from '../services/form-validation-rule.service';

@Component({
  selector: 'ctacu-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  submitted = false;
  readonly user$ = this.authService.currentUser$;
  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  editPasswordForm: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly formValidationRuleService: FormValidationRuleService
  ) {}

  ngOnInit(): void {
    this.editPasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(this.passwordPattern)],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        { validator: passwordMatcher }
      ),
    });
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
