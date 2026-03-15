# GitHub Secrets 配置指南

## 1. 创建 GitHub Secrets

在你的 GitHub 仓库中，依次点击：
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

添加以下 Secrets：

| Secret Name | 说明 | 示例值 |
|-------------|------|-------|
| `ALIYUN_HOST` | 服务器 IP | `47.116.74.205` |
| `ALIYUN_PORT` | SSH 端口（默认22） | `22` |
| `ALIYUN_USERNAME` | SSH 用户名 | `root` |
| `ALIYUN_PASSWORD` | SSH 密码 | `your_password` |

> 当前配置使用**密码登录**，如需改为 SSH 密钥，请联系修改。

## 2. 服务器准备

### 3.1 安装 nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# 创建部署目录
sudo mkdir -p /var/www/html/dotsize
sudo chown -R www-data:www-data /var/www/html/dotsize
```

### 3.2 配置 nginx
```bash
# 复制 nginx 配置
sudo cp nginx/dotsize.conf /etc/nginx/sites-available/dotsize
sudo ln -s /etc/nginx/sites-available/dotsize /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 nginx
sudo systemctl restart nginx
```

## 4. 手动触发部署

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Deploy DotSize to Aliyun**
4. 点击 **Run workflow** → **Run workflow**

## 5. 查看部署日志

部署日志可在 Actions 页面查看，包含：
- 构建过程
- 文件传输
- 服务器操作
- 验证结果

## 常见问题

### Q: 部署失败怎么办？
A: 查看 Actions 日志中的错误信息，常见问题：
- SSH 密钥权限不正确
- 服务器路径不存在
- nginx 配置错误

### Q: 如何回滚？
A: 备份文件在 `/var/www/html/dotsize_backup_YYYYMMDD_HHMMSS`，手动恢复。

### Q: 可以部署到子目录吗？
A: 可以，修改 `nginx/dotsize.conf` 中的 `root` 路径。
