import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class ProductCharacteristic {
  @prop()
  name: string;

  @prop()
  value: string;
}

export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps {
  @prop()
  image: string;

  @prop()
  price: number;

  @prop({
    type: () => [String],
  })
  category: string[];

  @prop({
    type: () => [ProductCharacteristic],
    _id: false,
  })
  characteristics: ProductCharacteristic[];
}
