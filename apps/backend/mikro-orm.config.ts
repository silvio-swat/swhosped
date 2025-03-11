import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { Cliente } from './src/cliente/cliente.entity';
import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  entities: [Cliente],
  dbName: 'swhosped',
  user: 'silviosw',
  password: '123456',
  host: 'localhost',
  port: 5432,
  debug: true,
  highlighter: new SqlHighlighter(),
  logger: (message) => Logger.log(message),
});