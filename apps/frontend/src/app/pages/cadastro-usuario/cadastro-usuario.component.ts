import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NotificationService  } from '../../../core/notifications/notification.service';
import { UserClientService  } from './../../services/user-client.service';
import { CreateUserClientDto } from './../../interfaces/user-client.interface';

/**
 * Componente responsável pelo cadastro de usuários e clientes
 * 
 * @remarks
 * Este componente implementa um formulário de cadastro com validações básicas
 * e integração com o serviço de usuários.
 */
@Component({
  standalone: true,  
  imports: [
    CardModule,
    FormsModule, // Adicione o FormsModule aqui
    InputMaskModule,
    ButtonModule,
    CommonModule
  ],  
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
  /**
   * Estado do formulário usando Signals
   * 
   * @remarks
   * Armazena todos os campos do formulário de cadastro
   */
  user = signal({
    nomeCompleto: '', // Pode ser o email
    senha: '',
    confirmarSenha: '',
    email: '',
    telefone: '',
    cpf: '',
  });

  constructor(
    private notify: NotificationService,
    private userClientService: UserClientService    
  ) {}

  /**
   * Manipulador de eventos de input
   * 
   * @param event - Evento DOM do input
   * @param field - Campo do formulário que está sendo alterado
   * 
   * @remarks
   * Atualiza o valor do campo específico no estado do formulário
   */
  onInputChange(event: Event, field: 'nomeCompleto' | 'email' | 'telefone' | 'cpf') {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateField(field, target.value);
    }
  }  

  /**
   * Atualiza um campo específico no estado do formulário
   * 
   * @param field - Nome do campo a ser atualizado
   * @param value - Novo valor para o campo
   */
  updateField(field: 'nomeCompleto' | 'email' | 'telefone' | 'cpf', value: string) {
    this.user.update(current => ({ ...current, [field]: value }));
  }

  /**
   * Submete o formulário de cadastro
   * 
   * @remarks
   * Valida os dados antes de enviar para o servidor e trata a resposta
   */
  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    const userClientData: CreateUserClientDto = {
      nomeUsuario: this.user().email, // Ou um username separado
      senha: this.user().senha,
      tipoAcesso: 'Cliente',
      nomeCompleto: this.user().nomeCompleto, // Ou um username separado
      email: this.user().email,
      telefone: this.user().telefone,
      cpf: this.user().cpf,
    };

    this.userClientService.createUserAndClient(userClientData).subscribe({
        next: (response) => {
          console.log('Usuário cadastrado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
        },
        error: (error) => {
          //Exibe todas as mensagens de erro de validação do Backend
          if(error.error.message !== undefined && error.error.message.length > 0) {
            for(let i = 0; i < error.error.message.length; i++) {
              this.notify.notify('error', error.error.message[i]);
            }
          }
          // Exibe erro no console caso não seja erro de validação de campos
          console.error('Erro ao cadastrar usuário', error);
        }
    });    
  }

  /**
   * Valida os dados do formulário
   * 
   * @returns boolean - True se o formulário é válido, False caso contrário
   * 
   * @remarks
   * Verifica se a senha foi preenchida e se as senhas coincidem
   */
  private isFormValid(): boolean {
    const form = this.user();
    if (!form.senha) {
      this.notify.notify('error','Insira uma senha válida!');
      return false;
    }
    
    if (form.senha !== form.confirmarSenha) {
      this.notify.notify('error','As senhas não coincidem!');
      return false;
    }
    return true;
  }
}