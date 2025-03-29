/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AcomodacaoResponse, TipoAcomodacao, StatusAcomodacao } from '../../interfaces/acomodacao.interface'; // Importe sua interface
import { AcomodacaoFiltrosPesquisaComponent } from '../../components/acomodacao-filtros-pesquisa/acomodacao-filtros-pesquisa.component';
import { AcomodacaoListComponent } from '../../components/acomodacao-list/acomodacao-list.component';
import { AcomodacaoService } from '../../services/acomodacao.service';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CommonModule, AcomodacaoFiltrosPesquisaComponent, AcomodacaoListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  acomodaçõesFiltradas: AcomodacaoResponse[] = [];
  
  constructor(private acomodacaoService: AcomodacaoService) {}  

  aplicarFiltros(filtros: any) {
    this.acomodacaoService.buscarAcomodacoesComFiltros(filtros).subscribe(
      (resultado) => {
        this.acomodaçõesFiltradas = resultado;
      },
      (erro) => {
        console.error('Erro ao buscar acomodações:', erro);
      }
    );
  }
}
