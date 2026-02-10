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
    AppConfigModule,
    CorsConfigModule,
    DatabaseModule.forRoot({
      postgres: true,
      azureSql: false,
      schema,
    }),
    ObservabilityModule,
    UsersModule,
  ],
  providers: [
    {
      provide: DATABASE_METRICS,
      useExisting: DatabaseMetricsFacade,
    },
  ]
})
export class AppModule { }