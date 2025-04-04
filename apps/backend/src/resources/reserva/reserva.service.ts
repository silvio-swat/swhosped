import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { EntityManager, wrap, FilterQuery  } from '@mikro-orm/postgresql';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Reserva, StatusReserva } from './entities/reserva.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Acomodacao } from '../acomodacao/entities/acomodacao.entity';
import { FilterReservaDto } from '../reserva/dto/filtro-reserva.dto';
import { PaginatedReservaResult } from './reserva.interface';
import { FilterReservaAdminDto } from './dto/filtro-reserva-admin.dto';

@Injectable()
export class ReservaService {
  constructor(private readonly em: EntityManager) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    // Validação básica de datas
    if (createReservaDto.dataCheckIn >= createReservaDto.dataCheckOut) {
      throw new BadRequestException('Data de check-in deve ser anterior à data de check-out');
    }

    // Verifica conflito de reservas
    const conflito = await this.verificarConflitoReserva(
      createReservaDto.acomodacao.id,
      createReservaDto.dataCheckIn,
      createReservaDto.dataCheckOut
    );

    if (conflito) {
      throw new ConflictException('Já existe uma reserva para esta acomodação no período selecionado');
    }

    // Restante da lógica de criação...
    const reserva = new Reserva();
    wrap(reserva).assign({
      ...createReservaDto,
      cliente: await this.getOrCreateCliente(createReservaDto.cliente),
      acomodacao: await this.em.findOneOrFail(Acomodacao, createReservaDto.acomodacao.id)
    }, { em: this.em });

    await this.em.persistAndFlush(reserva);
    return reserva;
  }

  findAll() {
    return `This action returns all reserva`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  // update(id: number, updateReservaDto: UpdateReservaDto) {
  //   return `This action updates a #${id} reserva`;
  // }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }

  private async verificarConflitoReserva(
    acomodacaoId: number,
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> {
    const qb = this.em.createQueryBuilder(Reserva);
    
    const conflito = await qb
      .where({
        acomodacao: acomodacaoId,
        $or: [
          { 
            dataCheckIn: { $lte: checkOut },
            dataCheckOut: { $gte: checkIn }
          }
        ]
      })
      .getCount();

    return conflito > 0;
  }

  private async getOrCreateCliente(clienteData: any): Promise<Cliente> {
    let cliente = await this.em.findOne(Cliente, { cpf: clienteData.cpf });
    
    if (!cliente) {
      cliente = new Cliente();
      wrap(cliente).assign(clienteData, { em: this.em });
      await this.em.persistAndFlush(cliente);
    }
    
    return cliente;
  }

  async findAllWithFilters(query: FilterReservaDto): Promise<PaginatedReservaResult> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 12;
    const offset = (page - 1) * limit;

    // Criando a query base
    const qb = this.em.createQueryBuilder(Reserva, 'r')
      .leftJoinAndSelect('r.cliente', 'c')
      .leftJoinAndSelect('r.acomodacao', 'a');

      console.log(query);
    // Aplicando filtros
    if (query.cpf) {
      qb.andWhere({ cliente: { cpf: { $ilike: `%${query.cpf}%` } } });
    }

    if (query.email) {
      qb.andWhere({ cliente: { email: { $ilike: `%${query.email}%` } } });
    }

    if (query.telefone) {
      qb.andWhere({ cliente: { telefone: { $ilike: `%${query.telefone}%` } } });
    }

    // Obtendo os resultados e a contagem total
    const [data, totalItems] = await qb
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async findAllWithFiltersAdmin(query: FilterReservaAdminDto): Promise<PaginatedReservaResult> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 12;
    const offset = (page - 1) * limit;

    // Criando a query base
    const qb = this.em.createQueryBuilder(Reserva, 'r')
      .leftJoinAndSelect('r.cliente', 'c')
      .leftJoinAndSelect('r.acomodacao', 'a');

    // Aplicando filtros
    if (query.cpf) {
      qb.andWhere({ cliente: { cpf: { $ilike: `%${query.cpf}%` } } });
    }

    if (query.email) {
      qb.andWhere({ cliente: { email: { $ilike: `%${query.email}%` } } });
    }

    if (query.telefone) {
      qb.andWhere({ cliente: { telefone: { $ilike: `%${query.telefone}%` } } });
    }

    if (query.status) {
      qb.andWhere({ status: query.status });
    }

    // Filtro por período (dataInicio e dataFim)
    if (query.dataInicio && query.dataFim) {
      const dataInicio = new Date(query.dataInicio);
      const dataFim = new Date(query.dataFim);
      
      qb.andWhere({
        $or: [
          // Reservas que começam e terminam dentro do período
          { 
            dataCheckIn: { $gte: dataInicio },
            dataCheckOut: { $lte: dataFim }
          },
          // Reservas que começam antes mas terminam dentro do período
          { 
            dataCheckIn: { $lt: dataInicio },
            dataCheckOut: { $gt: dataInicio, $lte: dataFim }
          },
          // Reservas que começam dentro mas terminam depois do período
          { 
            dataCheckIn: { $gte: dataInicio, $lt: dataFim },
            dataCheckOut: { $gt: dataFim }
          },
          // Reservas que englobam todo o período
          { 
            dataCheckIn: { $lt: dataInicio },
            dataCheckOut: { $gt: dataFim }
          }
        ]
      });
    }

    // Ordenação padrão por data de criação (opcional)
    qb.orderBy({ createdAt: 'DESC' });    

    // Obtendo os resultados e a contagem total
    const [data, totalItems] = await qb
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }


  // Método para cancelar uma reserva
  async cancelarReserva(id: number): Promise<Reserva> {
    // Buscar a reserva pelo ID
    const reserva = await this.em.findOne(Reserva, id, { populate: ['acomodacao', 'cliente'] });
    
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Atualizar o status para "Cancelada" (ou o que for apropriado para o seu modelo)
    reserva.status = StatusReserva.CANCELADA;

    // Persistir a alteração
    await this.em.persistAndFlush(reserva);
    return reserva;
  }  

}
