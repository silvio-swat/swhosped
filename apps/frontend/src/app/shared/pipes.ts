// cep.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cep' })
export class CepPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return `${value.substr(0, 5)}-${value.substr(5, 3)}`;
  }
}

// cpf.pipe.ts
@Pipe({ name: 'cpf' })
export class CpfPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return `${value.substr(0, 3)}.${value.substr(3, 3)}.${value.substr(6, 3)}-${value.substr(9, 2)}`;
  }
}

// telefone.pipe.ts
@Pipe({ name: 'telefone' })
export class TelefonePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    if (value.length === 11) {
      return `(${value.substr(0, 2)}) ${value.substr(2, 5)}-${value.substr(7, 4)}`;
    }
    return value;
  }
}