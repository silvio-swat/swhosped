/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AcomodacaoService, AcomodacaoStateService } from '../../../services/acomodacao.service';
import { AcomodacaoResponse, FiltroAcomodacao, PaginatedAcomodacaoResult } from '../../../interfaces/acomodacao.interface';
import { apiLinks } from '../../../shared/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-acomodacao-admin-list',
  imports: [ButtonModule, CommonModule, ConfirmDialogModule],
  templateUrl: './acomodacao-admin-list.component.html',
  providers: [ConfirmationService],  
  styleUrl: './acomodacao-admin-list.component.css'
})
export class AcomodacaoAdminListComponent implements OnInit {
  @Input() filtro: FiltroAcomodacao = {};
  @Input() acomodacoes!: PaginatedAcomodacaoResult;
  imgPath: string;
  private router = inject(Router); // Injeção alternativa
  private confirmationService = inject(ConfirmationService);

  constructor(private acomodacaoService: AcomodacaoService,
              private acomodacaoState: AcomodacaoStateService,
              private notify: NotificationService
  ) {
    this.imgPath = apiLinks.mainUrl;
  }

  ngOnInit(): void {
    this.buscarAcomodacoes(this.filtro, 0);
  }

  buscarAcomodacoes(filtros: FiltroAcomodacao, currentPage: number): void {
    // Altera a página atual e faz uma nova query
    console.log('buscarAcomodacoes currentPage', currentPage);
    console.log('buscarAcomodacoes filtros', filtros);
    filtros.page = currentPage > 0 ? currentPage : filtros.page;

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

  editarAcomodacao(acomodacao: any) {

    this.acomodacaoState.setAcomodacaoParaEdicao(acomodacao);
    this.router.navigate(['admin/acomodacoes/editar']);    
  }
  
  deleteAcomodacao(acomodacaoId: number): void {
      // Adiciona os dados do formulário
      this.acomodacaoService.deleteAcomodacao(acomodacaoId).subscribe({
        next: () => {
        // Atualiza a lista local mantendo a imutabilidade
        this.acomodacoes = {
          ...this.acomodacoes,
          data: this.acomodacoes.data.filter(a => a.id !== acomodacaoId),
          totalItems: this.acomodacoes.totalItems - 1
        };
        
        this.notify.notify('success', 'Acomodação removida com sucesso!');
        
        // Se a página ficou vazia e não é a primeira, volta uma página
        if (this.acomodacoes.data.length === 0 && this.acomodacoes.currentPage > 1) {
          this.paginaAnterior();
        }
      },
      error: (error) => {
        //Exibe todas as mensagens de erro de validação do Backend
        if(Array.isArray(error.error.message) && error.error.message.length > 0) {
          for(let i = 0; i < error.error.message.length; i++) {
            this.notify.notify('error', error.error.message[i]);
          }
        }
        this.notify.notify('error', error.error.message);    
      }
    });
  }  

  // Método para confirmar o cancelamento
  confirmDeleteAcomodacao(acomodacaoId: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir a acomodacao?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteAcomodacao(acomodacaoId);
      }
    });
  }  
  
  obterEnderecoCompleto(acomodacao: AcomodacaoResponse): string {
    return this.acomodacaoService.getEnderecoCompleto(acomodacao);
  }
   
}
