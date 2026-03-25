import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ToNumberPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    if (typeof value === 'number') {
      return value;
    }

    // Convert the value to a number
    const parsedValue = Number(value);

    // Check if the conversion resulted in a valid number
    if (isNaN(parsedValue)) {
      throw new BadRequestException('Validation failed (numeric value is expected)');
    }

    return parsedValue;
  }
}
