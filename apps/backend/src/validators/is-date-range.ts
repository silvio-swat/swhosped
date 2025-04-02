/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  
  export function IsDateRange(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name: 'isDateRange',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const { dataInicio, dataFim } = args.object as any;
            return (
              (dataInicio && dataFim) || (!dataInicio && !dataFim)
            );
          },
          defaultMessage(args: ValidationArguments) {
            return 'Os campos dataInicio e dataFim devem ser fornecidos juntos.';
          },
        },
      });
    };
  }
  