import { Module } from "@nestjs/common";
import * as schema from "./users/user.schema"
import {
  AppConfigModule,
  CorsConfigModule,
  DATABASE_METRICS,
  DatabaseModule,
} from "nest-config";
import { DatabaseMetricsFacade, ObservabilityModule } from "nest-metrics";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ObservabilityModule.forRoot({
      serviceName: "users-service",
      serviceVersion: "1.0.0",
      enabled: true,
    }),

    DatabaseModule.forRoot({
      postgres: true,
      azureSql: false,
      schema,
      metricsProvider: {
        provide: DATABASE_METRICS,
        useExisting: DatabaseMetricsFacade,
      },
    }),

    AppConfigModule,
    CorsConfigModule,
    UsersModule,
  ],
})
export class AppModule {}
