import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

}