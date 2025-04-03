import { Component, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NotificationService  } from '../../../../core/notifications/notification.service';
import { UserClientService  } from '../../../services/user-client.service';
import { CreateUserClientDto } from '../../../interfaces/user-client.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cad-user-client',
  imports: [
    CardModule,
    FormsModule, // Adicione o FormsModule aqui
    InputMaskModule,
    ButtonModule,
    CommonModule
  ],  
  templateUrl: './cad-user-client.component.html',
  styleUrl: './cad-user-client.component.css'
})
export class CadUserClientComponent {
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
  private router = inject(Router);

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
          this.notify.notify('success', 'Cadastro realizado com sucesso!');
          this.router.navigate(['login']);          
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
  
    // Validação do Nome Completo
    if (!form.nomeCompleto.trim()) {
      this.notify.notify('error', 'O nome completo é obrigatório!');
      return false;
    }
  
    // Validação do Email
    if (!form.email.trim()) {
      this.notify.notify('error', 'O email é obrigatório!');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      this.notify.notify('error', 'O email informado é inválido!');
      return false;
    }
  
    // Validação da Senha
    if (!form.senha) {
      this.notify.notify('error', 'A senha é obrigatória!');
      return false;
    }
    if (form.senha.length < 6) {
      this.notify.notify('error', 'A senha deve ter pelo menos 6 caracteres!');
      return false;
    }
  
    // Validação de Confirmação de Senha
    if (!form.confirmarSenha) {
      this.notify.notify('error', 'A confirmação de senha é obrigatória!');
      return false;
    }
    if (form.senha !== form.confirmarSenha) {
      this.notify.notify('error', 'As senhas não coincidem!');
      return false;
    }
  
    // Validação do Telefone
    if (!form.telefone.trim()) {
      this.notify.notify('error', 'O telefone é obrigatório!');
      return false;
    }
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(form.telefone)) {
      this.notify.notify('error', 'O telefone informado é inválido!');
      return false;
    }
  
    // Validação do CPF
    if (!form.cpf.trim()) {
      this.notify.notify('error', 'O CPF é obrigatório!');
      return false;
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(form.cpf)) {
      this.notify.notify('error', 'O CPF informado é inválido!');
      return false;
    }
  
    return true;
  }
  
}
