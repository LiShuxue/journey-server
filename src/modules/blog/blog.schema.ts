import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type Image = {
  name: string;
  url: string;
};

export type Comment = {
  id: string;
  arthur: string;
  date: number;
  content: string;
  email: string;
  reply: Reply[];
  isHide: boolean;
};

export type Reply = Comment & {
  parentId: string;
  replyName: string;
  replyEmail: string;
  replyContent: string;
};

// 通过 @Schema({ collection: 'Blog' }) 为mongodb中的Blog表定义模型，不加collection的话会默认指定Blogs表，加“s”
@Schema({ collection: 'Blog' })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  subTitle: string;

  @Prop()
  htmlContent: string;

  @Prop()
  markdownContent: string;

  @Prop({ type: MongooseSchema.Types.Mixed }) // 混合类型必须在prop中声明
  image: Image;

  @Prop()
  isOriginal: boolean;

  @Prop()
  publishTime: number;

  @Prop()
  updateTime: number;

  @Prop()
  see: number;

  @Prop()
  like: number;

  @Prop()
  category: string;

  @Prop([String]) // 混合类型必须在prop中声明，或者指明具体的类型
  tags: string[];

  @Prop({ type: [MongooseSchema.Types.Mixed] }) // 混合类型必须在prop中声明
  comments: Comment[];
}

export type BlogDocument = HydratedDocument<Blog>;

export const BlogSchema = SchemaFactory.createForClass(Blog);
