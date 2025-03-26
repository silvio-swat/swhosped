import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NotificationService  } from '../../../core/notifications/notification.service';
import { UserClientService  } from './../../services/user-client.service';
import { CreateUserClientDto } from './../../interfaces/user-client.interface';
// import { OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,  
  imports: [CardModule,
    FormsModule, // Adicione o FormsModule aqui
    InputMaskModule,
    ButtonModule,
    CommonModule],  
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
  // Usando Signals para gerenciar o estado do formulário
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

  // Função para lidar com o evento de input
  onInputChange(event: Event, field: 'nomeCompleto' | 'email' | 'telefone' | 'cpf') {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateField(field, target.value);
    }
  }  

  // Função para atualizar os valores do formulário
  updateField(field: 'nomeCompleto' | 'email' | 'telefone' | 'cpf', value: string) {
    this.user.update(current => ({ ...current, [field]: value }));
  }

  // Função para enviar os dados
  onSubmit() {
    // if (!this.isFormValid()) {
    //   return;
    // }

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
    // this.http.post('http://localhost:3000/api/usuarios', usuarioData, { headers })

  }

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



// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-cadastro-usuario',
//   imports: [],
//   templateUrl: './cadastro-usuario.component.html',
//   styleUrl: './cadastro-usuario.component.css'
// })
// export class CadastroUsuarioComponent {
//   usuarioForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.usuarioForm = this.fb.group({
//       nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
//       cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
//     });
//   }

//   cadastrar() {
//     if (this.usuarioForm.valid) {
//       console.log(this.usuarioForm.value); // Substituir por requisição HTTP
//     }
//   }
// }
