# 第一阶段：构建应用
FROM node:23 AS build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（或yarn.lock）
COPY package*.json ./

# 安装项目依赖
RUN npm ci --quiet

# 复制项目文件
COPY . .

# 设置环境变量（如有需要）


# 构建应用
RUN npm run build

# 第二阶段：部署应用
FROM nginx:stable-alpine AS production-stage

# 从构建阶段复制构建结果到nginx目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制nginx配置文件（如有自定义配置）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]

