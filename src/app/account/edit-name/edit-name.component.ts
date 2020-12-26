import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';

@Component({
  selector: 'ctacu-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent implements OnInit {
  submitted = false;
  editNameForm: FormGroup;

  readonly user$ = this.authService.currentUser$;

  readonly nameMinLength = +this.formValidationRuleService.nameMinLength;
  readonly nameMaxLength = +this.formValidationRuleService.nameMaxLength;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService
  ) {}

  ngOnInit(): void {
    this.editNameForm = this.fb.group({
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
}
