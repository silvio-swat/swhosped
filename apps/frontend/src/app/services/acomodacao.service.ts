/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CreateAcomodacaoDto, 
  AcomodacaoResponse,
  TipoAcomodacao,
  StatusAcomodacao,
  PaginatedAcomodacaoResult
} from '../interfaces/acomodacao.interface';
import { apiLinks } from '../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class AcomodacaoService {
  // private apiUrl = apiLinks.devLocal +'api/acomodacaos';
  private apiUrl = apiLinks.devNetwork +'api/acomodacaos';

  constructor(private http: HttpClient) {}

  createAcomodacao(formData: FormData): Observable<AcomodacaoResponse> {
    // Debug: Mostra todo o conteúdo do FormData
    formData.forEach((value, key) => {
      console.log(`Chave: ${key}`, `Valor: ${value}`, `Tipo: ${typeof value}`);
    });
    return this.http.post<AcomodacaoResponse>(this.apiUrl, formData);
  }

  buscarAcomodacoesComFiltros(filtros: any): Observable<PaginatedAcomodacaoResult> {
    let params = new HttpParams();
    Object.keys(filtros).forEach((chave) => {
      if (filtros[chave]) {
        params = params.append(chave, filtros[chave]);
      }
    });

    return this.http.get<PaginatedAcomodacaoResult>(this.apiUrl, { params });
  }  

  getAcomodacaoById(id: number): Observable<AcomodacaoResponse> {
    return this.http.get<AcomodacaoResponse>(`${this.apiUrl}/${id}`);
  }

  updateAcomodacao(id: number, data: Partial<CreateAcomodacaoDto>): Observable<AcomodacaoResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.patch<AcomodacaoResponse>(`${this.apiUrl}/${id}`, data, { headers });
  }

  deleteAcomodacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listAcomodacoes(): Observable<AcomodacaoResponse[]> {
    return this.http.get<AcomodacaoResponse[]>(this.apiUrl);
  }

  // Novo método para buscar acomodações disponíveis
  buscarDisponiveis(): Observable<AcomodacaoResponse[]> {
    const params = new HttpParams()
      .set('status', StatusAcomodacao.DISPONIVEL)
      .set('sort', 'precoPorNoite,asc'); // Ordena por preço crescente

    return this.http.get<AcomodacaoResponse[]>(this.apiUrl, { params });
  }

  // Métodos para obter os enums podem ser úteis para os dropdowns
  getTiposAcomodacao(): TipoAcomodacao[] {
    return Object.values(TipoAcomodacao);
  }

  getStatusAcomodacao(): StatusAcomodacao[] {
    return Object.values(StatusAcomodacao);
  }
}