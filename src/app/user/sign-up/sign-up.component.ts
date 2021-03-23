import {
  ChangeDetectionStrategy,
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
import {
  NgbAccordionConfig,
  NgbProgressbarConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/core/notification.service';
import { INotification } from 'src/app/types/notification';
import { User, UserMaker } from 'src/app/types/user';
import { UserContact, UserContactMaker } from 'src/app/types/user-contact';
import { UserName, UserNameMaker } from 'src/app/types/user-name';

@Component({
  selector: 'ctacu-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  // @ViewChild('signUpErrTpl') private signUpErrTpl: TemplateRef<any>;

  // signUpForm: FormGroup;
  // submitted = false;
  // emailTakenMessage: string;

  // @Input() loading: boolean;
  // @Output() loadingChange = new EventEmitter<boolean>();

  // private readonly nameMinLength = +this.formService.nameMinLength;
  // private readonly nameMaxLength = +this.formService.nameMaxLength;
  // private readonly phonePattern = this.formService.phonePattern as RegExp;
  // private readonly passwordPattern = this.formService.passwordPattern as RegExp;

  constructor() // private readonly accordionConfig: NgbAccordionConfig, // private readonly fb: FormBuilder,
  // private readonly progressBarConfig: NgbProgressbarConfig,
  // private readonly formService: FormService,
  // private readonly authService: AuthService,
  // private readonly router: Router,
  // private readonly notificationService: NotificationService
  {
    // accordionConfig.closeOthers = true;
    // progressBarConfig.striped = true;
    // progressBarConfig.animated = true;
  }

  ngOnInit(): void {
    // this.signUpForm = this.fb.group({
    //   nameGroup: this.fb.group({
    //     firstName: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(this.nameMinLength),
    //         Validators.maxLength(this.nameMaxLength),
    //       ],
    //     ],
    //     lastName: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(this.nameMinLength),
    //         Validators.maxLength(this.nameMaxLength),
    //       ],
    //     ],
    //   }),
    //   contactGroup: this.fb.group(
    //     {
    //       phone: [
    //         '',
    //         [Validators.required, Validators.pattern(this.phonePattern)],
    //       ],
    //       email: ['', [Validators.required, Validators.email]],
    //       confirmEmail: ['', Validators.required],
    //     },
    //     { validator: emailMatcher }
    //   ),
    //   passwordGroup: this.fb.group(
    //     {
    //       password: [
    //         '',
    //         [Validators.required, Validators.pattern(this.passwordPattern)],
    //       ],
    //       confirmPassword: ['', [Validators.required]],
    //     },
    //     { validator: passwordMatcher }
    //   ),
    // });
  }

  // onSubmit(form: FormGroup): void {
  //   if (!this.submitted) {
  //     this.submitted = true;
  //   }
  //   this.setEmailTakenMessage('');
  //   if (form.valid) {
  //     this.loadingChange.emit(true);
  //     this.checkForUser(form);
  //   }
  // }

  // setEmailTakenMessage(message: string): void {
  //   this.emailTakenMessage = message;
  // }

  // private getRandomNumber(min: number, max: number): number {
  //   return +(Math.floor(Math.random() * (max - min)) + min).toFixed();
  // }

  // private showDanger(templateRef: TemplateRef<any>): void {
  //   const notification = {
  //     textOrTpl: templateRef,
  //     className: 'bg-danger text-light',
  //     delay: 15000,
  //   } as INotification;
  //   this.notificationService.show(notification);
  // }

  // private checkForUser(form: FormGroup): void {
  //   const emailControl = form.get('contactGroup.email');
  //   this.authService.checkForUser(emailControl.value).subscribe(
  //     (result) => {
  //       if (result) {
  //         this.loadingChange.emit(false);
  //         this.setEmailTakenMessage(`"${emailControl.value}" is already
  //             registered to an account.`);
  //       } else {
  //         this.saveUser(form);
  //       }
  //     },
  //     (error) => {
  //       this.loadingChange.emit(false);
  //       this.showDanger(this.signUpErrTpl);
  //     }
  //   );
  // }

  // private saveUser(form: FormGroup): void {
  //   const user = UserMaker.create({
  //     name: UserNameMaker.create({
  //       firstName: form.get('nameGroup.firstName').value as string,
  //       lastName: form.get('nameGroup.lastName').value as string,
  //     } as UserName),
  //     contact: UserContactMaker.create({
  //       phone: form.get('contactGroup.phone').value as string,
  //       email: form.get('contactGroup.email').value as string,
  //     } as UserContact),
  //     password: form.get('passwordGroup.password').value as string,
  //     isAdmin: false,
  //   }) as User;
  //   this.authService.saveUser(user).subscribe({
  //     error: () => {
  //       this.showDanger(this.signUpErrTpl);
  //       this.loadingChange.emit(false);
  //     },
  //     complete: () => {
  //       this.loadingChange.emit(false);
  //       this.router.navigate(['/account']);
  //     },
  //   });
  // }
}
