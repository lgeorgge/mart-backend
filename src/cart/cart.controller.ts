import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';

@Controller('cart')
@UseGuards(RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles('USER', 'ADMIN') // Adjust roles as per your application's requirements
  addToCart(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  @Roles('USER', 'ADMIN')
  getMyCart(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.getMyCart(userId);
  }

  @Delete(':cartItemId')
  @Roles('USER', 'ADMIN')
  removeFromCart(@Req() req: any, @Param('cartItemId') cartItemId: string) {
    const userId = req.user.id;
    return this.cartService.removeFromCart(userId, cartItemId);
  }

  @Post('checkout')
  @Roles('USER', 'ADMIN')
  checkout(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.checkout(userId);
  }

  @Post('order')
  @Roles('USER', 'ADMIN')
  placeOrder(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.placeOrder(userId);
  }
}
