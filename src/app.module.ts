import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AppConfigService } from "nest-config";
import {
  AppConfigModule,
  CorsConfigModule,
  DatabaseModule,
  DATABASE_METRICS,
  envSchema,
} from "nest-config";

import { DatabaseMetricsFacade, ObservabilityModule } from "nest-metrics";
import { UsersModule } from "./users/users.module";

import {
  LoggerModule,
  HttpLoggingInterceptor,
  GlobalExceptionFilter,
  ResponseInterceptor,
  AuthModule,
} from "common";

@Module({
  imports: [
    /**
     * ========================================
     * 1️ CONFIGURACIÓN BASE (ROOT DEL SISTEMA)
     * ========================================
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    /**
     * ========================================
     * 2️ APP CONFIG (WRAPPER LIMPIO)
     * ========================================
     */

    AppConfigModule.forRoot({
      schema: envSchema,
      cache: true,
    }),

    /**
     * ========================================
     * 3️ OBSERVABILIDAD
     * ========================================
     */

    ObservabilityModule.forRoot({
      serviceName: "users-service",
      serviceVersion: "1.0.0",
      enabled: true,
      enableHttpMetrics: true,
      enableErrorMetrics: true,
      enableAuthMetrics: true,
    }),

    /**
     * ========================================
     * 4️ LOGGER
     * ========================================
     */
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        level: config.logLevel,
        serviceName: "users-service",
        environment: config.env,

        loki: config.lokiEndpoint ? {
          endpoint: config.lokiEndpoint,
          username: config.lokiUsername,
          password: config.lokiPassword,
        } : undefined,

        cloudwatch: config.awsRegion ? {
          region: config.awsRegion,
          logGroup: config.cloudwatchLogGroup!,
          logStream: config.cloudwatchLogStream,
        } : undefined,
      }),
    }),

    /**
     * ========================================
     * 5️ DATABASE
     * ========================================
     */
    DatabaseModule.forRoot({
      postgres: true,
      azureSql: false,
      metricsProvider: {
        provide: DATABASE_METRICS,
        useClass: DatabaseMetricsFacade,
      },
    }),


    AuthModule.registerAsync({
      useFactory: (config: AppConfigService) => ({
        apiKey: {
          validKeys: [config.heliosApiKey],
        },
        cognito: {
          allowedUserPoolIds: [config.sicCognitoUserPoolId,config.heliosWebCognitoUserPoolId],
          jwksCacheTtlMs: 5 * 60 * 1000
        },
      }),
      inject: [AppConfigService],
    }),

    /**
     * ========================================
     * 6️ OTROS MÓDULOS
     * ========================================
     */
    CorsConfigModule,
    UsersModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
