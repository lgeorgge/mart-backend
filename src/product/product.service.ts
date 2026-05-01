import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Partial<Product>> {
    return await this.prisma.product.create({
      data: createProductDto,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        availableQuantity: true,
      },
    });
  }

  async findAll(filters: GetProductsFilterDto): Promise<Product[]> {
    const { name, categoryId, minPrice, maxPrice } = filters;
    const where: Prisma.ProductWhereInput = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        gte: Number(minPrice),
        lte: Number(maxPrice),
      };
    }

    return this.prisma.product.findMany({
      where,
      include: { category: true },
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: { category: true },
    });
  }

  async remove(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
