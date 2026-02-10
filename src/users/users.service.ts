import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CLIENT, DatabaseClient } from "nest-config";
import { users } from "./user.schema";
import type * as Schema from "./user.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CLIENT)
    private readonly dbClient: DatabaseClient
  ) { }

  private get db() {
    return this.dbClient.getDb<typeof Schema>();
  }

  async createUser(email: string, name: string) {
    await this.db.insert(users).values({ email, name });
  }

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
}