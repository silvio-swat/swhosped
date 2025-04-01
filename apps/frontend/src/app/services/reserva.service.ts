/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../interfaces/reserva.interface';
import { apiLinks } from '../shared/environment';
import { PaginatedReservaResult } from '../interfaces/reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
private apiUrl = apiLinks.devNetwork +'api/reservas';

  constructor(private http: HttpClient) {}

  criarReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  buscarReservaPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  listarReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  buscarReservasComFiltros(filtros: any): Observable<PaginatedReservaResult> {
    let params = new HttpParams();
    Object.keys(filtros).forEach((chave) => {
      if (filtros[chave]) {
        params = params.append(chave, filtros[chave]);
      }
    });

    return this.http.get<PaginatedReservaResult>(this.apiUrl, { params });
  }    

  // ... outros métodos existentes ...

  /**
   * Cancela uma reserva pelo ID
   * @param id ID da reserva a ser cancelada
   * @returns Observable com a reserva atualizada
   */
  cancelarReserva(id: number): Observable<Reserva> {
    // PATCH para cancelar a reserva
    return this.http.patch<Reserva>(`${this.apiUrl}/${id}/cancelar`, {});
  }

}