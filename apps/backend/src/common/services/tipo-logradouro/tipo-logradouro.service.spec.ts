import { Test, TestingModule } from '@nestjs/testing';
import { TipoLogradouroService } from './tipo-logradouro.service';

describe('TipoLogradouroService', () => {
  let service: TipoLogradouroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoLogradouroService],
    }).compile();

    service = module.get<TipoLogradouroService>(TipoLogradouroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
