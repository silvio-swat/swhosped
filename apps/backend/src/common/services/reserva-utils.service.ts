// shared/reserva-utils.service.ts
import { Injectable } from '@nestjs/common';
import { EntityManager, sql } from '@mikro-orm/postgresql';
import { StatusReserva } from '../../resources/reserva/entities/reserva.entity';

@Injectable()
export class ReservaUtilsService {
  constructor(private readonly em: EntityManager) {}

  async verificarConflitoReserva(
    acomodacaoId: number,
    checkIn: Date,
    checkOut: Date,
    alias?: string
  ): Promise<{ exists: boolean; query?: string }> {
    // Para uso direto (como no ReservaService)
    if (!alias) {
      const count = await this.em.createQueryBuilder('Reserva', 'r')
        .where({
          acomodacao: acomodacaoId,
          status: StatusReserva.CONFIRMADA,
          dataCheckIn: { $lt: checkOut },
          dataCheckOut: { $gt: checkIn }
        })
        .getCount();
      
      return { exists: count > 0 };
    }

    // Para uso em subqueries (como no AcomodacaoService)
    const query = this.em.createQueryBuilder('Reserva', 'r')
      .select(sql`1`)
      .where(`r.acomodacao_id = ${alias}.id`)
      .andWhere('r.data_check_in < ?', [checkOut])
      .andWhere('r.data_check_out > ?', [checkIn])
      .andWhere('r.status = ?', [StatusReserva.CONFIRMADA])
      .getFormattedQuery();

    return { exists: true, query: `NOT EXISTS (${query})` };
  }
}