import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaFiltroAdminPesquisa } from '../../../interfaces/reserva.interface';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber'; // Adicione esta linha
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reserva-admin-pesquisa',
  imports: [
    CommonModule, 
    FormsModule, 
    DropdownModule, 
    InputNumberModule,
    CalendarModule,
    InputMaskModule,
    ButtonModule
  ],
  templateUrl: './reserva-admin-pesquisa.component.html',
  styleUrl: './reserva-admin-pesquisa.component.css'
})
export class ReservaAdminPesquisaComponent {
  filtro: ReservaFiltroAdminPesquisa = {};

  statusOptions = [
    { label: 'Confirmada', value: 'Confirmada' },
    { label: 'Cancelada', value: 'Cancelada' }
  ];  

  @Output() filtrosAlterados = new EventEmitter<ReservaFiltroAdminPesquisa>();

  aplicarFiltros() {
    this.filtrosAlterados.emit(this.filtro);
  }

  limparFiltros() {
    this.filtro = {};
    this.aplicarFiltros();
  }  
}
