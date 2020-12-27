import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordChecker(password: string): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.pristine || !c.value) {
      return null;
    }

    if (c.value.toString() === password) {
      return null;
    }

    return { invalid: true };
  };
}

// export function passwordChecker(
//   c: AbstractControl
// ): { [key: string]: boolean } | null {
//   const value = c.value?.toString() as string;
//   const withinRange = /^\w{8,16}$/.test(value);

//   if (c.pristine || !value || !withinRange) {
//     return null;
//   }

//   /* What we DO want */
//   const hasNumber = /\d/.test(value);
//   const hasUpper = /[A-Z]/.test(value);
//   const hasLower = /[a-z]/.test(value);
//   const hasSpecial = /\W/.test(value);

//   /* What we DON'T want */
//   const hasNoWhiteSpace = !/\s/.test(value);
//   const hasNoBracket = !/(<|>)/.test(value);

//   const valid =
//     hasNumber &&
//     hasUpper &&
//     hasLower &&
//     hasNoWhiteSpace &&
//     hasSpecial &&
//     hasNoBracket;

//   if (valid) {
//     return null;
//   }

//   return { strong: true };
// }
