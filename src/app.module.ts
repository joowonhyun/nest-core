import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
