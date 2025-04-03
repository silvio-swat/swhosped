import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterModule } from '@angular/router';
import { NotificationService  } from '../../../../core/notifications/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,  
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule,
    RouterModule
  ],  
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private notify = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Estado das credenciais usando Signals
   */
  credentials = signal({
    email: '',
    senha: '',
    lembrar: false
  });

  /**
   * Estado de carregamento
   */
  loading = signal(false);

  /**
   * Submete o formulário de login
   */
  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.loading.set(true);

    this.authService.login(this.credentials()).subscribe({
      next: () => {
        this.notify.notify('success', 'Login realizado com sucesso!');
        // Redireciona com base no tipo de usuário
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }        
      },
      error: (error) => {
        this.loading.set(false);
        //Exibe todas as mensagens de erro de validação do Backend
        if(Array.isArray(error.error.message) && error.error.message.length > 0) {
          for(let i = 0; i < error.error.message.length; i++) {
            this.notify.notify('error', 'Erro ao realizar login. Tente novamente. ' +  error.error.message[i]);
          }
          return;
        }
        this.notify.notify('error','Erro ao realizar login. Tente novamente. ' +  error.error.message);         
        
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  /**
   * Valida os dados do formulário
   */
  private isFormValid(): boolean {
    const form = this.credentials();
    
    if (!form.email || !form.email.includes('@')) {
      this.notify.notify('error', 'Insira um email válido!');
      return false;
    }
    
    if (!form.senha || form.senha.length < 6) {
      this.notify.notify('error', 'A senha deve ter pelo menos 6 caracteres!');
      return false;
    }
    
    return true;
  }

  /**
   * Manipula o clique em "Esqueci a senha"
   */
  onForgotPassword() {
    this.router.navigate(['/recuperar-senha']);
  }
}