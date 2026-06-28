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

当前购买按钮为占位状态，后续拿到传承人、农户、合作社或当地商家的真实销售链接后，在 `mobile.html` 和 `desktop.html` 中替换对应按钮的 `data-purchase-url` 即可。`data-product-channel` 用于标注“传承人/合作社”“农户/合作社”等对接渠道。团队只做公益展示和流量引导，不参与交易、不赚差价。

`tracking.js` 会在真实链接启用后自动追加 UTM 参数：

- `utm_source=xunmai_hechuan_h5`
- `utm_medium=product_link`
- `utm_campaign=sxx_2026_hechuan_ich_agri`
- `utm_content=<产品ID>`

可统计口径：

- 扫码曝光：活码或二维码后台统计扫码人数、扫码次数、扫码地点和入口类型。
- 内容浏览：百度统计、Google Analytics、Umami 或 `dataLayer` 统计产品屏浏览、页面停留和访问路径。
- 购买意向：短链接后台或百度统计事件统计两类产品的购买入口点击。
- 对接渠道：购买点击事件会带上 `product_id`、`product_name`、`product_channel`，便于后台区分桃片、萝卜干及对应渠道。
- 整体点击率：全站购买入口点击量 / 全站产品屏浏览量 × 100%。
- 扫码转点击率：全站购买入口点击量 / 活码累计扫码次数 × 100%，可作为补充指标。
- 成交转化：合作社或商家按周/月回填订单量、客单价和成交金额。
- 带动金额：回填成交件数 × 平均客单价，或商家实际成交金额。
- 前台说明：H5 页面只展示统计口径并触发埋点，不直接读取百度统计后台数字。

百度统计接入方式：

1. 在百度统计后台添加站点 `https://xiaoctf.github.io/xunmai-hechuan-h5/`。
2. 打开后台生成的统计代码，复制 `hm.js?` 后面的站点 ID。
3. 将站点 ID 填入 `analytics-config.js` 的 `baiduTongjiId`。
4. `tracking.js` 会自动加载百度统计脚本，并通过 `_hmt.push(["_trackEvent", ...])` 分别上报产品区曝光和购买入口点击。
5. 结题数据以百度统计、活码平台和合作社回填为准，不使用单台设备的本机数据。

结题可写成：

```text
二维码累计扫码 X 次，产品页浏览 X 次，引流至购买页面 X 次，整体点击率 X%。
合作社回填成交 X 单，预计带动销售 X 元。
```

## 生成二维码

当前 `assets/qr/` 中已生成 GitHub Pages 正式二维码，指向 `https://xiaoctf.github.io/xunmai-hechuan-h5`。如入口链接或问卷链接发生变化，在本目录重新运行：

```powershell
python scripts\generate_qr.py --base-url https://<GitHub用户名>.github.io/xunmai-hechuan-h5
```

如果问卷链接已确定：

```powershell
python scripts\generate_qr.py --base-url https://<GitHub用户名>.github.io/xunmai-hechuan-h5 --survey-url https://问卷正式链接
```

## GitHub Pages 部署

把本目录内容推送到 GitHub 仓库后，在仓库 `Settings -> Pages` 中选择部署分支和目录即可。详见 `docs/GitHub-Pages部署与二维码替换说明.md`。
