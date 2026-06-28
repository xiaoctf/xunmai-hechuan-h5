# GitHub Pages部署与二维码替换说明

## 一、推荐上线方式

本 H5 是纯静态页面，不需要服务器后台。推荐使用 GitHub Pages 免费托管。

建议仓库名：

```text
xunmai-hechuan-h5
```

部署后常见访问格式：

```text
https://<GitHub用户名>.github.io/xunmai-hechuan-h5/
```

如果仓库使用自定义域名，以实际域名为准。

## 二、四类二维码正式链接

上线后把 `{BASE_URL}` 替换成实际 GitHub Pages 地址：

| 二维码 | 正式链接 |
| --- | --- |
| 主二维码 | `{BASE_URL}/index.html` |
| 路线二维码 | `{BASE_URL}/index.html#route` |
| 产品二维码 | `{BASE_URL}/index.html#product` |
| 问卷二维码 | 问卷星、腾讯问卷或学校指定平台链接 |

在问卷链接未确定前，可临时使用：

```text
{BASE_URL}/index.html#survey
```

## 三、二维码使用边界

- 礼盒、礼袋主视觉不放“三下乡”标识。
- 说明卡背面可放小字：`本方案由重庆邮电大学青耕文脉实践队设计`。
- H5 页面底部保留正式成果落款。
- 问卷二维码正式印刷前必须替换为真实问卷链接。
- 非遗项目图片和具体名录需在实地调研确认后替换。

## 四、部署前检查

1. 手机打开首页，确认首屏无横向滚动。
2. 测试四个入口：`#home`、`#route`、`#product`、`#survey`。
3. 检查底部正式落款是否完整。
4. 将二维码扫码测试截图放入汇报材料。
5. 如果使用活码平台，确认后台跳转链接已替换为正式 GitHub Pages 地址。

