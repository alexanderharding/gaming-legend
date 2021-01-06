import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;
  submitted = false;
  editForm: FormGroup;
  emailTakenMessage: string;

  @Input() user: IUser;
  @Input() loading: boolean;

  @Output() onLoadingChange = new EventEmitter<boolean>();

  private readonly phonePattern = this.formValidationRuleService
    .phonePattern as RegExp;

  get hasChanged(): boolean {
    const contactGroup = JSON.stringify(
      this.editForm.get('contactGroup').value
    ).toLowerCase();
    const userContactValue = JSON.stringify({
      ...this.user.contact,
      confirmEmail: this.user.contact.email,
    }).toLowerCase();
    return contactGroup !== userContactValue;
  }

  private get hasEmailChanged(): boolean {
    const emailControl = this.editForm.get('contactGroup.email');
    const userEmail = this.user.contact.email.toLowerCase();
    return emailControl.value.toLowerCase() !== userEmail;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      currentPassword: [
        '',
        [Validators.required, passwordChecker(this.user.password)],
      ],
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
    });
  }

  onSubmit(form: FormGroup, user: IUser): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.onLoadingChange.emit(true);
      if (this.hasEmailChanged) {
        const email = this.editForm.get('contactGroup.email').value as string;
        this.authService.checkForUser(email).subscribe(
          (result) => {
            if (result) {
              this.onLoadingChange.emit(false);
              this.emailTakenMessage = `${email} is already registered to an
               account.`;
            } else {
              this.saveUser(form, user);
            }
          },
          (error) => {
            this.onLoadingChange.emit(false);
            this.showDanger();
          }
        );
      } else {
        this.saveUser(form, user);
      }
    }
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
  }

  resetForm(form: FormGroup, user: IUser): void {
    this.submitted = false;
    const contact = user.contact;
    form.reset();
    form.patchValue({
      contactGroup: {
        phone: contact.phone as string,
        email: contact.email as string,
        confirmEmail: contact.email as string,
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

  private saveUser(form: FormGroup, user: IUser): void {
    const updatedUser = {
      ...user,
      contact: {
        phone: form.get('contactGroup.phone').value as string,
        email: form.get('contactGroup.email').value as string,
      },
    } as IUser;
    this.authService.saveUser(updatedUser).subscribe(
      (result) => {
        this.onLoadingChange.emit(false);
        this.showSuccess();
      },
      (error) => {
        this.onLoadingChange.emit(false);
        this.showDanger();
      }
    );
  }
}
