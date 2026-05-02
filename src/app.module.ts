import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [BoardModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
