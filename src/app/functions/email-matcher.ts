import { AbstractControl } from '@angular/forms';

export function emailMatcher(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (!emailControl.value || !confirmControl.value) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true };
}
