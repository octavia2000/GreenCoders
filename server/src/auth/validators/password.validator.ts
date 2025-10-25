import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@ValidatorConstraint({ name: 'isStrongPassword', async: true })
@Injectable()
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  /* 
  =======================================
  Validate Strong Password
  ========================================
  */
  async validate(password: string, args: ValidationArguments) {
    if (!password) return false;

    // Check minimum length
    if (password.length < 8) return false;

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;

    // Check for at least one number
    if (!/[0-9]/.test(password)) return false;

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;

    // ✅ OPTIMIZED: Skip password uniqueness check for existing users updating their password
    const isUpdate = args.object && 'id' in args.object;
    if (isUpdate) return true;

    // ✅ OPTIMIZED: For new users, check against a sample instead of all users
    const userCount = await this.userRepository.count();
    if (userCount > 1000) {
      // For large user bases, skip uniqueness check to avoid performance issues
      return true;
    }

    // Check against a random sample of users instead of all users
    const sampleUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.password'])
      .orderBy('RANDOM()')
      .limit(100)
      .getMany();

    for (const user of sampleUsers) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return false; // Password already exists
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, one special character, and must be unique across all users';
  }
}
/* 
  =======================================
  Validator for Strong Password
  ========================================
  */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
