import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ALREADY_EXISTING_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.email);

    if (oldUser) throw new BadRequestException(ALREADY_EXISTING_ERROR);

    return this.authService.createUser(dto);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const { email } = await this.authService.validateUser(
      dto.email,
      dto.password,
    );

    return this.authService.login(email);
  }
}
