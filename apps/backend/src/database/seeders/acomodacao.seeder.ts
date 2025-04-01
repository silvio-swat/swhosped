import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql'; // Importação correta para PostgreSQL
import { AcomodacaoFactory } from './../../resources/acomodacao/acomodacao.factory';
import { TipoLogradouroService } from '../../common/services/tipo-logradouro/tipo-logradouro.service'; 


export class AcomodacaoSeeder extends Seeder {
    // constructor(
    //     private readonly tipoLogradouroService: TipoLogradouroService,
    //     private em: EntityManager,
    //   ) {
    //     super()
    //   }

  async run(em: EntityManager): Promise<void> {

    const tipoLogradouroService = new TipoLogradouroService();
    const acomodacaoFactory = new AcomodacaoFactory(em, tipoLogradouroService);
    await acomodacaoFactory.create(100); // Cria 10 registros fictícios
  }
}