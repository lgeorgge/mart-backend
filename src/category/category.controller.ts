import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { Category, Prisma } from '@prisma/client';

@Controller('category')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('ADMIN')
  async create(
    @Body() categoryData: Prisma.CategoryCreateInput,
  ): Promise<Partial<Category>> {
    return this.categoryService.createCategory(categoryData);
  }

  @Get()
  @Roles()
  async findAll(): Promise<Partial<Category>[]> {
    return this.categoryService.getAllCategories();
  }
}
