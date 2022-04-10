import { Test, TestingModule } from '@nestjs/testing';
import { BulkVerificationService } from './bulk-verification.service';

describe('BulkVerificationService', () => {
  let service: BulkVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkVerificationService],
    }).compile();

    service = module.get<BulkVerificationService>(BulkVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
