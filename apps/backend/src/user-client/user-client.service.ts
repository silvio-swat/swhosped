import { Injectable } from '@nestjs/common';
import { CreateUserClientDto } from './dto/create-user-client.dto';
// import { UpdateUserClientDto } from './dto/update-user-client.dto';
import { Cliente } from './../cliente/cliente.entity';
import { Usuario } from './../usuario/entities/usuario.entity';
import { UsuarioService } from './../usuario/usuario.service';
import { ClienteService } from './../cliente/cliente.service';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

// user-client.service.ts
@Injectable()
export class UserClientService {
  constructor(
    private readonly userService: UsuarioService,
    private readonly clienteService: ClienteService,
    private readonly em: EntityManager,
  ) {}

  async createUserAndClient(createDto: CreateUserClientDto) {
    // Iniciar transação
    return this.em.transactional(async (em) => {
      // Criar usuário
      const user = em.create(Usuario, {
        nomeUsuario: createDto.nomeUsuario,
        senha: await bcrypt.hash(createDto.senha, 10),
        tipoAcesso: createDto.tipoAcesso,
      });
      
      await em.persistAndFlush(user);

      // Criar cliente
      const cliente = em.create(Cliente, {
        nomeCompleto: createDto.nomeCompleto,
        email: createDto.email,
        telefone: createDto.telefone,
        cpf: createDto.cpf,
        usuario: user,
      });

      await em.persistAndFlush(cliente);

      // Atualizar relação no usuário
      user.cliente = cliente;
      await em.persistAndFlush(user);

      return { user, cliente };
    });
  }
}