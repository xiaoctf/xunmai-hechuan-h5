# 寻脉合川：非遗文旅数字导览 H5

本目录是青耕文脉实践队“非遗文旅赋能乡村振兴”数字化展示板块的静态 H5 交付包。

## 内容

- `index.html`：9屏移动端 H5 页面。
- `styles.css`：新中式非遗导览视觉样式。
- `script.js`：屏幕导航、锚点入口和标题状态。
- `assets/qr/`：四类二维码输出目录。
- `docs/`：部署、二维码和交付说明。

## 四类入口

正式部署到 GitHub Pages 后，用实际域名替换 `{BASE_URL}`：

- 主二维码：`{BASE_URL}/index.html`
- 路线二维码：`{BASE_URL}/index.html#route`
- 产品二维码：`{BASE_URL}/index.html#product`
- 问卷二维码：正式问卷链接；未确定时可临时使用 `{BASE_URL}/index.html#survey`

## 本地预览

在本目录运行：

```powershell
python -m http.server 8080
```

打开：

```text
http://localhost:8080/index.html
```

## 生成二维码

当前 `assets/qr/` 中是本地预览版二维码，指向 `http://localhost:8080`。GitHub Pages 链接确定后，在本目录运行：

```powershell
python scripts\generate_qr.py --base-url https://<GitHub用户名>.github.io/xunmai-hechuan-h5
```

如果问卷链接已确定：

```powershell
python scripts\generate_qr.py --base-url https://<GitHub用户名>.github.io/xunmai-hechuan-h5 --survey-url https://问卷正式链接
```

## GitHub Pages 部署

把本目录内容推送到 GitHub 仓库后，在仓库 `Settings -> Pages` 中选择部署分支和目录即可。详见 `docs/GitHub-Pages部署与二维码替换说明.md`。
