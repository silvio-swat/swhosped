/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PaginatedReservaResult, ReservaFiltroPesquisa } from '../../interfaces/reserva.interface'; 
import { ReservaClientePesquisaComponent } from '../../components/reserva/reserva-cliente-pesquisa/reserva-cliente-pesquisa.component';
import { ReservaClienteListComponent } from '../../components/reserva/reserva-cliente-list/reserva-cliente-list.component'; 
import { ReservaService } from '../../services/reserva.service'; 

@Component({
  selector: 'app-reserva-cliente',
  imports: [ButtonModule, CommonModule, ReservaClientePesquisaComponent, ReservaClienteListComponent],
  templateUrl: './reserva-cliente.component.html',
  styleUrl: './reserva-cliente.component.css'
})
export class ReservaClienteComponent {
  reservaFiltradas: PaginatedReservaResult = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  };

  // Propriedade para armazenar os filtros atuais
  filtrosAtuais: any = {};  
  
  constructor(private reservaService: ReservaService) {}  

  aplicarFiltros(filtros: any) {
    this.filtrosAtuais = filtros;  // Salva os filtros atuais    
    this.reservaService.buscarReservasCliente(filtros).subscribe(
      (resultado) => {
        this.reservaFiltradas = resultado;
      },
      (erro) => {
        console.error('Erro ao buscar acomodações:', erro);
      }
    );
  }  
}
