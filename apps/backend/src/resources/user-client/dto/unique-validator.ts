/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    registerDecorator, 
    ValidationOptions, 
    ValidationArguments, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
  } from 'class-validator';
  import { EntityManager } from '@mikro-orm/core';
  import { Injectable } from '@nestjs/common';
  
  @ValidatorConstraint({ name: 'IsUnique', async: true })
  @Injectable()
  export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly em: EntityManager) {}
  
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        // Tenta usar o EntityManager injetado, se não houver, usa o que foi passado no DTO
        const em = this.em || (args.object as any).em;
        if (!em) {
          throw new Error('EntityManager não disponível');
        }
        const [entity, field] = args.constraints;
        const exists = await em.findOne(entity, { [field]: value });
        return !exists;
      }
  
    defaultMessage(args: ValidationArguments): string {
      return `${args.property} já está em uso`;
    }
  }
  
  export function IsUnique(
    entity: any,
    field: string,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name: 'IsUnique',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [entity, field],
        options: validationOptions,
        validator: IsUniqueConstraint,
      });
    };
  }