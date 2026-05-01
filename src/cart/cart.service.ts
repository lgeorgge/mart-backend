import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity = 1 } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.availableQuantity < quantity) {
      throw new BadRequestException('Not enough product quantity available');
    }

    // Find if the item is already in the user's cart (orderId is null)
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        orderId: null,
      },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async getMyCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: {
        userId,
        orderId: null,
      },
      include: {
        product: true,
      },
    });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, userId, orderId: null },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async checkout(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId, orderId: null },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let total = 0;
    for (const item of cartItems) {
      total += item.quantity * item.product.price;
    }

    return { total, itemsCount: cartItems.length, items: cartItems };
  }

  async placeOrder(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId, orderId: null },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let total = 0;
    // Check quantities before placing order
    for (const item of cartItems) {
      if (item.product.availableQuantity < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for product ${item.product.name}`,
        );
      }
      total += item.quantity * item.product.price;
    }

    // Create the order and update quantities in a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'PENDING', // or 'SHIPPED' whatever the flow dictates
        },
      });

      // Update cart items to be linked to this order
      await prisma.cartItem.updateMany({
        where: {
          userId,
          orderId: null,
        },
        data: {
          orderId: order.id,
        },
      });

      // Deduct product quantities
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            availableQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  }
}
