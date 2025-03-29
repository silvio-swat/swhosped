import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroAcomodacao } from './../../interfaces/acomodacao.interface';

@Component({
  selector: 'app-acomodacao-filtros-pesquisa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acomodacao-filtros-pesquisa.component.html',
  styleUrl: './acomodacao-filtros-pesquisa.component.css'
})
export class AcomodacaoFiltrosPesquisaComponent {
  filtro: FiltroAcomodacao = {};
  tiposAcomodacao: string[] = ['Casa', 'Apartamento', 'Hotel']; // Exemplo de tipos de acomodação

  @Output() filtrosAlterados = new EventEmitter<FiltroAcomodacao>();

  aplicarFiltros() {
    this.filtrosAlterados.emit(this.filtro);
  }
}