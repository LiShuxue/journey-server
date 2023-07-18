# 基础镜像
FROM node:18-alpine

# 创建工作目录
WORKDIR /app

# 复制源代码，第一个.是相对于Dockerfile目录下的所有文件，第二个.是指复制到容器工作目录下
COPY . .

# 安装依赖
RUN yarn

# 构建
RUN yarn build

# 创建日志目录
RUN mkdir logs

# 暴露 4000 端口
EXPOSE 4000

# 设置node_env，值是构建镜像时候传的参数 docker build --build-arg DOCKER_ENV=production
# 也可以直接设置 ENV NODE_ENV=production
ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV} 

# 启动journey-server程序
CMD [ "node", "dist/server.js" ]

# 可以通过 docker build --build-arg DOCKER_ENV=production -t journey-server . 来创建本地镜像，默认是latest标签
# 通过 docker run -dp 4000:4000 --rm journey-server 来运行此镜像
# 通过 docker exec -it fdba3 sh 进入容器内部