## LPWAN 地下管网智能监测可视化（前端）

这是一个 **Vite + React + TypeScript** 的纯前端可视化项目：包含登录页、仪表盘、设备列表、地图点位（Leaflet）等界面。数据来自本地 `MOCK_DATA_LIST`（无需后端即可展示）。

---

## 你将看到什么

- **登录页**：输入框已预填，点击按钮即可进入系统（当前为演示跳转，不校验账号密码）。
- **仪表盘**：KPI 卡片、异常告警列表、地图点位。
- **设备列表**：设备表格 + 弹窗详情 + 24 小时趋势图（Recharts）。

---

## 运行环境

- **Node.js**：建议安装 **Node.js LTS（18+，推荐 20+）**
- **包管理器**：默认使用 `npm`（也可用 `pnpm/yarn`，但本项目未提供 lock 文件）
- **网络**：需要联网加载 CDN 资源（Tailwind/Leaflet/地图瓦片），否则地图可能空白

---

## 小白一键启动（推荐）

在终端执行：

```bash
cd LPWAN_web
npm install
npm run dev
```

启动成功后，浏览器打开：

- `http://localhost:3000/`

如果你看到页面 URL 带有 `#`（例如 `/#/dashboard`），这是正常的：项目使用了 `HashRouter`。

---

## 不需要配置的内容（重要）

你可能会在 `vite.config.ts` 里看到 `GEMINI_API_KEY` 的注入，但**当前代码中并没有实际使用到该 Key**，所以：

- **可以不创建** `.env.local`
- **可以不设置** `GEMINI_API_KEY`

---

## 常用命令

```bash
# 开发模式（本地热更新）
npm run dev

# 打包
npm run build

# 预览打包产物（默认端口通常是 4173）
npm run preview
```

---

## 常见问题（排查清单）

- **端口 3000 被占用**
  - 关闭占用 3000 的程序，或修改 `vite.config.ts` 里的 `server.port`
  - 也可以尝试（部分环境可用）：`npm run dev -- --port 5173`

- **地图区域/点位不对**
  - 修改 `constants.ts` 里的 `CAMPUS_BOUNDS`（经纬度范围）

- **地图一片空白/无底图**
  - 多半是网络问题：Leaflet 与瓦片服务来自公网 CDN
  - 检查代理/防火墙，或更换可访问的瓦片源（见 `components/MapVisualization.tsx`）

- **`npm install` 报错/很慢**
  - 尝试切换 npm 镜像或使用 `pnpm`
  - 确保 Node 版本为 LTS（18+）

---

## 目录结构（快速了解）

- `index.tsx`：应用入口
- `App.tsx`：路由（`HashRouter`）
- `pages/`：页面（`Login` / `Dashboard` / `DeviceList`）
- `components/`：组件（布局、地图等）
- `constants.ts`：演示数据与地图边界配置
