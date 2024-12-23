# 基础镜像
FROM node:20-alpine

# 设置环境代理源
RUN corepack enable && npm config set registry https://registry.npmmirror.com && yarn config set registry https://registry.npmmirror.com && pnpm config set registry https://registry.npmmirror.com

# 创建工作目录
WORKDIR /journey-server

# 创建日志目录
RUN mkdir logs && chmod -R 777 logs
RUN mkdir dist
# 在/root目录下创建文件夹
RUN mkdir /root/mongodb
RUN mkdir /root/project

# 将容器的文件夹挂载出去
VOLUME /journey-server/logs
VOLUME /journey-server/dist
VOLUME /root/mongodb
VOLUME /root/project

# 复制依赖，因为这个不怎么变化，所以单独放一层
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm i

# 暴露 4000 端口，暴露的只是 docker 容器的端口，需要映射到宿主机才行，通过 -p 4000:4000 才行
EXPOSE 4000

# 设置ARG，构建镜像时候传的参数 docker build --build-arg DOCKER_ENV=production -t journey-server .
# ARG DOCKER_ENV
# ENV NODE_ENV=${DOCKER_ENV}

# 直接设置 ENV NODE_ENV=production
ENV NODE_ENV=production

# 安装docker命令行
RUN apk update
RUN apk add docker-cli

# 安装zip命令
RUN apk add zip

# 设置时区，使用北京时间。虽然用的上海表示，但是不影响
RUN apk add tzdata
ENV TZ=Asia/Shanghai

# 启动journey-server程序
CMD [ "node", "dist/main.js" ]

# 可以通过 docker build -t journey-server:dev . 来创建本地镜像，默认是latest标签
# 通过 docker run -d -p 4000:4000 --name journey-server --network journey-network --rm journey-server:dev 来运行此镜像
# 通过 docker exec -it fdba3 sh 进入容器内部