import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc)
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }
}
