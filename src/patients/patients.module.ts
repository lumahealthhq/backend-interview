import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsUseCase } from './patients.use-case';
import { PatientsRepository } from './patients.repository';
import { RankingModule } from '@/ranking/ranking.module';

@Module({
  imports: [RankingModule],
  controllers: [PatientsController],
  providers: [PatientsUseCase, PatientsRepository],
})
export class PatientsModule {}
