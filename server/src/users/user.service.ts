import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUserdto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { object } from "zod";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,) {}
    
    async createUser(createUserDto:CreateUserDto): Promise<any> {
        if(createUserDto.password !== createUserDto.confirmPassword){
            throw new HttpException('Password must match', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const {confirmPassword, ...userData} = createUserDto;
        const newUser = new UserEntity();
        Object.assign(newUser, userData);

    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (userByEmail) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

        const saveUser = await this.userRepository.save(newUser);
        const {password, ...apiResponse} = saveUser
        return apiResponse;
    }
}