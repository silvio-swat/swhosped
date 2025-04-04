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
import { Router } from '@angular/router';
import { NotificationService  } from '../../../../core/notifications/notification.service';
import { AuthService } from '../../../services/auth.service';
import { MapaComponent } from '../../../components/mapa/mapa.component';
import { AcomodacaoService } from '../../../services/acomodacao.service';
import { apiLinks } from '../../../shared/environment';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    InputMaskModule,
    InputTextModule,
    MapaComponent
  ],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent implements OnInit {
  
  acomodacaoSelecionada!: AcomodacaoResponse;
  enderecoCompleto = '';

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

  constructor(private notify: NotificationService,
    private acomodacaoSrv: AcomodacaoService
  ) {
    this.imgPath = apiLinks.mainUrl;
    this.countImagens = 0;
  }  

  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setFullYear(this.minDate.getFullYear() + 1));
  latitude  = 0;
  longitude = 0;

  async ngOnInit(): Promise<void> {
    await this.setUserData();
    // Recupera os dados de duas formas diferentes para garantir
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;
    this.checkIfUserIsLogedIn();
    
    
    if (state?.['acomodacaoSelecionada']) {
      this.acomodacaoSelecionada = state['acomodacaoSelecionada'];
      this.enderecoCompleto = this.acomodacaoSrv.getEnderecoCompleto(this.acomodacaoSelecionada);
      this.countImagens = this.acomodacaoSelecionada.imagens ? this.acomodacaoSelecionada.imagens?.length : 0;
      
      // CONVERTE LATITUDE E LONGITUDE PARA NÚMERO (SE NECESSÁRIO)
      if (this.acomodacaoSelecionada.latitude && this.acomodacaoSelecionada.longitude) {
        this.latitude = Number(this.acomodacaoSelecionada.latitude);
        this.longitude = Number(this.acomodacaoSelecionada.longitude);
      } 

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

  isFormValid(): boolean {
    const { dataCheckIn, dataCheckOut, cliente } = this.reserva();
    let isValid = true;
  
    if (!dataCheckIn) {
      this.notify.notify('error', 'A data de check-in é obrigatória.');
      isValid = false;
    }
    
    if (!dataCheckOut) {
      this.notify.notify('error', 'A data de check-out é obrigatória.');
      isValid = false;
    } else if (dataCheckIn && dataCheckOut <= dataCheckIn) {
      this.notify.notify('error', 'A data de check-out deve ser posterior à data de check-in.');
      isValid = false;
    }
  
    if (!cliente.nomeCompleto.trim()) {
      this.notify.notify('error', 'O nome completo é obrigatório.');
      isValid = false;
    }
  
    if (!cliente.email.trim() || !/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(cliente.email)) {
      this.notify.notify('error', 'Informe um e-mail válido.');
      isValid = false;
    }
  
    if (!cliente.telefone.trim() || !/^\(\d{2}\) \d{5}-\d{4}$/.test(cliente.telefone)) {
      this.notify.notify('error', 'Informe um telefone válido no formato (99) 99999-9999.');
      isValid = false;
    }
  
    if (!cliente.cpf.trim() || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cliente.cpf)) {
      this.notify.notify('error', 'Informe um CPF válido no formato 999.999.999-99.');
      isValid = false;
    }
  
    return isValid;
  }

  checkIfUserIsLogedIn(): void {
    if (!this.authService.isLoggedIn()) {
      const navigationExtras = {
        state: {
          notification: {
            severity: 'warn',
            summary: 'Atenção',
            detail: 'Por Favor, faça o login ou Cadastro antes de reservar uma acomodação!'
          }
        }
      };
      this.router.navigate(['/login'], navigationExtras);
    }
  } 
  
  getisUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }    
}