import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/request/sign-in-req.dto';
import { SignInResponseDto } from './dto/response/sign-in-res.dto';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AllowedRoles } from '../../decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RefreshTokenDto } from './dto/response/refresh-token.dto';
import { ResetPasswordReqDto } from './dto/request/reset-password.req.dto';
import { AuthTokenDto } from './dto/response/auth-token.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in for employees' })
  @ResponseMessage('Sign in successful')
  async signIn(@Body() signInDto: SignInRequestDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('forgot-password-get-token/employee')
  @ApiOperation({ summary: 'Generate forgot password token for employees' })
  @ResponseMessage('Forgot password link has been sent to your email')
  async employeeForgotPasswordGetToken(@Body() { email }: { email: string }): Promise<string> {
    return this.authService.generateForgotPasswordToken(email);
  }

  @Post('forgot-password-reset/employee')
  @ApiOperation({ summary: 'Reset password for employees' })
  @ResponseMessage('Password has been successfully reset')
  async employeeForgotPasswordReset(
    @Body() employeeResetPasswordDto: ResetPasswordReqDto,
  ): Promise<void> {
    return this.authService.verifyForgotPasswordToken(employeeResetPasswordDto);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @AllowedRoles(Role.Admin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Refresh access token' })
  @ResponseMessage('Access token refreshed successfully')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthTokenDto> {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}
