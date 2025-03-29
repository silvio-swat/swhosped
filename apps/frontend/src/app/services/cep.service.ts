// cep.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ViaCepResponse } from '../interfaces/endereco.interface';

@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  buscarEndereco(cep: string): Observable<ViaCepResponse | null> {
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`${this.viaCepUrl}/${cep}/json`).pipe(
      map(dados => dados.erro ? null : dados),
      catchError(() => of(null))
    );
  }
}