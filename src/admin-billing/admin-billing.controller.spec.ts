import { Test, TestingModule } from '@nestjs/testing';
import { AdminBillingController } from './admin-billing.controller';

describe('AdminBillingController', () => {
  let controller: AdminBillingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBillingController],
    }).compile();

    controller = module.get<AdminBillingController>(AdminBillingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
