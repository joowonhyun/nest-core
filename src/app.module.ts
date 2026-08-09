import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger.middleware';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guards';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BoardModule } from './board/board.module';

@Module({
  imports: [AuthModule, BoardModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true, // DTO에 정의 안 된 필드는 자동으로 제거
          forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 400 에러로 거부
          transform: true, // 쿼리/파라미터 문자열을 DTO에 선언된 타입으로 자동 변환
        }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
