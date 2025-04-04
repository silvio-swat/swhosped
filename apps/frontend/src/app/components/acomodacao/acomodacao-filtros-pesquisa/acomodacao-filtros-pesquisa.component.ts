import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroAcomodacao } from '../../../interfaces/acomodacao.interface';
import { GlobalParamsService } from '../../../shared/global-params/global-params.service'; // Ajuste o caminho conforme sua estrutura
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-acomodacao-filtros-pesquisa',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './acomodacao-filtros-pesquisa.component.html',
  styleUrl: './acomodacao-filtros-pesquisa.component.css'
})
export class AcomodacaoFiltrosPesquisaComponent {
  filtro: FiltroAcomodacao = {};
  estadosBrasil: string[] = [];  
  tiposAcomodacao: string[] = ['Casa', 'Apartamento', 'Quarto de Hotel']; // Exemplo de tipos de acomodação


  constructor(private globalParamsSrv: GlobalParamsService) {
    this.estadosBrasil = this.globalParamsSrv.estadosBrasil;
  }  

  @Output() filtrosAlterados = new EventEmitter<FiltroAcomodacao>();

  aplicarFiltros() {
    this.filtrosAlterados.emit(this.filtro);
  }
}