// DTO 可以用于验证传入请求的数据。通过定义输入 DTO，你可以明确地指定哪些字段是必需的，哪些字段是可选的，以及每个字段的验证规则。
// DTO 也可以用于格式化传出响应的数据。通过定义输出 DTO，你可以指定响应的数据结构，并确保响应的数据符合预期的格式。
// DTO 可以作为 API 文档的一部分。通过定义 DTO，你可以清晰地记录每个接口的输入和输出数据格式，从而生成准确的 API 文档。
// 如果你希望 DTO 中的属性可以在对象创建后不能被修改，可以将它们定义为 readonly。
import { IsString, IsNotEmpty, IsBoolean, ArrayNotEmpty, ArrayMaxSize } from 'class-validator';
import { Image } from './blog.schema';

export class BlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subTitle: string;

  image: Image;

  @IsString()
  @IsNotEmpty()
  htmlContent: string;

  @IsString()
  @IsNotEmpty()
  markdownContent: string;

  @IsBoolean()
  @IsNotEmpty()
  isOriginal: boolean;

  @IsString()
  @IsNotEmpty()
  category: string;

  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  tags: string[];
}
