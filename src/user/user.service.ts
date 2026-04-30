import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/user-signup.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(signupData: SignUpDto): Promise<Partial<User>> {
    const { email, password, role, name } = signupData;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    // Hash password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword: string = await bcrypt.hash(password, 10);
    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        hashedPassword: hashedPassword,
        role,
        name,
      },
    });
    // Prepare response - exclude password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    //compare password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      message: 'Login successful',
      user: {
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.role,
      },
    };
  }
}
