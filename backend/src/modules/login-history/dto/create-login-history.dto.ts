import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateLoginHistoryDto {
  @IsString()
  @IsNotEmpty()
  employeeId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsBoolean()
  isAuthenticated: boolean;
}
