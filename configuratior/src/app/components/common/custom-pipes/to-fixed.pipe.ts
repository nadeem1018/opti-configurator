import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    switch (args) {
      case "3": {
        return parseFloat(value).toFixed(3);
        break;
      }
      case "2": {
        return parseFloat(value).toFixed(2);
        break;
      }
      case "4": {
        return parseFloat(value).toFixed(4);
        break;
      }
      default: {
        return parseFloat(value).toFixed(3);
        break;
      }

    }

  }

}
