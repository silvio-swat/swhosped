/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PaginatedAcomodacaoResult } from '../../interfaces/acomodacao.interface'; // Importe sua interface
import { AcomodacaoFiltrosPesquisaComponent } from '../../components/acomodacao/acomodacao-filtros-pesquisa/acomodacao-filtros-pesquisa.component';
import { AcomodacaoListComponent } from '../../components/acomodacao/acomodacao-list/acomodacao-list.component';
import { AcomodacaoService } from '../../services/acomodacao.service';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CommonModule, AcomodacaoFiltrosPesquisaComponent, AcomodacaoListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  acomodacoesFiltradas: PaginatedAcomodacaoResult = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  };  

  // Propriedade para armazenar os filtros atuais
  filtrosAtuais: any = {};  
  
  constructor(private acomodacaoService: AcomodacaoService) {}  

  aplicarFiltros(filtros: any) {
    this.filtrosAtuais = filtros;  // Salva os filtros atuais    
    this.acomodacaoService.buscarAcomodacoesComFiltros(filtros).subscribe(
      (resultado) => {
        this.acomodacoesFiltradas = resultado;
      },
      (erro) => {
        console.error('Erro ao buscar acomodações:', erro);
      }
    );
  }
}
