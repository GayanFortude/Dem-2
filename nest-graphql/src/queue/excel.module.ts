import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelProcessor } from './excel.processor';
import { SharedModule } from 'src/common/sharedmodule';


@Module({
  imports: [
    SharedModule,
  ],
  controllers: [ExcelController],
  providers: [ExcelProcessor],
})
export class ExcelModule {}
