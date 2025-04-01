/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
// import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';
import { AcomodacaoFactory } from './acomodacao.factory';

// src/acomodacao/acomodacao.service.ts
import { EntityManager } from '@mikro-orm/postgresql';
import { Acomodacao } from './entities/acomodacao.entity';
import { FilterAcomodacaoDto } from './dto/filter-acomodacao.dto';

@Injectable()
export class AcomodacaoService {
  constructor(
    private readonly em: EntityManager,
    private readonly acomodacaoFactory: AcomodacaoFactory
  ) {}

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

  async findAllWithFilters(query: FilterAcomodacaoDto): Promise<{ 
    data: Acomodacao[], 
    totalItems: number, 
    totalPages: number, 
    currentPage: number 
  }> {
    const page  = query.page  && query.page > 0  ? query.page  : 1;  
    const limit = query.limit && query.limit > 0 ? query.limit : 21;
    const offset = (page - 1) * limit;
  
    const qb = this.em.createQueryBuilder(Acomodacao);
  
    // Aplicação dos filtros dinamicamente
    if (query.tipo) {
      qb.andWhere({ tipo: query.tipo });
    }
    if (query.capacidade) {
      qb.andWhere({ capacidade: { $gte: query.capacidade } });
    }
    if (query.precoMin !== undefined) {
      qb.andWhere({ precoPorNoite: { $gte: query.precoMin } });
    }
    if (query.precoMax !== undefined) {
      qb.andWhere({ precoPorNoite: { $lte: query.precoMax } });
    }
    if (query.cidade) {
      qb.andWhere({ cidade: query.cidade });
    }
    if (query.estado) {
      qb.andWhere({ estado: query.estado });
    }
  
    // Obtendo os resultados e a contagem total
    const [data, totalItems] = await qb.limit(limit).offset(offset).getResultAndCount();
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
  

  // async findAllWithFilters(query: FilterAcomodacaoDto): Promise<Acomodacao[]> {
  //   const { page = query.page, limit = query.limit, ...filters } = query;
  //   const offset = (page - 1) * limit;
  
  //   const qb = this.em.createQueryBuilder(Acomodacao)
  //     .limit(limit)
  //     .offset(offset);

  //   if (filters.tipo) {
  //     qb.andWhere({ tipo: filters.tipo });
  //   }
  //   if (filters.capacidade) {
  //     qb.andWhere({ capacidade: { $gte: filters.capacidade } });
  //   }
  //   if (filters.precoMin !== undefined) {
  //     qb.andWhere({ precoPorNoite: { $gte: filters.precoMin } });
  //   }
  //   if (filters.precoMax !== undefined) {
  //     qb.andWhere({ precoPorNoite: { $lte: filters.precoMax } });
  //   }
  //   if (filters.cidade) {
  //     qb.andWhere({ cidade: filters.cidade });
  //   }
  //   if (filters.estado) {
  //     qb.andWhere({ estado: filters.estado });
  //   }

  //   return await qb.getResultList();
  // }  

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
