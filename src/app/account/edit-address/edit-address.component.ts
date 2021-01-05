import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  errorMessage = '';
  loading = false;

  readonly user$ = this.authService.currentUser$;
  readonly streetMinLength = +this.formValidationRuleService.streetMinLength;
  readonly streetMaxLength = +this.formValidationRuleService.streetMaxLength;
  readonly cityMinLength = +this.formValidationRuleService.cityMinLength;
  readonly cityMaxLength = +this.formValidationRuleService.cityMaxLength;
  private readonly zipPattern = this.formValidationRuleService
    .zipPattern as RegExp;
  private readonly cvvPattern = this.formValidationRuleService
    .cvvPattern as RegExp;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user$.pipe(first()).subscribe({
      next: (user) =>
        (this.editForm = this.fb.group({
          currentPassword: [
            '',
            [Validators.required, passwordChecker(user.password)],
          ],
          addressGroup: this.fb.group({
            street: [
              '',
              [
                Validators.required,
                Validators.minLength(this.streetMinLength),
                Validators.maxLength(this.streetMaxLength),
              ],
            ],
            city: [
              '',
              [
                Validators.required,
                Validators.minLength(this.cityMinLength),
                Validators.maxLength(this.cityMaxLength),
              ],
            ],
            state: ['', [Validators.required]],
            zip: [
              '',
              [Validators.required, Validators.pattern(this.zipPattern)],
            ],
            country: ['USA', [Validators.required]],
          }),
        })),
    });
  }

  onSubmit(form: FormGroup, user: IUser): void {
    this.errorMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loading = true;
      const updatedUser = {
        ...user,
        street: form.get('addressGroup.street').value as string,
        city: form.get('addressGroup.city').value as string,
        state: form.get('addressGroup.state').value as string,
        zip: form.get('addressGroup.zip').value as string,
      } as IUser;
      this.saveUser(updatedUser);
    }
  }

  private saveUser(user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => this.router.navigate(['/account']),
      (error) => {
        this.loading = false;
        this.errorMessage = 'There was an error saving your address.';
      }
    );
  }
}
