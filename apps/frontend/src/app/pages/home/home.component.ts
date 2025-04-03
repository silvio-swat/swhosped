/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PaginatedAcomodacaoResult } from '../../interfaces/acomodacao.interface'; // Importe sua interface
import { AcomodacaoFiltrosPesquisaComponent } from '../../components/acomodacao/acomodacao-filtros-pesquisa/acomodacao-filtros-pesquisa.component';
import { AcomodacaoListComponent } from '../../components/acomodacao/acomodacao-list/acomodacao-list.component';
import { AcomodacaoService } from '../../services/acomodacao.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CommonModule, RouterModule, AcomodacaoFiltrosPesquisaComponent, AcomodacaoListComponent],
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
  authService    = inject(AuthService);  
  private notify = inject(NotificationService);  
  
  constructor(private acomodacaoService: AcomodacaoService) {}  

  aplicarFiltros(filtros: any) {
    this.filtrosAtuais = filtros;  // Salva os filtros atuais    
    this.acomodacaoService.buscarAcomodacoesComFiltros(filtros).subscribe(
      (resultado) => {
        this.acomodacoesFiltradas = resultado;
      },
      (error) => {
        //Exibe todas as mensagens de erro de validação do Backend
        if(Array.isArray(error.error.message) && error.error.message.length > 0) {
          for(let i = 0; i < error.error.message.length; i++) {
            this.notify.notify('error', 'Erro ao Carregar Acomodações. ' +  error.error.message[i]);
          }
          return;
        }
        this.notify.notify('error','Erro ao Carregar Acomodações. ' +  error.error.message); 
      }
    );
  }
}
