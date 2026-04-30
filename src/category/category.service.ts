import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    categoryData: Prisma.CategoryCreateInput,
  ): Promise<Partial<Category>> {
    return this.prisma.category.create({
      data: categoryData,
      select: { id: true, name: true },
    });
  }

  async getAllCategories(): Promise<Partial<Category>[]> {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        parentCategory: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
