import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUserdto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { compare } from "bcrypt";
import { LogUserDto } from "./dto/logUserdto";
import { logApiResponse } from "./dto/logApiResponse";
import { EmailService } from "./utils/email.service";
import { OtpService } from "./verifyNumber/otp.service";

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      private readonly otpService: OtpService,
      private readonly emailService: EmailService,) {}
    
    async createUser(createUserDto:CreateUserDto): Promise<UserEntity> {
      if(createUserDto.password !== createUserDto.confirmPassword){
          throw new HttpException('Password must match', HttpStatus.UNPROCESSABLE_ENTITY)
      }
      const {confirmPassword, ...userData} = createUserDto;
      const newUser = this.userRepository.create(userData);
            
      const checkForEmail = await this.userRepository.findOne({where: {email: createUserDto.email,},});
      const checkForName = await this.userRepository.findOne({where: {username: createUserDto.username,},});
      const checkForNumber = await this.userRepository.findOne({where: {phoneNumber: createUserDto.phoneNumber,},});
  
      if (checkForEmail) {throw new HttpException('Email is already in use',HttpStatus.UNPROCESSABLE_ENTITY,);}
      if (checkForName) {throw new HttpException('Username is already in use',HttpStatus.UNPROCESSABLE_ENTITY,);}
      if (checkForNumber) {throw new HttpException('Phone Number is already in use',HttpStatus.UNPROCESSABLE_ENTITY,);}

      return await this.userRepository.save(newUser); 
      
    }
    async logUser(logUserDto: LogUserDto): Promise<logApiResponse> {
        const user = await this.userRepository.findOne({where: { email: logUserDto.email },});
    
        if (!user) {
          throw new HttpException('Invalid Email or Password',HttpStatus.UNAUTHORIZED,);}
    
        const matchPassword = await compare(logUserDto.password, user.password);

        if (!matchPassword) {
          throw new HttpException('Invalid Email or Password',HttpStatus.UNAUTHORIZED,);}
         
        if(!user.isNumberVerified){
          await this.otpService.generateOtp(user.phoneNumber);
          throw new HttpException('You have to verify, recheck sms for Otp', HttpStatus.UNAUTHORIZED)}
    
        const { password, ...apiResponse2 } = user;
        return apiResponse2;
    }
    async sendWelcomeEmail(user: UserEntity): Promise<void> {
        await this.emailService.sendOnboardingEmail(user.email, user.username);
    }

}