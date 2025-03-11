import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, MikroORM } from '@mikro-orm/postgresql';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: EntityRepository<Cliente>,
    private readonly orm: MikroORM, // Injetando o MikroORM para acessar o EntityManager
  ) {}

  async create(clienteData: Partial<Cliente>): Promise<Cliente> {
    const cliente = this.clienteRepository.create(clienteData);
    await this.orm.em.persistAndFlush(cliente); // Usando o EntityManager para persistir e dar flush
    return cliente;
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }

  async findOne(id: number): Promise<Cliente | null> {
    return this.clienteRepository.findOne(id);
  }

  async update(id: number, clienteData: Partial<Cliente>): Promise<Cliente> {
    const cliente = await this.findOne(id);
    if (cliente) {
      this.clienteRepository.assign(cliente, clienteData);
      await this.orm.em.flush(); // Usando o EntityManager para dar flush
    }
    return cliente;
  }

  async remove(id: number): Promise<boolean> {
    const cliente = await this.findOne(id);
    if (cliente) {
      await this.orm.em.removeAndFlush(cliente); // Usando o EntityManager para remover e dar flush
      return true;
    }
    return false;
  }
}
