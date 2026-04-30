import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { Category, Prisma } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
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
