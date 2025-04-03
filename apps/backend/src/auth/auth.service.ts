/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { MikroORM } from '@mikro-orm/core';
import { Usuario } from '../resources/usuario/entities/usuario.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(user: { id: string; role: string }) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }

  create(createAuthDto: CreateAuthDto) {
    // Implemente sua lógica de criação aqui
    return 'This action adds a new auth';
  }

  findAll() {
    // Implemente sua lógica de listagem aqui
    return `This action returns all auth`;
  }

  findOne(id: number) {
    // Implemente sua lógica de busca por ID aqui
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    // Implemente sua lógica de atualização aqui
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    // Implemente sua lógica de remoção aqui
    return `This action removes a #${id} auth`;
  }  


  async validarUsuario(email: string, senha: string): Promise<Partial<Usuario> | null> {
    // const usuario = await this.em.findOne(Usuario, { email });
    const usuario = await this.em.findOne(Usuario, 
      {email: { $ilike: email }},
      {populate: ['cliente']}, // Carrega o Cliente
    );    
    
    if (!usuario) {
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return null;
    }

    const { senha: _, ...result } = usuario;
    return result;
  }

  async login(usuario: Partial<Usuario>) {
    const payload = { 
      email: usuario.email,
      sub: usuario.id,
      tipoAcesso: usuario.tipoAcesso,
      nomeUsuario: usuario.nomeUsuario,
      clienteId: usuario.cliente?.id
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        tipoAcesso: usuario.tipoAcesso,
        nomeUsuario: usuario.nomeUsuario,
        cliente: usuario.cliente ? {
          id: usuario.cliente.id,
          nomeCompleto: usuario.cliente.nomeCompleto,
          telefone: usuario.cliente.telefone,
          cpf: usuario.cliente.cpf
          // Adicione outros campos do cliente conforme necessário
        } : null        
      }
    };
  }

  async registrar(createAuthDto: any) {
    const hashedSenha = await bcrypt.hash(createAuthDto.senha, 10);
    const usuario = this.em.create(Usuario, {
      ...createAuthDto,
      senha: hashedSenha,
    });

    await this.em.persistAndFlush(usuario);
    return this.login(usuario);
  }

}
