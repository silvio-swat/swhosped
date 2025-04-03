import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AcomodacaoResponse } from '../../../interfaces/acomodacao.interface';
import { Reserva } from '../../../interfaces/reserva.interface';
import { ReservaService } from '../../../services/reserva.service';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../services/backend.service';
import { NotificationService  } from '../../../../core/notifications/notification.service';
import { UserResponse } from '../../../interfaces/user-client.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    InputMaskModule,
    InputTextModule
  ],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaComponent implements OnInit {
  
  acomodacaoSelecionada!: AcomodacaoResponse;

  reserva = signal<Reserva>({
    id: 0,
    acomodacao: {} as AcomodacaoResponse,
    dataCheckIn: new Date(),
    dataCheckOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    valorTotal: 0,
    status: 'Confirmada',
    cliente: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      cpf: ''
    }
  });


  
  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  authService = inject(AuthService);  
  private imgPath: string;
  countImagens: number;  

  constructor(private backendSrv: BackendService,
    private notify: NotificationService
  ) {
    this.imgPath = this.backendSrv.getServerUrl();
    this.countImagens = 0;
  }  

  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setFullYear(this.minDate.getFullYear() + 1));

  async ngOnInit(): Promise<void> {
    await this.setUserData();
    // Recupera os dados de duas formas diferentes para garantir
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;

    if (state?.['acomodacaoSelecionada']) {
      this.acomodacaoSelecionada = state['acomodacaoSelecionada'];
      this.countImagens = this.acomodacaoSelecionada.imagens ? this.acomodacaoSelecionada.imagens?.length : 0;
      
      this.reserva.set({
        ...this.reserva(),
        acomodacao: this.acomodacaoSelecionada,
        valorTotal: this.acomodacaoSelecionada.precoPorNoite
      });
    } else {
      console.error('Nenhuma acomodação encontrada no estado da navegação');
      this.router.navigate(['/']);
    }
  }

  async setUserData() : Promise<void> {
    const usuario = this.authService.currentUser();
    if(usuario) {
      const userCliente = usuario.cliente;
      this.reserva.update(reservaAtual => ({
      ...reservaAtual,
      cliente: {
        ...reservaAtual.cliente,
        nomeCompleto: userCliente?.nomeCompleto ?? '',
        email: usuario?.email ?? '',
        telefone: userCliente?.telefone ?? '',
        cpf: userCliente?.cpf
      }
      }));
    }
  }

  calcularNoites(): number {
    const checkIn = this.reserva().dataCheckIn;
    const checkOut = this.reserva().dataCheckOut;
    // Verifica se ambas as datas existem e são válidas
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;
  
    // Cálculo preciso considerando horários
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24)); // Arredonda para cima qualquer fração de dia
  }
  
  calcularValorTotal(): void {
    console.log('teste acomodacao', this.acomodacaoSelecionada);
    if (!this.acomodacaoSelecionada) return;
  
    const noites = this.calcularNoites();
    const novoValor = noites * this.acomodacaoSelecionada.precoPorNoite;

    this.reserva.update(r => ({
      ...r,
      valorTotal: Number(novoValor.toFixed(2))
    }));
  }

activeImageIndex = 0; // Controla a imagem ativa no carrossel

// Método para navegar entre as imagens (opcional)
nextImage(): void {
  if (!this.acomodacaoSelecionada?.imagens?.length) return;
  
  this.activeImageIndex = 
    (this.activeImageIndex + 1) % this.acomodacaoSelecionada.imagens.length;
}

prevImage(): void {
  if (!this.acomodacaoSelecionada?.imagens?.length) return;
  
  this.activeImageIndex = 
    (this.activeImageIndex - 1 + this.acomodacaoSelecionada.imagens.length) % 
    this.acomodacaoSelecionada.imagens.length;
}

  formValido(): boolean {
    return (
      !!this.reserva().cliente.nomeCompleto &&
      !!this.reserva().cliente.email &&
      !!this.reserva().cliente.telefone &&
      !!this.reserva().cliente.cpf &&
      !!this.reserva().dataCheckIn &&
      !!this.reserva().dataCheckOut &&
      this.reserva().dataCheckIn < this.reserva().dataCheckOut
    );
  }

  onSubmit(): void {
    // Atualiza o cliente na reserva
    //this.reserva().cliente = this.cliente();
    
    this.reservaService.criarReserva(this.reserva()).subscribe({
      next: (reservaCriada) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Reserva realizada com sucesso!'
        });
        this.router.navigate(['/reserva-cliente']);
      },
      error: (error) => {
        //Exibe todas as mensagens de erro de validação do Backend
        if(Array.isArray(error.error.message) && error.error.message.length > 0) {
          for(let i = 0; i < error.error.message.length; i++) {
            this.notify.notify('error', error.error.message[i]);
          }
          return;
        }

        this.notify.notify('error', error.error.message);        
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/acomodacoes']);
  }

  // Método para retornar a URL correta da imagem
  getImageUrl(imagem: string | undefined): string {
    if (!imagem) return 'assets/imagem-padrao.jpg';
    // Verifica se a URL já é completa
    if (imagem.startsWith('http://') || imagem.startsWith('https://')) {
      return imagem;
    } else {
      return this.imgPath + imagem.replace('apps/backend', '');
    }
  } 
}