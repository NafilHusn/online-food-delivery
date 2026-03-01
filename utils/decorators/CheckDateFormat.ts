import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isDate } from 'date-fns';

@ValidatorConstraint({ async: false })
class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(date: unknown, args: ValidationArguments) {
    const [optional] = args.constraints as [boolean?];
    if (isDate(date)) return true;
    if (optional && (date === null || date === undefined || date === '')) {
      return true;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return typeof date === 'string' && dateRegex.test(date);
  }
}

export function CheckDateFormat(
  optional = false,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [optional],
      validator: IsDateFormatConstraint,
    });
  };
}
