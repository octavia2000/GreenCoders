import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @Type(() => Number)
  phoneNumber: number;

  @IsString()
  confirmPassword: string;
}
