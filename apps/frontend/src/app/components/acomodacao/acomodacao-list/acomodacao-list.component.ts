/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AcomodacaoService } from '../../../services/acomodacao.service';
import { AcomodacaoResponse, FiltroAcomodacao, PaginatedAcomodacaoResult } from '../../../interfaces/acomodacao.interface';
import { apiLinks } from '../../../shared/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-acomodacao-list',
  imports: [ButtonModule, CommonModule],
  templateUrl: './acomodacao-list.component.html',
  standalone: true,
})
export class AcomodacaoListComponent implements OnInit{
  @Input() filtro: FiltroAcomodacao = {};
  @Input() acomodacoes!: PaginatedAcomodacaoResult;
  imgPath: string;
  private router = inject(Router); // Injeção alternativa

  constructor(private acomodacaoService: AcomodacaoService
  ) {
    this.imgPath = apiLinks.mainUrl;
  }

  ngOnInit(): void {
    this.buscarAcomodacoes(this.filtro, 0);
  }

  buscarAcomodacoes(filtros: FiltroAcomodacao, currentPage: number): void {
    // Altera a página atual e faz uma nova query
    filtros.page = currentPage > 0 ? currentPage : filtros.page;
    filtros.isPublic = "true";

    this.acomodacaoService.buscarAcomodacoesComFiltros(filtros).subscribe(
      (resultado) => {
        this.acomodacoes = resultado;
      },
      (erro) => {
        console.error('Erro ao buscar acomodações:', erro);
      }
    );
  }

  // Navegar para a próxima página
  proximaPagina(): void {
    if (this.acomodacoes.currentPage < this.acomodacoes.totalPages) {
      this.acomodacoes.currentPage++;

      console.log('teste current page', this.acomodacoes.currentPage );
      console.log('teste current acomodacoes', this.acomodacoes);
      this.buscarAcomodacoes(this.filtro, this.acomodacoes.currentPage);
    }
  }

  // Navegar para a página anterior
  paginaAnterior(): void {
    if (this.acomodacoes.currentPage > 1) {
      this.acomodacoes.currentPage--;
      this.buscarAcomodacoes(this.filtro, this.acomodacoes.currentPage);
    }
  }

  // TrackBy function to optimize *ngFor
  trackById(index: number, item: AcomodacaoResponse): number {
    return item.id;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }  

  // Retorna um array de números para iterar os botões de página
  get pages(): number[] {
    return Array.from({ length: this.acomodacoes.totalPages }, (_, i) => i + 1);
  }  

  mudarPagina(page: number): void {
    if (page >= 1 && page <= this.acomodacoes.totalPages) {
      this.buscarAcomodacoes(this.filtro, page);
    }
  }  

  // Método para retornar a URL correta da imagem
  getImageUrl(acomodacao: AcomodacaoResponse): string {
    return this.acomodacaoService.getImageUrl(acomodacao);
  } 
  
  reservar(acomodacao: AcomodacaoResponse) {
    console.log('Dados enviados:', acomodacao); // Verifique no console
    this.router.navigate(['/reservar'], {
      state: { 
        acomodacaoSelecionada: acomodacao 
      }
    });
  }

  obterEnderecoCompleto(acomodacao: AcomodacaoResponse): string {
    return this.acomodacaoService.getEnderecoCompleto(acomodacao);
  }    
}
