/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
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
  imgPath: string;

  constructor(private http: HttpClient,
              private backendSrv: BackendService
  ) {
    this.imgPath = this.backendSrv.getServerUrl();
  }

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

  updateAcomodacao(id: number, formData: FormData): Observable<AcomodacaoResponse> {
    return this.http.patch<AcomodacaoResponse>(`${this.apiUrl}/${id}`, formData);
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

  // Método para retornar a URL correta da imagem
  getImageUrl(acomodacao: AcomodacaoResponse): string {
    if (acomodacao.imagens && acomodacao.imagens.length > 0) {
      const first = acomodacao.imagens[0];
      // Verifica se a URL já é completa
      if (first.startsWith('http://') || first.startsWith('https://')) {
        return first;
      } else {
        return this.imgPath + first.replace('apps/backend', '');
      }
    }
    return 'assets/imagem-padrao.jpg';
  }   

  // Método para retornar a URL correta da imagem
  getArrayImageUrl(acomodacao: AcomodacaoResponse): any {
    const imgLinks = [];
    if (acomodacao.imagens && acomodacao.imagens.length > 0) {
      for(let i = 0; i < acomodacao.imagens.length; i++){
        const first = acomodacao.imagens[i];
        // Verifica se a URL já é completa
        if (first.startsWith('http://') || first.startsWith('https://')) {
          imgLinks.push(first);
        } else {
          const linkConcatenado =  this.imgPath + first.replace('apps/backend/', '');
          imgLinks.push(linkConcatenado);
        }
      }
      return imgLinks;
    }
    return [];
  }     

  // Dentro da classe AcomodacaoService
  getEnderecoCompleto(acomodacao: AcomodacaoResponse): string {
    if(!acomodacao) {
      return '';
    }
    // Monta o endereço com tipo de logradouro, logradouro, número e, se existir, o complemento
    let endereco = `${acomodacao.tipoLogradouro} ${acomodacao.logradouro}, ${acomodacao.numero}`;
    if (acomodacao.complemento && acomodacao.complemento.trim() !== '') {
      endereco += `, ${acomodacao.complemento}`;
    }
    // Acrescenta bairro, cidade, estado e CEP
    endereco += ` - ${acomodacao.bairro}, ${acomodacao.cidade} - ${acomodacao.estado}, CEP: ${acomodacao.cep}`;
    return endereco;
  }  
}

// acomodacao-state.service.ts
import { BehaviorSubject } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({ providedIn: 'root' })
export class AcomodacaoStateService {
  private acomodacaoParaEdicao = new BehaviorSubject<any>(null);
  currentAcomodacao = this.acomodacaoParaEdicao.asObservable();

  setAcomodacaoParaEdicao(acomodacao: any) {
    this.acomodacaoParaEdicao.next(acomodacao);
  }

  clearAcomodacao() {
    this.acomodacaoParaEdicao.next(null); // Limpa o estado
  }

}