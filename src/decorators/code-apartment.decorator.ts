import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCodeApartment(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsCodeApartment',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const hasSpace = value.trim().includes(' ');
          return !hasSpace;
        },
      },
    });
  };
}
