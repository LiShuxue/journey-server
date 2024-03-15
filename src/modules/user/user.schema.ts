import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// 通过 @Schema({ collection: 'User' }) 为mongodb中的User表定义模型，不加collection的话会默认指定Users表，加“s”
@Schema({ collection: 'User' })
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
