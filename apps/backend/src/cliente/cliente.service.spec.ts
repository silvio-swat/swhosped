import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';

describe('ClienteService', () => {
  let service: ClienteService;

  const clienteFicticio = {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    // outros campos conforme sua entidade Cliente
  };

  const mockClienteRepository = {
    create: jest.fn().mockReturnValue(clienteFicticio),
    findAll: jest.fn().mockResolvedValue([clienteFicticio]),
    findOne: jest.fn().mockResolvedValue(clienteFicticio),
    // outros métodos conforme necessário
  };  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: {
            mockClienteRepository
          },
        },        
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um novo cliente', async () => {
    const novoCliente = await service.create({
      nomeCompleto: 'Maria Souza',
      telefone:  '11 98749-3847',
    });
    expect(novoCliente).toEqual(clienteFicticio);
    expect(mockClienteRepository.create).toHaveBeenCalledWith({
      nomeCompleto: 'Maria Souza',
      telefone:  '11 98749-3847',
      // outros campos
    });
  });  
});
