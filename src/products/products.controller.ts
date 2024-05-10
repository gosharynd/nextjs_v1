import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './products.constants';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id);

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);

    return product;
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.deleteById(id);

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
  }

  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateProductDto,
  ) {
    const product = await this.productService.updateById(id, dto);

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);

    return product;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
