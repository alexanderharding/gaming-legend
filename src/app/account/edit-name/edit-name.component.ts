import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  errorMessage = '';
  invalidPasswordMessage = '';
  loading = false;

  readonly user$ = this.authService.currentUser$;

  readonly nameMinLength = +this.formValidationRuleService.nameMinLength;
  readonly nameMaxLength = +this.formValidationRuleService.nameMaxLength;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      currentPassword: ['', Validators.required],
      nameGroup: this.fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(this.nameMinLength),
            Validators.maxLength(this.nameMaxLength),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(this.nameMinLength),
            Validators.maxLength(this.nameMaxLength),
          ],
        ],
      }),
    });
  }

  onSubmit(form: FormGroup, user: IUser): void {
    this.errorMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loading = true;
      const currentPasswordControl = form.get('currentPassword');
      if (currentPasswordControl.value.toString() === user.password) {
        const updatedUser = {
          ...user,
          firstName: form.get('nameGroup.firstName').value as string,
          lastName: form.get('nameGroup.lastName').value as string,
        } as IUser;
        this.saveUser(updatedUser);
      } else {
        this.invalidPasswordMessage = this.formValidationRuleService.invalidPasswordMessage;
        this.loading = false;
      }
    }
  }

  setInvalidPasswordMessage(message: string): void {
    this.invalidPasswordMessage = message;
  }

  private saveUser(user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => this.router.navigate(['/account']),
      (error) => {
        this.loading = false;
        this.errorMessage = 'There was an error saving your name.';
      }
    );
  }
}
