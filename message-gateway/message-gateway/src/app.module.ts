import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SocketModule } from './shocket/socket.module';
@Module({
  imports: [
    SocketModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'excelQueue',
    }),
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}
