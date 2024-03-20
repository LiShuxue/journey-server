import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  ServiceUnavailableException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './user.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';

/*
  使用 @Controller('user') 注解声明一个controller，处理 user 路径下的请求，类里面的每一个方法，处理一个请求。
  使用 @Get('list') @Put @Post @Delete 来定义请求类型和路径。
  默认返回 200 状态代码和相关的响应。
  @Req() 注解可以获取express原生的request对象，在多数情况下，不必手动获取它们，我们可以使用@Param @Body @Query @Headers @Ip() 来获取对应信息。
  @Res() 注解获取response对象，这样做时，必须通过调用 response 对象（例如，res.json(…) 或 res.send(…)）发出某种响应，否则 HTTP 服务器将挂起。

  @Controller() 注解中定义的路径不需要加 /，因为它会自动与全局前缀和控制器方法的路径拼接在一起，如果加 / ，则视为绝对路径。
  @Get('list') 中的 / 可加可不加，他是相对控制器根路径user的绝对或者相对。
*/
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  private secret: string;

  // 当控制器被实例化的时候，UserService会被注入，自动实例化userService（默认是单例的，如果已经存在，直接返回）
  constructor(
    private readonly userService: UserService,
    private readonly myLogger: MyLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.myLogger.setContext('UserController');
    this.secret = this.configService.get('config.secret');
  }

  @Post('create')
  @HttpCode(200) // Post方法默认返回201，需要返回200的话，用该注解
  @UsePipes(ValidationPipe) // 参数验证管道，结合dto中的class-validator一起验证
  async createUser(@Body() userDto: UserDto) {
    this.myLogger.log('createUser method');

    try {
      const hashPass = createHmac('sha256', this.secret).update(userDto.password).digest('hex');

      const newUserDto = {
        username: userDto.username,
        password: hashPass,
      };
      const user = await this.userService.createUser(newUserDto);
      return {
        username: user.username,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('用户名已存在');
      }
      throw new BadRequestException(error);
    }
  }

  @Get('list')
  async getUserList() {
    this.myLogger.log('getUserList method');

    try {
      const userList = await this.userService.getUserList();
      return userList;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  @Post('delete')
  @HttpCode(200)
  async deleteUser(@Body('id', IdValidationPipe) id: string) {
    this.myLogger.log('getUserList method');

    try {
      const user = await this.userService.deleteUser(id);
      if (!user) {
        throw '未找到用户';
      }
      return {
        username: user.username,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('update')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async updateUser(@Body() userDto: UserDto) {
    this.myLogger.log('updateUser method');

    try {
      const hashPass = createHmac('sha256', this.secret).update(userDto.password).digest('hex');

      const newUserDto = {
        username: userDto.username,
        password: hashPass,
      };
      const user = await this.userService.updateUser(newUserDto);
      if (!user) {
        throw '未找到用户';
      }
      return {
        username: user.username,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
