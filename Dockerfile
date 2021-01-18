# 基础镜像
FROM node:12

# 创建工作目录
WORKDIR /usr/src/journey-server

# 复制源代码，第一个.是相对于Dockerfile目录下的所有文件，第二个.是指复制到容器工作目录下
COPY . .

# 安装依赖
RUN yarn

# 暴露 4000 端口
EXPOSE 4000

# 启动journey-server程序
CMD [ "node", "dist/server.js" ]


# 可以通过 docker build -t journey-server:latest . 来创建本地镜像
# 通过 docker run -itd --rm -p 4000:4000 --name node-test journey-server:latest 来运行此镜像来测试