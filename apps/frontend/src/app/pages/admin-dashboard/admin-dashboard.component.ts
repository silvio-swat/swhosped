/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { AcomodacaoService } from '../../services/acomodacao.service';
import { PaginatedAcomodacaoResult } from '../../interfaces/acomodacao.interface'; // Importe sua interface
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AcomodacaoFiltrosPesquisaComponent } from '../../components/acomodacao/acomodacao-filtros-pesquisa/acomodacao-filtros-pesquisa.component';
import { AcomodacaoAdminListComponent } from '../../components/acomodacao/acomodacao-admin-list/acomodacao-admin-list.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AcomodacaoFiltrosPesquisaComponent,
    AcomodacaoAdminListComponent,
     RouterModule,
     ButtonModule,
     CommonModule,
     ToastModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
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
