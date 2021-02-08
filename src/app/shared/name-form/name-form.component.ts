import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

import { UserName } from 'src/app/types/user-name';

@Component({
  selector: 'ctacu-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameFormComponent implements OnInit, OnDestroy {
  readonly defaultPageTitle = 'Full Name';

  @Input() pageTitle: string;
  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;

  @Input() user: IUser;

  private readonly subscriptions: Subscription[] = [];

  private readonly nameMinLength = this.formValidationRuleService.nameMinLength;
  private readonly nameMaxLength = this.formValidationRuleService.nameMaxLength;

  private readonly firstNameValidationMessages = {
    required: 'Please enter a first name.',
    minlength: `First name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `First name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  private readonly firstNameMessageSubject = new BehaviorSubject<string>(
    this.firstNameValidationMessages.required
  );
  readonly firstNameMessage$ = this.firstNameMessageSubject.asObservable();

  private readonly lastNameValidationMessages = {
    required: 'Please enter a last name.',
    minlength: `Last name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `Last name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  private readonly lastNameMessageSubject = new BehaviorSubject<string>(
    this.lastNameValidationMessages.required
  );
  readonly lastNameMessage$ = this.lastNameMessageSubject.asObservable();

  constructor(
    private readonly formValidationRuleService: FormValidationRuleService
  ) {}

  ngOnInit(): void {
    this.subscribeToControls();
    if (this.user) {
      this.setUserData(this.user.name);
    }
  }

  private subscribeToControls(): void {
    const firstNameControl = this.parentForm.get('nameGroup.firstName');
    this.subscriptions.push(
      firstNameControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(firstNameControl, 'firstName'))
    );
    const lastNameControl = this.parentForm.get('nameGroup.lastName');
    this.subscriptions.push(
      lastNameControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(lastNameControl, 'lastName'))
    );
  }

  private setMessage(c: AbstractControl, name: string): void {
    let message = '';
    switch (name) {
      case 'firstName':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.firstNameValidationMessages[key])
            .join(' ');
        }
        this.firstNameMessageSubject.next(message);
        break;
      case 'lastName':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.lastNameValidationMessages[key])
            .join(' ');
        }
        this.lastNameMessageSubject.next(message);
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  private setUserData(name: UserName): void {
    const nameGroupControl = this.parentForm.get('nameGroup');
    nameGroupControl.setValue({
      firstName: name.firstName,
      lastName: name.lastName,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
