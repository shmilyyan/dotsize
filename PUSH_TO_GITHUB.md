# 推送到 GitHub 步骤

## 1. 创建 GitHub 仓库（手动）

访问: https://github.com/new

填写信息：
- **Repository name**: `dotsize`
- **Description**: 照片尺寸工具 - 纯 Web 端照片处理工具
- **Visibility**: Public
- **☐** Add a README file (不要勾选)
- **☐** Add .gitignore (不要勾选)
- **☐** Choose a license (不要勾选)

点击 **Create repository**

## 2. 推送到 GitHub

创建仓库后，在终端执行：

```bash
cd D:/workspace/DotSize
git remote add origin https://github.com/shmilyyan/dotsize.git
git branch -M main
git push -u origin main
```

## 3. 配置阿里云部署 Secrets

推送完成后，访问：
https://github.com/shmilyyan/dotsize/settings/secrets/actions

添加以下 Secrets：

| Name | Value |
|------|-------|
| `ALIYUN_HOST` | `47.116.74.205` |
| `ALIYUN_USERNAME` | root |
| `ALIYUN_PASSWORD` | [你的SSH密码] |

## 4. 查看部署

- Actions 页面：https://github.com/shmilyyan/dotsize/actions
- 部署完成后访问：http://47.116.74.205/dotsize/
