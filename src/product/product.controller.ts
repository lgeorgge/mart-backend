import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from '@prisma/client';

@Controller('product')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Partial<Product>> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Roles()
  findAll(@Query() filters: GetProductsFilterDto): Promise<Product[]> {
    return this.productService.findAll(filters);
  }

  @Get(':id')
  @Roles()
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
