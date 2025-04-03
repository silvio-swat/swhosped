/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Definindo que usaremos email como campo de login
      passwordField: 'senha' // Adicionar explicitamente      
    });
  }

  async validate(email: string, senha: string): Promise<any> {
    console.log('Validando:', email);    
    const usuario = await this.authService.validarUsuario(email, senha);
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    return usuario;
  }
}