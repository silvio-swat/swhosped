import { Test, TestingModule } from '@nestjs/testing';
import { AcomodacaoService } from './acomodacao.service';

describe('AcomodacaoService', () => {
  let service: AcomodacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcomodacaoService],
    }).compile();

    service = module.get<AcomodacaoService>(AcomodacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
