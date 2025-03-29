import { Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
// import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';

// src/acomodacao/acomodacao.service.ts
import { EntityManager } from '@mikro-orm/core';
import { Acomodacao } from '../acomodacao/entities/acomodacao.entity';

@Injectable()
export class AcomodacaoService {
  constructor(private readonly em: EntityManager) {}

  async create(
    createAcomodacaoDto: CreateAcomodacaoDto, 
    files: Array<Express.Multer.File> // Recebe array    
  ) {
    const imagePaths = files.map(file => file.path); // Extrai paths    
    const acomodacao = this.em.create(Acomodacao, {
      ...createAcomodacaoDto,
      imagens: imagePaths, // Armazena array de paths
    });

    await this.em.persistAndFlush(acomodacao);
    return acomodacao;
  }

  findAll() {
    return `This action returns all acomodacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} acomodacao`;
  }

  // update(id: number, updateAcomodacaoDto: UpdateAcomodacaoDto) {
  //   return `This action updates a #${id} acomodacao`;
  // }

  remove(id: number) {
    return `This action removes a #${id} acomodacao`;
  }
}
