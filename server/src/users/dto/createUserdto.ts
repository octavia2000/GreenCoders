import { IsString, IsEmail, IsNotEmpty, Matches, MinLength} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username should be at least 3 characters' })
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password should be at least 6 characters' })
  password: string;

   @Matches(/^\d{11}$/, { message: 'Phone number should be 11 digits' })
  phoneNumber: string;

  @IsString()
  confirmPassword: string;
}
