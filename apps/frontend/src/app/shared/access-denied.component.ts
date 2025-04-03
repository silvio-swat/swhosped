// access-denied.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 class="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
        <p class="text-gray-700 mb-6">Você não tem permissão para acessar esta área.</p>
        <button 
          (click)="redirect()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Voltar para {{ authService.isLoggedIn() ? 'Página Inicial' : 'Login' }}
        </button>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  redirect() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.authService.isLoggedIn() 
      ? this.router.navigate(['/'])
      : this.router.navigate(['/login']);
  }
}