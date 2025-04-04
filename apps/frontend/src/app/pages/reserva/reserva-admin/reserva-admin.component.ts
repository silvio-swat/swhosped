/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PaginatedReservaResult } from '../../../interfaces/reserva.interface'; 
import { ReservaAdminPesquisaComponent } from '../../../components/reserva/reserva-admin-pesquisa/reserva-admin-pesquisa.component';
import { ReservaAdminListComponent } from '../../../components/reserva/reserva-admin-list/reserva-admin-list.component';
import { ReservaService } from '../../../services/reserva.service'; 
import { NotificationService  } from '../../../../core/notifications/notification.service';

@Component({
  selector: 'app-reserva-admin',
  imports: [ButtonModule, CommonModule, ReservaAdminPesquisaComponent, ReservaAdminListComponent],
  templateUrl: './reserva-admin.component.html',
  styleUrl: './reserva-admin.component.css'
})
export class ReservaAdminComponent {
  reservaFiltradas: PaginatedReservaResult = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  };

  // Propriedade para armazenar os filtros atuais
  filtrosAtuais: any = {};  
  
  constructor(
    private reservaService: ReservaService,
    private notify: NotificationService    
  ) {}  

  aplicarFiltros(filtros: any) {
    console.log('teste para aplicar filtro de Reservas Admin');


    this.filtrosAtuais = filtros;  // Salva os filtros atuais    
    this.reservaService.buscarReservasAdmin(filtros).subscribe(
      (resultado) => {
        this.reservaFiltradas = resultado;
      },
      (error) => {
          //Exibe todas as mensagens de erro de validação do Backend
          if(error.error.message !== undefined && error.error.message.length > 0) {
            for(let i = 0; i < error.error.message.length; i++) {
              this.notify.notify('error', error.error.message[i]);
            }
          }
          // Exibe erro no console caso não seja erro de validação de campos
          console.error('Erro ao cadastrar usuário', error);        
        //console.error('Erro ao buscar acomodações:', erro);
      }
    );
  }  
}
