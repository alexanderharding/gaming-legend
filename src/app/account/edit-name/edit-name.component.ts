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
import { INotification } from 'src/app/types/notification';
import { IUser, User } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;

  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;

  @Input() user: IUser;
  @Input() loading: boolean;

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

  onSubmit(form: FormGroup): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.onLoadingChange.emit(true);
      this.saveUser(form);
    }
  }

  resetForm(form: FormGroup, user: IUser): void {
    const name = user.name;
    const nameControl = form.get('nameGroup');
    this.submitted = false;
    form.reset();
    nameControl.setValue({
      firstName: name.firstName,
      lastName: name.lastName,
    });
  }

  private showSuccess(): void {
    const notification = {
      textOrTpl: this.successTpl,
      className: 'bg-success text-light',
      delay: 10000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private showDanger(): void {
    const notification = {
      textOrTpl: this.dangerTpl,
      className: 'bg-danger text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private saveUser(form: FormGroup): void {
    const updatedUser = {
      ...this.user,
      name: {
        firstName: form.get('nameGroup.firstName').value as string,
        lastName: form.get('nameGroup.lastName').value as string,
      },
    } as User;
    this.authService.saveUser(updatedUser).subscribe(
      (user) => {
        this.onLoadingChange.emit(false);
        this.resetForm(form, user);
        this.showSuccess();
      },
      (error) => {
        this.onLoadingChange.emit(false);
        this.showDanger();
      }
    );
  }
}
