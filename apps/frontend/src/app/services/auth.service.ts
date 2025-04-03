/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.service.ts
import { Injectable, inject, signal  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { apiLinks } from '../shared/environment';
import { Router } from '@angular/router';

export interface LoginCredentials {
  email: string;
  senha: string;
  lembrar?: boolean;
}

export interface LoginResponse {
  access_token: string;
  usuario: {
    id: number;
    email: string;
    tipoAcesso: string;
    nomeUsuario: string;
    cliente: {
      nomeCompleto: string,
      email: string,
      telefone: string,
      cpf: string,  
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = apiLinks.devNetwork + 'api/auth';

  // Usando Signal para estado reativo do usuário
  currentUser = signal<LoginResponse['usuario'] | null>(null);

  constructor() {
    // Carrega o usuário do localStorage ao inicializar
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }  

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
        this.currentUser.set(response.usuario);
      })
    );
  }

  private setSession(authResult: LoginResponse) {
    localStorage.setItem('token', authResult.access_token);
    localStorage.setItem('usuario', JSON.stringify(authResult.usuario));
  }

  logout() {
    let msg ='';
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this.currentUser.set(null);
      this.router.navigate(['/login']);
      msg = 'Sessão finalizada com sucesso!';    
    } catch (error) {
      msg = 'Erro ao tentar deslogar: ' + error;
    }

    return msg;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.tipoAcesso === 'Administrador';
  }

  getUsuario(): LoginResponse['usuario'] | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}