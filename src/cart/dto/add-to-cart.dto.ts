import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
