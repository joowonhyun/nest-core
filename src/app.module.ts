import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guards';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
