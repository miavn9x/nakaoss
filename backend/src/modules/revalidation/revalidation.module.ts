import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RevalidationService } from './services/revalidation.service';

@Module({
  imports: [HttpModule],
  providers: [RevalidationService],
  exports: [RevalidationService],
})
export class RevalidationModule {}
