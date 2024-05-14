import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  HttpModule as HttpNestjsModule,
  HttpService as HttpNestjsService,
} from '@nestjs/axios';
import { HttpService } from './http.service';

@Module({
  providers: [HttpService],
  imports: [ConfigModule],
})
export class HttpModule {
  token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpNestjsService,
  ) {
    this.token = configService.get('HTTP_TOKEN') ?? '';
  }

  async getData(text: string) {
    // const { data } = await this.httpService.get(
    //   'https://api.hh.ru/vacanciones',
    //   {
    //     params: {
    //       text,
    //       clusters: true,
    //     },
    //     headers: {
    //       Authorization: 'Bearer' + this.token,
    //     },
    //   },
    // );
  }
}
