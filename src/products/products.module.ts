import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ProductModel,
        schemaOptions: {
          collection: 'Products',
        },
      },
    ]),
  ],
  providers: [ProductsService],
})
export class ProductsModule {}
