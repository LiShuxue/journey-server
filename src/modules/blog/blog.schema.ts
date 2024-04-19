import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type Image = {
  name: string;
  url: string;
};

// 评论
export type Comment = {
  id: string; // 评论id，后端自动生成
  arthur: string; // 评论作者，前端传
  email: string; // 评论作者的邮箱，前端传
  content: string; // 评论内容，前端传
  reply: Reply[]; // 该评论下面所有的回复
  date: number; // 评论时间
  isHide: boolean; // 是否需要隐藏
};

// 评论下的回复
export type Reply = {
  parentId: string; // 哪条评论下的回复
  replyId: string; // 回复的哪条评论
  isReplyParent: boolean; // 是否对父级评论的回复

  replyArthur: string; // 回复的哪个作者
  replyEmail: string; // 回复的哪个邮箱
  replyContent: string; // 回复的哪个内容

  id: string; // 本回复的id
  arthur: string; // 本回复的作者
  email: string; // 本回复的作者邮箱
  content: string; // 本回复的内容
  date: number; // 回复时间
  isHide: boolean; // 是否需要隐藏
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
