import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('ValidationPipe');
    // 在这里进行数据验证和转换
    return value; // 返回经过验证和转换的值
  }
}
