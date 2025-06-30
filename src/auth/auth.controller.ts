import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post("refresh")
  refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @Post("logout")
  logout(@Body() body: { userId: number }) {
    return this.authService.logout(body.userId);
  }
}
