import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToSpaces',
})
export class ConvertToSpacesPipe implements PipeTransform {
  transform(value: string, character: string): string {
    if (value === undefined || value === null || value.length === 0) {
      return value;
    }
    if (
      character === undefined ||
      character === null ||
      character.length === 0
    ) {
      return value;
    }
    return value.replace(character, ' ');
  }
}
