import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';

import { UserName } from 'src/app/types/user-name';

@Component({
  selector: 'ctacu-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss'],
})
export class NameFormComponent implements OnInit, OnDestroy {
  readonly defaultPageTitle = 'Full Name';

  @Input() pageTitle: string;
  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;

  @Input() userName: UserName;

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
  firstNameMessage = this.firstNameValidationMessages['required'];

  private readonly lastNameValidationMessages = {
    required: 'Please enter a last name.',
    minlength: `Last name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `Last name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  lastNameMessage = this.lastNameValidationMessages['required'];

  constructor(
    private readonly formValidationRuleService: FormValidationRuleService
  ) {}

  ngOnInit(): void {
    this.subscribeToControls();
    // <<<<<<< HEAD
    //     if (this.user) {
    //       this.setUserData(this.user.name);
    // =======
    //     if (this.userName) {
    //       this.setUserData(this.userName);
    // >>>>>>> d3681987011335de47ee7adcccf667b533c089df
    //     }
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

  private setUserData(name: UserName): void {
    const nameControl = this.parentForm.get('nameGroup');
    nameControl.setValue({
      firstName: name.firstName,
      lastName: name.lastName,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
