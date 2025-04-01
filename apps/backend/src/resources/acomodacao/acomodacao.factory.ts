import { Factory } from '@mikro-orm/seeder';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { Acomodacao, TipoAcomodacao, StatusAcomodacao } from './entities/acomodacao.entity';
import { TipoLogradouroService } from '../../common/services/tipo-logradouro/tipo-logradouro.service';
import { EntityManager } from '@mikro-orm/postgresql'; // Importação correta para PostgreSQL


export class AcomodacaoFactory extends Factory<Acomodacao> {
  model = Acomodacao;

  constructor(
    em: EntityManager,
    private readonly tipoLogradouroService: TipoLogradouroService
  ) {
    super(em); // Chama o construtor da classe base com o EntityManager
  }

  definition(): Partial<Acomodacao> {
    const logradouro = faker.location.street();
    return {
      tipo: faker.helpers.arrayElement(Object.values(TipoAcomodacao)),
      descricao: faker.lorem.paragraph(),
      capacidade: faker.number.int({ min: 1, max: 10 }),
      tipoLogradouro: this.tipoLogradouroService.extrairTipo(logradouro),
      logradouro: logradouro,
      numero: faker.number.int({ min: 1, max: 1000 }).toString(),
      bairro: faker.location.secondaryAddress(),
      cidade: faker.location.city(),
      estado: faker.location.state({abbreviated: true}),
      complemento: faker.helpers.maybe(() => faker.location.secondaryAddress()),
      cep: faker.location.zipCode(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      precoPorNoite: parseFloat(faker.finance.amount({ min: 50, max: 500, dec: 2 })),
      status: faker.helpers.arrayElement(Object.values(StatusAcomodacao)),
      imagens: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.image.url()),
    };
  }
}
