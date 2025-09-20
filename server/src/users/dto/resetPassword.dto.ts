import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class PasswordResetDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Please input the reset Password' })
  randomPassword: string;

  @MinLength(6, { message: 'Password should be at least 6 characters' })
  newPassword: string;
}
