import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInResponseDto } from './dto/response/sign-in-res.dto';
import { AuthTokenDto } from './dto/response/auth-token.dto';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigProps } from 'src/configs/config.interface';
import { ResetPasswordReqDto } from './dto/request/reset-password.req.dto';
import { LoginHistoryService } from 'src/modules/login-history/login-history.service';
import { EmployeeService } from 'src/modules/employees/employee.service';
import { EmployeeDocument } from 'src/modules/employees/employee.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService<ConfigProps>,
    private readonly loginHistoryService: LoginHistoryService,
    private employeeService: EmployeeService,
  ) {}

  /**
   * Sign In Admin User
   * @param email
   * @param password
   * @returns SignIn Response
   */
  async signIn(email: string, password: string): Promise<SignInResponseDto> {
    const employee = await this.validateUser(email, password);
    const tokens = await this.getTokens(email, employee.role);

    // Update refresh token in database
    await this.updateRefreshToken(email, tokens.refreshToken);
    // Save login history
    await this.loginHistoryService.createLoginHistory(
      employee._id,
      employee.name,
      employee.role,
      true,
    );
    return {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Validate  User
   * @param email
   * @param password
   * @returns Admin User
   */
  async validateUser(email: string, password: string): Promise<EmployeeDocument> {
    const employee = await this.employeeService.getEmployeeByEmailWithPassword(email);
    if (!employee) {
      throw new BadRequestException('Invalid Email or Password');
    }
    const isCorrectPassword = await bcrypt.compare(password, employee.password);
    if (!isCorrectPassword) {
      throw new BadRequestException('Invalid Email or Password');
    }
    return employee;
  }

  /**
   * Get Tokens
   * @param username
   * @param role
   * @returns AuthTokenDto
   */
  async getTokens(username: string, role: Role): Promise<AuthTokenDto> {
    const secret = this.configService.get<string>('jwt.secret', {
      infer: true,
    });
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret', {
      infer: true,
    });

    const tokens = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
          role,
        },
        {
          secret,
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          username,
          role,
        },
        {
          secret: refreshSecret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }

  /**
   * Refresh Access Token
   * @param refreshToken
   * @returns AuthTokenDto
   */
  async refreshAccessToken(refreshToken: string): Promise<AuthTokenDto> {
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret', {
      infer: true,
    });
    const { username } = await this.jwtService.verifyAsync(refreshToken, {
      secret: refreshSecret,
    });
    const user = await this.employeeService.getEmployeeByEmail(username);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.email, user.role);
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  /**
   *  Update Refresh Token
   * @param email
   * @param refreshToken
   */
  private async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.employeeService.updateEmployeeToken({
      email,
      refreshToken,
    });
  }

  async generateForgotPasswordToken(email: string): Promise<string> {
    // Retrieve the user to get the student Id
    const user = await this.employeeService.getEmployeeByEmail(email);
    if (!user) {
      throw new NotFoundException('Student not found');
    }

    const secret = this.configService.get<string>('jwt.forgotPasswordSecret', {
      infer: true,
    });

    // Generate the forgot password token
    const forgotPasswordToken = await this.jwtService.signAsync(
      { email },
      { expiresIn: '1d', secret },
    );

    // Emit forgot password event
    this.eventEmitter.emit('employee.forgot-password', {
      name: user.name,
      email: user.email,
      forgotPasswordToken,
    });

    return forgotPasswordToken;
  }

  /**
   * Employee Reset Password
   * @param userResetPasswordDto Employee Reset Password DTO
   */
  async verifyForgotPasswordToken(userResetPasswordDto: ResetPasswordReqDto): Promise<void> {
    // Decode the token to extract the payload and determine the user
    const decodedToken = this.jwtService.decode(userResetPasswordDto.forgotPasswordToken) as {
      email: string;
      iat?: number;
      exp?: number;
    };

    if (!decodedToken || !decodedToken.email) {
      throw new BadRequestException('Invalid token');
    }

    // Retrieve the user to get the student Id
    const user = await this.employeeService.getEmployeeByEmail(decodedToken.email);

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    const secret = this.configService.get<string>('jwt.forgotPasswordSecret', {
      infer: true,
    });
    // Verify the token with the
    let initialEmail: string;
    try {
      const { email } = await this.jwtService.verifyAsync(
        userResetPasswordDto.forgotPasswordToken,
        {
          secret,
        },
      );
      initialEmail = email;
    } catch (error) {
      throw new BadRequestException('Invalid Token', error.message);
    }
    // Reset the user's password
    await this.employeeService.resetPassword(initialEmail, userResetPasswordDto.newPassword);
  }
}
