import { Injectable } from '@nestjs/common';
import { Usuario, TipoAcesso } from './../usuario/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: EntityRepository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, salt);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: hashedPassword,
      tipoAcesso: createUsuarioDto.tipoAcesso || TipoAcesso.CLIENTE,
    });

    await this.em.persistAndFlush(usuario); // Usando EntityManager
    return usuario;
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  // update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
  //   return `This action updates a #${id} usuario`;
  // }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
