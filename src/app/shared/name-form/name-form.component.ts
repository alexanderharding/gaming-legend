import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss'],
})
export class NameFormComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() user: IUser;
  @Output() nameMinLengthChange = new EventEmitter<number>();
  @Output() nameMaxLengthChange = new EventEmitter<number>();

  private readonly subscriptions: Subscription[] = [];
  private readonly nameMinLength = 3;
  private readonly nameMaxLength = 20;

  private firstNameValidationMessages = {
    required: 'Please enter your first name.',
    minlength: `First name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `First name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  firstNameMessage = this.firstNameValidationMessages['required'];

  private lastNameValidationMessages = {
    required: 'Please enter your last name.',
    minlength: `Last name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `Last name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  lastNameMessage = this.lastNameValidationMessages['required'];

  constructor() {}

  ngOnInit(): void {
    this.nameMinLengthChange.emit(this.nameMinLength);
    this.nameMaxLengthChange.emit(this.nameMaxLength);
    this.subscribeToControls();
    if (this.user) {
      this.setUserData(this.user);
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
    switch (name) {
      case 'firstName':
        this.firstNameMessage = '';
        if (c.errors) {
          this.firstNameMessage = Object.keys(c.errors)
            .map((key) => this.firstNameValidationMessages[key])
            .join(' ');
        }
        break;
      case 'lastName':
        this.lastNameMessage = '';
        if (c.errors) {
          this.lastNameMessage = Object.keys(c.errors)
            .map((key) => this.lastNameValidationMessages[key])
            .join(' ');
        }
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  private setUserData(user: IUser): void {
    this.parentForm.patchValue({
      nameGroup: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
