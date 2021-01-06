import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { passwordChecker } from 'src/app/functions/password-checker';
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
  loading = false;

  // readonly user$ = this.authService.currentUser$;

  @Input() user: IUser;

  readonly nameMinLength = +this.formValidationRuleService.nameMinLength;
  readonly nameMaxLength = +this.formValidationRuleService.nameMaxLength;

  get hasChanged(): boolean {
    const formValue = JSON.stringify(
      this.editForm.get('nameGroup').value
    ).toLowerCase();
    const userNameValue = JSON.stringify(this.user.name).toLowerCase();
    return formValue !== userNameValue;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      currentPassword: [
        '',
        [Validators.required, passwordChecker(this.user.password)],
      ],
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
      const updatedUser = {
        ...user,
        firstName: form.get('nameGroup.firstName').value as string,
        lastName: form.get('nameGroup.lastName').value as string,
      } as IUser;
      this.saveUser(updatedUser);
    }
  }

  resetForm(user: IUser): void {
    const name = user.name;
    this.editForm.reset();
    this.editForm.patchValue({
      nameGroup: {
        firstName: name.firstName,
        lastName: name.lastName,
      },
    });
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
