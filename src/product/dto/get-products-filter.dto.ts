import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
