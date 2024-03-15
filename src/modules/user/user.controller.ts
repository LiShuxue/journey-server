import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto } from './user.dto';

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
  // 当控制器被实例化的时候，UserService会被注入，自动实例化userService（默认是单例的，如果已经存在，直接返回）
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UsePipes(ValidationPipe) // 参数验证管道，结合dto中的class-validator一起验证
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('UserController create method');
    console.log(createUserDto);
    return {};
  }

  @Get('list')
  async getUserList() {
    console.log('UserController getUserList method');
    const userList = await this.userService.getUserList();
    return userList;
  }

  @Get('list/:id')
  async getUser(@Param('id') id: string) {
    console.log('UserController getUser method');
    const user = await this.userService.getUser(id);
    return user;
  }
}
