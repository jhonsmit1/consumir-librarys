import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "common";

@Controller("users")

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  //@Public()
  async createUser(
    @Body() body: { email: string; name?: string }
  ) {
    await this.usersService.createUser(body.email, body.name ?? "");
    return { success: true };
  }

  @Get("by-email")
  async findByEmail(@Query("email") email: string) {
    return this.usersService.findByEmail(email);
  }
}
