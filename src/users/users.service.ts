import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CLIENT, DatabaseClient } from "nest-config";
import { users } from "./user.schema";
import type * as Schema from "./user.schema";
import { eq } from "drizzle-orm";
import { BadRequestError, LoggerService } from "common";

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CLIENT)
    private readonly dbClient: DatabaseClient,
    private readonly logger: LoggerService
  ) { }

  private get db() {
    return this.dbClient.getDb<typeof Schema>();
  }

  async createUser(email: string, name: string) {

    await this.dbClient.withTransaction(async (tx) => {
      console.log("Creating user...");

      await tx.insert(users).values({ email, name });
    });
  }

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
}