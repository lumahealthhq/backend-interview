import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { NormalizationModule } from '@/normalization/normalization.module';
import { DistanceModule } from '@/distance/distance.module';

@Module({
  exports: [RankingService],
  imports: [NormalizationModule, DistanceModule],
  providers: [RankingService],
})
export class RankingModule {}
