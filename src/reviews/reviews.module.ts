import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReviewModel } from './review.model';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [ReviewsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReviewModel,
        schemaOptions: {
          collection: 'Reviews',
        },
      },
    ]),
    TelegramModule,
  ],
  providers: [ReviewsService],
})
export class ReviewsModule {}
