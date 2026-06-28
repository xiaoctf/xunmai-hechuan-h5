# 寻脉合川：数智赋能非遗，文创助农振兴 H5

本目录是青耕文脉实践队“数智赋能非遗，文创助农振兴”数字化展示板块的静态网站交付包。站点包含移动端 H5、桌面端展示站和自动识别入口。

新版内容主线：以合川桃片、青草坝萝卜干双非遗美食为流量载体，带动峡砚、泥塑、木雕等小众非遗传播，联动非遗数字化二维码 H5 档案、桃片&萝卜干联合礼盒礼袋、合川非遗冰箱贴系列、非遗主题三下乡短视频、市场调研数据、扫码即购入口与落地建议五类成果。

## 内容

- `index.html`：自动识别入口，按设备跳转移动端或桌面端。
- `mobile.html`：9屏移动端 H5 页面。
- `styles.css`：移动端新中式非遗导览视觉样式。
- `script.js`：移动端屏幕导航、锚点入口和标题状态。
- `desktop.html`：桌面端展示站。
- `desktop.css`：桌面端展览导览视觉样式。
- `desktop.js`：桌面端导航状态。
- `tracking.js`：非遗小吃购买入口的静态追踪钩子。
- `assets/qr/`：四类二维码输出目录。
- `docs/`：部署、二维码和交付说明。

## 四类入口

正式部署到 GitHub Pages 后，用实际域名替换 `{BASE_URL}`。二维码统一指向 `index.html`，入口页会自动识别移动端或桌面端：

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

## 助农购买入口与数据追踪

当前购买按钮为占位状态，后续拿到传承人、农户、合作社或当地商家的真实销售链接后，在 `mobile.html` 和 `desktop.html` 中替换对应按钮的 `data-purchase-url` 即可。团队只做公益展示和流量引导，不参与交易、不赚差价。

`tracking.js` 会在真实链接启用后自动追加 UTM 参数：

- `utm_source=xunmai_hechuan_h5`
- `utm_medium=product_link`
- `utm_campaign=sxx_2026_hechuan_ich_agri`
- `utm_content=<产品ID>`

可统计口径：

- 扫码量：活码或二维码后台统计。
- 购买点击：短链接、百度统计、Google Analytics、Umami 或 `dataLayer` 事件统计。
- 销售转化：由合作社或商家按月回填。
- 本机演示点击：页面会用 `localStorage` 记录当前设备点击次数，仅用于现场演示，不代表真实后台数据。

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
