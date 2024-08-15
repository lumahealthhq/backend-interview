import { Module } from '@nestjs/common';
import { DistanceService } from './distance.service';

@Module({
  exports: [DistanceService],
  providers: [DistanceService],
})
export class DistanceModule {}
