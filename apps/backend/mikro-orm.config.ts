import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { Cliente } from './src/resources/cliente/cliente.entity';
import { Usuario } from './src/resources/usuario/entities/usuario.entity';
import { Acomodacao } from './src/resources/acomodacao/entities/acomodacao.entity';
import { Reserva } from './src/resources/reserva/entities/reserva.entity';
import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  entities: [Cliente, Usuario, Acomodacao, Reserva],
  dbName: 'swhosped',
  user: 'root',
  password: 'K@ssy2009',
  host: 'localhost',
  port: 5432,
  debug: true,
  highlighter: new SqlHighlighter(),
  logger: (message) => Logger.log(message),
  seeder: {
    path: './src/database/seeders/acomodacao', // Caminho para a pasta onde os seeders estão localizados
    defaultSeeder: 'AcomodacaoSeeder', // Nome da classe do seeder padrão
  },
});
