/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PaginatedReservaResult } from '../../../interfaces/reserva.interface'; 
import { ReservaClientePesquisaComponent } from '../../../components/reserva/reserva-cliente-pesquisa/reserva-cliente-pesquisa.component';
import { ReservaClienteListComponent } from '../../../components/reserva/reserva-cliente-list/reserva-cliente-list.component'; 
import { ReservaService } from '../../../services/reserva.service'; 
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reserva-cliente',
  imports: [ButtonModule, CommonModule, ReservaClientePesquisaComponent, ReservaClienteListComponent],
  templateUrl: './reserva-cliente.component.html',
  styleUrl: './reserva-cliente.component.css'
})
export class ReservaClienteComponent implements OnInit{
  authService = inject(AuthService);

  reservaFiltradas: PaginatedReservaResult = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  };

  // Propriedade para armazenar os filtros atuais
  filtrosAtuais: any = {};
  constructor(private reservaService: ReservaService) {}    

  async ngOnInit(): Promise<void> {
    await this.setUserData();
  }  

  async setUserData() : Promise<void> {
    const usuario = this.authService.currentUser();
    if(usuario) {
      const filtros = {
        'email' : usuario?.email ?? ""
      };
      this.aplicarFiltros(filtros);
    }
  }

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

  getisUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }  
}
