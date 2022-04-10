import { Test, TestingModule } from '@nestjs/testing';
import { AdminBillingService } from './admin-billing.service';

describe('AdminBillingService', () => {
  let service: AdminBillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminBillingService],
    }).compile();

    service = module.get<AdminBillingService>(AdminBillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
