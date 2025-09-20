import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({name: 'users'})
export class UserEntity{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({unique: true})
    phoneNumber: string;

    @Column({ default: false })
    isNumberVerified: boolean;

    @Column({ nullable: true })
    phoneOtp: string;

    @Column({ nullable: true, type:"timestamptz" })
    otpExpiresAt: Date;

    @Column({ nullable: true })
    resetPassword: string;

    @Column({ nullable: true, type: 'timestamptz' })
    rPExpiresAt: Date;

    @BeforeInsert()
    
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

}