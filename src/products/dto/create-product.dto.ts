import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ProductCharacteristicDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  image: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsArray()
  @ValidateNested()
  @Type(() => ProductCharacteristicDto)
  characteristics: ProductCharacteristicDto[];
}
