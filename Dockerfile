# 基础镜像
FROM node:18-alpine

# 设置环境代理源
RUN corepack enable && npm config set registry https://registry.npmmirror.com && yarn config set registry https://registry.npmmirror.com && pnpm config set registry https://registry.npmmirror.com

# 创建工作目录
WORKDIR /journey-server

# 创建日志目录
RUN mkdir logs

# 复制依赖，因为这个不怎么变化，所以单独放一层
COPY package.json yarn.lock .

# 安装依赖
RUN yarn

# 复制源代码，第一个.是相对于Dockerfile目录下的所有文件，第二个.是指复制到容器工作目录下
COPY . .

# 构建
RUN yarn build

# 暴露 4000 端口
EXPOSE 4000

# 设置ARG，构建镜像时候传的参数 docker build --build-arg DOCKER_ENV=production -t journey-server .
# ARG DOCKER_ENV
# ENV NODE_ENV=${DOCKER_ENV}

# 直接设置 ENV NODE_ENV=production
ENV NODE_ENV=production

# 启动journey-server程序
CMD [ "node", "dist/server.js" ]

# 可以通过 docker build -t journey-server . 来创建本地镜像，默认是latest标签
# 通过 docker run -d -p 4000:4000 --rm journey-server 来运行此镜像
# 通过 docker exec -it fdba3 sh 进入容器内部