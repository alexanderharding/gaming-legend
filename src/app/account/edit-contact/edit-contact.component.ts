import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { User } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditContactComponent implements OnInit, OnDestroy {
  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;
  submitted = false;
  editForm: FormGroup;
  emailTakenMessage: string;
  hasValueChanged = false;
  hasEmailChanged = false;

  private subscription: Subscription;

  @Input() user: User;
  @Input() loading: boolean;

  @Output() onLoadingChange = new EventEmitter<boolean>();

  private readonly phonePattern = this.formValidationRuleService
    .phonePattern as RegExp;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      contactGroup: this.fb.group(
        {
          phone: [
            '',
            [Validators.required, Validators.pattern(this.phonePattern)],
          ],
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcher }
      ),
      passwordGroup: this.fb.group({
        currentPassword: [
          '',
          [Validators.required, passwordChecker(this.user.password)],
        ],
      }),
    });
    const contactControl = this.editForm.get('contactGroup');
    this.subscription = contactControl.valueChanges.subscribe(() =>
      this.setHasValueChanged(contactControl)
    );
    const emailControl = this.editForm.get('contactGroup.email');
    this.subscription = emailControl.valueChanges.subscribe(() =>
      this.setHasEmailChanged(emailControl)
    );
  }

  onSubmit(form: FormGroup): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.onLoadingChange.emit(true);
      if (this.hasEmailChanged) {
        this.checkForUser(form);
      } else {
        this.saveUser(form);
      }
    }
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
  }

  resetForm(form: FormGroup, user: User): void {
    this.submitted = false;
    const contact = user.contact;
    const contactControl = form.get('contactGroup');
    const passwordGroupControl = form.get('passwordGroup');
    contactControl.setValue({
      phone: contact.phone as string,
      email: contact.email as string,
      confirmEmail: contact.email as string,
    });
    passwordGroupControl.patchValue({
      currentPassword: '',
    });
  }

  private setHasValueChanged(c: AbstractControl): void {
    const controlValue = JSON.stringify(c.value).toLowerCase();
    const userNameValue = JSON.stringify({
      ...this.user.contact,
      confirmEmail: this.user.contact.email,
    }).toLowerCase();
    this.hasValueChanged = controlValue === userNameValue ? false : true;
  }

  private setHasEmailChanged(c: AbstractControl): void {
    const emailValue = c.value.toLowerCase();
    const userEmail = this.user.contact.email;
    this.hasEmailChanged = emailValue === userEmail ? false : true;
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

  private checkForUser(form: FormGroup): void {
    const emailControl = this.editForm.get('contactGroup.email');
    this.authService.checkForUser(emailControl.value).subscribe(
      (result) => {
        if (result) {
          this.emailTakenMessage = `${emailControl.value} is already registered
          to an account.`;
          this.onLoadingChange.emit(false);
        } else {
          this.saveUser(form);
        }
      },
      (error) => {
        this.showDanger();
        this.onLoadingChange.emit(false);
      }
    );
  }

  private saveUser(form: FormGroup): void {
    const updatedUser = {
      ...this.user,
      contact: {
        phone: form.get('contactGroup.phone').value as string,
        email: form.get('contactGroup.email').value as string,
      },
    } as User;
    this.authService.saveUser(updatedUser).subscribe(
      (user) => {
        this.showSuccess();
        this.user = user as User;
        this.resetForm(form, user);
        this.onLoadingChange.emit(false);
      },
      (error) => {
        this.showDanger();
        this.onLoadingChange.emit(false);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
