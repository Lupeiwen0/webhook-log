# webhook-log

一个接受 webhook 的日志信息展示系统

## 功能特性

- ✅ 接收 webhook 请求的 API 接口 `/api/webhook`
- ✅ 支持所有 HTTP 方法（GET, POST, PUT, DELETE, PATCH）
- ✅ 使用 SQLite 数据库存储 webhook 数据
- ✅ 自动删除 24 小时之前的日志
- ✅ 展示页面支持时间筛选（最近 30 分钟、1 小时、4 小时）
- ✅ 实时自动刷新（每 5 秒）
- ✅ 详细查看每个 webhook 的完整信息

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **数据库**: SQLite (better-sqlite3)
- **样式**: TailwindCSS
- **部署**: 支持 Vercel 一键部署

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
npm run build
npm start
```

## 使用说明

### 发送 Webhook

向 `/api/webhook` 端点发送任何 HTTP 请求：

```bash
# POST 请求
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "user.created", "user_id": 12345}'

# GET 请求
curl -X GET "http://localhost:3000/api/webhook?param1=value1&param2=value2"

# PUT 请求
curl -X PUT http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"action": "update", "resource": "test"}'
```

### 查看日志

1. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)
2. 选择时间筛选器（30 分钟、1 小时、4 小时）
3. 点击"查看详情"按钮查看 webhook 完整信息

## 数据存储

- 数据库文件存储在 `data/webhooks.db`
- 自动创建索引以优化时间范围查询
- 每次接收 webhook 时自动清理超过 24 小时的旧数据

## 数据结构

每个 webhook 记录包含：

- `id`: 自增 ID
- `method`: HTTP 方法
- `url`: 完整 URL
- `headers`: 请求头（JSON 字符串）
- `body`: 请求体（JSON 字符串或文本）
- `query`: 查询参数
- `ip`: 客户端 IP 地址
- `created_at`: 创建时间戳（毫秒）

## 开发

### 代码检查

```bash
npm run lint
```

### 构建

```bash
npm run build
```

## 部署

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lupeiwen0/webhook-log)

### 其他平台

本项目使用标准 Next.js 结构，可部署到任何支持 Node.js 的平台。

## License

MIT

