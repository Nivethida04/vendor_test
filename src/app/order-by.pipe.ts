import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], key: string, reverse: boolean = false): any[] {
    if (!array || !key) return array;

    return [...array].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return reverse ? 1 : -1;
      if (aValue > bValue) return reverse ? -1 : 1;
      return 0;
    });
  }

}
