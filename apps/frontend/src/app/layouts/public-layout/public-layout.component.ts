import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/notifications/notification.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterModule, ButtonModule, CommonModule, ToastModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {
  title = 'frontend';
  menuAberto = false;
  authService = inject(AuthService);
  private notify = inject(NotificationService);  

  toggleMenu() {
    const usuario = this.authService.currentUser();    
    console.log("Dados do usuario logado", usuario);
    this.menuAberto = !this.menuAberto;
  }

  /**
 * Submete o formulário de login
 */
  logOut() {
    this.notify.notify('info', this.authService.logout());
  }

}
