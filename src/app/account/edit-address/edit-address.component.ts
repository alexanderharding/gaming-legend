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
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAddressComponent implements OnInit, OnDestroy {
  // submitted = false;
  // editForm: FormGroup;
  // hasValueChanged = false;

  // private subscription: Subscription;

  // @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  // @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;

  // @Input() user: IUser;
  // @Input() loading: boolean;

  // @Output() loadingChange = new EventEmitter<boolean>();

  // readonly streetMinLength = +this.formService.streetMinLength;
  // readonly streetMaxLength = +this.formService.streetMaxLength;
  // readonly cityMinLength = +this.formService.cityMinLength;
  // readonly cityMaxLength = +this.formService.cityMaxLength;
  // private readonly zipPattern = this.formService.zipPattern as RegExp;

  constructor() // private readonly fb: FormBuilder,
  // private readonly authService: AuthService,
  // private readonly formService: FormService,

  // private readonly notificationService: NotificationService
  {}

  ngOnInit(): void {
    // this.editForm = this.fb.group({
    //   addressGroup: this.fb.group({
    //     street: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(this.streetMinLength),
    //         Validators.maxLength(this.streetMaxLength),
    //       ],
    //     ],
    //     city: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(this.cityMinLength),
    //         Validators.maxLength(this.cityMaxLength),
    //       ],
    //     ],
    //     state: ['', [Validators.required]],
    //     zip: ['', [Validators.required, Validators.pattern(this.zipPattern)]],
    //     country: ['USA', [Validators.required]],
    //   }),
    //   passwordGroup: this.fb.group({
    //     currentPassword: [
    //       '',
    //       [Validators.required, passwordChecker(this.user.password)],
    //     ],
    //   }),
    // });
    // const addressControl = this.editForm.get('addressGroup');
    // this.subscription = addressControl.valueChanges.subscribe(() =>
    //   this.setHasValueChanged(addressControl)
    // );
    // if (!this.user.address) {
    //   this.hasValueChanged = true;
    // }
  }

  // onSubmit(form: FormGroup): void {
  //   if (!this.submitted) {
  //     this.submitted = true;
  //   }
  //   if (form.valid) {
  //     this.loadingChange.emit(true);
  //     this.saveUser(form);
  //   }
  // }

  // resetForm(form: FormGroup, user: IUser): void {
  //   const address = user.address;
  //   const addressControl = form.get('addressGroup');
  //   const passwordGroupControl = form.get('passwordGroup');
  //   this.submitted = false;
  //   if (address) {
  //     addressControl.setValue({
  //       street: address.street as string,
  //       city: address.city as string,
  //       state: address.state as string,
  //       zip: address.zip as string,
  //       country: address.country as string,
  //     });
  //     passwordGroupControl.reset();
  //   } else {
  //     form.reset();
  //     addressControl.patchValue({
  //       state: '',
  //       country: 'USA',
  //     });
  //   }
  // }

  // private setHasValueChanged(c: AbstractControl): void {
  //   if (!this.user.address) {
  //     this.hasValueChanged = true;
  //     return;
  //   }
  //   const controlValue = JSON.stringify(c.value).toLowerCase();
  //   const userNameValue = JSON.stringify(this.user.address).toLowerCase();
  //   this.hasValueChanged = controlValue === userNameValue ? false : true;
  // }

  // private showSuccess(): void {
  //   const notification = {
  //     textOrTpl: this.successTpl,
  //     className: 'bg-success text-light',
  //     delay: 10000,
  //   } as INotification;
  //   this.notificationService.show(notification);
  // }

  // private showDanger(): void {
  //   const notification = {
  //     textOrTpl: this.dangerTpl,
  //     className: 'bg-danger text-light',
  //     delay: 15000,
  //   } as INotification;
  //   this.notificationService.show(notification);
  // }

  // private saveUser(form: FormGroup): void {
  //   let updatedUser: IUser;
  //   if (this.user.address) {
  //     updatedUser = {
  //       ...this.user,
  //       address: {
  //         ...this.user.address,
  //         street: form.get('addressGroup.street').value as string,
  //         city: form.get('addressGroup.city').value as string,
  //         state: form.get('addressGroup.state').value as string,
  //         zip: form.get('addressGroup.zip').value as string,
  //         country: form.get('addressGroup.country').value as string,
  //       },
  //     } as IUser;
  //   } else {
  //     updatedUser = {
  //       ...this.user,
  //       address: {
  //         street: form.get('addressGroup.street').value as string,
  //         city: form.get('addressGroup.city').value as string,
  //         state: form.get('addressGroup.state').value as string,
  //         zip: form.get('addressGroup.zip').value as string,
  //         country: form.get('addressGroup.country').value as string,
  //       },
  //     } as IUser;
  //   }
  //   this.authService.saveUser(updatedUser).subscribe(
  //     (user) => {
  //       this.showSuccess();
  //       this.user = user;
  //       this.resetForm(form, user);
  //       this.loadingChange.emit(false);
  //     },
  //     (error) => {
  //       this.showDanger();
  //       this.loadingChange.emit(false);
  //     }
  //   );
  // }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
