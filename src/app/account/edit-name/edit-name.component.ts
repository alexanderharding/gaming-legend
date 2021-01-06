import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent implements OnInit {
  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;

  submitted = false;
  editForm: FormGroup;

  @Input() user: IUser;

  @Output() onLoadingChange = new EventEmitter<boolean>();

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
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
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
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.onLoadingChange.emit(true);
      const updatedUser = {
        ...user,
        name: {
          firstName: form.get('nameGroup.firstName').value as string,
          lastName: form.get('nameGroup.lastName').value as string,
        },
      } as User;
      this.saveUser(updatedUser);
    }
  }

  resetForm(user: User): void {
    this.submitted = false;
    const name = user.name;
    this.editForm.reset();
    this.editForm.patchValue({
      nameGroup: {
        firstName: name.firstName,
        lastName: name.lastName,
      },
    });
  }

  private showSuccess(): void {
    this.notificationService.show(this.successTpl, {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  private showDanger(): void {
    this.notificationService.show(this.dangerTpl, {
      classname: 'bg-danger text-light',
      delay: 15000,
    });
  }
  private saveUser(user: User): void {
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.onLoadingChange.emit(false);
        this.resetForm(result);
        this.showSuccess();
      },
      (error) => {
        this.onLoadingChange.emit(false);
        this.showDanger();
      }
    );
  }
}
