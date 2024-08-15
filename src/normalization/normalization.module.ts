import { Module } from '@nestjs/common';
import { NormalizationService } from './normalization.service';

@Module({
  exports: [NormalizationService],
  providers: [NormalizationService],
})
export class NormalizationModule {}
