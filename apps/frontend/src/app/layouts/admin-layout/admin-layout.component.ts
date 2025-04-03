import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../../../core/notifications/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule, ButtonModule, CommonModule, ToastModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  title = 'frontend';
  menuAberto = false;
  private notify = inject(NotificationService);
  authService    = inject(AuthService);   

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  /**
   * Submete o formulário de login
   */
  logOut() {
    console.log('testefdksjflksjdflksj')
    this.notify.notify('info', this.authService.logout());
  }  
}
