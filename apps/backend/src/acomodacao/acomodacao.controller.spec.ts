import { Test, TestingModule } from '@nestjs/testing';
import { AcomodacaoController } from './acomodacao.controller';
import { AcomodacaoService } from './acomodacao.service';

describe('AcomodacaoController', () => {
  let controller: AcomodacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcomodacaoController],
      providers: [AcomodacaoService],
    }).compile();

    controller = module.get<AcomodacaoController>(AcomodacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
