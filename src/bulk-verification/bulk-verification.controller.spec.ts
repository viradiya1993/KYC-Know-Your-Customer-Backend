import { Test, TestingModule } from '@nestjs/testing';
import { BulkVerificationController } from './bulk-verification.controller';

describe('BulkVerificationController', () => {
  let controller: BulkVerificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkVerificationController],
    }).compile();

    controller = module.get<BulkVerificationController>(BulkVerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
