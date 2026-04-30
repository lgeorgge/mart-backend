import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsEnum(['ADMIN', 'CUSTOMER'], { message: 'Invalid role' })
  role?: 'ADMIN' | 'CUSTOMER';
}
