/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { Reserva, PaginatedReservaResult, ReservaFiltroAdminPesquisa } from '../../../interfaces/reserva.interface'
import { apiLinks } from '../../../shared/environment';
import { ReservaService } from '../../../services/reserva.service';
import { NotificationService } from '../../../../core/notifications/notification.service';
// No seu componente (reserva-cliente-list.component.ts)
import { provideNgxMask } from 'ngx-mask';
import { TelefonePipe } from './../../../shared/pipes'; // ajuste o caminho
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-reserva-admin-list',
  imports: [CommonModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    //CepPipe,
    TelefonePipe],
  providers: [provideNgxMask(), ConfirmationService],
  templateUrl: './reserva-admin-list.component.html',
  styleUrl: './reserva-admin-list.component.css'
})
export class ReservaAdminListComponent implements OnInit  {
  @Input() reservas!: PaginatedReservaResult;
  @Input() filtro: ReservaFiltroAdminPesquisa = {};

  private router = inject(Router);
  private reservaService = inject(ReservaService);
  private notify = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.carregarReservas(1);
  }

  // Obtém a URL da imagem da acomodação
  getAcomodacaoImageUrl(acomodacao: any): string {
    if (acomodacao.imagens && acomodacao.imagens.length > 0) {
      const firstImage = acomodacao.imagens[0];
      if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
        return firstImage;
      }
      return apiLinks.mainUrl + firstImage.replace('apps/backend', '');
    }
    return 'assets/default-accommodation.jpg';
  }

  // Navega para a próxima página
  proximaPagina(): void {
    if (this.reservas.currentPage < this.reservas.totalPages) {
      this.reservas.currentPage++;
      this.carregarReservas(this.reservas.currentPage);
    }
  }

  // Navega para a página anterior
  paginaAnterior(): void {
    if (this.reservas.currentPage > 1) {
      this.reservas.currentPage--;
      this.carregarReservas(this.reservas.currentPage);
    }
  }

  // Muda para uma página específica
  mudarPagina(page: number): void {
    if (page >= 1 && page <= this.reservas.totalPages) {
      this.carregarReservas(page);
    }
  }

  // Carrega as reservas para a página especificada
  private carregarReservas(page: number): void {
    this.filtro.page = page;
    this.reservaService.buscarReservasAdmin(this.filtro).subscribe({
      next: (reservas) => this.reservas = reservas,
      error: (err) => console.error('Erro ao carregar reservas:', err)
    });
  }

  // Gera o array de páginas para a paginação
  get pages(): number[] {
    return Array.from({ length: this.reservas.totalPages }, (_, i) => i + 1);
  }

  // Visualiza detalhes da reserva
  verDetalhes(reserva: Reserva): void {
    this.router.navigate(['/reservas', reserva.id]);
  }

  // Método para confirmar o cancelamento
  confirmarCancelamento(reserva: Reserva): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja cancelar esta reserva?',
      header: 'Confirmar Cancelamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      accept: () => {
        this.cancelarReserva(reserva);
      }
    });
  }

  // Método para cancelar a reserva
  cancelarReserva(reserva: Reserva): void {
    this.reservaService.cancelarReserva(reserva.id).subscribe({
      next: (reservaAtualizada) => {
        const index = this.reservas.data.findIndex(r => r.id === reserva.id);
        if (index !== -1) {
          this.reservas.data[index] = reservaAtualizada;
        }
        this.notify.notify('success', 'Reserva cancelada com sucesso');
      },
      error: (err) => {
        console.error('Erro ao cancelar reserva:', err);
        this.notify.notify('error', 'Não foi possível cancelar a reserva');
      }
    });
  }

}
