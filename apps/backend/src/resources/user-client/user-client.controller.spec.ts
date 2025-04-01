import { Test, TestingModule } from '@nestjs/testing';
import { UserClientController } from './user-client.controller';
import { UserClientService } from './user-client.service';

describe('UserClientController', () => {
  let controller: UserClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserClientController],
      providers: [UserClientService],
    }).compile();

    controller = module.get<UserClientController>(UserClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
