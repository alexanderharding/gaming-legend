import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (value === undefined || value === null || value.length === 0) {
      return value;
    }
    const words = value.split(' ');
    const capitalizedWords = [];
    words.forEach((w) =>
      capitalizedWords.push(
        w[0].toUpperCase() + w.slice(1, w.length).toLowerCase()
      )
    );
    return capitalizedWords.join(' ');
  }
}
