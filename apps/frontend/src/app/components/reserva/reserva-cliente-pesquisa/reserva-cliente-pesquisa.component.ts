import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaFiltroPesquisa } from '../../../interfaces/reserva.interface';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber'; // Adicione esta linha
import { InputMaskModule } from 'primeng/inputmask';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reserva-cliente-pesquisa',
  imports: [CommonModule, FormsModule, DropdownModule, InputNumberModule, InputMaskModule ],
  standalone: true,
  templateUrl: './reserva-cliente-pesquisa.component.html',
  styleUrl: './reserva-cliente-pesquisa.component.css'
})
export class ReservaClientePesquisaComponent {
  filtro: ReservaFiltroPesquisa = {};

  @Output() filtrosAlterados = new EventEmitter<ReservaFiltroPesquisa>();
  
  constructor(private authService: AuthService) {}  

  aplicarFiltros() {
    this.filtrosAlterados.emit(this.filtro);
  }

  get isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }  
}
 